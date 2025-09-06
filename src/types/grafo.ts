export interface Vertice {
  id: string;
  nome: string;
  x: number;
  y: number;
  conexoes: string[]; // IDs dos vértices conectados
}

export interface Aresta {
  origem: string;
  destino: string;
  peso: number;
}

export interface GrafoData {
  vertices: Vertice[];
  arestas: Aresta[];
}
