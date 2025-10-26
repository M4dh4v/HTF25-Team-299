export default async function captureFrames(
  videoNode: HTMLVideoElement,
  maxFrames = 16
): Promise<string[]> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas not supported.");

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

    const frame = await new Promise<string>((resolve, reject) => {
      const onSeeked = () => {
        videoNode.removeEventListener("seeked", onSeeked);
        context.drawImage(videoNode, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
      };
      const onError = (e: Event) => {
        videoNode.removeEventListener("seeked", onSeeked);
        reject(e);
      };
      videoNode.addEventListener("seeked", onSeeked, { once: true });
      videoNode.addEventListener("error", onError, { once: true });
      videoNode.currentTime = time;
    });

    frames.push(frame);
  }
  return frames;
}
