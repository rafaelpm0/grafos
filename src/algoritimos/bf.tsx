import type { GrafoData, Aresta } from '../types/grafo';

export interface BFResult {
  arestas: Aresta[];
  pesoTotal: number;
  passos: string[];
  ordemVisita: string[];
  arvoreExpansao: Aresta[];
}

export function buscaEmLargura(grafo: GrafoData, inicio: string): BFResult {
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
    };
  }

  const visitados = new Set<string>();
  const fila: string[] = [];
  const passos: string[] = [];
  const ordemVisita: string[] = [];
  const arvoreExpansao: Aresta[] = [];
  const arestasTotais: Aresta[] = [];
  let pesoTotal = 0;
  let pesoArvore = 0; // Peso apenas das arestas da árvore

  // Inicializa a busca
  fila.push(inicio);
  visitados.add(inicio);
  ordemVisita.push(inicio);
  passos.push(`Iniciando busca em largura a partir do vértice: ${inicio}`);
  passos.push(`Grafo: ${orientado ? 'Orientado (direcionado)' : 'Não-orientado'}`);
  passos.push(`Fila inicial: [${inicio}]`);

  while (fila.length > 0) {
    const verticeAtual = fila.shift()!;
    passos.push(`\n--- Explorando vértice: ${verticeAtual} ---`);
    passos.push(`Removido da fila: ${verticeAtual}`);

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

        // Se o vizinho não foi visitado, adiciona à árvore de expansão
        if (!visitados.has(vizinhoId)) {
          visitados.add(vizinhoId);
          fila.push(vizinhoId);
          ordemVisita.push(vizinhoId);
          arvoreExpansao.push(arestaEncontrada);
          pesoArvore += arestaEncontrada.peso; // Adiciona ao peso da árvore

          passos.push(`  → Vizinho ${vizinhoId} NÃO visitado - adicionado à fila`);
          passos.push(`  → Aresta ${arestaTexto} adicionada à árvore`);
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
  passos.push(`Peso total da árvore de expansão: ${pesoArvore}`);
  passos.push(`\n📌 DESTACADO NO GRAFO: Apenas as arestas da árvore de expansão (${arvoreExpansao.length} arestas)`);

  return {
    arestas: arvoreExpansao, // Retorna apenas as arestas da árvore de expansão
    pesoTotal: pesoArvore, // Retorna o peso apenas da árvore
    passos,
    ordemVisita,
    arvoreExpansao,
  };
}
