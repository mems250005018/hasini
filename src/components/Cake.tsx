"use client";

import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "./Confetti";
import { motion } from "motion/react";
import Spices from "./Spices";
import SplitText from "./SplitText";

export default function Cake() {
  const mount = useRef<HTMLDivElement>(null);
  const boost = useRef(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const host = mount.current!;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const sun = new THREE.DirectionalLight(0xfff0d0, 2.2);
      sun.position.set(3, 5, 4);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.bias = -0.0004;
      sun.shadow.radius = 6;
      scene.add(sun);

      const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false; // keep page scrolling on wheel and pinch
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.55;
      renderer.domElement.style.touchAction = "pan-y"; // vertical swipe scrolls the page, horizontal swipe spins the cake

      let model: import("three").Object3D | null = null;
      let baseY = 0;
      new GLTFLoader().load(
        "/models/cake.glb",
        (gltf) => {
          if (disposed) return;
          model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.traverse((o) => {
            if ((o as import("three").Mesh).isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
          scene.add(model);
          baseY = model.position.y;
          const radius = Math.max(size.x, size.y, size.z);
          // Soft floor shadow under the cake.
          const floor = new THREE.Mesh(new THREE.PlaneGeometry(radius * 8, radius * 8), new THREE.ShadowMaterial({ opacity: 0.38 }));
          floor.rotation.x = -Math.PI / 2;
          floor.position.y = -size.y / 2 - radius * 0.06;
          floor.receiveShadow = true;
          scene.add(floor);
          sun.position.set(radius * 1.6, radius * 3, radius * 1.4);
          sun.shadow.camera.left = -radius * 1.6;
          sun.shadow.camera.right = radius * 1.6;
          sun.shadow.camera.top = radius * 1.6;
          sun.shadow.camera.bottom = -radius * 1.6;
          sun.shadow.camera.near = 0.1;
          sun.shadow.camera.far = radius * 10;
          sun.shadow.camera.updateProjectionMatrix();
          camera.position.set(radius * 1.1, radius * 0.9, radius * 1.6);
          controls.target.set(0, 0, 0);
          controls.update();
          setReady(true);
        },
        undefined,
        () => setFailed(true),
      );

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(host);
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        boost.current *= 0.96;
        controls.autoRotateSpeed = 2 + boost.current;
        if (model) model.position.y = baseY + Math.sin(performance.now() / 650) * 0.02 * (camera.position.length() / 3);
        controls.update();
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        renderer.dispose();
        pmrem.dispose();
        host.removeChild(renderer.domElement);
      };
    })().catch(() => setFailed(true));

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const celebrate = (e: React.MouseEvent) => {
    boost.current = 40;
    setWished(true);
    fireConfetti(e.clientX, e.clientY, 160);
  };

  return (
    <section className="cake-section reveal">
      <Spices count={14} />
      <div className="cake-copy rv from-left">
        <h2 className="kicker">Dessert, after the biryani</h2>
        <SplitText className="cake-title" text="Spin the cake. Then make a wish." />
        <motion.button type="button" className="big-btn" onClick={celebrate} whileHover={{ scale: 1.07, rotate: -2 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
          {wished ? "Wish sent. Spin again" : "Make a wish"}
        </motion.button>
        <p className="wish">Swipe sideways to turn it. Scroll normally to move on.</p>
      </div>

      <div className="cake-stage rv from-right">
        <div ref={mount} className="cake-canvas" />
        {!ready && !failed && <p className="cake-status">Baking the cake...</p>}
        {failed && <p className="cake-status">The cake could not load. Refresh to try again.</p>}
      </div>
    </section>
  );
}
