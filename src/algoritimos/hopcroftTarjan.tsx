import type { GrafoData, Aresta, Vertice } from '../types/grafo';
import type { VerticeColorido } from './componentes';

export interface PontesArticulacoesResult {
  pontes: Aresta[];
  verticesArticulacao: string[];
  passos: string[];
  tempoDescoberta: Record<string, number>;
  low: Record<string, number>;
  verticesColoridos: VerticeColorido[];
  ePlanar: boolean;
  criterioEuler: {
    valido: boolean;
    vertices: number;
    arestas: number;
    faces: number;
    formula: string;
  };
  subgrafosProibidos: {
    k5: boolean;
    k33: boolean;
    detalhes: string[];
  };
  grauVertices: { [id: string]: number };
}

// Funções auxiliares para verificação de planaridade
function verificarK5(vertices: Vertice[], arestas: Aresta[], passos: string[]): boolean {
  passos.push('🔍 Verificando presença de K₅ (grafo completo com 5 vértices)...');
  
  if (vertices.length < 5) {
    passos.push('   ✅ Menos de 5 vértices - K₅ impossível');
    return false;
  }

  for (let i = 0; i < vertices.length - 4; i++) {
    for (let j = i + 1; j < vertices.length - 3; j++) {
      for (let k = j + 1; k < vertices.length - 2; k++) {
        for (let l = k + 1; l < vertices.length - 1; l++) {
          for (let m = l + 1; m < vertices.length; m++) {
            const conjunto = [vertices[i], vertices[j], vertices[k], vertices[l], vertices[m]];
            if (ehCompleto(conjunto, arestas)) {
              passos.push(`   ❌ K₅ encontrado: {${conjunto.map(v => v.nome).join(', ')}}`);
              return true;
            }
          }
        }
      }
    }
  }
  
  passos.push('   ✅ K₅ não encontrado');
  return false;
}

function verificarK33(vertices: Vertice[], arestas: Aresta[], passos: string[]): boolean {
  passos.push('🔍 Verificando presença de K₃,₃ (grafo bipartido completo)...');
  
  if (vertices.length < 6) {
    passos.push('   ✅ Menos de 6 vértices - K₃,₃ impossível');
    return false;
  }

  for (let i = 0; i < vertices.length - 5; i++) {
    for (let j = i + 1; j < vertices.length - 4; j++) {
      for (let k = j + 1; k < vertices.length - 3; k++) {
        const grupo1 = [vertices[i], vertices[j], vertices[k]];
        
        for (let l = k + 1; l < vertices.length - 2; l++) {
          for (let m = l + 1; m < vertices.length - 1; m++) {
            for (let n = m + 1; n < vertices.length; n++) {
              const grupo2 = [vertices[l], vertices[m], vertices[n]];
              
              if (ehBipartidoCompleto(grupo1, grupo2, arestas)) {
                passos.push(`   ❌ K₃,₃ encontrado:`);
                passos.push(`     Grupo 1: {${grupo1.map(v => v.nome).join(', ')}}`);
                passos.push(`     Grupo 2: {${grupo2.map(v => v.nome).join(', ')}}`);
                return true;
              }
            }
          }
        }
      }
    }
  }
  
  passos.push('   ✅ K₃,₃ não encontrado');
  return false;
}

function ehCompleto(vertices: Vertice[], arestas: Aresta[]): boolean {
  const n = vertices.length;
  const arestasEsperadas = (n * (n - 1)) / 2;
  
  let arestasEncontradas = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const existe = arestas.some(a => 
        (a.origem === vertices[i].id && a.destino === vertices[j].id) ||
        (a.origem === vertices[j].id && a.destino === vertices[i].id)
      );
      if (existe) arestasEncontradas++;
    }
  }
  
  return arestasEncontradas === arestasEsperadas;
}

