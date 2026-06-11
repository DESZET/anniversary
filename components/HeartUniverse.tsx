"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function HeartUniverse() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Heart geometry via parametric points
    const heartShape = new THREE.Shape();
    const x0 = 0, y0 = 0;
    heartShape.moveTo(x0, y0 + 0.25);
    heartShape.bezierCurveTo(x0, y0 + 0.25, x0 - 0.1, y0, x0 - 0.3, y0);
    heartShape.bezierCurveTo(x0 - 0.6, y0, x0 - 0.6, y0 + 0.35, x0 - 0.6, y0 + 0.35);
    heartShape.bezierCurveTo(x0 - 0.6, y0 + 0.55, x0 - 0.4, y0 + 0.77, x0, y0 + 1.0);
    heartShape.bezierCurveTo(x0 + 0.4, y0 + 0.77, x0 + 0.6, y0 + 0.55, x0 + 0.6, y0 + 0.35);
    heartShape.bezierCurveTo(x0 + 0.6, y0 + 0.35, x0 + 0.6, y0, x0 + 0.3, y0);
    heartShape.bezierCurveTo(x0 + 0.1, y0, x0, y0 + 0.25, x0, y0 + 0.25);

    const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 6 };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    // Heart mesh with glow material
    const heartMat = new THREE.MeshPhongMaterial({
      color: 0xff4466,
      emissive: 0xff1133,
      emissiveIntensity: 0.4,
      shininess: 80,
      transparent: true,
      opacity: 0.9,
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    scene.add(heart);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xff6b9d, wireframe: true, transparent: true, opacity: 0.08 });
    const wireHeart = new THREE.Mesh(heartGeo, wireMat);
    scene.add(wireHeart);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b9d, 2, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xd4a843, 1.5, 10);
    pointLight2.position.set(-2, -1, 1);
    scene.add(pointLight2);

    // Particle system — reduce on mobile
    const particleCount = isMobile ? 200 : 600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      // Gold or pink
      if (Math.random() > 0.5) {
        colors[i * 3] = 0.83; colors[i * 3 + 1] = 0.66; colors[i * 3 + 2] = 0.26;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.61;
      }
      sizes[i] = Math.random() * 3 + 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Glowing ring around heart
    const ringGeo = new THREE.TorusGeometry(1.2, 0.01, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4a843, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Mouse + touch tracking
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseX = (t.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(t.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Resize
    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.01;

      // Heart heartbeat + rotation
      heart.rotation.y += 0.008;
      wireHeart.rotation.y = heart.rotation.y;
      const pulse = 1 + Math.sin(t * 2) * 0.04;
      heart.scale.setScalar(pulse);
      wireHeart.scale.setScalar(pulse * 1.01);

      // Particles orbit
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      // Ring rotation
      ring.rotation.z += 0.005;
      ring.rotation.x = Math.sin(t * 0.5) * 0.3;

      // Camera follows mouse
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 1.0 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Pulse lights
      pointLight1.intensity = 1.5 + Math.sin(t * 2) * 0.5;
      pointLight2.intensity = 1.0 + Math.cos(t * 1.5) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      // Dispose all geometries and materials
      heartGeo.dispose(); heartMat.dispose(); wireMat.dispose();
      particleGeo.dispose(); particleMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="heart-universe" style={{ width: "100%", padding: "6rem 0", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(25,5,30,0.8) 0%, rgba(10,10,26,0.95) 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div style={{ textAlign: "center", marginBottom: "3rem" }}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1rem", color: "#d4a843" }}>
            ✦ Heart Universe ✦
          </p>
          <h2 style={{
            fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
            background: "linear-gradient(135deg, #ff6b9d, #d4a843)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Our Love in 3D
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.75rem" }}>Move your cursor to explore</p>
        </motion.div>

        {/* Three.js canvas */}
        <div ref={mountRef} style={{
          width: "100%", borderRadius: "1.5rem", overflow: "hidden",
          height: "clamp(320px, 65vh, 650px)",
          border: "1px solid rgba(255,107,157,0.15)",
          background: "rgba(10,5,20,0.6)",
          boxShadow: "0 0 80px rgba(255,107,157,0.1)",
        }} />

        <motion.p style={{ textAlign: "center", marginTop: "2rem", color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", fontStyle: "italic", fontFamily: "Georgia, serif" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}>
          ❤️ A heart that beats only for you
        </motion.p>
      </div>
    </section>
  );
}
