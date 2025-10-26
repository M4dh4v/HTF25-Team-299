import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaptionStyle } from "../../../types";
import {
  generateCaptions,
  transcribeAudio,
  describeVideoVisuals,
} from "../../api/fetching.ts";
import VideoPlayer from "../VideoPlayer";
import Controls from "../Controls";
import TranscriptInput from "../TranscriptInput";
import CaptionOutput from "../CaptionOutput";
import captureFrames from "../../utils/captureFrames";

const HomePage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [style, setStyle] = useState<CaptionStyle>(CaptionStyle.Meme);
  const [language, setLanguage] = useState("English");
  const [captions, setCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState("");
  const [generationProgressText, setGenerationProgressText] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // video wrapper measurement for smooth collapse (video -> Remove button)
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(420); // fallback

  // transcription dropdown state (ONLY transcription area collapses)
  // start closed and *not rendered* until a transcript exists
  const [transcriptionOpen, setTranscriptionOpen] = useState<boolean>(false);

  // When transcript is generated, show the dropdown by default
  useEffect(() => {
    if (transcript) {
      setTranscriptionOpen(true);
    }
  }, [transcript]);

  // when new upload, reset states (do NOT auto-open the transcription dropdown until transcript arrives)
  useEffect(() => {
    if (!videoUrl) {
      setTranscript("");
      setCaptions([]);
      setError(null);
      setIsGenerating(false);
      setGenerationProgressText("");
      setTranscriptionOpen(false);
    }
  }, [videoUrl]);

  // if captions generated, collapse transcription area by default (after generation completes)
  useEffect(() => {
    if (captions.length > 0) {
      setTranscriptionOpen(false);
    }
  }, [captions.length]);

  // Measure wrapper height and keep in sync via ResizeObserver
  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const h =
          wrapperRef.current.scrollHeight ||
          wrapperRef.current.offsetHeight ||
          420;
        setMeasuredHeight(h);
      }
    };
    measure();

    let ro: ResizeObserver | null = null;
    try {
      if (wrapperRef.current && (window as any).ResizeObserver) {
        ro = new ResizeObserver(() => measure());
        ro.observe(wrapperRef.current);
      }
    } catch {
      // ignore
    }

    const t = setTimeout(measure, 350);
    return () => {
      clearTimeout(t);
      if (ro && wrapperRef.current) ro.unobserve(wrapperRef.current);
    };
  }, [videoUrl, transcript, transcriptionOpen]);

  // Process video -> transcript
  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    const videoElement = videoRef.current;

    const handleLoadedData = async () => {
      try {
        // Center the raw <video> if VideoPlayer exposes it
        try {
          videoElement.style.display = "block";
          videoElement.style.marginLeft = "auto";
          videoElement.style.marginRight = "auto";
        } catch {
          /* ignore */
        }

        setIsTranscribing(true);
        setProgressText("Extracting frames from video...");
        const frames = await captureFrames(videoElement);
        if (!frames.length) throw new Error("No frames captured.");

        setProgressText("Transcribing audio...");
        const representativeFrame = frames[Math.floor(frames.length / 2)];
        const audioTranscript = await transcribeAudio(representativeFrame);

        const wordCount = audioTranscript.split(/\s+/).filter(Boolean).length;
        let fullTranscript = audioTranscript;

        if (wordCount < 20) {
          setProgressText("Describing visuals...");
          const visualDescription = await describeVideoVisuals(frames);
          fullTranscript += `\n\n${visualDescription}`;
        }

        setTranscript(fullTranscript);
      } catch (e) {
        setError(`Failed to generate transcript: ${String(e)}`);
      } finally {
        setIsTranscribing(false);
        setProgressText("");
      }
    };

    videoElement.addEventListener("loadeddata", handleLoadedData, {
      once: true,
    });
    return () =>
      videoElement.removeEventListener("loadeddata", handleLoadedData);
  }, [videoUrl]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      ["video/mp4", "video/quicktime", "video/webm"].includes(file.type)
    ) {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(URL.createObjectURL(file));
      setCaptions([]);
      setError(null);
      setTranscript("");
      setIsTranscribing(true); // ensure spinner shows immediately
      // do NOT setTranscriptionOpen(true) here — dropdown appears only after transcript exists
    } else {
      setError("Please upload a valid video file (MP4, MOV, WEBM).");
    }
    e.target.value = "";
  };

  // Generate captions: show inline loader under Controls while generating,
  // then collapse transcription on success
  const handleGenerateClick = useCallback(
    async (e?: React.MouseEvent) => {
      if (!transcript.trim()) {
        setError("Transcript cannot be empty.");
        return;
      }

      setIsGenerating(true);
      setError(null);
      setCaptions([]);
      setGenerationProgressText("Sending transcript to server...");

      try {
        const generated = await generateCaptions(transcript, style, language);
        setGenerationProgressText("Finalizing captions...");
        await new Promise((r) => setTimeout(r, 300));
        setCaptions(generated);
        setGenerationProgressText("");
        setTranscriptionOpen(false); // collapse after successful generation
      } catch (err) {
        setError(`Failed to generate captions: ${String(err)}`);
        setGenerationProgressText("");
        setTranscriptionOpen(true); // keep open for retry
      } finally {
        setIsGenerating(false);
      }
    },
    [transcript, style, language]
  );

  // Remove video -> reload page (keeps current behavior)
  const handleRemoveVideo = () => {
    window.location.reload();
  };

  // whether the video should be collapsed (shutter closed and replaced with Remove button)
  const isVideoCollapsed = !!transcript && !isTranscribing;

  return (
    <main className="flex flex-col items-center gap-8 w-full">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 w-full max-w-3xl">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* VIDEO wrapper: collapses to Remove button when finished */}
      <div className="w-full max-w-3xl">
        <motion.div
          ref={wrapperRef}
          initial={false}
          animate={{
            maxHeight: isVideoCollapsed ? 0 : measuredHeight,
            opacity: isVideoCollapsed ? 0 : 1,
          }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{ overflow: "hidden", borderRadius: 8 }}
        >
          <motion.div
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            animate={
              isVideoCollapsed
                ? { clipPath: "inset(0% 0% 100% 0%)" }
                : { clipPath: "inset(0% 0% 0% 0%)" }
            }
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ overflow: "hidden", borderRadius: 8 }}
            className="w-full"
          >
            <VideoPlayer
              ref={videoRef}
              videoUrl={videoUrl}
              onFileChange={handleFileChange}
            />
          </motion.div>
        </motion.div>

        {/* Remove button */}
        <AnimatePresence>
          {isVideoCollapsed && (
            <motion.div
              key="remove"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeInOut", delay: 0.05 }}
              className="mt-3"
            >
              <button
                onClick={handleRemoveVideo}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg shadow-md transition-colors"
                aria-label="Remove video and reload"
              >
                Remove video
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TRANSCRIPTION AREA */}
        <div className="mt-4">
          {/* If transcribing and transcript not yet ready => show spinner here */}
          {isTranscribing && !transcript ? (
            <div className="flex flex-col items-center justify-center py-10 w-full rounded bg-neutral-800/30">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300 text-center text-lg font-medium animate-pulse">
                {progressText || "Processing your video..."}
              </p>
            </div>
          ) : null}

          {/* Render dropdown only after transcript exists */}
          {transcript ? (
            <div className="mt-2">
              {/* Entire header row is a single clickable button spanning the full width */}
              <button
                type="button"
                onClick={() => setTranscriptionOpen((s) => !s)}
                aria-expanded={transcriptionOpen}
                className="w-full flex items-center justify-between mb-2 px-3 py-2 rounded hover:bg-neutral-800 transition focus:outline-none"
              >
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-200 leading-tight">
                    Transcript & Options
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5 hidden sm:block">
                    Edit transcript, choose style & language
                  </p>
                </div>

                <motion.span
                  animate={{ rotate: transcriptionOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block text-gray-300"
                  aria-hidden
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: transcriptionOpen ? "auto" : 0,
                  opacity: transcriptionOpen ? 1 : 0,
                }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{ overflow: "hidden", borderRadius: 8 }}
              >
                {/* Spinner (shows while transcribing) */}
                {isTranscribing && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300 text-center text-lg font-medium animate-pulse">
                      {progressText || "Processing your video..."}
                    </p>
                  </div>
                )}

                {/* Transcript & Controls (appear after transcription finishes) */}
                {!isTranscribing && transcript && (
                  <motion.div
                    key="transcript"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full flex flex-col gap-4 mt-2"
                  >
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

                    {/* Inline generation loader */}
                    <AnimatePresence>
                      {isGenerating && (
                        <motion.div
                          key="gen-loader"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-center py-6"
                        >
                          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="text-gray-300 text-center text-base font-medium animate-pulse">
                            {generationProgressText || "Generating captions..."}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Caption Output (only after generation) */}
      <AnimatePresence>
        {!isGenerating && captions.length > 0 && (
          <motion.div
            key="captions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >
            <CaptionOutput captions={captions} isLoading={isGenerating} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default HomePage;
