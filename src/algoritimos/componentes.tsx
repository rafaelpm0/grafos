import type { GrafoData } from '../types/grafo';

export interface ComponentesCaixas {
  componentes: string[][];
  passos: string[];
  totalComponentes: number;
}

export function encontrarComponentesConexas(
  grafo: GrafoData
): ComponentesCaixas {
  const { vertices, arestas, orientado } = grafo;
  const visitados = new Set<string>();
  const componentes: string[][] = [];
  const passos: string[] = [];

  passos.push('=== INICIANDO BUSCA DE COMPONENTES CONEXAS ===');
  passos.push(`Total de vértices no grafo: ${vertices.length}`);
  passos.push(`Tipo de grafo: ${orientado ? 'Orientado (direcionado)' : 'Não-orientado'}`);
  
  if (orientado) {
    passos.push('Nota: Para grafos orientados, este algoritmo encontra componentes fracamente conexas');
  }

  // Função DFS para explorar uma componente
  const dfsComponente = (verticeAtual: string, componenteAtual: string[]) => {
    visitados.add(verticeAtual);
    componenteAtual.push(verticeAtual);
    passos.push(`  → Adicionado vértice ${verticeAtual} à componente atual`);

    // Encontra o vértice atual no grafo
    const vertice = vertices.find(v => v.id === verticeAtual);
    if (!vertice) return;

    // Para grafos orientados, consideramos conexões em ambas as direções para componentes fracamente conexas
    let vizinhos: string[] = [];
    if (orientado) {
      // Em grafos orientados, para componentes fracamente conexas, consideramos arestas em ambas as direções
      const vizinhosSaida = arestas
        .filter(a => a.origem === verticeAtual)
        .map(a => a.destino);
      const vizinhosEntrada = arestas
        .filter(a => a.destino === verticeAtual)
        .map(a => a.origem);
      
      vizinhos = [...new Set([...vizinhosSaida, ...vizinhosEntrada])];
    } else {
      // Em grafos não-orientados, usa as conexões bidirecionais
      vizinhos = vertice.conexoes;
    }

    // Explora todos os vizinhos não visitados
    for (const vizinhoId of vizinhos) {
      if (!visitados.has(vizinhoId)) {
        passos.push(`    → Explorando vizinho ${vizinhoId} de ${verticeAtual}`);
        dfsComponente(vizinhoId, componenteAtual);
      }
    }
  };

  // Para cada vértice não visitado, inicia uma nova componente
  for (const vertice of vertices) {
    if (!visitados.has(vertice.id)) {
      const novaComponente: string[] = [];
      passos.push(
        `\n--- Nova componente iniciada a partir de ${vertice.id} ---`
      );

      dfsComponente(vertice.id, novaComponente);

      componentes.push(novaComponente);
      const tipoComponente = orientado ? 'Componente fracamente conexa' : 'Componente conexa';
      passos.push(
        `${tipoComponente} ${componentes.length}: {${novaComponente.join(', ')}}`
      );
    }
  }

  passos.push(`\n=== BUSCA CONCLUÍDA ===`);
  
  if (orientado) {
    passos.push(
      `Total de componentes fracamente conexas encontradas: ${componentes.length}`
    );
    
    if (componentes.length === 1) {
      passos.push('O dígrafo é FRACAMENTE CONEXO (possui apenas uma componente fracamente conexa)');
    } else {
      passos.push('O dígrafo é FRACAMENTE DESCONEXO (possui múltiplas componentes fracamente conexas)');
    }
  } else {
    passos.push(
      `Total de componentes conexas encontradas: ${componentes.length}`
    );

    if (componentes.length === 1) {
      passos.push('O grafo é CONEXO (possui apenas uma componente)');
    } else {
      passos.push('O grafo é DESCONEXO (possui múltiplas componentes)');
    }
  }

  return {
    componentes,
    passos,
    totalComponentes: componentes.length,
  };
}
