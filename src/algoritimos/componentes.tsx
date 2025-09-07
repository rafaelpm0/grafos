import type { GrafoData, Vertice } from '../types/grafo';

// Tipo para vértices coloridos (usado apenas no Tarjan)
export interface VerticeColorido extends Vertice {
  cor?: string;
}

export interface ComponentesCaixas {
  componentes: string[][];
  passos: string[];
  totalComponentes: number;
  verticesColoridos?: VerticeColorido[]; // Apenas para Tarjan
}

export function encontrarComponentesConexas(
  grafo: GrafoData
): ComponentesCaixas {
  const { orientado } = grafo;
  
  if (orientado) {
    return tarjanStronglyConnectedComponents(grafo);
  } else {
    return encontrarComponentesSimples(grafo);
  }
}

// Algoritmo de Tarjan para componentes fortemente conexas (grafos orientados)
function tarjanStronglyConnectedComponents(grafo: GrafoData): ComponentesCaixas {
  const { vertices, arestas } = grafo;
  const n = vertices.length;
  const passos: string[] = [];
  
  // Paleta de cores para componentes
  const coresComponentes = [
    '#ef4444', // Vermelho
    '#3b82f6', // Azul
    '#10b981', // Verde
    '#f59e0b', // Amarelo
    '#8b5cf6', // Roxo
    '#f97316', // Laranja
    '#06b6d4', // Ciano
    '#84cc16', // Lima
    '#ec4899', // Rosa
    '#6b7280', // Cinza
  ];
  
  // Criar mapeamento de ID para índice
  const verticeMap = new Map<string, number>();
  vertices.forEach((v, i) => verticeMap.set(v.id, i));
  
  // Criar lista de adjacência
  const graph: number[][] = Array(n).fill(null).map(() => []);
  for (const aresta of arestas) {
    const origemIdx = verticeMap.get(aresta.origem);
    const destinoIdx = verticeMap.get(aresta.destino);
    if (origemIdx !== undefined && destinoIdx !== undefined) {
      graph[origemIdx].push(destinoIdx);
    }
  }
  
  let index = 0;
  const stack: number[] = [];
  const onStack: boolean[] = Array(n).fill(false);
  const indices: number[] = Array(n).fill(-1);
  const lowlink: number[] = Array(n).fill(-1);
  const sccs: number[][] = [];
  
  passos.push('🎯 === ALGORITMO DE TARJAN PARA COMPONENTES FORTEMENTE CONEXAS ===');
  passos.push(`📊 Total de vértices: ${n}`);
  passos.push('🔧 Inicializando estruturas de dados...');
  
  function strongConnect(v: number): void {
    const verticeId = vertices[v].id;
    
    // Definir o índice e lowlink do vértice
    indices[v] = lowlink[v] = index;
    index++;
    stack.push(v);
    onStack[v] = true;
    
    passos.push(`\n🔍 --- Visitando vértice ${verticeId} ---`);
    passos.push(`📈 Índice: ${indices[v]}, Lowlink: ${lowlink[v]}`);
    passos.push(`📚 Adicionado à pilha. Pilha atual: [${stack.map(i => vertices[i].id).join(', ')}]`);
    
    // Considerar sucessores do vértice v
    for (const w of graph[v]) {
      const vizinhoId = vertices[w].id;
      
      if (indices[w] === -1) {
        // Sucessor w não foi visitado; recursão
        passos.push(`  🔄 Explorando sucessor não visitado ${vizinhoId}`);
        strongConnect(w);
        lowlink[v] = Math.min(lowlink[v], lowlink[w]);
        passos.push(`  ⬅️ Retornando de ${vizinhoId}. Lowlink de ${verticeId} atualizado para: ${lowlink[v]}`);
      } else if (onStack[w]) {
        // Sucessor w está na pilha e portanto no SCC atual
        lowlink[v] = Math.min(lowlink[v], indices[w]);
        passos.push(`  🔗 ${vizinhoId} já está na pilha. Lowlink de ${verticeId} atualizado para: ${lowlink[v]}`);
      }
    }
    
    // Se v é raiz de um SCC, desempilhar até v
    if (lowlink[v] === indices[v]) {
      passos.push(`  🎯 ${verticeId} é raiz de uma componente fortemente conexa!`);
      const scc: number[] = [];
      let w: number;
      
      do {
        w = stack.pop()!;
        onStack[w] = false;
        scc.push(w);
        passos.push(`    📤 Removido ${vertices[w].id} da pilha`);
      } while (w !== v);
      
      sccs.push(scc);
      const componenteIds = scc.map(i => vertices[i].id);
      passos.push(`  🎨 Componente fortemente conexa ${sccs.length}: {${componenteIds.join(', ')}}`);
    }
  }
  
  // Executar o algoritmo para todos os vértices não visitados
  for (let v = 0; v < n; v++) {
    if (indices[v] === -1) {
      passos.push(`\n🚀 Iniciando busca a partir do vértice ${vertices[v].id}`);
      strongConnect(v);
    }
  }
  
  // Converter índices de volta para IDs e criar vértices coloridos
  const componentes = sccs.map(scc => 
    scc.map(idx => vertices[idx].id)
  );
  
  const verticesColoridos: VerticeColorido[] = [];
  for (const vertice of vertices) {
    const verticeColorido: VerticeColorido = { ...vertice };
    
    // Encontrar qual componente este vértice pertence
    const componenteIndex = componentes.findIndex(comp => comp.includes(vertice.id));
    if (componenteIndex !== -1) {
      verticeColorido.cor = coresComponentes[componenteIndex % coresComponentes.length];
    } else {
      verticeColorido.cor = '#6b7280'; // Cinza para vértices isolados
    }
    
    verticesColoridos.push(verticeColorido);
  }
  
  passos.push('\n🎉 === RESULTADO FINAL ===');
  passos.push(`🔢 Total de componentes fortemente conexas: ${componentes.length}`);
  
  if (componentes.length === 1) {
    passos.push('✅ O dígrafo é FORTEMENTE CONEXO');
  } else {
    passos.push('❌ O dígrafo NÃO é fortemente conexo');
    
    // Análise adicional
    const maiorComponente = componentes.reduce((maior, atual) => 
      atual.length > maior.length ? atual : maior
    );
    passos.push(`📊 Maior componente tem ${maiorComponente.length} vértices: {${maiorComponente.join(', ')}}`);
    
    // Mostrar cores das componentes
    passos.push('\n🎨 Cores das componentes:');
    componentes.forEach((comp, index) => {
      const cor = coresComponentes[index % coresComponentes.length];
      passos.push(`  Componente ${index + 1}: {${comp.join(', ')}} - Cor: ${cor}`);
    });
  }
  
  return {
    componentes,
    passos,
    totalComponentes: componentes.length,
    verticesColoridos
  };
}

