"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform float uPixelRatio;
varying float vN;
void main(){
  vec3 p = position;
  float n = sin(p.x*2.1 + uTime*0.8) * sin(p.y*2.4 + uTime*0.6) * sin(p.z*1.9 + uTime*0.7);
  float ripple = sin(length(p)*5.0 - uTime*2.4) * 0.5 + 0.5;
  vec3 displaced = p + normalize(p) * (n * 0.42 + uEnergy * 0.35 * ripple);
  vN = n * 0.5 + 0.5 + uEnergy * ripple * 0.3;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.6 + uEnergy * 2.0) * uPixelRatio * (6.0 / -mv.z);
}
`;

const FRAG = /* glsl */ `
varying float vN;
void main(){
  float a = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
  vec3 mint = vec3(0.243, 0.725, 0.659);
  vec3 sig  = vec3(0.643, 0.949, 0.753);
  vec3 teal = vec3(0.114, 0.424, 0.380);
  vec3 col = mix(teal, mint, smoothstep(0.1, 0.55, vN));
  col = mix(col, sig, smoothstep(0.6, 1.0, vN));
  gl_FragColor = vec4(col, a * 0.9);
}
`;

export default function CtaScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Lighter scene on phones and modest machines.
    const lowEnd =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency || 8) <= 4 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return;
    }
    const pr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.5);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 7;

    const uniforms = {
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uPixelRatio: { value: pr },
    };
    const geo = new THREE.IcosahedronGeometry(1.9, lowEnd ? 8 : 12);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const orb = new THREE.Points(geo, mat);
    scene.add(orb);

    const layout = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      orb.scale.setScalar(w < 700 ? 0.8 : 1);
      if (reduce) renderer.render(scene, camera);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    let energy = 0;
    let lx = 0;
    let ly = 0;
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      energy = Math.min(1, energy + Math.hypot(e.clientX - lx, e.clientY - ly) * 0.004);
      lx = e.clientX;
      ly = e.clientY;
      target.x = nx;
      target.y = ny;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      // Reduced motion: draw one still frame, no loop.
      if (!reduce) raf = requestAnimationFrame(frame);
      if (!visible && !reduce) return;
      const t = clock.getElapsedTime();
      energy *= 0.94;
      uniforms.uTime.value = t;
      uniforms.uEnergy.value = reduce ? 0 : energy;
      if (!reduce) {
        orb.rotation.y = t * 0.12 + target.x * 0.5;
        orb.rotation.x = target.y * 0.35;
      }
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="cta-canvas" aria-hidden="true" />;
}
