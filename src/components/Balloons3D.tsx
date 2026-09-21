"use client";

import { useEffect, useRef } from "react";
import { fireConfetti } from "./Confetti";

const COLORS = [0xb7311b, 0xf2a81d, 0x3f5a2b, 0x5b2a14, 0xe8c46a, 0xd1541c, 0xf6e9c8, 0xb7311b];
// nx / ny are fractions of the visible half-width / half-height, z is depth.
// Positions are random on every load and again each time a balloon is popped and regrows.
const COUNT = 8;
const randSlot = (i: number) => {
  const side = i % 2 ? 1 : -1;
  return {
    nx: side * (0.4 + Math.random() * 0.56), // keep the middle clear for Hasini
    ny: (Math.random() * 2 - 1) * 0.85,
    z: -1.2 + Math.random() * 2.8,
    s: 0.7 + Math.random() * 0.6,
    wx: 0.25 + Math.random() * 0.5,
    wy: 0.25 + Math.random() * 0.5,
  };
};

export default function Balloons3D() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current!;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.45;
      const key = new THREE.DirectionalLight(0xfff1d6, 1.3);
      key.position.set(-4, 6, 6);
      scene.add(key);

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 10);

      const bodyGeo = new THREE.SphereGeometry(1, 48, 36);
      bodyGeo.scale(1, 1.2, 1);
      const knotGeo = new THREE.ConeGeometry(0.15, 0.24, 20);
      const stringGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -1.3, 0),
          new THREE.Vector3(0.18, -2.1, 0),
          new THREE.Vector3(-0.12, -3.1, 0),
          new THREE.Vector3(0.06, -4.3, 0),
        ]),
        24,
        0.014,
        6,
      );
      const stringMat = new THREE.MeshBasicMaterial({ color: 0x2a140a });

      type Balloon = { group: import("three").Group; body: import("three").Mesh; slot: ReturnType<typeof randSlot>; phase: number; poppedAt: number; respawned: boolean };
      const balloons: Balloon[] = [];
      const mats: import("three").Material[] = [stringMat];
      Array.from({ length: COUNT }).forEach((_, i) => {
        const slot = randSlot(i);
        const mat = new THREE.MeshPhysicalMaterial({
          color: COLORS[i % COLORS.length],
          roughness: 0.32,
          clearcoat: 0.8,
          clearcoatRoughness: 0.18,
        });
        mats.push(mat);
        const group = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, mat);
        const knot = new THREE.Mesh(knotGeo, mat);
        knot.position.y = -1.32;
        group.add(body, knot, new THREE.Mesh(stringGeo, stringMat));
        scene.add(group);
        balloons.push({ group, body, slot, phase: Math.random() * 6.28, poppedAt: 0, respawned: false });
      });

      let halfW = 5;
      let halfH = 3.6;
      let unit = 0.6;
      let active = 8;
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        halfW = halfH * camera.aspect;
        const narrow = camera.aspect < 0.8;
        unit = halfH * (narrow ? 0.11 : 0.15);
        active = narrow ? 6 : 8;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      let px = 0;
      let py = 0;
      const onMove = (e: PointerEvent) => {
        px = (e.clientX / window.innerWidth - 0.5) * 2;
        py = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove);

      const ray = new THREE.Raycaster();
      const onClick = (e: Event) => {
        const { x, y } = (e as CustomEvent).detail as { x: number; y: number };
        const r = host.getBoundingClientRect();
        const ndc = new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(
          balloons.filter((b, i) => i < active && !b.poppedAt).map((b) => b.body),
          false,
        )[0];
        if (!hit) return;
        const b = balloons.find((bb) => bb.body === hit.object)!;
        b.poppedAt = performance.now();
        fireConfetti(x, y, 60);
      };
      window.addEventListener("hero-click", onClick);

      const easeOutBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(host);

      let raf = 0;
      let cx = 0;
      let cy = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const t = reduce ? 0 : now / 1000;
        const sc = Math.min(window.scrollY / window.innerHeight, 1.2);
        cx += (px - cx) * 0.05;
        cy += (py - cy) * 0.05;
        camera.position.x = cx * 0.7;
        camera.position.y = -cy * 0.4;
        camera.lookAt(0, 0, 0);

        balloons.forEach((b, i) => {
          const g = b.group;
          g.visible = i < active;
          if (!g.visible) return;
          let scale = unit * b.slot.s;
          if (b.poppedAt) {
            const dt = now - b.poppedAt;
            if (dt < 90) scale *= 1 + dt / 220; // swell
            else if (dt < 3500) scale = 0; // gone
            else if (dt < 4200) {
              if (!b.respawned) {
                b.slot = randSlot(i); // reappears somewhere new
                b.respawned = true;
              }
              scale = unit * b.slot.s * easeOutBack((dt - 3500) / 700); // regrow
            } else {
              b.poppedAt = 0;
              b.respawned = false;
            }
          }
          g.scale.setScalar(Math.max(scale, 0.0001));
          g.position.set(
            (b.slot.nx + Math.sin(t * b.slot.wx + b.phase) * 0.06) * halfW * 0.98,
            (b.slot.ny + Math.cos(t * b.slot.wy + b.phase) * 0.05) * halfH + Math.sin(t * 0.9 + b.phase) * 0.28 + sc * (2.4 + b.slot.s * 1.5),
            b.slot.z,
          );
          g.rotation.y = t * 0.6 + b.phase;
          g.rotation.z = Math.sin(t * 0.7 + b.phase) * 0.09;
        });
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("hero-click", onClick);
        bodyGeo.dispose();
        knotGeo.dispose();
        stringGeo.dispose();
        mats.forEach((m) => m.dispose());
        renderer.dispose();
        pmrem.dispose();
        host.removeChild(renderer.domElement);
      };
    })().catch(() => {});

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mount} className="balloons3d" aria-hidden="true" />;
}
