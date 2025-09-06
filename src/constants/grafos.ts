import type { GrafoData } from '../types/grafo';

export const GRAFOS_OPCOES = [
  {
    id: 'grafo1',
    nome: 'Grafo Simples',
    data: {
      vertices: [
        { id: 'A', nome: 'A', x: 150, y: 100, conexoes: ['B', 'C'] },
        { id: 'B', nome: 'B', x: 300, y: 150, conexoes: ['A', 'C', 'D'] },
        { id: 'C', nome: 'C', x: 200, y: 250, conexoes: ['A', 'B', 'D'] },
        { id: 'D', nome: 'D', x: 400, y: 200, conexoes: ['B', 'C'] },
      ],
      arestas: [
        { origem: 'A', destino: 'B', peso: 5 },
        { origem: 'A', destino: 'C', peso: 3 },
        { origem: 'B', destino: 'C', peso: 2 },
        { origem: 'B', destino: 'D', peso: 7 },
        { origem: 'C', destino: 'D', peso: 4 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo2',
    nome: 'Grafo Estrela',
    data: {
      vertices: [
        { id: 'Centro', nome: 'Centro', x: 300, y: 200, conexoes: ['A', 'B', 'C', 'D', 'E'] },
        { id: 'A', nome: 'A', x: 300, y: 100, conexoes: ['Centro'] },
        { id: 'B', nome: 'B', x: 400, y: 150, conexoes: ['Centro'] },
        { id: 'C', nome: 'C', x: 400, y: 250, conexoes: ['Centro'] },
        { id: 'D', nome: 'D', x: 300, y: 300, conexoes: ['Centro'] },
        { id: 'E', nome: 'E', x: 200, y: 250, conexoes: ['Centro'] },
      ],
      arestas: [
        { origem: 'Centro', destino: 'A', peso: 1 },
        { origem: 'Centro', destino: 'B', peso: 2 },
        { origem: 'Centro', destino: 'C', peso: 3 },
        { origem: 'Centro', destino: 'D', peso: 4 },
        { origem: 'Centro', destino: 'E', peso: 5 },
      ]
    } as GrafoData
  },
  {
    id: 'grafo3',
    nome: 'Grafo Linear',
    data: {
      vertices: [
        { id: 'A', nome: 'A', x: 100, y: 200, conexoes: ['B'] },
        { id: 'B', nome: 'B', x: 200, y: 200, conexoes: ['A', 'C'] },
        { id: 'C', nome: 'C', x: 300, y: 200, conexoes: ['B', 'D'] },
        { id: 'D', nome: 'D', x: 400, y: 200, conexoes: ['C', 'E'] },
        { id: 'E', nome: 'E', x: 500, y: 200, conexoes: ['D'] },
      ],
      arestas: [
        { origem: 'A', destino: 'B', peso: 10 },
        { origem: 'B', destino: 'C', peso: 15 },
        { origem: 'C', destino: 'D', peso: 8 },
        { origem: 'D', destino: 'E', peso: 12 },
      ]
    } as GrafoData
  },
    {
    id: 'grafo4',
    nome: 'Grafo em Branco',
    data: {
      vertices: [

      ],
      arestas: [

      ]
    } as GrafoData
  }
];
