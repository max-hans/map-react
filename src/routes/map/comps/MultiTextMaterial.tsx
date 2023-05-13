import { FunctionComponent } from "react";
import { Texture } from "three";

interface MultiTexMaterialProps {
  idx: number;
  textures: Texture[];
}

const MultiTexMaterial: FunctionComponent<MultiTexMaterialProps> = ({
  idx,
  textures,
}) => {
  const tex = textures[idx];
  return <meshBasicMaterial attach="material" map={tex} />;
};

export default MultiTexMaterial;
