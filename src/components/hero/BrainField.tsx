import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Pulsating brain — procedural point cloud rendered via R3F.
 * Two hemispheres of points distributed on an ellipsoid surface with noise
 * folding (sulci-like), breathing scale, and mouse-driven synaptic pulse.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;          // -1..1 NDC of pointer
  uniform float uMouseActive;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aSeed;         // per-point random 0..1
  attribute float aHemisphere;   // -1 or +1

  varying float vGlow;
  varying float vSeed;

  // cheap hash noise
  float hash(float n){ return fract(sin(n) * 43758.5453123); }

  void main(){
    vec3 p = position;

    // global breathing (≈0.6 Hz)
    float breath = 1.0 + sin(uTime * 3.77) * 0.025;
    p *= breath;

    // gentle per-point wander
    float w = sin(uTime * 0.9 + aSeed * 30.0) * 0.018;
    p += normalize(position + 0.0001) * w;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 proj = projectionMatrix * mv;

    // synaptic pulse based on screen distance to mouse
    vec2 screen = proj.xy / proj.w;
    float md = distance(screen, uMouse);
    float pulse = smoothstep(0.55, 0.0, md) * uMouseActive;

    // base brightness varies by seed, hemisphere, and depth
    float depth = clamp(-mv.z / 6.0, 0.0, 1.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.0 + aSeed * 50.0);
    vGlow = (0.35 + 0.65 * twinkle) * (1.0 - depth * 0.5) + pulse * 1.2;
    vSeed = aSeed;

    gl_PointSize = uSize * uPixelRatio * (0.6 + 0.8 * twinkle + pulse * 1.4) / max(0.6, -mv.z * 0.4);
    gl_Position = proj;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying float vGlow;
  varying float vSeed;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.15, d) * 0.6;
    vec3 col = mix(uColorA, uColorB, vSeed);
    float a = (core * 0.85 + halo) * clamp(vGlow, 0.0, 1.6);
    gl_FragColor = vec4(col, a);
  }
`;

function makeBrainGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const hemi = new Float32Array(count);

  // ellipsoid radii (brain-ish: longer L-R, shorter dorsal-ventral)
  const rx = 1.45, ry = 0.95, rz = 1.15;

  let i = 0;
  while (i < count) {
    // uniform on sphere
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    let x = s * Math.cos(t);
    let y = u;
    let z = s * Math.sin(t);

    // ellipsoid scale
    x *= rx; y *= ry; z *= rz;

    // sulci folding: warp using sin combos so surface looks creased
    const fold =
      Math.sin(x * 4.1 + Math.cos(y * 3.2)) *
      Math.cos(z * 3.7 + Math.sin(x * 2.3)) * 0.07;
    const fold2 = Math.sin(y * 6.0 + z * 4.0) * 0.04;
    const nx = x + fold * x;
    const ny = y + fold2;
    const nz = z + fold * z * 0.7;

    // central longitudinal fissure: push points away from x=0 plane slightly
    const sep = Math.sign(nx) * (0.07 - Math.min(0.07, Math.abs(nx) * 0.08));
    const fx = nx + sep;

    // brainstem tail (small bias) — skip bottom-front so it doesn't dangle
    if (ny < -0.85 && nz > 0.4) continue;

    positions[i * 3]     = fx;
    positions[i * 3 + 1] = ny;
    positions[i * 3 + 2] = nz;
    seeds[i] = Math.random();
    hemi[i] = fx >= 0 ? 1 : -1;
    i++;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute("aHemisphere", new THREE.BufferAttribute(hemi, 1));
  return geo;
}

function BrainPoints({ count }: { count: number }) {
  const { size, viewport } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, a: 0 });

  const geometry = useMemo(() => makeBrainGeometry(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseActive: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      uSize: { value: 7.0 },
      uColorA: { value: new THREE.Color("#34d399") }, // emerald
      uColorB: { value: new THREE.Color("#a7f3d0") }, // mint highlight
    }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.current.a = 1;
    };
    const onLeave = () => { mouse.current.a = 0; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  useFrame((state, dt) => {
    const u = matRef.current?.uniforms;
    if (u) {
      u.uTime.value += dt;
      u.uMouse.value.x += (mouse.current.x - u.uMouse.value.x) * 0.08;
      u.uMouse.value.y += (mouse.current.y - u.uMouse.value.y) * 0.08;
      u.uMouseActive.value += (mouse.current.a - u.uMouseActive.value) * 0.05;
    }
    if (groupRef.current) {
      // slow auto-rotation + subtle tilt follow mouse
      groupRef.current.rotation.y += dt * 0.08;
      groupRef.current.rotation.x = mouse.current.y * 0.15;
      groupRef.current.rotation.z = mouse.current.x * 0.06;
    }
  });

  // keep size sensible when viewport changes
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uSize.value = Math.max(5, Math.min(9, size.width / 220));
    }
  }, [size.width, size.height, viewport]);

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function BrainField({ className = "" }: { className?: string }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      setSupported(ok);
    } catch { setSupported(false); }
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const h = (e: MediaQueryListEvent) => setReduce(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  if (supported === false) {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          background:
            "radial-gradient(closest-side, hsl(160 70% 45% / 0.35), transparent 70%)",
        }}
      />
    );
  }

  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const count = reduce ? 800 : isMobile ? 1200 : 2400;

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduce ? "demand" : "always"}
      >
        <BrainPoints count={count} />
      </Canvas>
    </div>
  );
}
