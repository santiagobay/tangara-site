"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { onReady } from "@/lib/ready";

const VERT = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uDisperse;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
attribute vec3 aStart;
attribute vec3 aTarget;
attribute vec3 aDir;
attribute float aRand;
varying float vRand;
varying float vAlpha;

float ease(float t){ return t*t*(3.0-2.0*t); }

void main(){
  float delay = aRand * 0.5;
  float p = ease(clamp((uProgress - delay) / 0.5, 0.0, 1.0));
  vec3 pos = mix(aStart, aTarget, p);

  pos.x += sin(uTime*0.6 + aRand*20.0) * 0.022;
  pos.y += cos(uTime*0.5 + aRand*17.0) * 0.022;
  pos.z += sin(uTime*0.4 + aRand*9.0) * 0.05;

  vec2 d = pos.xy - uMouse.xy;
  float dist = length(d);
  float f = smoothstep(1.15, 0.0, dist);
  pos.xy += normalize(d + vec2(0.0001)) * f * 0.6;
  pos.z += f * 0.7;

  pos += aDir * uDisperse * 4.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aRand * 0.9) * uPixelRatio * (7.0 / -mv.z);
  vRand = aRand;
  vAlpha = (1.0 - uDisperse) * (0.3 + 0.7 * p);
}
`;

const FRAG = /* glsl */ `
varying float vRand;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.05, length(c));
  vec3 mint = vec3(0.243, 0.725, 0.659);
  vec3 sig  = vec3(0.643, 0.949, 0.753);
  vec3 lime = vec3(0.353, 0.639, 0.443);
  vec3 col = mix(mint, sig, smoothstep(0.35, 0.95, vRand));
  col = mix(col, lime, smoothstep(0.22, 0.0, vRand));
  gl_FragColor = vec4(col, a * vAlpha);
}
`;

function samplePoints(img: HTMLImageElement, width: number, step = 2) {
  const ratio = img.height / img.width;
  const cw = 240;
  const ch = Math.round(cw * ratio);
  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, cw, ch);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const pts: number[] = [];
  for (let y = 0; y < ch; y += step) {
    for (let x = 0; x < cw; x += step) {
      if (data[(y * cw + x) * 4 + 3] > 110) {
        const jx = (Math.random() - 0.5) * step;
        const jy = (Math.random() - 0.5) * step;
        pts.push(((x + jx) / cw - 0.5) * width, -((y + jy) / ch - 0.5) * width * ratio);
      }
    }
  }
  return pts;
}

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

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
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    const pr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.5);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.z = 8;
    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: reduce ? 1 : 0 },
      uDisperse: { value: 0 },
      uSize: { value: 8 },
      uPixelRatio: { value: pr },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Faint wireframe backdrop
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.6, 1),
      new THREE.MeshBasicMaterial({ color: 0x1d6c61, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    wire.position.z = -3;
    group.add(wire);

    // Ambient dust
    const dustN = lowEnd ? 140 : 300;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 22;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 2] = -Math.random() * 9;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0x3eb9a8, size: 0.035, transparent: true, opacity: 0.45, depthWrite: false }),
    );
    scene.add(dust);

    let points: THREE.Points | null = null;
    let disposed = false;
    const img = new Image();
    img.src = "/brand/bird-mark.png";
    img.onload = () => {
      if (disposed) return;
      const t = samplePoints(img, 4.8, lowEnd ? 3 : 2);
      const n = t.length / 2;
      const start = new Float32Array(n * 3);
      const target = new Float32Array(n * 3);
      const dir = new Float32Array(n * 3);
      const rand = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        target[i * 3] = t[i * 2];
        target[i * 3 + 1] = t[i * 2 + 1];
        target[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        // scatter on a wide shell
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const r = 5 + Math.random() * 6;
        start[i * 3] = r * Math.sin(ph) * Math.cos(th);
        start[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        start[i * 3 + 2] = r * Math.cos(ph) - 2;
        dir[i * 3] = (Math.random() - 0.5) * 2;
        dir[i * 3 + 1] = Math.random() * 1.4 + 0.2;
        dir[i * 3 + 2] = Math.random() * 1.5;
        rand[i] = Math.random();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
      geo.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
      points = new THREE.Points(geo, material);
      points.frustumCulled = false;
      group.add(points);
      if (reduce) renderer.render(scene, camera);

      if (!reduce) {
        onReady(() => {
          gsap.to(uniforms.uProgress, { value: 1, duration: 3.2, ease: "power2.inOut", delay: 0.2 });
        });
      }
    };
    img.onerror = () => setFailed(true);

    // layout
    let aspect = 1;
    const layout = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      aspect = w / h;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      if (aspect > 1.15) {
        group.position.set(1.85, 0.2, 0);
        group.scale.setScalar(0.88);
      } else {
        // Small screens: smaller, softer bird parked in the upper area, clear of the headline
        group.position.set(0, 2.0, 0);
        group.scale.setScalar(Math.min(0.42, Math.max(0.26, aspect * 0.62)));
      }
      uniforms.uSize.value = aspect > 1.15 ? 8 : 4.2;
      if (reduce) renderer.render(scene, camera);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    // pointer → local plane coords
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;

    const frame = () => {
      // Reduced motion: draw still frames only (on load/resize), no loop.
      if (!reduce) raf = requestAnimationFrame(frame);
      if (!visible && !reduce) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const wx = mouse.x * halfH * aspect - group.position.x;
      const wy = mouse.y * halfH - group.position.y;
      uniforms.uMouse.value.set(wx / group.scale.x, wy / group.scale.x, 0);

      if (!reduce) {
        group.rotation.y += (mouse.x * 0.25 - group.rotation.y) * 0.04;
        group.rotation.x += (-mouse.y * 0.15 - group.rotation.x) * 0.04;
        wire.rotation.x = t * 0.05;
        wire.rotation.y = t * 0.07;
        dust.rotation.y = t * 0.01;
      }

      const sy = window.scrollY / Math.max(1, window.innerHeight * 0.9);
      uniforms.uDisperse.value = THREE.MathUtils.clamp(sy, 0, 1);
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(uniforms.uProgress);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={host} className="hero-canvas" aria-hidden="true">
      {failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/brand/bird-mark.png" alt="" className="hero-fallback" />
      )}
    </div>
  );
}
