import type { GrafoData, Aresta } from '../types/grafo';

export interface BFResult {
  arestas: Aresta[];
  pesoTotal: number;
  passos: string[];
  ordemVisita: string[];
  arvoreExpansao: Aresta[];
}

export function buscaEmLargura(grafo: GrafoData, inicio: string): BFResult {
  const { vertices, arestas } = grafo;

  // Verifica se o vértice inicial existe
  const verticeInicial = vertices.find(v => v.id === inicio);
  if (!verticeInicial) {
    return {
      arestas: [],
      pesoTotal: 0,
      passos: ['Vértice inicial não encontrado'],
      ordemVisita: [],
      arvoreExpansao: [],
    };
  }

  const visitados = new Set<string>();
  const fila: string[] = [];
  const passos: string[] = [];
  const ordemVisita: string[] = [];
  const arvoreExpansao: Aresta[] = [];
  const arestasTotais: Aresta[] = [];
  let pesoTotal = 0;

  // Inicializa a busca
  fila.push(inicio);
  visitados.add(inicio);
  ordemVisita.push(inicio);
  passos.push(`Iniciando busca em largura a partir do vértice: ${inicio}`);
  passos.push(`Fila inicial: [${inicio}]`);

  while (fila.length > 0) {
    const verticeAtual = fila.shift()!;
    passos.push(`\n--- Explorando vértice: ${verticeAtual} ---`);
    passos.push(`Removido da fila: ${verticeAtual}`);

    // Encontra o vértice atual no grafo
    const vertice = vertices.find(v => v.id === verticeAtual)!;
    passos.push(
      `Vizinhos de ${verticeAtual}: [${vertice.conexoes.join(', ')}]`
    );

    // Explora todos os vizinhos do vértice atual
    for (const vizinhoId of vertice.conexoes) {
      // Procura a aresta entre o vértice atual e o vizinho
      const arestaEncontrada = arestas.find(
        a =>
          (a.origem === verticeAtual && a.destino === vizinhoId) ||
          (a.origem === vizinhoId && a.destino === verticeAtual)
      );

      if (arestaEncontrada) {
        // Simula a "descoberta" da aresta
        arestasTotais.push(arestaEncontrada);
        pesoTotal += arestaEncontrada.peso;
        passos.push(
          `Descoberta aresta: ${arestaEncontrada.origem} ↔ ${arestaEncontrada.destino} (peso: ${arestaEncontrada.peso})`
        );

        // Se o vizinho não foi visitado, adiciona à árvore de expansão
        if (!visitados.has(vizinhoId)) {
          visitados.add(vizinhoId);
          fila.push(vizinhoId);
          ordemVisita.push(vizinhoId);
          arvoreExpansao.push(arestaEncontrada);

          passos.push(
            `  → Vizinho ${vizinhoId} NÃO visitado - adicionado à fila`
          );
          passos.push(
            `  → Aresta ${arestaEncontrada.origem} ↔ ${arestaEncontrada.destino} adicionada à árvore`
          );
        } else {
          passos.push(`  → Vizinho ${vizinhoId} JÁ visitado - ignorado`);
        }
      }
    }

    passos.push(`Fila atual: [${fila.join(', ')}]`);
    passos.push(`Visitados: {${Array.from(visitados).join(', ')}}`);
  }

  passos.push(`\n=== BUSCA CONCLUÍDA ===`);
  passos.push(`Ordem de visita: ${ordemVisita.join(' → ')}`);
  passos.push(`Total de vértices visitados: ${visitados.size}`);
  passos.push(`Total de arestas descobertas: ${arestasTotais.length}`);
  passos.push(`Arestas na árvore de expansão: ${arvoreExpansao.length}`);
  passos.push(`Peso total das arestas descobertas: ${pesoTotal}`);

  return {
    arestas: arestasTotais,
    pesoTotal,
    passos,
    ordemVisita,
    arvoreExpansao,
  };
}
