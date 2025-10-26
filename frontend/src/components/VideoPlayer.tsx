import React from 'react';
import UploadIcon from './icons/UploadIcon';

interface VideoPlayerProps {
  videoUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoUrl, onFileChange }, ref) => {
    return (
      <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center aspect-video relative overflow-hidden">
        {videoUrl ? (
          <video
            ref={ref}
            src={videoUrl}
            controls
            className="w-full h-full object-contain rounded-lg"
            crossOrigin="anonymous" // Required for canvas operations
          />
        ) : (
          <div className="text-center">
            <label
              htmlFor="video-upload"
              className="cursor-pointer group flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-gray-700/50 transition-colors"
            >
              <UploadIcon className="w-12 h-12 text-gray-500 group-hover:text-indigo-400 transition-colors mb-2" />
              <span className="text-gray-400 font-semibold">Upload a Video</span>
              <span className="text-sm text-gray-500 mt-1">MP4, MOV, or WEBM</span>
            </label>
            <input
              id="video-upload"
              type="file"
              className="hidden"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={onFileChange}
            />
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;