
import React, { useState, useEffect, useRef } from 'react';
import { 
  Atom, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  Sparkles,
  Zap,
  Share2,
  Lock,
  Info,
  Play,
  RotateCcw,
  BookOpen,
  Cpu,
  Copy,
  Shield,
  ArrowRightLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CONCEPTS, SYSTEM_PROMPT, COMPARISONS } from './constants';
import { Message, QuantumConcept } from './types';
import QuantumVisualizer from './components/QuantumVisualizer';

const App: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<QuantumConcept | null>(null);
  const [isMeasured, setIsMeasured] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '欢迎来到量子通信实验室。请先在左侧选择一个实验课题，观察量子世界与传统世界的奇妙差异。' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const userMessage = customPrompt || input.trim();
    if (!userMessage || isTyping) return;

    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });

      const aiResponse = response.text || '量子通信信道暂时关闭，请重试。';
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: '连接 AI 助理失败，请检查 API 配置。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLabAction = () => {
    if (!activeConcept) return;
    setIsMeasured(true);
    let actionText = "";
    if (activeConcept.id === 'superposition') actionText = "我观察了量子叠加态，它坍缩了。请详细解释这在通信中意味着什么？";
    if (activeConcept.id === 'entanglement') actionText = "我完成了纠缠测量。为什么这种关联性对量子通信至关重要？";
    if (activeConcept.id === 'qkd') actionText = "我模拟了拦截攻击，系统报错了。量子力学是如何从物理层面防止复制信息的？";
    
    handleSendMessage(undefined, actionText);
  };

  const selectConcept = (concept: QuantumConcept) => {
    setActiveConcept(concept);
    setIsMeasured(false);
    const introText = `我想深入了解 ${concept.title}。它在量子通信中是如何运作的？`;
    handleSendMessage(undefined, introText);
  };

  const getCompIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Copy': return <Copy className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen quantum-gradient flex flex-col items-center p-4 md:p-6 text-slate-100">
      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Atom className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
              Quantum Explorer <span className="text-sm font-normal text-slate-500 ml-2">v2.0</span>
            </h1>
            <p className="text-slate-500 text-xs">互动式量子通信原理学习平台</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6">
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/5 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <ShieldCheck className="w-4 h-4" /> 物理级安全
          </div>
        </div>
      </header>

      {/* Comparison Knowledge Base */}
      <section className="w-full max-w-7xl mb-8">
        <h2 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> 量子 vs 传统：核心差异
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPARISONS.map((comp, i) => (
            <div key={i} className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-800 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                  {getCompIcon(comp.icon)}
                </div>
                <span className="font-bold text-sm text-slate-200">{comp.feature}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>传统方式</span>
                  <span className="text-slate-300 font-medium">{comp.traditional}</span>
                </div>
                <div className="flex justify-between items-center text-blue-400 font-semibold">
                  <span>量子方式</span>
                  <span className="bg-blue-400/10 px-2 py-0.5 rounded">{comp.quantum}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Lab Control & Selector (4 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-4 flex flex-col h-full border-white/5">
            <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <ArrowRightLeft className="w-3 h-3" /> 实验课题选择
            </h3>
            <div className="space-y-3">
              {CONCEPTS.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => selectConcept(concept)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                    activeConcept?.id === concept.id 
                    ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500/50' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${activeConcept?.id === concept.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {concept.icon === 'Zap' && <Zap className="w-4 h-4" />}
                    {concept.icon === 'Share2' && <Share2 className="w-4 h-4" />}
                    {concept.icon === 'Lock' && <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{concept.title.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{concept.description}</div>
                  </div>
                </button>
              ))}
            </div>
            
            {activeConcept && (
              <div className="mt-6 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <h4 className="text-xs font-bold text-blue-300 mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> 核心原理
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  “{activeConcept.detail}”
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center: Visualizer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex-1 min-h-[400px] flex flex-col border-blue-500/10 shadow-inner">
            <div className="flex justify-between items-center mb-4 z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${activeConcept ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
                <span className="text-xs font-medium text-slate-400 tracking-widest">LABORATORY ACTIVE</span>
              </div>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-500 border border-white/5">MODE: {activeConcept?.id || 'IDLE'}</div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <QuantumVisualizer 
                mode={activeConcept?.id || 'idle'} 
                isMeasured={isMeasured}
              />
            </div>

            {/* In-Lab Actions */}
            <div className="mt-4 flex justify-center gap-3 z-10">
              {activeConcept && (
                <>
                  {!isMeasured ? (
                    <button 
                      onClick={handleLabAction}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-sm transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
                    >
                      <Play className="w-4 h-4" /> 
                      {activeConcept.id === 'qkd' ? '模拟量子窃听' : '执行量子测量'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsMeasured(false)}
                      className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-sm border border-white/10 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" /> 重置实验环境
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Chat Assistant (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
          <div className="glass-panel flex-1 rounded-3xl flex flex-col overflow-hidden border-purple-500/10 shadow-lg">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                AI 量子实验室助理
              </span>
              <Sparkles className="w-4 h-4 text-yellow-500/50" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-900/20' 
                    : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/80 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="针对实验现象提问..."
                className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 rounded-xl transition-all shadow-lg"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      </main>
      
      {/* Footer Info */}
      <footer className="mt-8 text-center text-slate-600 text-[10px] tracking-widest uppercase">
        Built for education with Google Gemini 3 Flash • Quantum Visualizer powered by D3.js
      </footer>
    </div>
  );
};

export default App;
