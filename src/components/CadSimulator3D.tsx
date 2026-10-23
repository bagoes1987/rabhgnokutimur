"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Camera,
  Play,
  Pause,
  Box,
  Compass,
  Crown,
  Music,
  Users,
  Globe,
  Printer,
  Maximize2,
} from "lucide-react";

export interface CadSimulator3DRef {
  captureAllPovsForPrint: () => Record<string, string>;
  setAngle: (angle: string) => void;
}

interface CadSimulator3DProps {
  onPrintRequest: () => void;
  externalAngle?: string | null;
}

const CadSimulator3D = forwardRef<CadSimulator3DRef, CadSimulator3DProps>(
  ({ onPrintRequest, externalAngle }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<any>(null);
    const spotConesRef = useRef<THREE.Mesh[]>([]);
    const isTourActiveRef = useRef<boolean>(false);
    const tourTimeRef = useRef<number>(0);

    const [isTourActive, setIsTourActive] = useState(false);
    const [activePreset, setActivePreset] = useState("isometric");
    const [angleLabel, setAngleLabel] = useState(
      "Posisi: 📐 Pandangan Isometrik CAD 3D (Kawasan 22×96m • 3.026 Kursi)"
    );

    const animateCameraTo = (
      tx: number,
      ty: number,
      tz: number,
      lx: number,
      ly: number,
      lz: number
    ) => {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return;

      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();
      const endPos = new THREE.Vector3(tx, ty, tz);
      const endTarget = new THREE.Vector3(lx, ly, lz);

      let progress = 0;
      const step = () => {
        progress += 0.06;
        if (progress >= 1) {
          camera.position.copy(endPos);
          controls.target.copy(endTarget);
          controls.update();
          return;
        }
        const ease = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(startPos, endPos, ease);
        controls.target.lerpVectors(startTarget, endTarget, ease);
        controls.update();
        requestAnimationFrame(step);
      };
      step();
    };

    const handleSetCameraAngle = (angle: string) => {
      if (isTourActiveRef.current) {
        isTourActiveRef.current = false;
        setIsTourActive(false);
      }
      setActivePreset(angle);

      if (angle === "isometric") {
        animateCameraTo(36, 36, 18, 0, 2, 6);
        setAngleLabel(
          "Posisi: 📐 Pandangan Isometrik CAD 3D (Kawasan 22×96m • 3.026 Kursi)"
        );
      } else if (angle === "front") {
        animateCameraTo(0, 4.2, -23, 0, 2.5, -38);
        setAngleLabel(
          "Posisi: 🎯 Tampak Depan Panggung Utama (8×6m & Videotron LED 8×3m)"
        );
      } else if (angle === "sideLeft") {
        animateCameraTo(-36, 16, 6, 0, 2, 6);
        setAngleLabel(
          "Posisi: 📐 Tampak Samping Potongan (Elevasi Stage 1,2m & Bentang 96m)"
        );
      } else if (angle === "vip") {
        animateCameraTo(0, 1.4, -30.5, 0, 2.8, -38);
        setAngleLabel(
          "Posisi: 👑 POV Sofa VVIP Bupati (Menghadap Lurus ke Panggung Utama & Videotron)"
        );
      } else if (angle === "choir") {
        animateCameraTo(8.5, 2.4, -38, 0, 1.2, 14);
        setAngleLabel(
          "Posisi: 🎵 POV Paduan Suara (Menghadap Penuh ke 3.000 Peserta Guru)"
        );
      } else if (angle === "rear") {
        animateCameraTo(0, 2.2, 49, 0, 3.8, -38);
        setAngleLabel(
          "Posisi: 👥 POV Baris Belakang Ke-89 (Menatap Panggung Sejauh 85 Meter)"
        );
      } else if (angle === "aerial") {
        animateCameraTo(0, 88, 6, 0, 0, 6);
        setAngleLabel(
          "Posisi: 🌐 Denah Atas Orthographic CAD (Masterplan 22 × 96 Meter)"
        );
      }
    };

    useEffect(() => {
      if (externalAngle) {
        handleSetCameraAngle(externalAngle);
      }
    }, [externalAngle]);

    const captureAllPovsForPrint = (): Record<string, string> => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const results: Record<string, string> = {};

      if (!renderer || !scene || !camera) return results;

      const prevPos = camera.position.clone();
      const prevTarget = controls ? controls.target.clone() : new THREE.Vector3(0, 2, 6);

      const povList = [
        { id: "print3d_vip", pos: [0, 1.4, -30.5], target: [0, 2.8, -38] },
        { id: "print3d_choir", pos: [8.5, 2.4, -38], target: [0, 1.2, 14] },
        { id: "print3d_rear", pos: [0, 2.2, 49], target: [0, 3.8, -38] },
        { id: "print3d_iso", pos: [36, 36, 18], target: [0, 2, 6] },
        { id: "print3d_front", pos: [0, 4.2, -23], target: [0, 2.5, -38] },
        { id: "print3d_side", pos: [-36, 16, 6], target: [0, 2, 6] },
      ];

      povList.forEach((pov) => {
        camera.position.set(pov.pos[0], pov.pos[1], pov.pos[2]);
        if (controls) {
          controls.target.set(pov.target[0], pov.target[1], pov.target[2]);
          controls.update();
        }
        renderer.render(scene, camera);
        try {
          const dataUrl = renderer.domElement.toDataURL("image/png");
          results[pov.id] = dataUrl;
          const img = document.getElementById(pov.id) as HTMLImageElement | null;
          if (img) img.src = dataUrl;
        } catch (err) {
          console.warn("Failed to capture POV", pov.id, err);
        }
      });

      camera.position.copy(prevPos);
      if (controls) {
        controls.target.copy(prevTarget);
        controls.update();
      }
      renderer.render(scene, camera);
      return results;
    };

    useImperativeHandle(ref, () => ({
      captureAllPovsForPrint,
      setAngle: handleSetCameraAngle,
    }));

    const downloadCurrent3DScreenshot = () => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !scene || !camera) return;
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Simulasi_3D_CAD_${activePreset}_HUT_PGRI_OKUT.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || 900;
      const height = container.clientHeight || 540;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x020617);
      scene.fog = new THREE.Fog(0x020617, 45, 240);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 900);
      camera.position.set(36, 36, 18);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.innerHTML = "";
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
      controls.minDistance = 3;
      controls.maxDistance = 260;
      controls.target.set(0, 2, 6);
      controls.update();
      controlsRef.current = controls;

      // Lighting
      scene.add(new THREE.AmbientLight(0x93c5fd, 0.9));
      scene.add(new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.65));

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
      sunLight.position.set(35, 60, 20);
      sunLight.target.position.set(0, 0, -38);
      scene.add(sunLight.target);
      scene.add(sunLight);

      const stageSpot = new THREE.SpotLight(0x38bdf8, 3.0, 55, Math.PI / 3, 0.4);
      stageSpot.position.set(0, 20, -28);
      stageSpot.target.position.set(0, 1.2, -38);
      scene.add(stageSpot);
      scene.add(stageSpot.target);

      // Helpers
      function createCADLabel(
        text: string,
        color = "#38bdf8",
        bgColor = "rgba(2, 6, 23, 0.9)",
        borderColor = "#0284c7"
      ) {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 96;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(8, 8, 496, 80, 16);
        } else {
          ctx.rect(8, 8, 496, 80);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 22px "JetBrains Mono", "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 256, 48);

        const tex = new THREE.CanvasTexture(c);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(6.5, 1.2, 1);
        return sprite;
      }

      function createDimensionLine(
        start: THREE.Vector3,
        end: THREE.Vector3,
        labelText?: string
      ) {
        const group = new THREE.Group();
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0x38bdf8,
          dashSize: 0.5,
          gapSize: 0.25,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        group.add(line);

        const tickGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
        const tickMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const t1 = new THREE.Mesh(tickGeo, tickMat);
        t1.position.copy(start);
        const t2 = new THREE.Mesh(tickGeo, tickMat);
        t2.position.copy(end);
        group.add(t1, t2);

        if (labelText) {
          const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
          const label = createCADLabel(
            labelText,
            "#f8fafc",
            "rgba(15, 23, 42, 0.92)",
            "#38bdf8"
          );
          label.position.set(mid.x, mid.y + 0.9, mid.z);
          label.scale.set(5.8, 1.1, 1);
          group.add(label);
        }
        return group;
      }

      function createCADBox(
        w: number,
        h: number,
        d: number,
        faceColor = 0x0f172a,
        edgeColor = 0x38bdf8,
        opacity = 0.9
      ) {
        const group = new THREE.Group();
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({
          color: faceColor,
          roughness: 0.4,
          metalness: 0.25,
          transparent: opacity < 1,
          opacity,
        });
        group.add(new THREE.Mesh(geo, mat));
        const wireGeo = new THREE.EdgesGeometry(geo);
        const wireMat = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 });
        group.add(new THREE.LineSegments(wireGeo, wireMat));
        return group;
      }

      function createChairGeometry() {
        const geometries: THREE.BufferGeometry[] = [];
        const seat = new THREE.BoxGeometry(0.44, 0.05, 0.42);
        seat.translate(0, 0.425, 0);
        geometries.push(seat);

        const back = new THREE.BoxGeometry(0.42, 0.36, 0.04);
        back.translate(0, 0.63, 0.19);
        geometries.push(back);

        const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 5);
        [
          [-0.18, 0.2, -0.17],
          [0.18, 0.2, -0.17],
          [-0.18, 0.2, 0.17],
          [0.18, 0.2, 0.17],
        ].forEach(([x, y, z]) => {
          const l = legGeo.clone();
          l.translate(x, y, z);
          geometries.push(l);
        });

        let posCount = 0,
          normCount = 0,
          indexCount = 0;
        geometries.forEach((g) => {
          posCount += g.attributes.position.array.length;
          normCount += g.attributes.normal.array.length;
          if (g.index) indexCount += g.index.array.length;
        });

        const mergedPos = new Float32Array(posCount);
        const mergedNorm = new Float32Array(normCount);
        const mergedIndex = new Uint32Array(indexCount);
        let pOffset = 0,
          nOffset = 0,
          iOffset = 0,
          vOffset = 0;

        geometries.forEach((g) => {
          mergedPos.set(g.attributes.position.array, pOffset);
          pOffset += g.attributes.position.array.length;
          mergedNorm.set(g.attributes.normal.array, nOffset);
          nOffset += g.attributes.normal.array.length;
          if (g.index) {
            for (let i = 0; i < g.index.array.length; i++) {
              mergedIndex[iOffset + i] = g.index.array[i] + vOffset;
            }
            iOffset += g.index.array.length;
          }
          vOffset += g.attributes.position.count;
        });

        const mergedGeo = new THREE.BufferGeometry();
        mergedGeo.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
        mergedGeo.setAttribute("normal", new THREE.BufferAttribute(mergedNorm, 3));
        if (indexCount > 0)
          mergedGeo.setIndex(new THREE.BufferAttribute(mergedIndex, 1));
        return mergedGeo;
      }

      // 1. CAD Coordinate Grid
      const gridMinor = new THREE.GridHelper(140, 140, 0x1e293b, 0x090d16);
      gridMinor.position.set(0, -0.02, 4);
      scene.add(gridMinor);

      const gridMajor = new THREE.GridHelper(140, 28, 0x0284c7, 0x0f172a);
      gridMajor.position.set(0, -0.015, 4);
      scene.add(gridMajor);

      const fieldPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 96),
        new THREE.MeshStandardMaterial({
          color: 0x061226,
          roughness: 0.8,
          metalness: 0.2,
        })
      );
      fieldPlane.rotation.x = -Math.PI / 2;
      fieldPlane.position.set(0, -0.01, 4);
      scene.add(fieldPlane);

      const fieldBorder = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(22, 96)),
        new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 })
      );
      fieldBorder.rotation.x = -Math.PI / 2;
      fieldBorder.position.set(0, 0.01, 4);
      scene.add(fieldBorder);

      scene.add(
        createDimensionLine(
          new THREE.Vector3(-11, 0.1, -44),
          new THREE.Vector3(11, 0.1, -44),
          "LEBAR TAPAK: 22.00 M"
        )
      );
      scene.add(
        createDimensionLine(
          new THREE.Vector3(12.5, 0.1, -44),
          new THREE.Vector3(12.5, 0.1, 52),
          "PANJANG KAWASAN: 96.00 M (3.000 KURSI 1 HAMPARAN)"
        )
      );

      // 2. Main Stage (8x6m)
      const stageGroup = new THREE.Group();
      stageGroup.position.set(0, 0, -38);

      const stageBase = createCADBox(8, 1.2, 6, 0x0f172a, 0x38bdf8, 0.95);
      stageBase.position.y = 0.6;
      stageGroup.add(stageBase);

      const stageDeck = createCADBox(7.9, 0.05, 5.9, 0x1e293b, 0x0ea5e9, 1.0);
      stageDeck.position.y = 1.22;
      stageGroup.add(stageDeck);

      for (let s = 0; s < 3; s++) {
        const step = createCADBox(
          3 - s * 0.2,
          0.4,
          0.5,
          0x991b1b,
          0xef4444,
          0.95
        );
        step.position.set(0, 0.2 + s * 0.4, 3.25 - s * 0.45);
        stageGroup.add(step);
      }

      const stageCallout = createCADLabel(
        "PANGGUNG UTAMA: 8.00m × 6.00m | ELEVASI: +1.20m",
        "#38bdf8",
        "rgba(15, 23, 42, 0.9)",
        "#38bdf8"
      );
      stageCallout.position.set(0, 1.9, 3.8);
      stageGroup.add(stageCallout);

      // 3. Curved Truss Roof
      [
        [-4.2, 2.8],
        [4.2, 2.8],
        [-4.2, -2.8],
        [4.2, -2.8],
      ].forEach(([x, z]) => {
        const col = createCADBox(0.35, 7, 0.35, 0x334155, 0x94a3b8, 0.85);
        col.position.set(x, 3.5, z);
        stageGroup.add(col);
      });

      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.2, 4.5, 2.8),
        new THREE.Vector3(-3.2, 6.2, 2.8),
        new THREE.Vector3(0, 7.3, 2.8),
        new THREE.Vector3(3.2, 6.2, 2.8),
        new THREE.Vector3(4.2, 4.5, 2.8),
      ]);
      const archMesh = new THREE.Mesh(
        new THREE.TubeGeometry(archCurve, 32, 0.2, 8, false),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.8,
          roughness: 0.2,
        })
      );
      stageGroup.add(archMesh);

      const canopyGeo = new THREE.CylinderGeometry(
        5.4,
        5.4,
        6.2,
        32,
        1,
        true,
        0,
        Math.PI
      );
      const canopyMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.rotation.z = Math.PI / 2;
      canopy.rotation.y = Math.PI / 2;
      canopy.position.set(0, 1.9, 0);
      stageGroup.add(canopy);

      const canopyWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(canopyGeo),
        new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.6,
        })
      );
      canopyWire.rotation.z = Math.PI / 2;
      canopyWire.rotation.y = Math.PI / 2;
      canopyWire.position.set(0, 1.9, 0);
      stageGroup.add(canopyWire);

      // 4. Videotron 8x3m
      const videoScreen = createCADBox(8.0, 3.0, 0.15, 0x0369a1, 0x38bdf8, 0.95);
      videoScreen.position.set(0, 2.9, -2.6);
      stageGroup.add(videoScreen);

      const videoCallout = createCADLabel(
        "VIDEOTRON LED P3: 8.00m × 3.00m (+2.20m)",
        "#38bdf8",
        "rgba(15, 23, 42, 0.9)",
        "#0284c7"
      );
      videoCallout.position.set(0, 4.8, -2.5);
      stageGroup.add(videoCallout);

      const cones: THREE.Mesh[] = [];
      [-3, -1, 1, 3].forEach((sx, i) => {
        const coneGeo = new THREE.ConeGeometry(1.6, 8, 16, 1, true);
        const coneMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x38bdf8 : 0xfde047,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set(sx, 2.4, 1.2);
        cone.rotation.x = Math.PI / 6;
        stageGroup.add(cone);
        cones.push(cone);
      });
      spotConesRef.current = cones;
      scene.add(stageGroup);

      // 5. Left Wing: Control Room (5x4m)
      const crGroup = new THREE.Group();
      crGroup.position.set(-8.5, 0, -38);
      const crBox = createCADBox(5, 3.2, 4, 0x1e1b4b, 0x818cf8, 0.85);
      crBox.position.y = 1.6;
      crGroup.add(crBox);
      const crCallout = createCADLabel(
        "SAYAP KIRI: CONTROL ROOM 5.00m × 4.00m (STERIL)",
        "#a5b4fc",
        "rgba(30, 27, 75, 0.9)",
        "#6366f1"
      );
      crCallout.position.set(0, 3.9, 0);
      crGroup.add(crCallout);
      scene.add(crGroup);

      // 6. Right Wing: Choir Facing Audience (+Z South)
      const choirGroup = new THREE.Group();
      choirGroup.position.set(8.5, 0, -38);

      const riser1 = createCADBox(6, 0.4, 1.2, 0x14532d, 0x22c55e, 0.9);
      riser1.position.set(0, 0.2, 1.2);
      choirGroup.add(riser1);

      const riser2 = createCADBox(6, 0.75, 1.2, 0x14532d, 0x22c55e, 0.9);
      riser2.position.set(0, 0.375, 0.0);
      choirGroup.add(riser2);

      const riser3 = createCADBox(6, 1.1, 1.2, 0x14532d, 0x22c55e, 0.9);
      riser3.position.set(0, 0.55, -1.2);
      choirGroup.add(riser3);

      const choirMemberGeo = new THREE.Group();
      const bodyMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.2, 1.05, 8),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
      );
      bodyMesh.position.y = 0.525;
      choirMemberGeo.add(bodyMesh);

      const headMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 })
      );
      headMesh.position.y = 1.15;
      choirMemberGeo.add(headMesh);

      const bookMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.18, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x991b1b })
      );
      bookMesh.position.set(0, 0.72, 0.18);
      bookMesh.rotation.x = 0.35;
      choirMemberGeo.add(bookMesh);

      [
        { z: 1.2, yBase: 0.4 },
        { z: 0.0, yBase: 0.75 },
        { z: -1.2, yBase: 1.1 },
      ].forEach((tier) => {
        for (let m = 0; m < 8; m++) {
          const singer = choirMemberGeo.clone();
          singer.position.set(-2.4 + m * 0.68, tier.yBase, tier.z);
          choirGroup.add(singer);
        }
      });

      const dirigenPodium = createCADBox(0.8, 0.25, 0.8, 0x0f172a, 0x22c55e, 0.95);
      dirigenPodium.position.set(0, 0.125, 2.5);
      choirGroup.add(dirigenPodium);

      const dirigen = choirMemberGeo.clone();
      dirigen.position.set(0, 0.25, 2.5);
      dirigen.rotation.y = Math.PI;
      choirGroup.add(dirigen);

      const choirCallout = createCADLabel(
        "SAYAP KANAN: PADUAN SUARA PGRI (HADAP PESERTA 👥)",
        "#86efac",
        "rgba(20, 83, 45, 0.92)",
        "#22c55e"
      );
      choirCallout.position.set(0, 3.2, 0);
      choirGroup.add(choirCallout);
      scene.add(choirGroup);

      // 7. Red Carpet Central Aisle
      const carpetGeo = new THREE.PlaneGeometry(2.0, 84);
      const carpetMat = new THREE.MeshStandardMaterial({
        color: 0xb91c1c,
        roughness: 0.6,
      });
      const redCarpet = new THREE.Mesh(carpetGeo, carpetMat);
      redCarpet.rotation.x = -Math.PI / 2;
      redCarpet.position.set(0, 0.02, 7.0);
      scene.add(redCarpet);

      // 8. VVIP Sofas Facing Stage (-Z North)
      const vvipGroup = new THREE.Group();
      vvipGroup.position.set(0, 0, -31.5);

      const vvipLabels = [
        "KAPOLRES & DANDIM",
        "KETUA PGRI OKU TIMUR",
        "BUPATI OKU TIMUR & IBU",
        "WAKIL BUPATI & FORKOPIMDA",
        "KADIS PENDIDIKAN",
        "SEKDA & TOKOH PENDIDIKAN",
      ];
      [-6.0, -3.6, -1.2, 1.2, 3.6, 6.0].forEach((x, i) => {
        const sofa = new THREE.Group();
        sofa.position.x = x;
        const seat = createCADBox(1.6, 0.38, 0.8, 0xf8fafc, 0x38bdf8, 0.96);
        seat.position.set(0, 0.22, 0);
        sofa.add(seat);

        const backrest = createCADBox(1.6, 0.55, 0.2, 0xf1f5f9, 0x0284c7, 0.96);
        backrest.position.set(0, 0.55, 0.32);
        sofa.add(backrest);

        const table = createCADBox(1.3, 0.34, 0.48, 0x1e293b, 0xf59e0b, 0.92);
        table.position.set(0, 0.17, -0.75);
        sofa.add(table);

        const tag = createCADLabel(
          vvipLabels[i],
          "#fde047",
          "rgba(15, 23, 42, 0.95)",
          "#f59e0b"
        );
        tag.position.set(0, 0.48, -0.75);
        tag.scale.set(3.2, 0.65, 1);
        sofa.add(tag);
        vvipGroup.add(sofa);
      });

      const vvipCallout = createCADLabel(
        "★ RING 1: SOFA VVIP MEWAH (MENGHADAP PANGGUNG 🎯)",
        "#fde047",
        "rgba(69, 26, 3, 0.92)",
        "#f59e0b"
      );
      vvipCallout.position.set(0, 1.9, -1.8);
      vvipGroup.add(vvipCallout);
      scene.add(vvipGroup);

      // 9. 3,026 Napolly Chairs InstancedMesh
      const chairGeo = createChairGeometry();
      const chairMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.35,
        metalness: 0.25,
      });
      const totalChairsCount = 3026;
      const chairInstanced = new THREE.InstancedMesh(
        chairGeo,
        chairMat,
        totalChairsCount
      );
      const dummy = new THREE.Object3D();
      let chairIdx = 0;
      const colorWest = new THREE.Color(0x0284c7);
      const colorEast = new THREE.Color(0x0369a1);
      const colorFront = new THREE.Color(0x38bdf8);

      function placeChairBlock(startRowIndex: number, numRows: number, zStart: number) {
        for (let r = 0; r < numRows; r++) {
          const z = zStart + r * 0.85;
          for (let c = 0; c < 17; c++) {
            dummy.position.set(-10.0 + c * 0.53, 0, z);
            dummy.updateMatrix();
            chairInstanced.setMatrixAt(chairIdx, dummy.matrix);
            chairInstanced.setColorAt(
              chairIdx,
              startRowIndex + r < 4 ? colorFront : colorWest
            );
            chairIdx++;
          }
          for (let c = 0; c < 17; c++) {
            dummy.position.set(1.5 + c * 0.53, 0, z);
            dummy.updateMatrix();
            chairInstanced.setMatrixAt(chairIdx, dummy.matrix);
            chairInstanced.setColorAt(
              chairIdx,
              startRowIndex + r < 4 ? colorFront : colorEast
            );
            chairIdx++;
          }
        }
      }

      placeChairBlock(0, 30, -28.0);
      scene.add(
        createDimensionLine(
          new THREE.Vector3(-10.5, 0.05, -2.6),
          new THREE.Vector3(10.5, 0.05, -2.6),
          "LORONG SILANG 1 (AKSES MEDIS & TOILET - LEBAR 1.50 M)"
        )
      );
      placeChairBlock(30, 30, -1.85);
      scene.add(
        createDimensionLine(
          new THREE.Vector3(-10.5, 0.05, 23.55),
          new THREE.Vector3(10.5, 0.05, 23.55),
          "LORONG SILANG 2 (SIRKULASI EVAKUASI K3 - LEBAR 1.50 M)"
        )
      );
      placeChairBlock(60, 29, 24.3);

      chairInstanced.instanceMatrix.needsUpdate = true;
      if (chairInstanced.instanceColor)
        chairInstanced.instanceColor.needsUpdate = true;
      scene.add(chairInstanced);

      // Delay Speaker Towers
      [-10.6, 10.6].forEach((tx) => {
        const tower = createCADBox(0.4, 6.0, 0.4, 0x334155, 0x94a3b8, 0.9);
        tower.position.set(tx, 3.0, -2.6);
        scene.add(tower);
      });

      // 10. Tanjak Gate
      const tanjakGroup = new THREE.Group();
      tanjakGroup.position.set(0, 0, 51.5);
      const tanjakBase = createCADBox(8, 0.5, 3, 0x1e293b, 0xf59e0b, 0.95);
      tanjakBase.position.y = 0.25;
      tanjakGroup.add(tanjakBase);
      const tanjakPeak = createCADBox(3.5, 3.5, 0.4, 0x78350f, 0xfde047, 0.95);
      tanjakPeak.position.y = 2.25;
      tanjakPeak.rotation.z = Math.PI / 4;
      tanjakGroup.add(tanjakPeak);
      const tanjakCallout = createCADLabel(
        "GERBANG UTAMA & MONUMEN TANJAK SMAN 1 BELITANG",
        "#fde047",
        "rgba(15, 23, 42, 0.92)",
        "#f59e0b"
      );
      tanjakCallout.position.set(0, 4.2, 0);
      tanjakGroup.add(tanjakCallout);
      scene.add(tanjakGroup);

      // Animation Loop
      let animId: number;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        if (isTourActiveRef.current) {
          tourTimeRef.current += 0.005;
          const radius = 42 + Math.sin(tourTimeRef.current * 0.4) * 8;
          const angle = tourTimeRef.current * 0.5;
          camera.position.x = Math.sin(angle) * radius;
          camera.position.z = 6 + Math.cos(angle) * (radius * 1.15);
          camera.position.y = 24 + Math.sin(tourTimeRef.current * 0.5) * 8;
          controls.target.set(0, 2.0, 6);
          controls.update();
        } else {
          controls.update();
        }

        const time = Date.now() * 0.002;
        spotConesRef.current.forEach((cone, i) => {
          cone.rotation.z = Math.sin(time + i * 1.5) * 0.18;
          cone.rotation.x = Math.PI / 6 + Math.cos(time + i) * 0.08;
        });

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current)
          return;
        const w = containerRef.current.clientWidth || 900;
        const h = containerRef.current.clientHeight || 540;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    }, []);

    const toggleCinematicTour = () => {
      const next = !isTourActiveRef.current;
      isTourActiveRef.current = next;
      setIsTourActive(next);
      if (next) {
        setAngleLabel(
          "Mode: 🎬 Tur Sinematik CAD 360° Mengitari Seluruh Kawasan 22×96m"
        );
      } else {
        setAngleLabel("Posisi: Manual CAD (Klik Kiri Putar, Scroll Zoom, Klik Kanan Geser)");
      }
    };

    const cameraButtons = [
      { id: "isometric", label: "Isometrik CAD", icon: Box, color: "cyan" },
      { id: "front", label: "Depan Panggung", icon: Compass, color: "cyan" },
      { id: "sideLeft", label: "Samping (96m)", icon: Maximize2, color: "emerald" },
      { id: "vip", label: "POV Sofa VVIP", icon: Crown, color: "amber" },
      { id: "choir", label: "POV Paduan Suara", icon: Music, color: "emerald" },
      { id: "rear", label: "POV Baris 89", icon: Users, color: "sky" },
      { id: "aerial", label: "Denah Atas CAD", icon: Globe, color: "indigo" },
    ];

    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              AutoCAD & Revit 3D Engine • Real-Time WebGL Blueprint (22 × 96 Meter)
            </div>
            <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2.5">
              Simulator Rekayasa 3D CAD: 3.026 Kursi Napolly & Orientasi Presisi
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Gunakan mouse/sentuhan untuk memutar 360°, memperbesar (zoom), atau pilih tombol sudut kamera (POV) di kanan untuk menginspeksi pandangan VVIP, Paduan Suara, dan Baris ke-89.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleCinematicTour}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-1.5 cursor-pointer ${
                isTourActive
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
              }`}
            >
              {isTourActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTourActive ? "Jeda Tur 360°" : "Tur Sinematik 360°"}</span>
            </button>

            <button
              onClick={downloadCurrent3DScreenshot}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Simpan Screenshot Sudut Pandang 3D Saat Ini"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ambil Foto 3D (PNG)</span>
            </button>

            <button
              onClick={onPrintRequest}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Semua POV 3D</span>
            </button>
          </div>
        </div>

        {/* Camera Preset Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {cameraButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activePreset === btn.id && !isTourActive;
            return (
              <button
                key={btn.id}
                onClick={() => handleSetCameraAngle(btn.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-950/50"
                    : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#020617] shadow-inner">
          <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Top Left Engineering Telemetry */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
            <span className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-cyan-400 border border-cyan-500/40">
              CAD SCALE 1:100 • 22.00 × 96.00 METER
            </span>
            <span className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/40">
              3.026 KURSI NAPOLLY BIG-208 (89 BARIS)
            </span>
            <span className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-amber-400 border border-amber-500/40">
              GRID: 1.00 M METRIC
            </span>
          </div>

          {/* Bottom Status Bar */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 pointer-events-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-cyan-400 font-bold">{angleLabel}</span>
            <span className="text-amber-400 font-semibold">
              ✓ Orientasi Terverifikasi: VVIP Hadap Panggung • Paduan Suara Hadap Peserta
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CadSimulator3D.displayName = "CadSimulator3D";
export default CadSimulator3D;
