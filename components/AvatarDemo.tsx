"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import ModelViewer from "./ModelViewer";

type Outfit = {
  id: string;
  label: string;
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotationY?: number;
};

const outfits: Outfit[] = [
  {
    id: "look-1",
    label: "Blue Shirt",
    path: "/models/look-1.glb",
    scale: 1.2,
    position: [0, -1.1, 0],
    rotationY: Math.PI,
  },
//   {
//     id: "look-2",
//     label: "Black Tee",
//     path: "/models/look-2.glb",
//     scale: 1.2,
//     position: [0, -1.1, 0],
//     rotationY: Math.PI,
//   },
//   {
//     id: "look-3",
//     label: "Casual Look",
//     path: "/models/look-3.glb",
//     scale: 1.2,
//     position: [0, -1.1, 0],
//     rotationY: Math.PI,
//   },
];

export default function AvatarDemo() {
  const [selected, setSelected] = useState<Outfit>(outfits[0]);

  const leftItems = outfits.slice(0, 1);
  const rightItems = outfits.slice(1);

  return (
    <div style={pageStyle}>
      <div style={sideColumnStyle}>
        {leftItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            style={{
              ...cardStyle,
              border:
                selected.id === item.id
                  ? "2px solid #d9488b"
                  : "1px solid #d9deea",
            }}
          >
            <div style={hangerBoxStyle}>{item.label}</div>
          </button>
        ))}
      </div>

      <div style={canvasShellStyle}>
        <div style={arrowLeftStyle}>←</div>
        <div style={arrowRightStyle}>→</div>

        <Canvas camera={{ position: [0, 1.4, 3.8], fov: 35 }}>
          <color attach="background" args={["#f5f7fb"]} />

          <ambientLight intensity={1.4} />
          <hemisphereLight intensity={1.1} groundColor="#d9dce5" />
          <directionalLight position={[4, 6, 4]} intensity={2.2} />

          <Suspense fallback={<Html center>Loading model...</Html>}>
            <ModelViewer
              url={selected.path}
              scale={selected.scale}
              position={selected.position}
              rotationY={selected.rotationY}
            />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]}>
              <torusGeometry args={[1.05, 0.035, 24, 100]} />
              <meshStandardMaterial color="#d9488b" />
            </mesh>

            <ContactShadows
              position={[0, -1.14, 0]}
              opacity={0.35}
              scale={5}
              blur={2.5}
              far={2.2}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 0.2, 0]}
          />
        </Canvas>
      </div>

      <div style={sideColumnStyle}>
        {rightItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            style={{
              ...cardStyle,
              border:
                selected.id === item.id
                  ? "2px solid #d9488b"
                  : "1px solid #d9deea",
            }}
          >
            <div style={hangerBoxStyle}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "220px 1fr 220px",
  gap: "24px",
  padding: "24px",
  background: "linear-gradient(180deg, #f8f9fc 0%, #eef2f8 100%)",
};

const sideColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "20px",
};

const canvasShellStyle: React.CSSProperties = {
  position: "relative",
  height: "85vh",
  borderRadius: "24px",
  overflow: "hidden",
  background: "linear-gradient(180deg, #f7f8fc 0%, #eef1f7 100%)",
  border: "1px solid #e3e7f0",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  padding: "16px",
  cursor: "pointer",
  boxShadow: "0 8px 30px rgba(42, 52, 74, 0.08)",
  transition: "all 0.2s ease",
};

const hangerBoxStyle: React.CSSProperties = {
  height: "220px",
  borderRadius: "12px",
  border: "1px dashed #ccd3e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#3f4a5f",
  fontWeight: 600,
  textAlign: "center",
  padding: "12px",
};

const arrowLeftStyle: React.CSSProperties = {
  position: "absolute",
  left: "14%",
  top: "42%",
  transform: "translateY(-50%)",
  fontSize: "64px",
  color: "#d9488b",
  zIndex: 10,
  pointerEvents: "none",
};

const arrowRightStyle: React.CSSProperties = {
  position: "absolute",
  right: "14%",
  top: "42%",
  transform: "translateY(-50%)",
  fontSize: "64px",
  color: "#d9488b",
  zIndex: 10,
  pointerEvents: "none",
};
