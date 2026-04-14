"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, Group, Mesh } from "three";
import type { AnimationAction } from "three";
import { SkeletonUtils } from "three-stdlib";

type ModelViewerProps = {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotationY?: number;
  isPlaying?: boolean;
  shirtColor?: string;
};

export default function ModelViewer({
  url,
  scale = 1,
  position = [0, -1.1, 0],
  rotationY = Math.PI,
  isPlaying = true,
  shirtColor = "#d9488b",
}: ModelViewerProps) {
  const wrapperRef = useRef<Group>(null);
  const activeActionRef = useRef<AnimationAction | null>(null);

  const { scene, animations } = useGLTF(url);

  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene);
  }, [scene]);

  const { actions, names } = useAnimations(animations, clonedScene);

  useEffect(() => {
    clonedScene.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      const material = object.material;
      if (!material || Array.isArray(material)) return;

      if (!material.userData.__avatarMaterialCloned) {
        object.material = material.clone();
        object.material.userData.__avatarMaterialCloned = true;
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    const tint = new Color(shirtColor);

    clonedScene.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      const material = object.material;
      if (!material || Array.isArray(material) || !("color" in material)) return;

      material.color.copy(tint);
      material.needsUpdate = true;
    });
  }, [clonedScene, shirtColor]);

  useEffect(() => {
    const firstAnimation = names[0];
    if (!firstAnimation) return;

    const action = actions[firstAnimation];
    activeActionRef.current = action ?? null;
    action?.reset().fadeIn(0.25).play();

    return () => {
      action?.fadeOut(0.25);
      if (activeActionRef.current === action) {
        activeActionRef.current = null;
      }
    };
  }, [actions, names, url]);

  useEffect(() => {
    const action = activeActionRef.current;
    if (!action) return;

    action.paused = !isPlaying;
    if (isPlaying) {
      action.play();
    }
  }, [isPlaying]);

  useFrame((_, delta) => {
    if (!isPlaying) return;

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
