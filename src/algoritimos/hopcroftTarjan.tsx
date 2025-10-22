import type { GrafoData, Aresta } from '../types/grafo';
import type { VerticeColorido } from './componentes';

export interface PontesArticulacoesResult {
  pontes: Aresta[];
  verticesArticulacao: string[];
  passos: string[];
  tempoDescoberta: Record<string, number>;
  low: Record<string, number>;
  verticesColoridos: VerticeColorido[];
}

export function hopcroftTarjanNaoOrientado(
  grafo: GrafoData
): PontesArticulacoesResult {
  const { vertices, arestas } = grafo;
  const passos: string[] = [];
  const visitados = new Set<string>();
  const tempoDescoberta: Record<string, number> = {};
  const low: Record<string, number> = {};
  const pai: Record<string, string | null> = {};
  const pontes: Aresta[] = [];
  const verticesArticulacao: Set<string> = new Set();
  let tempo = 0;

  passos.push('🎯 === HOPCROFT-TARJAN (NÃO ORIENTADO) ===');
  passos.push('📋 Algoritmo para encontrar pontes e vértices de articulação');
  passos.push('🔍 Ponte: aresta cuja remoção desconecta o grafo');
  passos.push('🔗 Articulação: vértice cuja remoção desconecta o grafo');
  passos.push('');

  function dfs(u: string) {
    visitados.add(u);
    tempo++;
    tempoDescoberta[u] = low[u] = tempo;
    let filhos = 0;

    passos.push(`\n🔍 Visitando vértice ${u} (tempo: ${tempo})`);
    passos.push(`  📊 Tempo de descoberta[${u}] = ${tempoDescoberta[u]}`);
    passos.push(`  📊 Low[${u}] = ${low[u]}`);
    
    const vertice = vertices.find(v => v.id === u);
    if (!vertice) return;

    // Explorar todos os vizinhos
    for (const v of vertice.conexoes) {
      const aresta = arestas.find(
        a =>
          (a.origem === u && a.destino === v) ||
          (a.origem === v && a.destino === u)
      );
      
      if (!visitados.has(v)) {
        pai[v] = u;
        filhos++;
        passos.push(`  → Explorando vizinho ${v} (pai: ${u})`);
        dfs(v);

        // Atualizar low[u] com base no low[v]
        const lowAnterior = low[u];
        low[u] = Math.min(low[u], low[v]);
        if (lowAnterior !== low[u]) {
          passos.push(`  📊 Atualizando low[${u}] = min(${lowAnterior}, ${low[v]}) = ${low[u]}`);
        }

        // Verificar se é uma ponte
        if (low[v] > tempoDescoberta[u] && aresta) {
          pontes.push(aresta);
          passos.push(`    ⚡ PONTE ENCONTRADA: ${u} ↔ ${v}`);
          passos.push(`       📈 Condição: low[${v}] (${low[v]}) > tempo[${u}] (${tempoDescoberta[u]})`);
        }

        // Verificar se é um vértice de articulação
        const isRaizComMuitosFilhos = pai[u] === null && filhos > 1;
        const isNaoRaizComCondicao = pai[u] !== null && low[v] >= tempoDescoberta[u];
        
        if (isRaizComMuitosFilhos) {
          verticesArticulacao.add(u);
          passos.push(`    🔗 ARTICULAÇÃO (RAIZ): ${u} tem ${filhos} filhos`);
        } else if (isNaoRaizComCondicao) {
          verticesArticulacao.add(u);
          passos.push(`    🔗 ARTICULAÇÃO: ${u}`);
          passos.push(`       📈 Condição: low[${v}] (${low[v]}) >= tempo[${u}] (${tempoDescoberta[u]})`);
        }

      } else if (v !== pai[u]) {
        // Aresta de retorno (back edge)
        const lowAnterior = low[u];
        low[u] = Math.min(low[u], tempoDescoberta[v]);
        if (lowAnterior !== low[u]) {
          passos.push(`  ↩️ Aresta de retorno: ${u} ↔ ${v}`);
          passos.push(`  📊 Atualizando low[${u}] = min(${lowAnterior}, tempo[${v}]) = ${low[u]}`);
        }
      }
    }
  }

  // Executar DFS para cada componente conexa
  for (const v of vertices) {
    if (!visitados.has(v.id)) {
      pai[v.id] = null;
      passos.push(`\n🚀 Iniciando DFS a partir do vértice ${v.id} (nova componente)`);
      dfs(v.id);
    }
  }

  // Criar visualização colorida dos vértices
  const verticesColoridos: VerticeColorido[] = vertices.map(vertice => ({
    id: vertice.id,
    nome: vertice.nome,
    x: vertice.x,
    y: vertice.y,
    conexoes: vertice.conexoes,
    cor: verticesArticulacao.has(vertice.id) ? '#ef4444' : '#10b981', // Vermelho para articulação, verde para normal
    rotulo: verticesArticulacao.has(vertice.id) ? 'Articulação' : 'Normal'
  }));

  // Resumo final
  passos.push('\n🎉 === RESULTADO FINAL ===');
  passos.push(`📊 Total de vértices: ${vertices.length}`);
  passos.push(`📊 Total de arestas: ${arestas.length}`);
  passos.push(`⚡ Total de pontes: ${pontes.length}`);
  if (pontes.length > 0) {
    passos.push(`⚡ Pontes encontradas:`);
    pontes.forEach((ponte, index) => {
      passos.push(`   ${index + 1}. ${ponte.origem} ↔ ${ponte.destino} (peso: ${ponte.peso || 'N/A'})`);
    });
  } else {
    passos.push(`⚡ Nenhuma ponte encontrada - grafo é 2-aresta-conexo`);
  }
  
  passos.push(`🔗 Total de vértices de articulação: ${verticesArticulacao.size}`);
  if (verticesArticulacao.size > 0) {
    passos.push(`🔗 Vértices de articulação:`);
    Array.from(verticesArticulacao).forEach((vertice, index) => {
      const nomeVertice = vertices.find(v => v.id === vertice)?.nome || vertice;
      passos.push(`   ${index + 1}. ${nomeVertice} (${vertice})`);
    });
  } else {
    passos.push(`🔗 Nenhum vértice de articulação - grafo é 2-vértice-conexo`);
  }

  // Análise de conectividade
  passos.push('\n📈 === ANÁLISE DE CONECTIVIDADE ===');
  if (pontes.length === 0 && verticesArticulacao.size === 0) {
    passos.push('✅ Grafo é 2-conexo (resistente a falhas)');
  } else if (pontes.length > 0) {
    passos.push('⚠️ Grafo possui pontes - remoção pode desconectar');
  } else if (verticesArticulacao.size > 0) {
    passos.push('⚠️ Grafo possui articulações - remoção pode desconectar');
  }

  // Estatísticas dos tempos
  passos.push('\n🕐 === TEMPOS DE DESCOBERTA E LOW ===');
  vertices.forEach(vertice => {
    const descoberta = tempoDescoberta[vertice.id] || 0;
    const lowValue = low[vertice.id] || 0;
    const nomeVertice = vertice.nome || vertice.id;
    passos.push(`${nomeVertice}: tempo=${descoberta}, low=${lowValue}`);
  });

  return {
    pontes,
    verticesArticulacao: Array.from(verticesArticulacao),
    passos,
    tempoDescoberta,
    low,
    verticesColoridos
  };
}