function ehBipartidoCompleto(grupo1: Vertice[], grupo2: Vertice[], arestas: Aresta[]): boolean {
  // Verificar se cada vértice do grupo1 está conectado a cada vértice do grupo2
  for (const v1 of grupo1) {
    for (const v2 of grupo2) {
      const existe = arestas.some(a => 
        (a.origem === v1.id && a.destino === v2.id) ||
        (a.origem === v2.id && a.destino === v1.id)
      );
      if (!existe) return false;
    }
  }
  
  // Verificar se não há arestas dentro dos grupos
  for (let i = 0; i < grupo1.length - 1; i++) {
    for (let j = i + 1; j < grupo1.length; j++) {
      const existe = arestas.some(a => 
        (a.origem === grupo1[i].id && a.destino === grupo1[j].id) ||
        (a.origem === grupo1[j].id && a.destino === grupo1[i].id)
      );
      if (existe) return false;
    }
  }
  
  for (let i = 0; i < grupo2.length - 1; i++) {
    for (let j = i + 1; j < grupo2.length; j++) {
      const existe = arestas.some(a => 
        (a.origem === grupo2[i].id && a.destino === grupo2[j].id) ||
        (a.origem === grupo2[j].id && a.destino === grupo2[i].id)
      );
      if (existe) return false;
    }
  }
  
  return true;
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

  // Primeiro verificamos a planaridade
  passos.push('🎯 === VERIFICAÇÃO DE PLANARIDADE ===');
  
  // Calcular grau dos vértices
  const grauVertices: { [id: string]: number } = {};
  vertices.forEach(vertice => {
    grauVertices[vertice.id] = vertice.conexoes.length;
  });

  const v = vertices.length;
  const e = arestas.length;

  // Verificar critério de Euler
  const limiteEuler = 3 * v - 6;
  const passaEuler = v <= 4 || e <= limiteEuler;
  
  passos.push(`📊 Vértices: ${v}, Arestas: ${e}`);
  if (v <= 4) {
    passos.push(`✅ Grafo com ${v} vértices é sempre planar`);
  } else {
    passos.push(`📏 Limite de Euler: E ≤ 3V - 6 = ${limiteEuler}`);
    passos.push(`${e} ≤ ${limiteEuler}: ${passaEuler ? '✅ PASSA' : '❌ FALHA'}`);
  }

  let ePlanar = passaEuler;
  let temK5 = false;
  let temK33 = false;

  // Se passar no critério de Euler, verificar subgrafos proibidos
  if (passaEuler && v > 4) {
    passos.push('\n🔍 Verificando subgrafos proibidos...');
    temK5 = verificarK5(vertices, arestas, passos);
    if (!temK5) {
      temK33 = verificarK33(vertices, arestas, passos);
    }
    ePlanar = !temK5 && !temK33;
  }

  passos.push(`\n${ePlanar ? '✅' : '❌'} Resultado: O grafo ${ePlanar ? 'É' : 'NÃO é'} planar`);
  
  // Agora procedemos com Hopcroft-Tarjan
  passos.push('\n🎯 === HOPCROFT-TARJAN (NÃO ORIENTADO) ===');
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

  // Cores serão definidas mais abaixo

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

  // Os vértices já foram coloridos anteriormente, não precisa fazer novamente

  // Colorir arestas que são pontes
  const verticesComPontes = new Set<string>();
  pontes.forEach(ponte => {
    verticesComPontes.add(ponte.origem);
    verticesComPontes.add(ponte.destino);
  });

  // Atualizar cores dos vértices considerando pontes e articulações
  const verticesColoridos = vertices.map(vertice => ({
    id: vertice.id,
    nome: vertice.nome,
    x: vertice.x,
    y: vertice.y,
    conexoes: vertice.conexoes,
    cor: verticesArticulacao.has(vertice.id) 
      ? '#ef4444' // Vermelho para articulação
      : verticesComPontes.has(vertice.id)
      ? '#f59e0b' // Âmbar para vértices com pontes
      : '#10b981', // Verde para normal
    rotulo: verticesArticulacao.has(vertice.id) 
      ? 'Articulação' 
      : verticesComPontes.has(vertice.id)
      ? 'Conecta Ponte'
      : 'Normal'
  }));

  const detalhes = [];
  if (!passaEuler) {
    detalhes.push(`O grafo não satisfaz o critério de Euler: ${e} > ${limiteEuler}`);
  }
  if (temK5) {
    detalhes.push('Contém subgrafo K₅');
  }
  if (temK33) {
    detalhes.push('Contém subgrafo K₃,₃');
  }

  return {
    // Resultados do Hopcroft-Tarjan
    pontes,
    verticesArticulacao: Array.from(verticesArticulacao),
    passos,
    tempoDescoberta,
    low,
    verticesColoridos,
    
    // Resultados da Planaridade
    ePlanar,
    criterioEuler: {
      valido: passaEuler,
      vertices: v,
      arestas: e,
      faces: Math.max(2, 2 + e - v),
      formula: `${v} - ${e} + F = 2, F = ${2 + e - v}`
    },
    subgrafosProibidos: {
      k5: temK5,
      k33: temK33,
      detalhes
    },
    grauVertices
  };
}
