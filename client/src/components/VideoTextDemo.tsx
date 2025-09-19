import { VideoText } from "./ui/video-text";

export function VideoTextDemo() {
  return (
    <div className="relative w-[280px] h-full overflow-hidden">
      <VideoText fontSize="30" src="https://cdn.magicui.design/ocean-small.webm">
        NOBODY
      </VideoText>
    </div>
  );
}
