"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { SkeletonUtils } from "three-stdlib";

type ModelViewerProps = {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotationY?: number;
};

export default function ModelViewer({
  url,
  scale = 1,
  position = [0, -1.1, 0],
  rotationY = Math.PI,
}: ModelViewerProps) {
  const wrapperRef = useRef<Group>(null);

  const { scene, animations } = useGLTF(url);

  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene);
  }, [scene]);

  const { actions, names } = useAnimations(animations, clonedScene);

  useEffect(() => {
    const firstAnimation = names[0];
    if (!firstAnimation) return;

    const action = actions[firstAnimation];
    action?.reset().fadeIn(0.25).play();

    return () => {
      action?.fadeOut(0.25);
    };
  }, [actions, names, url]);

  useFrame((_, delta) => {
    if (wrapperRef.current) {
      wrapperRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group
      ref={wrapperRef}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
