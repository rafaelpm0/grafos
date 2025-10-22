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
  return tarjanStronglyConnectedComponents(grafo);
}

// Algoritmo de Tarjan para componentes fortemente conexas (grafos orientados)
function tarjanStronglyConnectedComponents(grafo: GrafoData): ComponentesCaixas {
  const { vertices, arestas, orientado } = grafo;
  const n = vertices.length;
  const passos: string[] = [];
  
  // Verificação: Tarjan só funciona em grafos orientados
  if (!orientado) {
    passos.push('Tarjan não se aplica a grafos não-orientados');
    
    return {
      componentes: [],
      passos,
      totalComponentes: 0,
    };
  }
  
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
  console.log('Graph adjacency list:', graph);
  let index = 0;
  const stack: number[] = [];
  const onStack: boolean[] = Array(n).fill(false);
  const indices: number[] = Array(n).fill(-1);
  const lowlink: number[] = Array(n).fill(-1);
  const sccs: number[][] = [];
  
  passos.push('Algoritmo de Tarjan');
  passos.push(`Total de vértices: ${n}`);
  
  function strongConnect(v: number): void {
    const verticeId = vertices[v].id;
    
    // Definir o índice e lowlink do vértice
    indices[v] = lowlink[v] = index;
    index++;
    stack.push(v);
    onStack[v] = true;
    
    passos.push(`Visitando vértice ${verticeId}`);
    passos.push(`Índice: ${indices[v]}, Lowlink: ${lowlink[v]}`);
    passos.push(`Pilha: [${stack.map(i => vertices[i].id).join(', ')}]`);
    
    // Considerar sucessores do vértice v
    for (const w of graph[v]) {
      const vizinhoId = vertices[w].id;
      
      if (indices[w] === -1) {
        // Sucessor w não foi visitado; recursão
        passos.push(`Explorando ${vizinhoId}`);
        strongConnect(w);
        lowlink[v] = Math.min(lowlink[v], lowlink[w]);
        passos.push(`Lowlink de ${verticeId}: ${lowlink[v]}`);
      } else if (onStack[w]) {
        // Sucessor w está na pilha e portanto no SCC atual
        lowlink[v] = Math.min(lowlink[v], indices[w]);
        passos.push(`${vizinhoId} na pilha. Lowlink de ${verticeId}: ${lowlink[v]}`);
      }
    }
    
    // Se v é raiz de um SCC, desempilhar até v
    if (lowlink[v] === indices[v]) {
      passos.push(`${verticeId} é raiz de componente`);
      const scc: number[] = [];
      let w: number;
      
      do {
        w = stack.pop()!;
        onStack[w] = false;
        scc.push(w);
      } while (w !== v);
      
      sccs.push(scc);
      const componenteIds = scc.map(i => vertices[i].id);
      passos.push(`Componente ${sccs.length}: {${componenteIds.join(', ')}}`);
    }
  }
  
  // Executar o algoritmo para todos os vértices não visitados
  for (let v = 0; v < n; v++) {
    if (indices[v] === -1) {
      passos.push(`Iniciando em ${vertices[v].id}`);
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
  
  passos.push('Resultado Final');
  passos.push(`Total de componentes: ${componentes.length}`);
  
  if (componentes.length === 1) {
    passos.push('Grafo é fortemente conexo');
  } else {
    passos.push('Grafo não é fortemente conexo');
  }
  
  return {
    componentes,
    passos,
    totalComponentes: componentes.length,
    verticesColoridos
  };
}
