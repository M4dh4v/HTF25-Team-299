import React, { useState, useCallback, useRef, useEffect } from "react";
import { CaptionStyle } from "./types";
import {
  generateCaptions,
  transcribeAudio,
  describeVideoVisuals,
} from "./api/fetching";
import VideoPlayer from "./components/VideoPlayer";
import Controls from "./components/Controls";
import TranscriptInput from "./components/TranscriptInput";
import CaptionOutput from "./components/CaptionOutput";

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [style, setStyle] = useState<CaptionStyle>(CaptionStyle.Meme);
  const [language, setLanguage] = useState<string>("English");
  const [captions, setCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const captureFrames = async (
    videoNode: HTMLVideoElement,
    maxFrames = 16
  ): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return reject("Canvas context is not supported.");

      canvas.width = videoNode.videoWidth;
      canvas.height = videoNode.videoHeight;

      const duration = videoNode.duration;
      const interval = duration / maxFrames;
      const frames: string[] = [];

      videoNode.currentTime = 0;
      await new Promise((r) => setTimeout(r, 200));

      for (let i = 0; i < maxFrames; i++) {
        const time = i * interval;
        if (time > duration) break;

        const frame = await new Promise<string>((resolveFrame, rejectFrame) => {
          const onSeeked = () => {
            videoNode.removeEventListener("seeked", onSeeked);
            videoNode.removeEventListener("error", onError);
            context.drawImage(
              videoNode,
              0,
              0,
              videoNode.videoWidth,
              videoNode.videoHeight
            );
            resolveFrame(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
          };
          const onError = (e: Event | string) => {
            videoNode.removeEventListener("seeked", onSeeked);
            videoNode.removeEventListener("error", onError);
            rejectFrame(`Error seeking video: ${e.toString()}`);
          };
          videoNode.addEventListener("seeked", onSeeked, { once: true });
          videoNode.addEventListener("error", onError, { once: true });
          videoNode.currentTime = time;
        });
        frames.push(frame);
      }
      resolve(frames);
    });
  };

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const videoElement = videoRef.current;

    const handleLoadedData = async () => {
      try {
        setIsTranscribing(true);
        const frames = await captureFrames(videoElement);
        if (frames.length === 0) {
          throw new Error("Could not capture any frames from the video.");
        }
        const representativeFrame = frames[Math.floor(frames.length / 2)];
        const audioTranscript = await transcribeAudio(representativeFrame);
        const wordCount = audioTranscript.split(/\s+/).filter(Boolean).length;
        let fullTranscript = audioTranscript;

        if (wordCount < 20) {
          // If the transcript is short, enhance it with a visual description
          const visualDescription = await describeVideoVisuals(frames);
          fullTranscript = `${audioTranscript}\n\n${visualDescription}`;
        }

        setTranscript(fullTranscript);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to generate transcript: ${errorMessage}`);
        setTranscript("");
      } finally {
        setIsTranscribing(false);
      }
    };

    videoElement.addEventListener("loadeddata", handleLoadedData, {
      once: true,
    });
    return () => {
      videoElement.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [videoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "video/mp4" ||
        file.type === "video/quicktime" ||
        file.type === "video/webm")
    ) {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      setVideoUrl(URL.createObjectURL(file));
      setCaptions([]);
      setError(null);
      setTranscript("");
      setIsTranscribing(true);
    } else {
      setError("Please upload a valid video file (MP4, MOV, WEBM).");
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = "";
  };

  const handleGenerateClick = useCallback(async () => {
    if (!transcript.trim()) {
      setError(
        "Transcript cannot be empty. Please provide a transcript to generate captions."
      );
      return;
    }
    setIsGenerating(true);
    setError(null);
    setCaptions([]);

    try {
      const generatedCaptions = await generateCaptions(
        transcript,
        style,
        language
      );
      setCaptions(generatedCaptions);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate captions: ${errorMessage}`);
      setCaptions([]);
    } finally {
      setIsGenerating(false);
    }
  }, [transcript, style, language]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text pb-2">
            Automated Caption Generator
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload your video, get an instant transcript, and generate
            AI-powered captions in any style.
          </p>
        </header>

        {error && (
          <div
            className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <VideoPlayer
              ref={videoRef}
              videoUrl={videoUrl}
              onFileChange={handleFileChange}
            />
            <TranscriptInput
              transcript={transcript}
              setTranscript={setTranscript}
              isTranscribing={isTranscribing}
              disabled={!videoUrl}
            />
            <Controls
              style={style}
              setStyle={setStyle}
              language={language}
              setLanguage={setLanguage}
              onGenerate={handleGenerateClick}
              isLoading={isGenerating}
              disabled={!videoUrl || isTranscribing}
            />
          </div>
          <div className="lg:h-[calc(100vh-180px)]">
            <CaptionOutput captions={captions} isLoading={isGenerating} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
