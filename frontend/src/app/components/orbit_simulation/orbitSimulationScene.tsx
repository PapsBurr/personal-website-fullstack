"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import { useRef, Suspense, createContext, useState } from "react";
import * as THREE from "three";

export default function () {
  return (
    <div className="canvas-container">
      <Canvas
        style={{ background: "black" }}
        camera={{ position: [-196, 64, 64], fov: 90, near: 0.01, far: 10000 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 1.5]} // Limit pixel ratio
      >
        <Suspense fallback={null}>
          <GizmoHelper alignment="top-left" margin={[80, 80]}>
            <GizmoViewcube />
          </GizmoHelper>
          <OrbitControls enableRotate makeDefault zoomSpeed={5} />
          <ambientLight intensity={0.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
