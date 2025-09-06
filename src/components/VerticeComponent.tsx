import React from 'react';
import type { Vertice } from '../types/grafo';

interface VerticeComponentProps {
  vertice: Vertice;
  onDrag: (id: string, x: number, y: number) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

const VerticeComponent: React.FC<VerticeComponentProps> = ({
  vertice,
  onDrag,
  isDragging,
  onDragStart,
  onDragEnd
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(vertice.id);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = (e.target as HTMLElement).closest('svg')?.getBoundingClientRect();
      if (rect) {
        const newX = moveEvent.clientX - rect.left;
        const newY = moveEvent.clientY - rect.top;
        onDrag(vertice.id, newX, newY);
      }
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
        r="30"
        fill={isDragging ? "#3b82f6" : "#6366f1"}
        stroke="#1e40af"
        strokeWidth="2"
        className="cursor-pointer hover:fill-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
      />
      <text
        x={vertice.x}
        y={vertice.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {vertice.nome}
      </text>
    </g>
  );
};

export default VerticeComponent;
