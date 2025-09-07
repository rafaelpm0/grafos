import type { GrafoData, Aresta } from '../types/grafo';

export interface PrimResult {
  arestas: Aresta[];
  pesoTotal: number;
  passos: string[];
}

export function prim(grafo: GrafoData, inicio: string): PrimResult {
  const { vertices, arestas, orientado } = grafo;

  // Verifica se o vértice inicial existe
  const verticeInicial = vertices.find(v => v.id === inicio);
  if (!verticeInicial) {
    return {
      arestas: [],
      pesoTotal: 0,
      passos: ['❌ Vértice inicial não encontrado'],
    };
  }

  // Prim não se aplica a grafos orientados
  if (orientado) {
    return {
      arestas: [],
      pesoTotal: 0,
      passos: ['❌ O algoritmo de Prim não se aplica a grafos orientados. Use apenas com grafos não-orientados.'],
    };
  }

  const mst: Aresta[] = [];
  const visitados = new Set<string>();
  const passos: string[] = [];
  let pesoTotal = 0;

  passos.push('🌲 === ALGORITMO DE PRIM - ÁRVORE GERADORA MÍNIMA ===');
  passos.push(`📍 Iniciando com vértice: ${inicio}`);
  passos.push(`📊 Total de vértices: ${vertices.length}`);
  passos.push(`🔗 Total de arestas: ${arestas.length}`);
  passos.push('');

  // Adiciona o vértice inicial ao conjunto de visitados
  visitados.add(inicio);
  passos.push(`✅ Passo 1: Adicionando vértice ${inicio} à AGM`);

  let passo = 2;
  while (visitados.size < vertices.length) {
    let menorAresta: Aresta | null = null;
    let menorPeso = Infinity;
    let verticeDestino = '';

    passos.push(`\n🔍 Passo ${passo}: Procurando aresta de menor peso...`);
    passos.push(`🟢 Vértices na AGM: {${Array.from(visitados).join(', ')}}`);

    // Procura a aresta de menor peso que conecta um vértice visitado a um não visitado
    for (const aresta of arestas) {
      const origemVisitada = visitados.has(aresta.origem);
      const destinoVisitado = visitados.has(aresta.destino);

      // A aresta deve conectar um vértice visitado a um não visitado
      if (origemVisitada !== destinoVisitado) {
        passos.push(`   🔎 Analisando aresta ${aresta.origem} ↔ ${aresta.destino} (peso: ${aresta.peso})`);
        
        if (aresta.peso < menorPeso) {
          menorPeso = aresta.peso;
          menorAresta = aresta;
          verticeDestino = origemVisitada ? aresta.destino : aresta.origem;
          passos.push(`   ⭐ Nova melhor aresta encontrada!`);
        }
      }
    }

    // Se não encontrou aresta, o grafo pode estar desconectado
    if (!menorAresta) {
      passos.push('❌ Nenhuma aresta encontrada - grafo desconectado');
      passos.push('⚠️  A AGM não pode ser completada');
      break;
    }

    // Adiciona a aresta à AGM
    mst.push(menorAresta);
    pesoTotal += menorAresta.peso;
    visitados.add(verticeDestino);

    passos.push(`\n✅ Aresta selecionada: ${menorAresta.origem} ↔ ${menorAresta.destino} (peso: ${menorAresta.peso})`);
    passos.push(`🆕 Novo vértice adicionado à AGM: ${verticeDestino}`);
    passos.push(`💰 Peso acumulado da AGM: ${pesoTotal}`);

    passo++;
  }

  passos.push('\n🎉 === ALGORITMO CONCLUÍDO ===');
  
  if (visitados.size === vertices.length) {
    passos.push(`✅ AGM construída com sucesso!`);
    passos.push(`🌲 Arestas da AGM: ${mst.length}`);
    passos.push(`💰 Peso total da AGM: ${pesoTotal}`);
    passos.push(`📋 Arestas selecionadas:`);
    
    mst.forEach((aresta, index) => {
      passos.push(`   ${index + 1}. ${aresta.origem} ↔ ${aresta.destino} (peso: ${aresta.peso})`);
    });
    
    // Verificação: uma AGM deve ter exatamente n-1 arestas
    const arestasEsperadas = vertices.length - 1;
    if (mst.length === arestasEsperadas) {
      passos.push(`✅ Verificação: AGM tem ${mst.length} arestas (esperado: ${arestasEsperadas})`);
    } else {
      passos.push(`⚠️  Atenção: AGM tem ${mst.length} arestas (esperado: ${arestasEsperadas})`);
    }
  } else {
    passos.push(`❌ Grafo desconectado - AGM parcial construída`);
    passos.push(`🔢 Vértices alcançados: ${visitados.size}/${vertices.length}`);
    passos.push(`💰 Peso da floresta geradora: ${pesoTotal}`);
  }

  return {
    arestas: mst,
    pesoTotal,
    passos,
  };
}
