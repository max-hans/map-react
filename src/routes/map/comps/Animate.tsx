import { a } from "@react-spring/three";
import { config, useSpring } from "@react-spring/web";
import { useThree } from "@react-three/fiber";
import { FC } from "react";

interface AnimatorProps {
  position: [number, number, number];
  target: [number, number, number];
}
const Animator: FC<AnimatorProps> = ({ position, target }) => {
  const { camera, controls } = useThree();

  const s = useSpring({
    from: defaultPosition,
    // Fun jelly-like animation
    config: config.wobbly,
    onStart: () => {
      if (!controls) return;
      controls.enabled = false;
    },
    onRest: () => {
      if (!controls) return;
      controls.enabled = true;
    },
  });

  s.position.start({ from: camera.position.toArray(), to: position });
  s.target.start({
    from: controls ? controls.target.toArray() : [0, 0, 0],
    to: target,
  });

  const AnimateControls = useMemo(() => a(ControlsWrapper), []);
  const AnimatedNavigation = useMemo(() => a(CameraWrapper), []);

  return (
    <>
      <AnimatedNavigation cameraPosition={s.position} target={s.target} />
      <AnimateControls target={s.target} />
    </>
  );
};
