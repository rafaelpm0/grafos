import React from 'react';
import type { Aresta, Vertice } from '../types/grafo';

interface ArestaComponentProps {
  aresta: Aresta;
  vertices: Vertice[];
  arestaColorida: Aresta[];
  orientado: boolean; // Nova propriedade para indicar se o grafo é orientado
}

const ArestaComponent: React.FC<ArestaComponentProps> = ({
  aresta,
  vertices,
  arestaColorida,
  orientado,
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

  // Calcula o ângulo da linha para posicionar a seta
  const angle = Math.atan2(
    destino.y - origem.y,
    destino.x - origem.x
  );

  // Calcula a posição da seta (próximo ao vértice de destino, mas não sobrepondo)
  const arrowDistance = 25; // Distância do centro do vértice (reduzida para vértices menores)
  const arrowX = destino.x - Math.cos(angle) * arrowDistance;
  const arrowY = destino.y - Math.sin(angle) * arrowDistance;

  // Tamanho da seta (aumentado para melhor visibilidade)
  const arrowSize = 15;

  // Calcula os pontos da seta
  const arrowPoint1X = arrowX - Math.cos(angle - Math.PI / 6) * arrowSize;
  const arrowPoint1Y = arrowY - Math.sin(angle - Math.PI / 6) * arrowSize;
  const arrowPoint2X = arrowX - Math.cos(angle + Math.PI / 6) * arrowSize;
  const arrowPoint2Y = arrowY - Math.sin(angle + Math.PI / 6) * arrowSize;

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

      {/* Seta para grafos orientados */}
      {orientado && (
        <polygon
          points={`${arrowX},${arrowY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
          fill={isHighlighted ? '#f59e42' : '#64748b'}
          stroke={isHighlighted ? '#f59e42' : '#64748b'}
          strokeWidth="1"
          className="pointer-events-none transition-all duration-300"
        />
      )}

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
