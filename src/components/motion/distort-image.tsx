"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Texture, WebGLRenderer } from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uCover;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Ondulation qui part du curseur
    vec2 diff = uv - uMouse;
    float dist = length(diff * vec2(uAspect, 1.0));
    float ripple = sin(dist * 26.0 - uTime * 5.0) * exp(-dist * 5.0) * 0.012 * uHover;
    uv += normalize(diff + 0.0001) * ripple;

    // Léger zoom au survol
    uv = (uv - 0.5) * (1.0 - 0.05 * uHover) + 0.5;

    // Équivalent de object-cover + object-top
    vec2 tuv = vec2(
      (uv.x - 0.5) * uCover.x + 0.5,
      1.0 - (1.0 - uv.y) * uCover.y
    );

    float shift = 0.0035 * uHover;
    gl_FragColor = vec4(
      texture2D(uTexture, tuv + vec2(shift, 0.0)).r,
      texture2D(uTexture, tuv).g,
      texture2D(uTexture, tuv - vec2(shift, 0.0)).b,
      1.0
    );
  }
`;

// Image de projet rendue avec Three.js : au repos identique à l'image d'origine,
// elle ondule et se décale légèrement en couleurs au survol de la souris.
export function DistortImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Three.js n'est téléchargé que sur les appareils qui en profitent (souris)
    import("three").then((THREE) => {
      if (cancelled) return;
      cleanup = setup(THREE, container, src);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <Image
        src={src}
        alt={alt}
        width={500}
        height={300}
        className="size-full object-cover object-top"
      />
    </div>
  );
}

function setup(
  THREE: typeof import("three"),
  container: HTMLDivElement,
  src: string,
) {
  let renderer: WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return undefined; // Pas de WebGL : l'image classique reste affichée
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.className =
    "absolute inset-0 size-full opacity-0 transition-opacity duration-500";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const uniforms = {
    uTexture: { value: null as Texture | null },
    uCover: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uAspect: { value: 1 },
  };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  });
  scene.add(new THREE.Mesh(geometry, material));

  let imageAspect = 1;
  const updateCover = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const planeAspect = width / height;
    uniforms.uAspect.value = planeAspect;
    uniforms.uCover.value.set(
      imageAspect > planeAspect ? planeAspect / imageAspect : 1,
      imageAspect > planeAspect ? 1 : imageAspect / planeAspect,
    );
  };

  const clock = new THREE.Clock();
  let frame = 0;
  let hovered = false;
  const mouseTarget = new THREE.Vector2(0.5, 0.5);

  // On ne fait tourner la boucle que pendant le survol et le retour au repos
  const tick = () => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uHover.value += ((hovered ? 1 : 0) - uniforms.uHover.value) * 0.08;
    uniforms.uMouse.value.lerp(mouseTarget, 0.12);
    renderer.render(scene, camera);
    if (hovered || uniforms.uHover.value > 0.002) {
      frame = requestAnimationFrame(tick);
    } else {
      uniforms.uHover.value = 0;
      renderer.render(scene, camera);
      frame = 0;
    }
  };
  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const onEnter = () => {
    hovered = true;
    start();
  };
  const onMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    mouseTarget.set(
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height,
    );
  };
  const onLeave = () => {
    hovered = false;
    start();
  };

  const texture = new THREE.TextureLoader().load(src, (tex) => {
    const img = tex.image as HTMLImageElement;
    imageAspect = img.width / img.height;
    updateCover();
    renderer.render(scene, camera);
    canvas.style.opacity = "1";
  });
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  uniforms.uTexture.value = texture;

  const resizeObserver = new ResizeObserver(() => {
    updateCover();
    renderer.render(scene, camera);
  });
  resizeObserver.observe(container);
  container.addEventListener("pointerenter", onEnter);
  container.addEventListener("pointermove", onMove);
  container.addEventListener("pointerleave", onLeave);

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    container.removeEventListener("pointerenter", onEnter);
    container.removeEventListener("pointermove", onMove);
    container.removeEventListener("pointerleave", onLeave);
    texture.dispose();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    container.removeChild(canvas);
  };
}
