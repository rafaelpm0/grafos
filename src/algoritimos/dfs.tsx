import type { GrafoData, Aresta } from '../types/grafo';

export interface DFSResult {
  arestas: Aresta[];
  pesoTotal: number;
  passos: string[];
  ordemVisita: string[];
  arvoreExpansao: Aresta[];
  tempoDescoberta: Record<string, number>;
  tempoFinalizacao: Record<string, number>;
}

export function buscaEmProfundidade(
  grafo: GrafoData,
  inicio: string
): DFSResult {
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
      tempoDescoberta: {},
      tempoFinalizacao: {},
    };
  }

  const visitados = new Set<string>();
  const passos: string[] = [];
  const ordemVisita: string[] = [];
  const arvoreExpansao: Aresta[] = [];
  const arestasTotais: Aresta[] = [];
  const tempoDescoberta: Record<string, number> = {};
  const tempoFinalizacao: Record<string, number> = {};
  let tempo = 0;
  let pesoTotal = 0;

  // Função auxiliar recursiva para DFS
  const dfsVisita = (verticeAtual: string) => {
    tempo++;
    tempoDescoberta[verticeAtual] = tempo;
    visitados.add(verticeAtual);
    ordemVisita.push(verticeAtual);

    passos.push(
      `\n--- Visitando vértice: ${verticeAtual} (tempo: ${tempo}) ---`
    );
    passos.push(`Vértice ${verticeAtual} marcado como visitado`);

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

        // Se o vizinho não foi visitado, faz chamada recursiva
        if (!visitados.has(vizinhoId)) {
          arvoreExpansao.push(arestaEncontrada);
          passos.push(
            `  → Vizinho ${vizinhoId} NÃO visitado - explorando recursivamente`
          );
          passos.push(
            `  → Aresta ${arestaEncontrada.origem} ↔ ${arestaEncontrada.destino} adicionada à árvore`
          );

          dfsVisita(vizinhoId);
        } else {
          passos.push(
            `  → Vizinho ${vizinhoId} JÁ visitado - aresta de retorno`
          );
        }
      }
    }

    tempo++;
    tempoFinalizacao[verticeAtual] = tempo;
    passos.push(`Finalizando vértice ${verticeAtual} (tempo: ${tempo})`);
  };

  // Inicializa a busca
  passos.push(`Iniciando busca em profundidade a partir do vértice: ${inicio}`);

  dfsVisita(inicio);

  passos.push(`\n=== BUSCA CONCLUÍDA ===`);
  passos.push(`Ordem de visita: ${ordemVisita.join(' → ')}`);
  passos.push(`Total de vértices visitados: ${visitados.size}`);
  passos.push(`Total de arestas descobertas: ${arestasTotais.length}`);
  passos.push(`Arestas na árvore de busca: ${arvoreExpansao.length}`);
  passos.push(`Peso total das arestas descobertas: ${pesoTotal}`);

  return {
    arestas: arestasTotais,
    pesoTotal,
    passos,
    ordemVisita,
    arvoreExpansao,
    tempoDescoberta,
    tempoFinalizacao,
  };
}
