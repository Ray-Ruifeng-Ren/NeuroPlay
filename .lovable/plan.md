
# 首页 v3 · "Aethera × Cognitive Lab" 浅色高级版

我研究了你贴的两个参考：**Asme**（深色 + liquid-glass 胶囊 + 大 Instrument Serif）和 **Aethera**（纯白 + 黑色 Instrument Serif + 灰色斜体强调 + 视频背景循环淡入淡出 + 胶囊按钮）。

你上一条说要浅色 → 我以 **Aethera 的克制白底高级感** 为骨架，吸收两者共同的"少而准"的语言（一段大字宣言 + 一个主视觉 + 一个 CTA），把 Super Brain Lab 的"研究感"嵌进去。结果不是模仿任一站，而是它们共同的设计语言被翻译到我们的场景里。

---

## 一、提炼出的设计语言（两站共通）

| 维度 | 共同做法 | 在我们这里怎么做 |
|---|---|---|
| 字体 | Instrument Serif 大字 + 斜体强调词 | 全站 Display 换成 Instrument Serif；强调词用 `<em>` 灰色斜体 |
| 色彩 | 极简两色（黑/白 或 黑/玻璃）+ 一个灰阶 | `#FAFAF7` 暖白 / `#0A0A0A` 墨黑 / `#6F6F6F` 灰副 / 翠绿仅作 1mm 装饰点 |
| 主视觉 | 单一大视频/影像，居中，循环淡入淡出 | 中央大脑插画 + 自循环呼吸/粒子，复刻同样的"fade-in 0.5s → loop → fade-out 0.5s"节奏 |
| 排版 | 标题居中、超大字（5xl–8xl）、行高 0.95、字距 -2.46px | 标题居中收为 `text-5xl md:text-7xl`，行高 0.96，字距收紧 |
| 按钮 | 圆角胶囊 `rounded-full px-6 py-2.5` 黑底白字 + hover scale 1.03 | 完全照搬这套 CTA |
| 导航 | 极简 nav，logo + 4–5 link + 1 CTA | 现有 nav 改为透明白底版，去掉公告条厚度 |
| 卡片 | `rounded-3xl` + 内置视频/图 + hover scale 1.05 + 右上 `ArrowUpRight` 小图标按钮 | 模块卡按这套规格重做 |

---

## 二、新的页面结构（浅色单屏）

```
┌────────────────────────────────────────────────────────────────┐
│  • Super Brain Lab        Modules  Research  About    [Begin]  │ ← 极薄白底 nav
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      LAB · 02 · COGNITIVE QUANT                 │ ← mono, 灰, 字距 0.28em
│                                                                 │
│              Quantify the limits of                             │ ← Instrument Serif
│              ╱human cognition.╲                                  │   "human cognition." 灰斜体
│                                                                 │
│      A research-grade training ground for the                   │ ← #6F6F6F 副文案
│      sharpest minds. Every score logged, every gain comparable. │
│                                                                 │
│                      ┌──────────────┐                            │
│                      │   解剖大脑    │                            │ ← 居中视觉, 圆形遮罩
│                      │  (循环呼吸)   │                            │   ~360px
│                      └──────────────┘                            │
│                                                                 │
│                       [ Begin training ]                        │ ← 黑胶囊
│                                                                 │
├──── MODULES · 07 ────────────────────────────────  EST. 2026 ──┤
│                                                                 │
│   ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐                   │
│   │01│  │02│  │03│  │04│  │05│  │06│  │07│  ← 7 张白色卡牌      │
│   └──┘  └──┘  └──┘  └──┘  └──┘  └──┘  └──┘                    │
│                                                                 │
│                Co-developed · World Mental-Calc × MIT           │ ← 极细脚注
└────────────────────────────────────────────────────────────────┘
```

设计原则：**整页只有一个英雄视觉（大脑）+ 一个英雄交互（卡牌）**，其他全是留白和细排版。这就是 Aethera/Asme 的高级来源。

