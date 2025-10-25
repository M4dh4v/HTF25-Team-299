
import React from 'react';

interface TranscriptInputProps {
  transcript: string;
  setTranscript: (transcript: string) => void;
  isTranscribing: boolean;
  disabled: boolean;
}

const TranscriptInput: React.FC<TranscriptInputProps> = ({
  transcript,
  setTranscript,
  isTranscribing,
  disabled,
}) => {
  return (
    <div className="relative">
      <label htmlFor="transcript-input" className="block text-sm font-medium text-gray-400 mb-1">
        Video Transcript
      </label>
      <textarea
        id="transcript-input"
        rows={8}
        className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
        placeholder={disabled ? "Upload a video to begin..." : "Paste your transcript here or wait for automatic transcription..."}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        disabled={disabled || isTranscribing}
      />
      {isTranscribing && (
        <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-indigo-300 font-semibold">Extracting & Transcribing Audio...</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptInput;
