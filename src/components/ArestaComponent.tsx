import React from 'react';
import type { Aresta, Vertice } from '../types/grafo';

interface ArestaComponentProps {
  aresta: Aresta;
  vertices: Vertice[];
}

const ArestaComponent: React.FC<ArestaComponentProps> = ({ aresta, vertices }) => {
  const origem = vertices.find(v => v.id === aresta.origem);
  const destino = vertices.find(v => v.id === aresta.destino);

  if (!origem || !destino) return null;

  // Calcular ponto médio para posicionar o texto do peso
  const midX = (origem.x + destino.x) / 2;
  const midY = (origem.y + destino.y) / 2;

  return (
    <g>
      <line
        x1={origem.x}
        y1={origem.y}
        x2={destino.x}
        y2={destino.y}
        stroke="#64748b"
        strokeWidth="2"
        className="pointer-events-none"
      />
      {/* Fundo branco para o texto do peso */}
      <circle
        cx={midX}
        cy={midY}
        r="12"
        fill="white"
        stroke="#64748b"
        strokeWidth="1"
        className="pointer-events-none"
      />
      {/* Texto do peso */}
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dy="0.35em"
        fontSize="12"
        fill="#374151"
        fontWeight="600"
        className="pointer-events-none"
      >
        {aresta.peso}
      </text>
    </g>
  );
};

export default ArestaComponent;
