import { useEffect, useRef } from "react";

/**
 * Lightweight neural-network particle field rendered with WebGL2.
 * Falls back to a CSS gradient if WebGL is unavailable.
 */
export default function NeuralCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, premultipliedAlpha: false }) as WebGL2RenderingContext | null;
    if (!gl) {
      canvas.style.background =
        "radial-gradient(circle at 30% 40%, hsl(160 70% 30% / 0.4), transparent 60%), radial-gradient(circle at 70% 70%, hsl(160 70% 40% / 0.3), transparent 60%)";
      return;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let N = isMobile ? 60 : 120;
    const LINK_DIST = isMobile ? 110 : 140;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // shaders
    const vsPoint = `#version 300 es
      in vec2 a_pos;
      uniform vec2 u_res;
      uniform float u_dpr;
      void main(){
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        gl_PointSize = 6.0 * u_dpr;
      }`;
    const fsPoint = `#version 300 es
      precision mediump float;
      out vec4 outColor;
      uniform vec3 u_color;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float a = smoothstep(0.5, 0.0, d);
        float glow = smoothstep(0.5, 0.1, d) * 0.6;
        outColor = vec4(u_color, a * 0.9 + glow);
      }`;
    const vsLine = `#version 300 es
      in vec2 a_pos;
      in float a_alpha;
      uniform vec2 u_res;
      out float v_alpha;
      void main(){
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        v_alpha = a_alpha;
      }`;
    const fsLine = `#version 300 es
      precision mediump float;
      in float v_alpha;
      out vec4 outColor;
      uniform vec3 u_color;
      void main(){
        outColor = vec4(u_color, v_alpha);
      }`;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    function program(vs: string, fs: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, compile(gl!.VERTEX_SHADER, vs));
      gl!.attachShader(p, compile(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(p);
      return p;
    }

    const pPoint = program(vsPoint, fsPoint);
    const pLine = program(vsLine, fsLine);

    // particles
    const data = new Float32Array(N * 4); // x,y,vx,vy
    for (let i = 0; i < N; i++) {
      data[i * 4] = Math.random() * W;
      data[i * 4 + 1] = Math.random() * H;
      data[i * 4 + 2] = (Math.random() - 0.5) * 0.25;
      data[i * 4 + 3] = (Math.random() - 0.5) * 0.25;
    }

    const pointBuf = gl.createBuffer();
    const pointPos = new Float32Array(N * 2);
    const lineBuf = gl.createBuffer();
    // max lines bounded; reserve generous
    const maxLines = N * 8;
    const linePos = new Float32Array(maxLines * 4); // 2 verts * (x,y)
    const lineAlphaBuf = gl.createBuffer();
    const lineAlpha = new Float32Array(maxLines * 2);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = 1;
    };
    const onLeave = () => { mouseRef.current.active = 0; };
    if (!isMobile) {
      window.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    let raf = 0;
    let last = performance.now();
    let frames = 0; let fpsTimer = last; let downgraded = false;

    const render = (now: number) => {
      const dt = Math.min(32, now - last); last = now;
      frames++;
      if (now - fpsTimer > 1000) {
        const fps = (frames * 1000) / (now - fpsTimer);
        frames = 0; fpsTimer = now;
        if (!downgraded && fps < 38 && N > 40) {
          N = Math.floor(N / 2); downgraded = true;
        }
      }

      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const attract = mouseRef.current.active;

      for (let i = 0; i < N; i++) {
        const k = i * 4;
        let x = data[k], y = data[k + 1];
        let vx = data[k + 2], vy = data[k + 3];

        if (attract) {
          const dx = mx - x, dy = my - y;
          const d2 = dx * dx + dy * dy;
          const R = 180; const R2 = R * R;
          if (d2 < R2 && d2 > 1) {
            const f = (1 - d2 / R2) * 0.04;
            vx += dx * f / Math.sqrt(d2);
            vy += dy * f / Math.sqrt(d2);
          }
        }

        // drag
        vx *= 0.985; vy *= 0.985;
        // wander
        vx += (Math.random() - 0.5) * 0.02;
        vy += (Math.random() - 0.5) * 0.02;
        // clamp
        const sp = Math.hypot(vx, vy);
        const maxS = 0.6;
        if (sp > maxS) { vx = vx / sp * maxS; vy = vy / sp * maxS; }

        x += vx * dt * 0.06;
        y += vy * dt * 0.06;
        if (x < 0) { x = 0; vx = -vx; }
        if (x > W) { x = W; vx = -vx; }
        if (y < 0) { y = 0; vy = -vy; }
        if (y > H) { y = H; vy = -vy; }

        data[k] = x; data[k + 1] = y; data[k + 2] = vx; data[k + 3] = vy;
        pointPos[i * 2] = x; pointPos[i * 2 + 1] = y;
      }

      // build lines
      let lc = 0;
      const D2 = LINK_DIST * LINK_DIST;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = data[i * 4] - data[j * 4];
          const dy = data[i * 4 + 1] - data[j * 4 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 < D2 && lc < maxLines) {
            const a = (1 - d2 / D2) * 0.35;
            linePos[lc * 4] = data[i * 4];
            linePos[lc * 4 + 1] = data[i * 4 + 1];
            linePos[lc * 4 + 2] = data[j * 4];
            linePos[lc * 4 + 3] = data[j * 4 + 1];
            lineAlpha[lc * 2] = a;
            lineAlpha[lc * 2 + 1] = a;
            lc++;
          }
        }
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // lines
      if (lc > 0) {
        gl.useProgram(pLine);
        const aPos = gl.getAttribLocation(pLine, "a_pos");
        const aA = gl.getAttribLocation(pLine, "a_alpha");
        gl.uniform2f(gl.getUniformLocation(pLine, "u_res"), W, H);
        gl.uniform3f(gl.getUniformLocation(pLine, "u_color"), 0.30, 0.85, 0.62);

        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
        gl.bufferData(gl.ARRAY_BUFFER, linePos.subarray(0, lc * 4), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, lineAlphaBuf);
        gl.bufferData(gl.ARRAY_BUFFER, lineAlpha.subarray(0, lc * 2), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(aA);
        gl.vertexAttribPointer(aA, 1, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, lc * 2);
      }

      // points
      gl.useProgram(pPoint);
      const aP = gl.getAttribLocation(pPoint, "a_pos");
      gl.uniform2f(gl.getUniformLocation(pPoint, "u_res"), W, H);
      gl.uniform1f(gl.getUniformLocation(pPoint, "u_dpr"), dpr);
      gl.uniform3f(gl.getUniformLocation(pPoint, "u_color"), 0.40, 0.95, 0.72);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pointPos.subarray(0, N * 2), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aP);
      gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, N);

      raf = requestAnimationFrame(render);
    };

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); raf = requestAnimationFrame(render); }
    };
    document.addEventListener("visibilitychange", onVis);

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
