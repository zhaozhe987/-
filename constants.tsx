
import { QuantumConcept } from './types';

export const CONCEPTS: QuantumConcept[] = [
  {
    id: 'superposition',
    title: '量子叠加 (Superposition)',
    description: '一枚旋转中的硬币。',
    icon: 'Zap',
    detail: '在经典世界，开关要么开要么关。在量子世界，一个粒子可以同时处于“开”和“关”的叠加状态。只有当你去“看”（测量）它时，它才会随机决定变成其中一种。'
  },
  {
    id: 'entanglement',
    title: '量子纠缠 (Entanglement)',
    description: '宇宙级的双胞胎感应。',
    icon: 'Share2',
    detail: '两颗纠缠的粒子像是有隐形连线的双胞胎。无论它们相隔多远，当你观察其中一颗发现是“0”时，另一颗会瞬间变成“1”。这就是量子通信能够瞬间同步状态的基础。'
  },
  {
    id: 'qkd',
    title: '安全保障 (QKD)',
    description: '不可窃听的“一次一密”。',
    icon: 'Lock',
    detail: '量子秘钥分发利用了“测量即破坏”原理。如果有人试图窃听（测量）量子信号，信号会立即发生改变，发送者和接收者能瞬间察觉，从而保证通信的绝对安全。'
  }
];

export const COMPARISONS = [
  {
    feature: "基本单位",
    traditional: "比特 (0 或 1)",
    quantum: "量子比特 (叠加态)",
    icon: "Cpu"
  },
  {
    feature: "可复制性",
    traditional: "可无限完美复制",
    quantum: "不可克隆 (物理定律)",
    icon: "Copy"
  },
  {
    feature: "安全基础",
    traditional: "数学复杂度 (可破解)",
    quantum: "物理定律 (绝对安全)",
    icon: "Shield"
  }
];

export const INTRO_STEPS = [
  { title: "什么是量子通信？", content: "它不是超光速传送文字，而是利用微观粒子的量子特性（如纠缠）来传递信息或生成加密秘钥的一种全新通信方式。" },
  { title: "核心优势是什么？", content: "传统通信会被监听和复制，但量子通信受物理定律保护，任何监听都会留下痕迹，是目前理论上唯一的“绝对安全”通信。" }
];

export const SYSTEM_PROMPT = `你是一位世界级的量子物理学教育专家。
请遵守以下原则：
1. 避开复杂的数学公式，多用直观类比。
2. 针对用户在实验室的操作（如点击了“测量”或“纠缠”）进行即时解释。
3. 重点解释量子通信如何超越传统通信的安全性限制。
4. 强调量子通信需要经典信道（如光纤）协同，并非纯粹的瞬间移动信息。
5. 语气要亲切、富有启发性。`;