---

## 三、Hero 细节

### 标题（Instrument Serif）
```
Quantify the limits of
<em class="italic text-[#6F6F6F]">human cognition.</em>
```
- `text-5xl md:text-7xl`（48–72px，比当前缩小一档）
- `leading-[0.96]`、`tracking-[-0.02em]`
- 居中、最大宽度 `max-w-4xl`
- 进场用 `animate-fade-rise`（opacity 0→1, translateY 20→0, 0.8s ease-out）

### 副文案（#6F6F6F）
单段，居中，`max-w-xl mt-6`，加 0.2s delay 的 `animate-fade-rise-delay`

### 大脑视觉（替换"量子点云"）
- 抛弃 R3F 椭球，改为 **可识别的解剖大脑 SVG**（侧视轮廓 + 主要 sulci）
- 装在一个圆形 mask 容器内（直径 320–380px），底色 `#F2F0EA`（比页面背景深一点），外圈极淡 1px 描边
- 内部动画：
  - SVG 轮廓 1.2s 描线进场
  - 进场后整体 `scale` 在 0.99→1.01 间正弦呼吸（≈0.6Hz）
  - 上层 Canvas2D 叠 ~60 个翠绿光点，沿大脑 mask 内缓慢游走 + 偶尔两点闪现 200ms 突触光线
  - **借用 Aethera 的 fade loop 节奏**：粒子整组每 8s 一个周期，开头 0.5s fade-in、结尾 0.5s fade-out，"换气"感
- 移动端：仅 SVG + 呼吸，关掉粒子
- 鼠标 hover 大脑区：左右半球分别浮现 token —— `L · LOGIC` / `R · PATTERN`（mono、字距 0.3em、灰色）

### CTA
- `rounded-full px-12 py-4` 黑底白字 Inter medium
- `hover:scale-[1.03]` `transition-transform`
- 文字："Begin training" / "开始训练"

---

## 四、模块卡牌（不是 Asme/Aethera 的视频卡，而是符合我们 7 个模块体量的"白色研究卡"）

> 视频卡每张要一段配套素材——我们没有，临时生成会显得拼凑。所以这里走 **"图录卡片"** 方向：白底 + 极细线条 + 一个抽象 line-art 图标 + 黑字标题 + 灰字英副名 + 右上 `ArrowUpRight`。与 Aethera 服务卡同款骨架，只把视频换成线稿插画。

### 单卡规格

```
┌──────────────────┐
│ 01           ↗   │  顶栏：mono 编号 + ArrowUpRight 圆形按钮
│                  │
│      ╱╲          │
│     ╱  ╲         │  艺术区：每模块专属抽象 line-art (1.25px 线, 黑色)
│    ╱    ╲        │
│                  │
│ 闪电心算          │  Instrument Serif, 22px, 黑
│ Flash Mental     │  mono, 11px, 字距 0.18em, #6F6F6F
│                  │
└──────────────────┘
```

- `aspect-[5/7]` 竖版卡，`rounded-2xl`，白底 + 1px `border-[#E8E5DE]`
- 7 张卡用 `flex` 横排，间隙 12px，**每张交替 `rotate(-1.2°/+1.2°)`** 形成手牌微扇形
- **Hover 一张**：
  - 当前卡 `rotate-0 translate-y-[-12px] scale-[1.04]`
  - 1.5px 黑色描边升级为 `shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)]`
  - 内置 3D 倾斜：鼠标位置驱动 `rotateY ±6°` / `rotateX ±4°`（CSS `transform`，无库依赖）
  - 一层 sweep `linear-gradient(105deg, transparent 40%, white/60 50%, transparent 60%)` 跟随鼠标 x
  - 邻居顺势外推 8px
- **Today's Pick (Flash Math)**：常态就微抬 + 右上一枚 8px 翠绿圆点（唯一彩色装饰）
- 点击 → 跳 `/play/{id}`

