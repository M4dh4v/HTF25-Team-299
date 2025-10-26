import React from "react";
import { CaptionStyle } from "../../types";

interface ControlsProps {
  style: CaptionStyle;
  setStyle: (style: CaptionStyle) => void;
  language: string;
  setLanguage: (language: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  style,
  setStyle,
  language,
  setLanguage,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Mandarin",
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="w-full md:w-1/3">
        <label
          htmlFor="style-select"
          className="block text-sm font-medium text-gray-400 mb-1"
        >
          Caption Style
        </label>
        <select
          id="style-select"
          value={style}
          onChange={(e) => setStyle(e.target.value as CaptionStyle)}
          className="w-full bg-neutralal-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-green500 focus:border-green0 transition"
          disabled={disabled}
        >
          {Object.values(CaptionStyle).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-1/3">
        <label
          htmlFor="language-select"
          className="block text-sm font-medium text-gray-400 mb-1"
        >
          Language
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-neutralal-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-green focus:border-greenransition"
          disabled={disabled}
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-1/3 md:self-end">
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled}
          className="w-full h-[46px] bg-gradient-to-r from-greenrple-600 text-white font-bold py-2.5 px-4 rounded-lg hover:from-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "✨ Generate Captions"
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
