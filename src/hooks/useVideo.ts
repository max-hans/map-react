import { useState } from "react";

const useVideo = (url: string, { play }: Partial<{ play: boolean }> = {}) => {
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    play && vid.play();
    vid.draggable = false;
    return vid;
  });
  return video;
};

export default useVideo;
