import type { GrafoData, Aresta } from '../types/grafo';

export interface PrimResult {
  arestas: Aresta[];
  pesoTotal: number;
  passos: string[];
}

export function prim(grafo: GrafoData, inicio: string): PrimResult {
  const { vertices, arestas } = grafo;

  // Verifica se o vértice inicial existe
  const verticeInicial = vertices.find(v => v.id === inicio);
  if (!verticeInicial) {
    return {
      arestas: [],
      pesoTotal: 0,
      passos: ['Vértice inicial não encontrado'],
    };
  }

  const mst: Aresta[] = [];
  const visitados = new Set<string>();
  const passos: string[] = [];
  let pesoTotal = 0;

  // Adiciona o vértice inicial ao conjunto de visitados
  visitados.add(inicio);
  passos.push(`Iniciando com vértice: ${inicio}`);

  while (visitados.size < vertices.length) {
    let menorAresta: Aresta | null = null;
    let menorPeso = Infinity;

    // Procura a aresta de menor peso que conecta um vértice visitado a um não visitado
    for (const aresta of arestas) {
      const origemVisitada = visitados.has(aresta.origem);
      const destinoVisitado = visitados.has(aresta.destino);

      // A aresta deve conectar um vértice visitado a um não visitado
      if (origemVisitada !== destinoVisitado) {
        if (aresta.peso < menorPeso) {
          menorPeso = aresta.peso;
          menorAresta = aresta;
        }
      }
    }

    // Se não encontrou aresta, o grafo pode estar desconectado
    if (!menorAresta) {
      passos.push('Grafo desconectado - não é possível continuar');
      break;
    }

    // Adiciona a aresta à AGM
    mst.push(menorAresta);
    pesoTotal += menorAresta.peso;

    // Adiciona o novo vértice ao conjunto de visitados
    const novoVertice = visitados.has(menorAresta.origem)
      ? menorAresta.destino
      : menorAresta.origem;

    visitados.add(novoVertice);

    passos.push(
      `Adicionada aresta: ${menorAresta.origem} ↔ ${menorAresta.destino} (peso: ${menorAresta.peso})`
    );
    passos.push(`Vértice ${novoVertice} adicionado à AGM`);
  }

  passos.push(`Árvore Geradora Mínima concluída. Peso total: ${pesoTotal}`);

  return {
    arestas: mst,
    pesoTotal,
    passos,
  };
}
