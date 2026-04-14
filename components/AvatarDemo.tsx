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
  const [isPlaying, setIsPlaying] = useState(true);
  const [shirtColor, setShirtColor] = useState("#d9488b");

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
        <button
          type="button"
          onClick={() => setIsPlaying((value) => !value)}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
          style={playPauseButtonStyle}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div style={shirtControlsStyle}>
          <div style={shirtControlsLabelStyle}>Shirt color</div>
          <div style={swatchRowStyle}>
            {shirtSwatches.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={`Set shirt color to ${swatch}`}
                onClick={() => setShirtColor(swatch)}
                style={{
                  ...swatchButtonStyle,
                  background: swatch,
                  boxShadow:
                    shirtColor === swatch
                      ? "0 0 0 3px rgba(255, 255, 255, 0.85), 0 0 0 5px rgba(217, 72, 139, 0.55)"
                      : swatchButtonStyle.boxShadow,
                }}
              />
            ))}
            <label style={colorInputLabelStyle}>
              <span style={visuallyHiddenStyle}>Choose custom shirt color</span>
              <input
                type="color"
                value={shirtColor}
                onChange={(event) => setShirtColor(event.target.value)}
                aria-label="Choose custom shirt color"
                style={colorInputStyle}
              />
            </label>
          </div>
        </div>

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
              isPlaying={isPlaying}
              shirtColor={shirtColor}
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

const playPauseButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "18px",
  right: "18px",
  zIndex: 20,
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(217, 72, 139, 0.25)",
  background: "rgba(255, 255, 255, 0.92)",
  color: "#d9488b",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(42, 52, 74, 0.12)",
  backdropFilter: "blur(8px)",
};

const shirtSwatches = ["#d9488b", "#2b6cb0", "#2f855a", "#805ad5", "#111827"];

const shirtControlsStyle: React.CSSProperties = {
  position: "absolute",
  top: "18px",
  left: "18px",
  zIndex: 20,
  padding: "12px 14px",
  borderRadius: "18px",
  border: "1px solid rgba(227, 231, 240, 0.9)",
  background: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0 10px 30px rgba(42, 52, 74, 0.12)",
  backdropFilter: "blur(8px)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const shirtControlsLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  fontWeight: 700,
};

const swatchRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const swatchButtonStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  border: "1px solid rgba(17, 24, 39, 0.12)",
  cursor: "pointer",
  boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.85)",
};

const colorInputLabelStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "999px",
  overflow: "hidden",
  border: "1px solid rgba(17, 24, 39, 0.12)",
  boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.85)",
  cursor: "pointer",
};

const colorInputStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
  padding: 0,
  background: "transparent",
  cursor: "pointer",
};

const visuallyHiddenStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
