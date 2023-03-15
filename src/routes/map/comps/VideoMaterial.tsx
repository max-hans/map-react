import { FC, useEffect } from "react";
import { constrain } from "../../../func/data";
import useVideo from "../../../hooks/useVideo";

interface VideoMaterialProps {
  url: string;
  position?: number;
}

const VideoMaterial: FC<VideoMaterialProps> = ({ url, position }) => {
  const video = useVideo(url);

  useEffect(() => {
    if (video) {
      video.currentTime = 0;
    }
  }, [video, position]);

  useEffect(() => {
    if (position === undefined) return;
    const pos = Math.min(Math.max(position, 0), 1) || 0.00001;
    try {
      const v = constrain(pos * video.duration, 0, video.duration);
      console.log(v, video.duration);

      video.currentTime = v - 0.001;
    } catch (e) {
      console.log(e);
    }
  }, [position, video]);

  return video ? (
    <meshStandardMaterial emissive="white" toneMapped={false}>
      <videoTexture attach="emissiveMap" args={[video]} />
      <videoTexture attach="map" args={[video]} />
    </meshStandardMaterial>
  ) : null;
};

export default VideoMaterial;
