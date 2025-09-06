import type { GrafoData } from '../types/grafo';

export interface ComponentesCaixas {
  componentes: string[][];
  passos: string[];
  totalComponentes: number;
}

export function encontrarComponentesConexas(
  grafo: GrafoData
): ComponentesCaixas {
  const { vertices } = grafo;
  const visitados = new Set<string>();
  const componentes: string[][] = [];
  const passos: string[] = [];

  passos.push('=== INICIANDO BUSCA DE COMPONENTES CONEXAS ===');
  passos.push(`Total de vértices no grafo: ${vertices.length}`);

  // Função DFS para explorar uma componente
  const dfsComponente = (verticeAtual: string, componenteAtual: string[]) => {
    visitados.add(verticeAtual);
    componenteAtual.push(verticeAtual);
    passos.push(`  → Adicionado vértice ${verticeAtual} à componente atual`);

    // Encontra o vértice atual no grafo
    const vertice = vertices.find(v => v.id === verticeAtual);
    if (!vertice) return;

    // Explora todos os vizinhos não visitados
    for (const vizinhoId of vertice.conexoes) {
      if (!visitados.has(vizinhoId)) {
        passos.push(`    → Explorando vizinho ${vizinhoId} de ${verticeAtual}`);
        dfsComponente(vizinhoId, componenteAtual);
      }
    }
  };

  // Para cada vértice não visitado, inicia uma nova componente
  for (const vertice of vertices) {
    if (!visitados.has(vertice.id)) {
      const novaComponente: string[] = [];
      passos.push(
        `\n--- Nova componente iniciada a partir de ${vertice.id} ---`
      );

      dfsComponente(vertice.id, novaComponente);

      componentes.push(novaComponente);
      passos.push(
        `Componente ${componentes.length}: {${novaComponente.join(', ')}}`
      );
    }
  }

  passos.push(`\n=== BUSCA CONCLUÍDA ===`);
  passos.push(
    `Total de componentes conexas encontradas: ${componentes.length}`
  );

  if (componentes.length === 1) {
    passos.push('O grafo é CONEXO (possui apenas uma componente)');
  } else {
    passos.push('O grafo é DESCONEXO (possui múltiplas componentes)');
  }

  return {
    componentes,
    passos,
    totalComponentes: componentes.length,
  };
}
