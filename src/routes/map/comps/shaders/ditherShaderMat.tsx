import { shaderMaterial } from "@react-three/drei/web";
import { FC, useEffect } from "react";
import { Color, Texture } from "three";

import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

import twoByShader from "glsl-dither/2x2.glsl?raw";

console.log(twoByShader);

const DitherMaterial = shaderMaterial(
  { time: 0, color: new Color(0.2, 0.0, 0.1), map: new Texture() },
  vertexShader,
  fragmentShader
);

export default DitherMaterial;
