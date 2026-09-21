"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { photos } from "@/lib/assets";

// Depth offsets zig-zag so the path through the photos winds instead of running straight.
const DEPTHS = [0.2, -1.4, 0.6, -1.1, 0.4, -1.3, 0.5, -1.0, 0.3];
const FRAMES = photos.frames.map((src, i) => ({ src, label: `MOMENT ${String(i + 1).padStart(2, "0")}`, z: DEPTHS[i % DEPTHS.length] }));
const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const GAP = 5.6; // distance between photos along the x axis
const HEIGHT = 3.3; // height of every cut-out in world units
const BG = 0x2a140a;

// A 3D "graph" of Hasini: each photo is a node standing on a gridded floor, joined by a glowing path.
// The horizontal scroller on top drives the camera along the x axis.
export default function PhotoGraph() {
  const mount = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = FRAMES.length;

  const goTo = (i: number) => {
    const s = scroller.current!;
    s.scrollTo({ left: s.clientWidth * Math.max(0, Math.min(n - 1, i)), behavior: "smooth" });
  };

  useEffect(() => {
    const host = mount.current!;
    const sc = scroller.current!;
    let disposed = false;
    let cleanup = () => {};

    // Mouse drag to scroll sideways (touch and trackpads already scroll natively).
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startLeft = sc.scrollLeft;
      sc.classList.add("drag");
      sc.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (dragging) sc.scrollLeft = startLeft - (e.clientX - startX) * 1.5;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      sc.classList.remove("drag");
      sc.scrollTo({ left: Math.round(sc.scrollLeft / sc.clientWidth) * sc.clientWidth, behavior: "smooth" });
    };
    sc.addEventListener("pointerdown", down);
    sc.addEventListener("pointermove", move);
    sc.addEventListener("pointerup", up);
    sc.addEventListener("pointercancel", up);

    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(BG);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(BG, 9, 26);
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

      const disposables: { dispose(): void }[] = [];
      const track = <T extends { dispose(): void }>(o: T) => {
        disposables.push(o);
        return o;
      };

      const radial = (color: string) => {
        const c = document.createElement("canvas");
        c.width = c.height = 256;
        const g = c.getContext("2d")!;
        const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        gr.addColorStop(0, color);
        gr.addColorStop(1, "rgba(242,168,29,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 256, 256);
        const t = track(new THREE.CanvasTexture(c));
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };
      const labelTex = (text: string) => {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 160;
        const g = c.getContext("2d")!;
        g.fillStyle = "#f2a81d";
        g.beginPath();
        g.roundRect(8, 24, 496, 112, 56);
        g.fill();
        g.lineWidth = 8;
        g.strokeStyle = "#f6e9c8";
        g.stroke();
        g.fillStyle = "#2a140a";
        g.font = "800 62px system-ui, Segoe UI, sans-serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(text, 256, 82);
        const t = track(new THREE.CanvasTexture(c));
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };

      // floor grid + axis
      const trackLen = GAP * (n - 1);
      const grid = new THREE.GridHelper(90, 90, 0xf2a81d, 0x6a3418);
      grid.position.x = trackLen / 2;
      (grid.material as import("three").Material).transparent = true;
      (grid.material as import("three").Material).opacity = 0.6;
      track(grid.geometry);
      track(grid.material as import("three").Material);
      scene.add(grid);

      // glowing path linking the nodes
      const pts = FRAMES.map((f, i) => new THREE.Vector3(i * GAP, 0.03, f.z));
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-4, 0.03, 0.8), ...pts, new THREE.Vector3(trackLen + 4, 0.03, -0.6)]);
      const pathGeo = track(new THREE.TubeGeometry(curve, 160, 0.04, 8));
      const pathMat = track(new THREE.MeshBasicMaterial({ color: 0xf2a81d }));
      scene.add(new THREE.Mesh(pathGeo, pathMat));

      // drifting motes for depth
      const moteCount = 260;
      const moteArr = new Float32Array(moteCount * 3);
      for (let i = 0; i < moteCount; i++) {
        moteArr[i * 3] = -8 + Math.random() * (trackLen + 16);
        moteArr[i * 3 + 1] = Math.random() * 7;
        moteArr[i * 3 + 2] = -7 + Math.random() * 11;
      }
      const moteGeo = track(new THREE.BufferGeometry());
      moteGeo.setAttribute("position", new THREE.BufferAttribute(moteArr, 3));
      const moteMat = track(new THREE.PointsMaterial({ color: 0xf2a81d, size: 0.06, transparent: true, opacity: 0.85, depthWrite: false }));
      const motes = new THREE.Points(moteGeo, moteMat);
      scene.add(motes);

      // the nodes
      const poolTex = radial("rgba(242,168,29,0.85)");
      const ringGeo = track(new THREE.RingGeometry(0.95, 1.05, 64));
      const ringMat = track(new THREE.MeshBasicMaterial({ color: 0xf6e9c8, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
      const stemMat = track(new THREE.LineBasicMaterial({ color: 0xf2a81d }));
      const loader = new THREE.TextureLoader();

      type Node = { group: import("three").Group; pool: import("three").Mesh; sprite: import("three").Sprite; baseY: number };
      const nodes: Node[] = FRAMES.map((f, i) => {
        const group = new THREE.Group();
        group.position.set(i * GAP, 0, f.z);
        scene.add(group);

        const pool = new THREE.Mesh(
          track(new THREE.PlaneGeometry(4.6, 4.6)),
          track(new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })),
        );
        pool.rotation.x = -Math.PI / 2;
        pool.position.y = 0.01;
        group.add(pool);

        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.02;
        group.add(ring);

        const sprite = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: labelTex(f.label), transparent: true, depthWrite: false })));
        sprite.scale.set(2.5, 0.78, 1);
        sprite.position.set(0, HEIGHT + 1.15, 0);
        group.add(sprite);
        const stem = new THREE.Line(track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, HEIGHT + 0.05, 0), new THREE.Vector3(0, HEIGHT + 0.78, 0)])), stemMat);
        group.add(stem);

        loader.load(f.src, (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          track(tex);
          const aspect = tex.image.width / tex.image.height;
          const w = HEIGHT * aspect;
          const geo = track(new THREE.PlaneGeometry(w, HEIGHT));
          geo.translate(0, HEIGHT / 2, 0);
          // Stack of dark copies behind the photo gives the cut-out real thickness when the camera moves.
          const layers = 7;
          for (let k = layers; k >= 0; k--) {
            const mat = track(
              new THREE.MeshBasicMaterial({
                map: tex,
                color: k === 0 ? 0xffffff : 0x1b0d06,
                transparent: true,
                alphaTest: 0.08,
                side: THREE.DoubleSide,
              }),
            );
            const m = new THREE.Mesh(geo, mat);
            m.position.z = -k * 0.03;
            group.add(m);
          }
        });

        return { group, pool, sprite, baseY: 0 };
      });

      let dist = 7.6;
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        // Pull back on tall (phone) screens so a whole photo fits.
        dist = Math.max(7.6, 5.4 / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect));
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      let px = 0;
      let py = 0;
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      host.parentElement!.addEventListener("pointermove", onMove);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(host);

      let camX = 0;
      let cpx = 0;
      let cpy = 0;
      let lastActive = -1;
      let raf = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const t = reduce ? 0 : now / 1000;
        const max = sc.scrollWidth - sc.clientWidth;
        const p = max > 0 ? sc.scrollLeft / max : 0;
        const targetX = p * trackLen;
        const vel = targetX - camX;
        camX += vel * 0.09;
        cpx += (px - cpx) * 0.05;
        cpy += (py - cpy) * 0.05;

        const idx = Math.round(p * (n - 1));
        if (idx !== lastActive) {
          lastActive = idx;
          setActive(idx);
        }

        camera.position.set(camX + cpx * 0.9, 1.9 - cpy * 0.4 + Math.sin(t * 0.6) * 0.05, dist);
        camera.lookAt(camX + vel * 0.6, 1.55, 0);
        camera.rotation.z = -vel * 0.02; // lean into the motion

        nodes.forEach((nd, i) => {
          const on = i === lastActive;
          nd.group.position.y = Math.sin(t * 1.2 + i * 1.3) * 0.05;
          nd.group.rotation.y += (cpx * 0.28 * (on ? 1 : 0.5) - nd.group.rotation.y) * 0.08;
          const s = on ? 1.06 : 1;
          nd.group.scale.x += (s - nd.group.scale.x) * 0.1;
          nd.group.scale.y += (s - nd.group.scale.y) * 0.1;
          (nd.pool.material as import("three").MeshBasicMaterial).opacity += ((on ? 1 : 0.4) - (nd.pool.material as import("three").MeshBasicMaterial).opacity) * 0.1;
          nd.sprite.position.y = HEIGHT + 1.15 + Math.sin(t * 2 + i) * 0.06;
        });
        motes.rotation.y = Math.sin(t * 0.1) * 0.05;
        motes.position.y = Math.sin(t * 0.4) * 0.15;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        host.parentElement?.removeEventListener("pointermove", onMove);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        host.removeChild(renderer.domElement);
      };
    })().catch(() => {});

    return () => {
      disposed = true;
      sc.removeEventListener("pointerdown", down);
      sc.removeEventListener("pointermove", move);
      sc.removeEventListener("pointerup", up);
      sc.removeEventListener("pointercancel", up);
      cleanup();
    };
  }, [n]);

  return (
    <section className="graph-section reveal">
      <h2 className="kicker rv">Hasini, in {COUNT_WORDS[n] ?? n} frames</h2>
      <p className="graph-title rv">Slide through the graph.</p>

      <div className="graph-stage rv">
        <div ref={mount} className="graph-canvas" />
        <div ref={scroller} className="graph-scroller" tabIndex={0} aria-label="Scroll sideways through Hasini's photos">
          {FRAMES.map((f) => (
            <div key={f.src} className="graph-slide" />
          ))}
        </div>

        <div className="graph-hud">
          <motion.button type="button" className="graph-btn" aria-label="Previous photo" onClick={() => goTo(active - 1)} disabled={active === 0} whileTap={{ scale: 0.9 }}>
            &larr;
          </motion.button>
          <div className="graph-dots">
            {FRAMES.map((f, i) => (
              <button key={f.src} type="button" aria-label={`Go to photo ${i + 1}`} className={i === active ? "on" : ""} onClick={() => goTo(i)} />
            ))}
          </div>
          <motion.button type="button" className="graph-btn" aria-label="Next photo" onClick={() => goTo(active + 1)} disabled={active === n - 1} whileTap={{ scale: 0.9 }}>
            &rarr;
          </motion.button>
        </div>
        <p className="graph-hint">Drag, swipe or scroll sideways</p>
      </div>
    </section>
  );
}
