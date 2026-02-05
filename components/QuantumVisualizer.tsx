
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  mode: string;
  isMeasured: boolean;
  onMeasureResult?: (res: string) => void;
}

const QuantumVisualizer: React.FC<Props> = ({ mode, isMeasured, onMeasureResult }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const resultRef = useRef<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').interrupt(); // 停止所有正在进行的动画
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    let activeTimer: d3.Timer | null = null;

    // 定义滤镜和渐变
    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const renderSuperposition = () => {
      const g = svg.append('g').attr('transform', `translate(${width/2}, ${height/2})`);
      
      const orbit = g.append('circle')
        .attr('r', 60)
        .attr('fill', 'none')
        .attr('stroke', '#38bdf8')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.3);

      const qubit = g.append('circle')
        .attr('r', 15)
        .attr('fill', '#38bdf8')
        .attr('filter', 'url(#glow)');

      const label = g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '35')
        .attr('fill', '#94a3b8')
        .attr('font-size', '12px')
        .text('叠加态 |ψ⟩ = α|0⟩ + β|1⟩');

      const valueText = g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .text('?');

      if (!isMeasured) {
        activeTimer = d3.timer((elapsed) => {
          const angle = elapsed / 200;
          qubit.attr('cx', Math.cos(angle) * 60)
               .attr('cy', Math.sin(angle) * 60);
          valueText.text(Math.random() > 0.5 ? '1' : '0');
        });
      } else {
        const result = Math.random() > 0.5 ? '1' : '0';
        qubit.transition().duration(500).attr('cx', 0).attr('cy', 0).attr('fill', '#10b981');
        valueText.text(result).attr('font-size', '24px');
        label.text(`坍缩为结果: ${result}`);
        if (onMeasureResult) onMeasureResult(result);
      }
    };

    const renderEntanglement = () => {
      const g = svg.append('g');
      const p1 = { x: width * 0.3, y: height / 2 };
      const p2 = { x: width * 0.7, y: height / 2 };

      const link = g.append('line')
        .attr('x1', p1.x).attr('y1', p1.y)
        .attr('x2', p2.x).attr('y2', p2.y)
        .attr('stroke', '#a855f7')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', isMeasured ? 'none' : '5,5')
        .attr('opacity', isMeasured ? 1 : 0.4);

      const drawParticle = (p: {x:number, y:number}, label: string, color: string) => {
        const pg = g.append('g').attr('transform', `translate(${p.x}, ${p.y})`);
        const c = pg.append('circle').attr('r', 20).attr('fill', color).attr('filter', 'url(#glow)');
        const t = pg.append('text').attr('text-anchor', 'middle').attr('dy', '.3em').attr('fill', 'white').text('?');
        pg.append('text').attr('y', 35).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', '10px').text(label);
        return { c, t };
      };

      const q1 = drawParticle(p1, "粒子 A", "#3b82f6");
      const q2 = drawParticle(p2, "粒子 B", "#3b82f6");

      if (!isMeasured) {
        activeTimer = d3.timer((elapsed) => {
          const offset = Math.sin(elapsed / 300) * 10;
          q1.t.text(Math.random() > 0.5 ? '0' : '1');
          q2.t.text(q1.t.text() === '0' ? '1' : '0'); // 互补展示纠缠
        });
      } else {
        const res = Math.random() > 0.5 ? '0' : '1';
        q1.t.text(res);
        q2.t.text(res === '0' ? '1' : '0');
        q1.c.attr('fill', '#10b981');
        q2.c.attr('fill', '#10b981');
        if (onMeasureResult) onMeasureResult(res);
      }
    };

    const renderQKD = () => {
        const g = svg.append('g');
        const aliceX = 100, bobX = 500, y = height/2;
        
        // Alice & Bob
        g.append('circle').attr('cx', aliceX).attr('cy', y).attr('r', 30).attr('fill', '#1e293b').attr('stroke', '#3b82f6');
        g.append('text').attr('x', aliceX).attr('y', y+50).attr('text-anchor', 'middle').attr('fill', '#3b82f6').text('Alice');
        
        g.append('circle').attr('cx', bobX).attr('cy', y).attr('r', 30).attr('fill', '#1e293b').attr('stroke', '#3b82f6');
        g.append('text').attr('x', bobX).attr('y', y+50).attr('text-anchor', 'middle').attr('fill', '#3b82f6').text('Bob');

        const photon = g.append('circle').attr('r', 8).attr('fill', '#fbbf24').attr('filter', 'url(#glow)');
        
        const animate = () => {
            photon.attr('cx', aliceX).attr('cy', y).attr('opacity', 1);
            photon.transition()
                .duration(2000)
                .attr('cx', bobX)
                .on('end', () => {
                    if (isMeasured) {
                        // 窃听发生
                        photon.attr('fill', '#ef4444').attr('r', 12);
                        g.append('text')
                            .attr('x', width/2).attr('y', y-40).attr('text-anchor', 'middle').attr('fill', '#ef4444')
                            .text('检测到窃听！秘钥废弃')
                            .transition().duration(1000).attr('opacity', 0).remove();
                    }
                    animate();
                });
        };
        animate();
    };

    switch (mode) {
      case 'superposition': renderSuperposition(); break;
      case 'entanglement': renderEntanglement(); break;
      case 'qkd': renderQKD(); break;
      default: 
        svg.append('text').attr('x', width/2).attr('y', height/2).attr('text-anchor', 'middle').attr('fill', '#475569').text('请选择左侧实验课题');
    }

    return () => {
      if (activeTimer) activeTimer.stop();
      svg.selectAll('*').interrupt();
    };
  }, [mode, isMeasured]);

  return (
    <svg 
      ref={svgRef} 
      viewBox="0 0 600 400" 
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default QuantumVisualizer;
