import type { GrafoData } from '../types/grafo';

export const GRAFOS_OPCOES = [
  {
    id: 'grafo1',
    nome: 'Grafo Conexo Complexo',
    data: {
      orientado: false,
      vertices: [
        { id: 'A', nome: 'A', x: 150, y: 100, conexoes: ['B', 'C', 'E'] },
        { id: 'B', nome: 'B', x: 300, y: 80, conexoes: ['A', 'C', 'D', 'F'] },
        { id: 'C', nome: 'C', x: 200, y: 200, conexoes: ['A', 'B', 'D', 'G'] },
        { id: 'D', nome: 'D', x: 400, y: 150, conexoes: ['B', 'C', 'F', 'H'] },
        { id: 'E', nome: 'E', x: 100, y: 250, conexoes: ['A', 'G', 'I'] },
        { id: 'F', nome: 'F', x: 450, y: 80, conexoes: ['B', 'D', 'H'] },
        { id: 'G', nome: 'G', x: 150, y: 320, conexoes: ['C', 'E', 'I'] },
        { id: 'H', nome: 'H', x: 500, y: 200, conexoes: ['D', 'F'] },
        { id: 'I', nome: 'I', x: 80, y: 380, conexoes: ['E', 'G'] },
      ],
      arestas: [
        { origem: 'A', destino: 'B', peso: 4 },
        { origem: 'A', destino: 'C', peso: 2 },
        { origem: 'A', destino: 'E', peso: 7 },
        { origem: 'B', destino: 'C', peso: 1 },
        { origem: 'B', destino: 'D', peso: 5 },
        { origem: 'B', destino: 'F', peso: 8 },
        { origem: 'C', destino: 'D', peso: 3 },
        { origem: 'C', destino: 'G', peso: 6 },
        { origem: 'D', destino: 'F', peso: 2 },
        { origem: 'D', destino: 'H', peso: 4 },
        { origem: 'E', destino: 'G', peso: 3 },
        { origem: 'E', destino: 'I', peso: 5 },
        { origem: 'F', destino: 'H', peso: 1 },
        { origem: 'G', destino: 'I', peso: 2 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo2',
    nome: 'Grafo Desconexo (3 Componentes)',
    data: {
      orientado: false,
      vertices: [
        // Componente 1: Triângulo
        { id: 'A', nome: 'A', x: 120, y: 100, conexoes: ['B', 'C'] },
        { id: 'B', nome: 'B', x: 200, y: 60, conexoes: ['A', 'C'] },
        { id: 'C', nome: 'C', x: 200, y: 140, conexoes: ['A', 'B'] },
        
        // Componente 2: Linha
        { id: 'D', nome: 'D', x: 320, y: 100, conexoes: ['E'] },
        { id: 'E', nome: 'E', x: 400, y: 100, conexoes: ['D', 'F'] },
        { id: 'F', nome: 'F', x: 480, y: 100, conexoes: ['E'] },
        
        // Componente 3: Estrela
        { id: 'G', nome: 'G', x: 300, y: 250, conexoes: ['H', 'I', 'J'] },
        { id: 'H', nome: 'H', x: 250, y: 200, conexoes: ['G'] },
        { id: 'I', nome: 'I', x: 350, y: 200, conexoes: ['G'] },
        { id: 'J', nome: 'J', x: 300, y: 300, conexoes: ['G'] },
        
        // Componente 4: Vértice isolado
        { id: 'K', nome: 'K', x: 500, y: 250, conexoes: [] },
      ],
      arestas: [
        // Componente 1
        { origem: 'A', destino: 'B', peso: 3 },
        { origem: 'B', destino: 'C', peso: 4 },
        { origem: 'C', destino: 'A', peso: 5 },
        
        // Componente 2
        { origem: 'D', destino: 'E', peso: 6 },
        { origem: 'E', destino: 'F', peso: 7 },
        
        // Componente 3
        { origem: 'G', destino: 'H', peso: 2 },
        { origem: 'G', destino: 'I', peso: 3 },
        { origem: 'G', destino: 'J', peso: 4 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo3',
    nome: 'Grafo Denso (Quase Completo)',
    data: {
      orientado: false,
      vertices: [
        { id: 'A', nome: 'A', x: 200, y: 80, conexoes: ['B', 'C', 'D', 'E'] },
        { id: 'B', nome: 'B', x: 350, y: 120, conexoes: ['A', 'C', 'D', 'F'] },
        { id: 'C', nome: 'C', x: 400, y: 250, conexoes: ['A', 'B', 'E', 'F'] },
        { id: 'D', nome: 'D', x: 250, y: 300, conexoes: ['A', 'B', 'E', 'F'] },
        { id: 'E', nome: 'E', x: 100, y: 250, conexoes: ['A', 'C', 'D', 'F'] },
        { id: 'F', nome: 'F', x: 150, y: 150, conexoes: ['B', 'C', 'D', 'E'] },
      ],
      arestas: [
        { origem: 'A', destino: 'B', peso: 10 },
        { origem: 'A', destino: 'C', peso: 15 },
        { origem: 'A', destino: 'D', peso: 20 },
        { origem: 'A', destino: 'E', peso: 12 },
        { origem: 'B', destino: 'C', peso: 8 },
        { origem: 'B', destino: 'D', peso: 25 },
        { origem: 'B', destino: 'F', peso: 14 },
        { origem: 'C', destino: 'E', peso: 18 },
        { origem: 'C', destino: 'F', peso: 6 },
        { origem: 'D', destino: 'E', peso: 9 },
        { origem: 'D', destino: 'F', peso: 11 },
        { origem: 'E', destino: 'F', peso: 7 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo4',
    nome: 'Grafo Árvore (Sem Ciclos)',
    data: {
      orientado: false,
      vertices: [
        // Raiz
        { id: 'Root', nome: 'Root', x: 300, y: 80, conexoes: ['A', 'B'] },
        
        // Nível 1
        { id: 'A', nome: 'A', x: 200, y: 150, conexoes: ['Root', 'C', 'D'] },
        { id: 'B', nome: 'B', x: 400, y: 150, conexoes: ['Root', 'E', 'F'] },
        
        // Nível 2
        { id: 'C', nome: 'C', x: 150, y: 220, conexoes: ['A', 'G'] },
        { id: 'D', nome: 'D', x: 250, y: 220, conexoes: ['A', 'H'] },
        { id: 'E', nome: 'E', x: 350, y: 220, conexoes: ['B'] },
        { id: 'F', nome: 'F', x: 450, y: 220, conexoes: ['B', 'I', 'J'] },
        
        // Nível 3
        { id: 'G', nome: 'G', x: 100, y: 290, conexoes: ['C'] },
        { id: 'H', nome: 'H', x: 250, y: 290, conexoes: ['D'] },
        { id: 'I', nome: 'I', x: 420, y: 290, conexoes: ['F'] },
        { id: 'J', nome: 'J', x: 480, y: 290, conexoes: ['F'] },
      ],
      arestas: [
        { origem: 'Root', destino: 'A', peso: 5 },
        { origem: 'Root', destino: 'B', peso: 3 },
        { origem: 'A', destino: 'C', peso: 4 },
        { origem: 'A', destino: 'D', peso: 6 },
        { origem: 'B', destino: 'E', peso: 2 },
        { origem: 'B', destino: 'F', peso: 7 },
        { origem: 'C', destino: 'G', peso: 3 },
        { origem: 'D', destino: 'H', peso: 4 },
        { origem: 'F', destino: 'I', peso: 1 },
        { origem: 'F', destino: 'J', peso: 2 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo5',
    nome: 'Grafo Grid 3x3',
    data: {
      orientado: false,
      vertices: [
        // Linha superior
        { id: '1,1', nome: '1,1', x: 150, y: 100, conexoes: ['1,2', '2,1'] },
        { id: '1,2', nome: '1,2', x: 250, y: 100, conexoes: ['1,1', '1,3', '2,2'] },
        { id: '1,3', nome: '1,3', x: 350, y: 100, conexoes: ['1,2', '2,3'] },
        
        // Linha do meio
        { id: '2,1', nome: '2,1', x: 150, y: 200, conexoes: ['1,1', '2,2', '3,1'] },
        { id: '2,2', nome: '2,2', x: 250, y: 200, conexoes: ['1,2', '2,1', '2,3', '3,2'] },
        { id: '2,3', nome: '2,3', x: 350, y: 200, conexoes: ['1,3', '2,2', '3,3'] },
        
        // Linha inferior
        { id: '3,1', nome: '3,1', x: 150, y: 300, conexoes: ['2,1', '3,2'] },
        { id: '3,2', nome: '3,2', x: 250, y: 300, conexoes: ['2,2', '3,1', '3,3'] },
        { id: '3,3', nome: '3,3', x: 350, y: 300, conexoes: ['2,3', '3,2'] },
      ],
      arestas: [
        // Horizontais
        { origem: '1,1', destino: '1,2', peso: 1 },
        { origem: '1,2', destino: '1,3', peso: 1 },
        { origem: '2,1', destino: '2,2', peso: 1 },
        { origem: '2,2', destino: '2,3', peso: 1 },
        { origem: '3,1', destino: '3,2', peso: 1 },
        { origem: '3,2', destino: '3,3', peso: 1 },
        
        // Verticais
        { origem: '1,1', destino: '2,1', peso: 1 },
        { origem: '1,2', destino: '2,2', peso: 1 },
        { origem: '1,3', destino: '2,3', peso: 1 },
        { origem: '2,1', destino: '3,1', peso: 1 },
        { origem: '2,2', destino: '3,2', peso: 1 },
        { origem: '2,3', destino: '3,3', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo6',
    nome: 'Grafo em Branco',
    data: {
      orientado: false,
      vertices: [

      ],
      arestas: [

      ]
    } as GrafoData
  },
  {
    id: 'grafo7',
    nome: 'Dígrafo (Orientado) - Exemplo',
    data: {
      orientado: true,
      vertices: [
        { id: 'A', nome: 'A', x: 150, y: 100, conexoes: ['B', 'C'] },
        { id: 'B', nome: 'B', x: 350, y: 100, conexoes: ['D'] },
        { id: 'C', nome: 'C', x: 200, y: 200, conexoes: ['D', 'E'] },
        { id: 'D', nome: 'D', x: 400, y: 200, conexoes: ['E'] },
        { id: 'E', nome: 'E', x: 300, y: 300, conexoes: [] },
      ],
      arestas: [
        { origem: 'A', destino: 'B', peso: 5 },
        { origem: 'A', destino: 'C', peso: 3 },
        { origem: 'B', destino: 'D', peso: 2 },
        { origem: 'C', destino: 'D', peso: 4 },
        { origem: 'C', destino: 'E', peso: 6 },
        { origem: 'D', destino: 'E', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo8',
    nome: 'Dígrafo Desconexo',
    data: {
      orientado: true,
      vertices: [
        // Componente 1
        { id: 'A', nome: 'A', x: 120, y: 100, conexoes: ['B'] },
        { id: 'B', nome: 'B', x: 220, y: 100, conexoes: ['C'] },
        { id: 'C', nome: 'C', x: 170, y: 180, conexoes: [] },
        
        // Componente 2
        { id: 'D', nome: 'D', x: 350, y: 100, conexoes: ['E'] },
        { id: 'E', nome: 'E', x: 450, y: 100, conexoes: [] },
        
        // Componente 3 - Isolado
        { id: 'F', nome: 'F', x: 300, y: 250, conexoes: [] },
      ],
      arestas: [
        { origem: 'A', destino: 'B', peso: 2 },
        { origem: 'B', destino: 'C', peso: 3 },
        { origem: 'D', destino: 'E', peso: 1 },
      ]
    } as GrafoData
  }
];
