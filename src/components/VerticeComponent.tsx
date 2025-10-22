import React from 'react';
import type { Vertice } from '../types/grafo';
import type { VerticeColorido } from '../algoritimos/componentes';

interface VerticeComponentProps {
  vertice: Vertice;
  onDrag: (id: string, x: number, y: number) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  cor?: string; // Cor opcional para coloração específica (ex: Tarjan)
  verticesColoridos?: VerticeColorido[]; // Lista de vértices com cores dos algoritmos
}

const VerticeComponent: React.FC<VerticeComponentProps> = ({
  vertice,
  onDrag,
  isDragging,
  onDragStart,
  onDragEnd,
  cor,
  verticesColoridos = []
}) => {
  // Calcular raio dinâmico baseado no comprimento do nome
  const calcularRaio = (nome: string): number => {
    const baseRaio = 25; // Aumentado de 20 para 25
    const caracteresPorPixel = 1.8; // Aumentado para acomodar mais caracteres
    const raioCalculado = Math.max(baseRaio, nome.length * caracteresPorPixel + 12);
    return Math.min(raioCalculado, 60); // Máximo aumentado de 40 para 60 pixels
  };

  // Função para quebrar texto em múltiplas linhas
  const quebrarTexto = (texto: string, maxCaracteresPorLinha: number = 8): string[] => {
    if (texto.length <= maxCaracteresPorLinha) {
      return [texto];
    }
    
    const palavras = texto.split(' ');
    const linhas: string[] = [];
    let linhaAtual = '';
    
    for (const palavra of palavras) {
      if ((linhaAtual + palavra).length <= maxCaracteresPorLinha) {
        linhaAtual += (linhaAtual ? ' ' : '') + palavra;
      } else {
        if (linhaAtual) {
          linhas.push(linhaAtual);
          linhaAtual = palavra;
        } else {
          // Se a palavra é muito longa, quebra ela
          linhas.push(palavra.substring(0, maxCaracteresPorLinha));
          linhaAtual = palavra.substring(maxCaracteresPorLinha);
        }
      }
    }
    
    if (linhaAtual) {
      linhas.push(linhaAtual);
    }
    
    return linhas;
  };

  const linhasTexto = quebrarTexto(vertice.nome);
  const baseRaio = calcularRaio(vertice.nome);
  // Ajustar raio baseado no número de linhas
  const raio = Math.max(baseRaio, linhasTexto.length * 8 + 15);
  
  // Determinar cor do vértice baseada nos algoritmos aplicados
  const determinarCor = (): string => {
    // Primeiro verificar se há cor específica passada como prop
    if (cor) return cor;
    
    // Verificar se há cor definida pelos algoritmos
    const verticeColorido = verticesColoridos.find(v => v.id === vertice.id);
    if (verticeColorido && verticeColorido.cor) return verticeColorido.cor;
    
    // Cor padrão baseada no estado de arrastar
    return isDragging ? "#3b82f6" : "#6366f1";
  };
  
  const corFinal = determinarCor();
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStart(vertice.id);

    const svg = (e.target as HTMLElement).closest('svg');
    if (!svg) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      
      // Calcular posição relativa ao viewBox do SVG
      const scaleX = viewBox.width / rect.width;
      const scaleY = viewBox.height / rect.height;
      
      const newX = (moveEvent.clientX - rect.left) * scaleX + viewBox.x;
      const newY = (moveEvent.clientY - rect.top) * scaleY + viewBox.y;
      
      // Limitar dentro dos bounds do viewBox considerando o raio dinâmico
      const boundedX = Math.max(raio, Math.min(viewBox.width - raio, newX));
      const boundedY = Math.max(raio, Math.min(viewBox.height - raio, newY));
      
      onDrag(vertice.id, boundedX, boundedY);
    };

    const handleMouseUp = () => {
      onDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <g>
      <circle
        cx={vertice.x}
        cy={vertice.y}
        r={raio}
        fill={corFinal}
        stroke="#1e40af"
        strokeWidth="2"
        className="cursor-grab hover:fill-blue-500 transition-colors active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      />
      <text
        x={vertice.x}
        y={vertice.y - (linhasTexto.length - 1) * 6} // Ajustar posição Y para centralizar múltiplas linhas
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={Math.max(9, Math.min(12, raio * 0.4))}
        fontWeight="bold"
        className="pointer-events-none select-none"
        style={{ userSelect: 'none' }}
      >
        {linhasTexto.map((linha, index) => (
          <tspan
            key={index}
            x={vertice.x}
            dy={index === 0 ? 0 : '1.1em'}
          >
            {linha}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default VerticeComponent;
