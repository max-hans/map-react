import { shaderMaterial, useVideoTexture } from "@react-three/drei/web";
import { extend, Object3DNode } from "@react-three/fiber";
import { FC, useEffect } from "react";
import { MeshBasicMaterial, Texture } from "three";
import { constrain } from "../../../func/data";
import useVideo from "../../../hooks/useVideo";

import DitherMaterial from "./shaders/ditherShaderMat";
extend({ DitherMaterial });

type DitherShaderImpl = {
  map: Texture | Texture[];
} & JSX.IntrinsicElements["shaderMaterial"];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ditherMaterial: DitherShaderImpl;
    }
  }
}

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

  {
    /* <ditherMaterial map={texture} key={DitherMaterial.key} toneMapped={false}> */
  }
  return video ? (
    <meshBasicMaterial attach="material">
      <videoTexture attach="map" args={[video]} />
    </meshBasicMaterial>
  ) : /* </ditherMaterial> */
  null;
};

export default VideoMaterial;

{
  /*   <meshStandardMaterial
    emissive="lightgray"
    toneMapped={false}
    opacity={1}
    dithering
  >
    <videoTexture attach="emissiveMap" args={[video]} />
    <videoTexture attach="map" args={[video]} />
  </meshStandardMaterial>; */
}