### 7 张 line-art
程序化 SVG（轻量），每张一个 `src/components/hero/art/<id>.tsx`：
- flashmath: 高速波形
- gauntlet: 被扭曲的数字网
- schulte: 4×4 网格 + 一个高亮格
- nback: 链式节点
- reaction: 同心圆扩散
- cards: 三张扑克叠放
- orbit: 椭圆轨道 + 沿轨光点

统一风格：1.25px 黑线、单色、画面内一个亮点（emerald 3px 圆）。

---

## 五、Nav / 公告 / 页脚

- 删除公告条作为独立条带，改为脚注一行（页底居中）：`Co-developed · World Mental-Calc Champion × MIT`（灰、mono、字距 0.22em）
- Nav 改为透明白 + 1px 底线：左 logo（`• Super Brain Lab` 圆点 + Inter semibold），中 link 4 个（Modules / Research / About / Log），右 EN/中 + Account + 黑胶囊 "Begin"

---

## 六、Token / 字体

### `src/index.css` 增改
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --background: 45 25% 97%;     /* #FAFAF7 暖白 */
  --foreground: 0 0% 4%;         /* #0A0A0A 墨黑 */
  --muted-foreground: 0 0% 44%;  /* #6F6F6F 灰副 */
  --border: 40 12% 89%;          /* #E8E5DE 极细边 */
  --primary: 158 64% 38%;        /* emerald 保留为强调点 */
}

@keyframes fade-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-rise        { animation: fade-rise .8s ease-out both; }
.animate-fade-rise-delay  { animation: fade-rise .8s ease-out .2s both; }
.animate-fade-rise-delay-2{ animation: fade-rise .8s ease-out .4s both; }
```

### `tailwind.config.ts`
`fontFamily.display = ["Instrument Serif", "serif"]`（替换当前 display 字体），其他字体保持。

---

## 七、文件改动清单

- **新增** `src/components/hero/AnatomicalBrain.tsx`（SVG 大脑 + Canvas2D 粒子叠层，自循环 fade）
- **新增** `src/components/hero/ModuleCard.tsx`（单张卡）
- **新增** `src/components/hero/CardDeck.tsx`（7 张容器 + 邻居让位逻辑）
- **新增** `src/components/hero/art/*.tsx`（7 张 line-art）
- **重写** `src/pages/Index.tsx`（单列居中浅色布局）
- **删除使用** `BrainField.tsx` / `NeuralCanvas.tsx`（文件保留待后续清理）
- **修改** `src/index.css`（token + Instrument Serif + fade-rise keyframes）
- **修改** `tailwind.config.ts`（display 字体改为 Instrument Serif）
- **i18n 新增** key：`begin_training`, `nav_research`, `nav_about`, `nav_log`, `l_hemi`, `r_hemi`, `pick_dot_alt`

---

## 八、验收（我自己跑 Playwright 一遍）
- 1334×872 浅色一屏：Nav + 标题 + 副文案 + 大脑 + CTA + 7 张卡牌 + 脚注 全部可见
- 大脑可识别为脑（截图自检）+ 呼吸生效
- 卡片 hover：抬起 + 3D 倾斜 + sweep + 邻居让位
- Instrument Serif 真实加载（fontFace 检测）
- Lighthouse Perf ≥ 90（无 Three，依赖比当前更轻）

---

## 九、一个需要你拍板的事

参考的两个站，主视觉都是 **真实拍摄/AI 生成的视频**（云、人、抽象画面）。我们这里是：

- A. **走 SVG 解剖大脑**（我倾向）——可识别、可控、零依赖、和"实验室研究"叙事吻合。
- B. **生成一段 cinematic 大脑视频**作为 hero 背景循环（更像 Aethera/Asme，但生成的视频通常带 AI 痕迹，可能反而掉档次）。

**默认走 A**。如果你想试 B，告诉我，我再去找/生成合适的医用大脑 MRI 旋转视频。

