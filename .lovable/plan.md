## 目标
把首页 Hero 升级成"局部电影感 + WebGL 神经粒子背景 + 滚动驱动微交互"的高级开场，其他区域保持现有亮色 Anodized Clarity 风格不变。

## 范围
仅改动：
- `src/pages/Index.tsx` 顶部公告条 + Hero（首屏 100vh）
- 新增 `src/components/hero/NeuralCanvas.tsx`（WebGL 粒子）
- 新增 `src/components/hero/ScrambleText.tsx`、`ScrambleIn.tsx`（轻量，无新增字体依赖）
- 新增 `src/lib/useLenis.ts`（仅 Hero 区域生效，移动端禁用）
- `src/index.css` 增加少量动画 keyframes 与 .hero-dark 局部作用域

不动：Logo、AccountMenu、Languages、Modules 网格、Values、Footer、全站配色、字体（继续 Playfair + Inter）。

## 交互设计

### 1. 顶部公告条（保留 + 加戏）
- 文案不变（速算冠军 × MIT）。
- 左侧脉冲点改为"双层呼吸光晕"（外圈 4s 缓慢、内圈 1.6s）。
- 文案使用 **ScrambleText hover**：鼠标移入时整行从左到右字符解码一次（25ms/帧，仅一次，不打扰阅读）。
- 整条加一条 1px 顶部渐变描边（hsl(primary) 透明渐变），强化"产品线"质感。

### 2. Hero 首屏（h-screen，局部深色电影感）
布局结构（从底到顶 z-index）：
```
z-0  bg-foreground (深墨)         ← 局部深色，仅 Hero 容器内
z-1  <NeuralCanvas/>              ← WebGL 神经粒子
z-5  径向 vignette + 极淡网格       ← 现有装饰升级
z-10 文案内容（标题/描述/CTA）
z-20 底部 progressive blur 渐隐    ← 与下方亮色区无缝衔接
```

**WebGL NeuralCanvas（核心）**
- 技术：原生 WebGL2（不引入 three.js，包体 < 4KB）。失败回退到 CSS 粒子动画。
- 视觉：~120 个发光节点 + 邻近连线（距离 < 阈值才连），形成"神经突触网络"。节点缓慢漂移（柏林噪声驱动）。
- 颜色：节点 hsl(primary/glow) 微调，背景透明，与深色 bg 叠加。
- 交互：
  - 鼠标移动产生"引力场"，半径内节点向光标靠拢 + 连线变亮。
  - 鼠标移开 1.5s 后回归自由漂移。
  - 移动端：自动降级到 60 节点 + 关闭引力，纯漂移。
- 性能：requestAnimationFrame，document.hidden 时暂停；DPR 上限 1.5；FPS < 40 自动减半节点。

**标题文字（ScrambleIn）**
- "Quantify Your" / "Cognitive Edge"（英文）或现有 i18n 中文标题。
- 进入时：每个词字符从随机字符 → 真实字符（900ms，左到右），节奏感来自 Playfair 大字号。
- 副标题：y:20→0 + opacity 渐入，delay 0.4s。

**CTA 按钮**
- "开始挑战 闪电心算" 保留现有，加 hover：
  - 背景出现一束"扫光"（::after 渐变从左滑到右，800ms）
  - 文字 ScrambleText 解码一次
- "浏览全部" hover 下划线从中心展开（story-link 风格）

### 3. 滚动驱动（Lenis 仅在桌面 Hero 范围）
- 引入 `lenis` ^1.3.x（轻量 ~8KB），duration 1.2，指数缓动。
- 移动端 / prefers-reduced-motion：完全禁用，使用原生滚动。
- Hero 离场动画（scrollYProgress 0 → 0.3）：
  - 标题 y: 0 → -40，opacity 1 → 0
  - 粒子画布 scale 1 → 1.06，opacity 1 → 0.3
  - 底部 blur 从 0 → 20px（progressive backdrop-filter）
- 用 ref 直接改 transform/style，不走 React state，避免重渲染。

### 4. 暗→亮过渡
- Hero 底部 80px 高度：从 transparent → bg-background 的垂直渐变 + backdrop-blur(8px)，让深色 Hero "溶解"进下方亮色区，不出现硬切。
- Modules 网格与下方完全不变。

## 自我批判（已迭代）
1. **会不会太重？** → 不用 three.js、不加视频、不加新字体；新增 JS < 15KB（lenis 8KB + 自写 WebGL ~3KB + scramble ~2KB）。
2. **WebGL 在低端机/无 GPU 怎么办？** → 检测 `gl = canvas.getContext('webgl2')`，失败回退到 CSS 关键帧粒子（10 个发光圆点漂浮）。
3. **深色 Hero 和下方亮色割裂？** → 用 80px 渐变 + blur 过渡带衔接；公告条本来就是深色，视觉上是"深 → 深 → 渐变 → 亮"的自然过渡。
4. **Scramble 影响可访问性？** → 标题用 aria-label 提供完整文本；prefers-reduced-motion 时跳过 scramble，直接淡入。
5. **Lenis 全局会不会和现有滚动冲突？** → 只在 `/`(Index) 挂载，路由切换时 destroy；Play 页不受影响。

## 技术细节（给开发的参考）
- 安装：`bun add lenis@^1.3.23`
- WebGL shader：vertex 透传 + fragment 用距离场画发光圆点；连线用单独的 LINES drawArrays。
- 节点数据：`Float32Array(N*4)` (x, y, vx, vy)，每帧 CPU 更新后 bufferSubData。
- Scramble 字符集：`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
- 文件改动清单：
  - `src/index.css`：+ `@keyframes shimmer`, `.hero-dark` 作用域变量覆盖
  - `src/pages/Index.tsx`：重写 announcement bar + hero section（其余 section 原封不动）
  - 新增 4 个组件/hook 文件

## 不做的事
- 不换字体（不引入 Space Mono）
- 不加背景视频
- 不动 Modules / Values / Footer
- 不改全站配色
- 不引入 framer-motion（用现有 CSS 动画 + ref 即可，不增加依赖）
