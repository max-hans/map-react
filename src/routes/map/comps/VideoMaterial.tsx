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
    setTimeout(() => {
      video.currentTime = 0;
    });
  }, []);

  useEffect(() => {
    if (position === undefined) return;
    const pos = Math.min(Math.max(position, 0), 1) || 0.00001;

    const v = constrain(pos * video.duration, 0, video.duration);
    if (!isNaN(v)) {
      video.currentTime = v - 0.001;
      return;
    }
  }, [position, video]);

  useEffect(() => {
    const onLoadedHandler = () => {
      video.currentTime = 0;
    };
    video.addEventListener("loadeddata", onLoadedHandler);
    return () => {
      video.removeEventListener("loadeddata", onLoadedHandler);
    };
  }, []);

  return video ? (
    <meshStandardMaterial emissive="white" toneMapped={false}>
      <videoTexture attach="emissiveMap" args={[video]} />
      <videoTexture attach="map" args={[video]} />
    </meshStandardMaterial>
  ) : null;
};

export default VideoMaterial;
