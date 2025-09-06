import React from 'react';
import type { Aresta, Vertice } from '../types/grafo';

interface ArestaComponentProps {
  aresta: Aresta;
  vertices: Vertice[];
  arestaColorida: Aresta[];
}

const ArestaComponent: React.FC<ArestaComponentProps> = ({
  aresta,
  vertices,
  arestaColorida,
}) => {
  const origem = vertices.find(v => v.id === aresta.origem);
  const destino = vertices.find(v => v.id === aresta.destino);

  if (!origem || !destino) return null;

  // Verifica se a aresta deve ser destacada
  const isHighlighted = arestaColorida.some(
    a =>
      (a.origem === aresta.origem && a.destino === aresta.destino) ||
      (a.origem === aresta.destino && a.destino === aresta.origem)
  );

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
        stroke={isHighlighted ? '#f59e42' : '#64748b'}
        strokeWidth={isHighlighted ? '4' : '2'}
        className="pointer-events-none"
      />
      {/* Fundo branco para o texto do peso */}
      <circle
        cx={midX}
        cy={midY}
        r="12"
        fill="white"
        stroke={isHighlighted ? '#f59e42' : '#64748b'}
        strokeWidth={isHighlighted ? '2' : '1'}
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
