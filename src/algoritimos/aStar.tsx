import type { GrafoData, Vertice, Aresta } from "../types/grafo";
import type { VerticeColorido } from './componentes';

export interface AStarResult {
  caminho: string[]; // sequência de vértices do caminho
  custoTotal: number; // custo total do caminho encontrado
  passos: string[]; // passos detalhados do algoritmo
  heuristica: { [id: string]: number }; // valores h(n) para cada vértice
  visitados: string[]; // ordem de visita dos vértices
  distancias: { [id: string]: number }; // distâncias g(n) do início
  fScores: { [id: string]: number }; // valores f(n) = g(n) + h(n)
  arestas: Aresta[]; // arestas do caminho encontrado
  verticesColoridos: VerticeColorido[]; // vértices coloridos para visualização
}

// Função para calcular distância de Manhattan entre dois vértices (heurística)
function calcularDistanciaManhattan(vertice1: Vertice, vertice2: Vertice): number {
  return Math.abs(vertice1.x - vertice2.x) + Math.abs(vertice1.y - vertice2.y);
}

export function aStar(grafo: GrafoData, inicioId: string, fimId: string): AStarResult {
  const { vertices, arestas, orientado } = grafo;
  const passos: string[] = [];

  // Verificações iniciais
  const verticeInicio = vertices.find(v => v.id === inicioId);
  const verticeFim = vertices.find(v => v.id === fimId);

  if (!verticeInicio) {
    return {
      caminho: [],
      custoTotal: 0,
      passos: ['❌ Vértice de início não encontrado'],
      heuristica: {},
      visitados: [],
      distancias: {},
      fScores: {},
      arestas: [],
      verticesColoridos: [],
    };
  }

  if (!verticeFim) {
    return {
      caminho: [],
      custoTotal: 0,
      passos: ['❌ Vértice de destino não encontrado'],
      heuristica: {},
      visitados: [],
      distancias: {},
      fScores: {},
      arestas: [],
      verticesColoridos: [],
    };
  }

  if (inicioId === fimId) {
    return {
      caminho: [inicioId],
      custoTotal: 0,
      passos: ['✅ Origem e destino são o mesmo vértice'],
      heuristica: { [inicioId]: 0 },
      visitados: [inicioId],
      distancias: { [inicioId]: 0 },
      fScores: { [inicioId]: 0 },
      arestas: [],
      verticesColoridos: [{
        ...verticeInicio,
        cor: '#22c55e' // Verde para início=fim
      }],
    };
  }

  // Verificação: A* funciona melhor em grafos não-orientados para este contexto
  if (orientado) {
    passos.push('⚠️  Aviso: A* está sendo aplicado em grafo orientado');
  }

  passos.push('🎯 === ALGORITMO A* - BUSCA COM HEURÍSTICA ===');
  passos.push(`📍 Vértice inicial: ${inicioId}`);
  passos.push(`🏁 Vértice destino: ${fimId}`);
  passos.push(`📊 Total de vértices: ${vertices.length}`);
  passos.push(`🔗 Total de arestas: ${arestas.length}`);
  passos.push('🗺️  Usando distância de Manhattan baseada nas coordenadas (x, y)');
  passos.push('');

  // Calcular heurística h(n) para todos os vértices usando distância de Manhattan
  const heuristica: { [id: string]: number } = {};
  vertices.forEach(vertice => {
    heuristica[vertice.id] = calcularDistanciaManhattan(vertice, verticeFim);
  });
  passos.push('📐 Calculando heurística h(n) - Distância de Manhattan até o destino:');
  vertices.forEach(vertice => {
    passos.push(`   h(${vertice.id}) = ${heuristica[vertice.id].toFixed(2)}`);
  });
  passos.push('');

  // Inicializar estruturas de dados
  const distancias: { [id: string]: number } = {}; // g(n)
  const fScores: { [id: string]: number } = {}; // f(n) = g(n) + h(n)
  const anterior: { [id: string]: string | null } = {};
  const visitados = new Set<string>();
  const visitadosOrdem: string[] = [];
  const listaAberta = new Set<string>([inicioId]);

  // Inicializar distâncias
  vertices.forEach(vertice => {
    distancias[vertice.id] = vertice.id === inicioId ? 0 : Infinity;
    fScores[vertice.id] = vertice.id === inicioId ? heuristica[vertice.id] : Infinity;
    anterior[vertice.id] = null;
  });

  passos.push('🚀 Iniciando busca A*');
  passos.push(`📋 Lista aberta inicial: {${inicioId}}`);
  passos.push(`🎯 f(${inicioId}) = g(${inicioId}) + h(${inicioId}) = 0 + ${heuristica[inicioId].toFixed(2)} = ${fScores[inicioId].toFixed(2)}`);
  passos.push('');

  let passo = 1;

  while (listaAberta.size > 0) {
    // Encontrar vértice com menor f(n) na lista aberta
    let verticeAtual = '';
    let menorF = Infinity;
    
    for (const verticeId of listaAberta) {
      if (fScores[verticeId] < menorF) {
        menorF = fScores[verticeId];
        verticeAtual = verticeId;
      }
    }

    passos.push(`🔍 Passo ${passo}: Selecionando vértice com menor f(n)`);
    passos.push(`   👑 Vértice atual: ${verticeAtual} (f = ${fScores[verticeAtual].toFixed(2)})`);

    // Remove da lista aberta e adiciona aos visitados
    listaAberta.delete(verticeAtual);
    visitados.add(verticeAtual);
    visitadosOrdem.push(verticeAtual);

    // Verifica se chegou ao destino
    if (verticeAtual === fimId) {
      passos.push(`🎉 Destino alcançado! Vértice ${fimId} encontrado`);
      break;
    }

    // Explorar vizinhos
    const vertice = vertices.find(v => v.id === verticeAtual)!;
    const vizinhos = orientado ? 
      vertice.conexoes : 
      [...new Set([...vertice.conexoes, ...vertices.filter(v => v.conexoes.includes(verticeAtual)).map(v => v.id)])];

    passos.push(`   🔗 Explorando vizinhos de ${verticeAtual}: {${vizinhos.join(', ')}}`);

    for (const vizinhoId of vizinhos) {
      if (visitados.has(vizinhoId)) {
        passos.push(`     ⏭️  ${vizinhoId} já foi visitado, pulando...`);
        continue;
      }

      // Encontrar peso da aresta
      const aresta = arestas.find(a => 
        (a.origem === verticeAtual && a.destino === vizinhoId) ||
        (!orientado && a.origem === vizinhoId && a.destino === verticeAtual)
      );

      if (!aresta) {
        passos.push(`     ❌ Aresta entre ${verticeAtual} e ${vizinhoId} não encontrada`);
        continue;
      }

      const pesoAresta = aresta.peso;
      const novaDistancia = distancias[verticeAtual] + pesoAresta;
      const novoF = novaDistancia + heuristica[vizinhoId];

      passos.push(`     📊 Analisando ${vizinhoId}:`);
      passos.push(`        Peso da aresta: ${pesoAresta}`);
      passos.push(`        g(${vizinhoId}) atual: ${distancias[vizinhoId] === Infinity ? '∞' : distancias[vizinhoId].toFixed(2)}`);
      passos.push(`        g(${vizinhoId}) nova: ${novaDistancia.toFixed(2)}`);
      passos.push(`        h(${vizinhoId}): ${heuristica[vizinhoId].toFixed(2)}`);
      passos.push(`        f(${vizinhoId}) nova: ${novoF.toFixed(2)}`);

      if (novaDistancia < distancias[vizinhoId]) {
        distancias[vizinhoId] = novaDistancia;
        fScores[vizinhoId] = novoF;
        anterior[vizinhoId] = verticeAtual;
        listaAberta.add(vizinhoId);
        
        passos.push(`        ✅ Melhor caminho encontrado para ${vizinhoId}!`);
        passos.push(`        📝 Anterior[${vizinhoId}] = ${verticeAtual}`);
      } else {
        passos.push(`        ❌ Caminho não é melhor que o atual`);
      }
    }

    passos.push(`   📋 Lista aberta atual: {${Array.from(listaAberta).join(', ')}}`);
    passos.push('');
    passo++;

    // Proteção contra loops infinitos
    if (passo > vertices.length * 2) {
      passos.push('⚠️  Limite de passos atingido, parando execução');
      break;
    }
  }

  // Reconstruir caminho
  const caminho: string[] = [];
  let atual: string | null = fimId;

  if (visitados.has(fimId)) {
    while (atual !== null) {
      caminho.unshift(atual);
      atual = anterior[atual];
    }
  }

  const custoTotal = distancias[fimId] === Infinity ? 0 : distancias[fimId];

  // Construir arestas do caminho
  const arestasCaminho: Aresta[] = [];
  for (let i = 0; i < caminho.length - 1; i++) {
    const origem = caminho[i];
    const destino = caminho[i + 1];
    const aresta = arestas.find(a => 
      (a.origem === origem && a.destino === destino) ||
      (!orientado && a.origem === destino && a.destino === origem)
    );
    if (aresta) {
      arestasCaminho.push(aresta);
    }
  }

  // Construir vértices coloridos
  const verticesColoridos: VerticeColorido[] = vertices.map(vertice => {
    let cor = '#94a3b8'; // Cinza padrão para não visitados
    
    if (vertice.id === inicioId) {
      cor = '#22c55e'; // Verde para início
    } else if (vertice.id === fimId) {
      cor = '#ef4444'; // Vermelho para fim
    } else if (caminho.includes(vertice.id)) {
      cor = '#3b82f6'; // Azul para caminho
    } else if (visitadosOrdem.includes(vertice.id)) {
      cor = '#f59e0b'; // Amarelo para visitados
    }

    return {
      ...vertice,
      cor
    };
  });

  passos.push('🏁 === RESULTADO DO A* ===');
  
  if (caminho.length > 0) {
    passos.push(`✅ Caminho encontrado: ${caminho.join(' → ')}`);
    passos.push(`💰 Custo total: ${custoTotal.toFixed(2)}`);
    passos.push(`📏 Tamanho do caminho: ${caminho.length} vértices`);
    passos.push(`🔢 Vértices visitados: ${visitadosOrdem.length}/${vertices.length}`);
    
    passos.push('');
    passos.push('📊 Detalhes do caminho:');
    for (let i = 0; i < caminho.length - 1; i++) {
      const origem = caminho[i];
      const destino = caminho[i + 1];
      const aresta = arestas.find(a => 
        (a.origem === origem && a.destino === destino) ||
        (!orientado && a.origem === destino && a.destino === origem)
      );
      if (aresta) {
        passos.push(`   ${i + 1}. ${origem} → ${destino} (custo: ${aresta.peso})`);
      }
    }

    passos.push('');
    passos.push('🎯 Eficiência do A*:');
    const eficiencia = ((vertices.length - visitadosOrdem.length) / vertices.length * 100).toFixed(1);
    passos.push(`   📈 Vértices não visitados: ${vertices.length - visitadosOrdem.length}/${vertices.length} (${eficiencia}% de economia)`);
  } else {
    passos.push(`❌ Nenhum caminho encontrado entre ${inicioId} e ${fimId}`);
    passos.push(`🔍 Vértices visitados: ${visitadosOrdem.join(', ')}`);
  }

  return {
    caminho,
    custoTotal,
    passos,
    heuristica,
    visitados: visitadosOrdem,
    distancias,
    fScores,
    arestas: arestasCaminho,
    verticesColoridos,
  };
}