// Algoritmo simples para componentes conexas (grafos não-orientados)
function encontrarComponentesSimples(grafo: GrafoData): ComponentesCaixas {
  const { vertices } = grafo;
  const visitados = new Set<string>();
  const componentes: string[][] = [];
  const passos: string[] = [];

  passos.push('=== BUSCA DE COMPONENTES CONEXAS (GRAFO NÃO-ORIENTADO) ===');
  passos.push(`Total de vértices: ${vertices.length}`);

  // Função DFS para explorar uma componente
  const dfsComponente = (verticeAtual: string, componenteAtual: string[]) => {
    visitados.add(verticeAtual);
    componenteAtual.push(verticeAtual);
    passos.push(`  → Visitando vértice ${verticeAtual}`);

    // Encontra o vértice atual no grafo
    const vertice = vertices.find(v => v.id === verticeAtual);
    if (!vertice) return;

    // Explora todos os vizinhos não visitados
    for (const vizinhoId of vertice.conexoes) {
      if (!visitados.has(vizinhoId)) {
        passos.push(`    → Explorando vizinho ${vizinhoId}`);
        dfsComponente(vizinhoId, componenteAtual);
      }
    }
  };

  // Para cada vértice não visitado, inicia uma nova componente
  for (const vertice of vertices) {
    if (!visitados.has(vertice.id)) {
      const novaComponente: string[] = [];
      passos.push(`\n--- Nova componente iniciada em ${vertice.id} ---`);

      dfsComponente(vertice.id, novaComponente);

      componentes.push(novaComponente);
      passos.push(`Componente ${componentes.length}: {${novaComponente.join(', ')}}`);
    }
  }

  passos.push('\n=== RESULTADO FINAL ===');
  passos.push(`Total de componentes conexas: ${componentes.length}`);

  if (componentes.length === 1) {
    passos.push('O grafo é CONEXO');
  } else {
    passos.push('O grafo é DESCONEXO');
  }

  return {
    componentes,
    passos,
    totalComponentes: componentes.length,
  };
}
