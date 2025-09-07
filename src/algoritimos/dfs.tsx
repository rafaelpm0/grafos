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
  const { vertices, arestas, orientado } = grafo;

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
  let pesoArvore = 0; // Peso apenas das arestas da árvore

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
    
    // Para grafos orientados, considera apenas as conexões de saída
    let vizinhos: string[] = [];
    if (orientado) {
      // Em grafos orientados, considera apenas as arestas que saem do vértice atual
      vizinhos = arestas
        .filter(a => a.origem === verticeAtual)
        .map(a => a.destino);
    } else {
      // Em grafos não-orientados, usa as conexões bidirecionais
      vizinhos = vertice.conexoes;
    }
    
    passos.push(`Vizinhos de ${verticeAtual}: [${vizinhos.join(', ')}]`);

    // Explora todos os vizinhos do vértice atual
    for (const vizinhoId of vizinhos) {
      // Procura a aresta entre o vértice atual e o vizinho
      let arestaEncontrada: Aresta | undefined;
      
      if (orientado) {
        // Em grafos orientados, procura apenas aresta que sai do vértice atual
        arestaEncontrada = arestas.find(
          a => a.origem === verticeAtual && a.destino === vizinhoId
        );
      } else {
        // Em grafos não-orientados, procura aresta em qualquer direção
        arestaEncontrada = arestas.find(
          a =>
            (a.origem === verticeAtual && a.destino === vizinhoId) ||
            (a.origem === vizinhoId && a.destino === verticeAtual)
        );
      }

      if (arestaEncontrada) {
        // Simula a "descoberta" da aresta
        arestasTotais.push(arestaEncontrada);
        pesoTotal += arestaEncontrada.peso;
        
        const arestaTexto = orientado 
          ? `${arestaEncontrada.origem} → ${arestaEncontrada.destino}`
          : `${arestaEncontrada.origem} ↔ ${arestaEncontrada.destino}`;
        
        passos.push(`Descoberta aresta: ${arestaTexto} (peso: ${arestaEncontrada.peso})`);

        // Se o vizinho não foi visitado, faz chamada recursiva
        if (!visitados.has(vizinhoId)) {
          arvoreExpansao.push(arestaEncontrada);
          pesoArvore += arestaEncontrada.peso; // Adiciona ao peso da árvore
          passos.push(`  → Vizinho ${vizinhoId} NÃO visitado - explorando recursivamente`);
          passos.push(`  → Aresta ${arestaTexto} adicionada à árvore`);

          dfsVisita(vizinhoId);
        } else {
          passos.push(`  → Vizinho ${vizinhoId} JÁ visitado - aresta de retorno`);
        }
      }
    }

    tempo++;
    tempoFinalizacao[verticeAtual] = tempo;
    passos.push(`Finalizando vértice ${verticeAtual} (tempo: ${tempo})`);
  };

  // Inicializa a busca
  passos.push(`Iniciando busca em profundidade a partir do vértice: ${inicio}`);
  passos.push(`Grafo: ${orientado ? 'Orientado (direcionado)' : 'Não-orientado'}`);

  dfsVisita(inicio);

  passos.push(`\n=== BUSCA CONCLUÍDA ===`);
  passos.push(`Ordem de visita: ${ordemVisita.join(' → ')}`);
  passos.push(`Total de vértices visitados: ${visitados.size}`);
  passos.push(`Total de arestas descobertas: ${arestasTotais.length}`);
  passos.push(`Arestas na árvore de busca: ${arvoreExpansao.length}`);
  passos.push(`Peso total das arestas descobertas: ${pesoTotal}`);
  passos.push(`Peso total da árvore de busca: ${pesoArvore}`);
  passos.push(`\n📌 DESTACADO NO GRAFO: Apenas as arestas da árvore de busca (${arvoreExpansao.length} arestas)`);

  return {
    arestas: arvoreExpansao, // Retorna apenas as arestas da árvore de busca
    pesoTotal: pesoArvore, // Retorna o peso apenas da árvore
    passos,
    ordemVisita,
    arvoreExpansao,
    tempoDescoberta,
    tempoFinalizacao,
  };
}
