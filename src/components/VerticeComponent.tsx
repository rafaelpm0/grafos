import React from 'react';
import type { Vertice } from '../types/grafo';

interface VerticeComponentProps {
  vertice: Vertice;
  onDrag: (id: string, x: number, y: number) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  cor?: string; // Cor opcional para coloração específica (ex: Tarjan)
}

const VerticeComponent: React.FC<VerticeComponentProps> = ({
  vertice,
  onDrag,
  isDragging,
  onDragStart,
  onDragEnd,
  cor
}) => {
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
      
      // Limitar dentro dos bounds do viewBox
      const boundedX = Math.max(20, Math.min(viewBox.width - 20, newX));
      const boundedY = Math.max(20, Math.min(viewBox.height - 20, newY));
      
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
        r="20"
        fill={cor || (isDragging ? "#3b82f6" : "#6366f1")}
        stroke="#1e40af"
        strokeWidth="2"
        className="cursor-grab hover:fill-blue-500 transition-colors active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      />
      <text
        x={vertice.x}
        y={vertice.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        className="pointer-events-none select-none"
        style={{ userSelect: 'none' }}
      >
        {vertice.nome}
      </text>
    </g>
  );
};

export default VerticeComponent;
