import type { GrafoData, Aresta, Vertice } from '../types/grafo';
import type { VerticeColorido } from './componentes';

export interface PlanaridadeResult {
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
  passos: string[];
  arestas: Aresta[];
  verticesColoridos: VerticeColorido[];
}

export function verificarPlanaridade(grafo: GrafoData): PlanaridadeResult {
  const { vertices, arestas, orientado } = grafo;
  const passos: string[] = [];
  
  passos.push('🎯 === ALGORITMO DE VERIFICAÇÃO DE PLANARIDADE ===');
  passos.push(`📊 Vértices: ${vertices.length}`);
  passos.push(`🔗 Arestas: ${arestas.length}`);
  passos.push(`🧭 Orientado: ${orientado ? 'Sim' : 'Não'}`);
  passos.push('');

  // Para grafos orientados, converter para não-orientado para análise de planaridade
  let arestasAnalise = arestas;
  if (orientado) {
    passos.push('⚠️  Convertendo grafo orientado para não-orientado para análise de planaridade');
    const arestasSet = new Set<string>();
    arestasAnalise = [];
    
    arestas.forEach(aresta => {
      const chave1 = `${aresta.origem}-${aresta.destino}`;
      const chave2 = `${aresta.destino}-${aresta.origem}`;
      
      if (!arestasSet.has(chave1) && !arestasSet.has(chave2)) {
        arestasSet.add(chave1);
        arestasAnalise.push(aresta);
      }
    });
    
    passos.push(`📊 Arestas após conversão: ${arestasAnalise.length}`);
    passos.push('');
  }

  const v = vertices.length;
  const e = arestasAnalise.length;

  // Calcular grau de cada vértice
  const grauVertices: { [id: string]: number } = {};
  vertices.forEach(vertice => {
    grauVertices[vertice.id] = vertice.conexoes.length;
  });

  passos.push('📐 Grau dos vértices:');
  vertices.forEach(vertice => {
    passos.push(`   ${vertice.nome}: grau ${grauVertices[vertice.id]}`);
  });
  passos.push('');

  // 1. Verificações básicas
  passos.push('🔍 === VERIFICAÇÕES BÁSICAS ===');
  
  // Grafo vazio ou com poucos vértices é sempre planar
  if (v <= 4) {
    passos.push(`✅ Grafo com ${v} vértices é sempre planar`);
    return criarResultadoPlanar(true, v, e, 'Poucos vértices', passos, arestasAnalise, vertices, grauVertices);
  }

  // 2. Fórmula de Euler para grafos planares conexos: V - E + F = 2
  passos.push('📏 Aplicando fórmula de Euler: V - E + F = 2');
  
  // Para grafo planar simples: E ≤ 3V - 6
  const limiteEuler = 3 * v - 6;
  const passaEuler = e <= limiteEuler;
  
  passos.push(`   V = ${v}, E = ${e}`);
  passos.push(`   Limite máximo de arestas para planaridade: E ≤ 3V - 6 = ${limiteEuler}`);
  passos.push(`   ${e} ≤ ${limiteEuler}: ${passaEuler ? '✅ PASSA' : '❌ FALHA'}`);
  
  if (!passaEuler) {
    passos.push('❌ Grafo NÃO é planar (excede limite de Euler)');
    return criarResultadoNaoPlanar(v, e, limiteEuler, passos, arestasAnalise, vertices, grauVertices);
  }

  // 3. Verificação de subgrafos proibidos (K5 e K3,3)
  passos.push('\n🚫 === VERIFICAÇÃO DE SUBGRAFOS PROIBIDOS ===');
  
  const temK5 = verificarK5(vertices, arestasAnalise, passos);
  const temK33 = verificarK33(vertices, arestasAnalise, passos);
  
  if (temK5 || temK33) {
    passos.push('❌ Grafo NÃO é planar (contém subgrafo proibido)');
    return {
      ePlanar: false,
      criterioEuler: {
        valido: passaEuler,
        vertices: v,
        arestas: e,
        faces: 2 + e - v,
        formula: `${v} - ${e} + F = 2, F = ${2 + e - v}`
      },
      subgrafosProibidos: {
        k5: temK5,
        k33: temK33,
        detalhes: []
      },
      grauVertices,
      passos,
      arestas: arestasAnalise,
      verticesColoridos: criarVerticesColoridos(vertices, false)
    };
  }

  // 4. Se passou por todas as verificações
  passos.push('\n✅ === GRAFO PLANAR ===');
  passos.push('✅ Passou no teste de Euler');
  passos.push('✅ Não contém K₅ ou K₃,₃');
  
  return criarResultadoPlanar(true, v, e, 'Todas as verificações', passos, arestasAnalise, vertices, grauVertices);
}

function verificarK5(vertices: Vertice[], arestas: Aresta[], passos: string[]): boolean {
  passos.push('🔍 Verificando presença de K₅ (grafo completo com 5 vértices)...');
  
  // K5 precisa de exatamente 5 vértices totalmente conectados
  if (vertices.length < 5) {
    passos.push('   ✅ Menos de 5 vértices - K₅ impossível');
    return false;
  }

  // Verificar se existe um conjunto de 5 vértices totalmente conectados
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

  // Verificar todas as possíveis divisões em dois conjuntos de 3 vértices
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

function criarResultadoPlanar(
  ePlanar: boolean, 
  v: number, 
  e: number, 
  motivo: string, 
  passos: string[], 
  arestas: Aresta[], 
  vertices: Vertice[], 
  grauVertices: { [id: string]: number }
): PlanaridadeResult {
  const faces = Math.max(2, 2 + e - v);
  
  passos.push(`📐 Fórmula de Euler: V - E + F = ${v} - ${e} + ${faces} = ${v - e + faces}`);
  
  return {
    ePlanar,
    criterioEuler: {
      valido: true,
      vertices: v,
      arestas: e,
      faces,
      formula: `${v} - ${e} + ${faces} = ${v - e + faces}`
    },
    subgrafosProibidos: {
      k5: false,
      k33: false,
      detalhes: [`Motivo: ${motivo}`]
    },
    grauVertices,
    passos,
    arestas,
    verticesColoridos: criarVerticesColoridos(vertices, true)
  };
}

function criarResultadoNaoPlanar(
  v: number, 
  e: number, 
  limite: number, 
  passos: string[], 
  arestas: Aresta[], 
  vertices: Vertice[], 
  grauVertices: { [id: string]: number }
): PlanaridadeResult {
  return {
    ePlanar: false,
    criterioEuler: {
      valido: false,
      vertices: v,
      arestas: e,
      faces: 0,
      formula: `${e} > ${limite} (máximo permitido)`
    },
    subgrafosProibidos: {
      k5: false,
      k33: false,
      detalhes: ['Excede limite de Euler']
    },
    grauVertices,
    passos,
    arestas,
    verticesColoridos: criarVerticesColoridos(vertices, false)
  };
}

function criarVerticesColoridos(vertices: Vertice[], ePlanar: boolean): VerticeColorido[] {
  return vertices.map(vertice => ({
    ...vertice,
    cor: ePlanar ? '#22c55e' : '#ef4444' // Verde se planar, vermelho se não
  }));
}
