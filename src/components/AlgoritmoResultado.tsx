import { useState } from 'react';
import type { GrafoData, Aresta } from '../types/grafo';
import type { VerticeColorido } from '../algoritimos/componentes';
import { prim, type PrimResult } from '../algoritimos/prim';
import { buscaEmLargura, type BFResult } from '../algoritimos/bf';
import { buscaEmProfundidade, type DFSResult } from '../algoritimos/dfs';
import {
  encontrarComponentesConexas,
  type ComponentesCaixas,
} from '../algoritimos/componentes';
import ResultadoPrim from './ResultadoPrim';
import ResultadoBFS from './ResultadoBFS';
import ResultadoDFS from './ResultadoDFS';
import ResultadoComponentes from './ResultadoComponentes';

interface AlgoritmoResultadoProps {
  algoritmoSelecionado: string;
  grafoData: GrafoData;
  setArestasSelecionadas: (arestas: Aresta[]) => void;
  setVerticesColoridos: (vertices: VerticeColorido[]) => void;
}

function AlgoritmoResultado({
  algoritmoSelecionado,
  setArestasSelecionadas,
  setVerticesColoridos,
  grafoData,
}: AlgoritmoResultadoProps) {
  const [verticeInicial, setVerticeInicial] = useState<string>('');
  const [resultado, setResultado] = useState<
    PrimResult | BFResult | DFSResult | ComponentesCaixas | null
  >(null);

  const executarAlgoritmo = () => {
    switch (algoritmoSelecionado) {
      case 'prim': {
        if (!verticeInicial.trim()) return;
        const resultadoPrim = prim(grafoData, verticeInicial);
        setArestasSelecionadas(resultadoPrim.arestas);
        console.log('Resultado Prim:', resultadoPrim);
        setResultado(resultadoPrim);
        break;
      }
      case 'bfs': {
        if (!verticeInicial.trim()) return;
        const resultadoBFS = buscaEmLargura(grafoData, verticeInicial);
        setArestasSelecionadas(resultadoBFS.arestas);
        console.log('Resultado BFS:', resultadoBFS);
        setResultado(resultadoBFS);
        break;
      }
      case 'dfs': {
        if (!verticeInicial.trim()) return;
        const resultadoDFS = buscaEmProfundidade(grafoData, verticeInicial);
        setArestasSelecionadas(resultadoDFS.arestas);
        console.log('Resultado DFS:', resultadoDFS);
        setResultado(resultadoDFS);
        break;
      }
      case 'componentes': {
        const resultadoComponentes = encontrarComponentesConexas(grafoData);
        setArestasSelecionadas([]);
        // Se houver vértices coloridos (resultado do Tarjan), aplicá-los
        if (resultadoComponentes.verticesColoridos) {
          setVerticesColoridos(resultadoComponentes.verticesColoridos);
        } else {
          setVerticesColoridos([]);
        }
        console.log('Resultado Componentes:', resultadoComponentes);
        setResultado(resultadoComponentes);
        break;
      }
      default:
        console.log('Algoritmo não implementado ainda');
    }
  };

  const resetarResultado = () => {
    setResultado(null);
    setVerticeInicial('');
    setVerticesColoridos([]); // Reset cores dos vértices
  };

  // Funções auxiliares para verificar tipos
  const isBFSResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas
  ): result is BFResult => {
    return (
      'ordemVisita' in result &&
      'arvoreExpansao' in result &&
      'arestas' in result
    );
  };

  const isDFSResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas
  ): result is DFSResult => {
    return 'tempoDescoberta' in result && 'tempoFinalizacao' in result;
  };

  const isComponentesResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas
  ): result is ComponentesCaixas => {
    return 'componentes' in result && 'totalComponentes' in result;
  };

  if (algoritmoSelecionado === 'nenhum') {
    return null;
  }

  const getBackgroundColor = () => {
    if (!resultado) return 'bg-purple-50';
    if (isBFSResult(resultado)) return 'bg-blue-50';
    if (isDFSResult(resultado)) return 'bg-green-50';
    if (isComponentesResult(resultado)) return 'bg-orange-50';
    return 'bg-purple-50'; // Prim
  };

  const getIconColor = () => {
    if (!resultado) return 'bg-purple-500';
    if (isBFSResult(resultado)) return 'bg-blue-500';
    if (isDFSResult(resultado)) return 'bg-green-500';
    if (isComponentesResult(resultado)) return 'bg-orange-500';
    return 'bg-purple-500'; // Prim
  };

  const getAlgorithmName = () => {
    switch (algoritmoSelecionado) {
      case 'bfs':
        return 'BUSCA EM LARGURA (BFS)';
      case 'dfs':
        return 'BUSCA EM PROFUNDIDADE (DFS)';
      case 'componentes':
        return 'TARJAN (SCC)';
      case 'prim':
        return 'PRIM (AGM)';
      default:
        return algoritmoSelecionado.toUpperCase();
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getBackgroundColor()}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2 ${getIconColor()}`}></span>
        Resultado do Algoritmo: {getAlgorithmName()}
      </h3>

      {/* Controles do algoritmo */}
      <div className="mb-4">
        <div className="flex gap-2 items-end">
          {algoritmoSelecionado !== 'componentes' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vértice inicial:
              </label>
              <select
                value={verticeInicial}
                onChange={e => setVerticeInicial(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 ${
                  algoritmoSelecionado === 'bfs'
                    ? 'focus:ring-blue-500 focus:border-blue-500'
                    : algoritmoSelecionado === 'dfs'
                    ? 'focus:ring-green-500 focus:border-green-500'
                    : 'focus:ring-purple-500 focus:border-purple-500'
                }`}
              >
                <option value="">Selecione um vértice</option>
                {grafoData.vertices.map(vertice => (
                  <option key={vertice.id} value={vertice.id}>
                    {vertice.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={executarAlgoritmo}
            disabled={algoritmoSelecionado !== 'componentes' && !verticeInicial}
            className={`px-4 py-2 text-white rounded-md text-sm focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${
              algoritmoSelecionado === 'bfs'
                ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                : algoritmoSelecionado === 'dfs'
                ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                : algoritmoSelecionado === 'componentes'
                ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
                : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500'
            }`}
          >
            Executar
          </button>
          {resultado && (
            <button
              onClick={resetarResultado}
              className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {resultado && (
        <div>
          {isBFSResult(resultado) ? (
            <ResultadoBFS resultado={resultado} />
          ) : isDFSResult(resultado) ? (
            <ResultadoDFS resultado={resultado} />
          ) : isComponentesResult(resultado) ? (
            <ResultadoComponentes resultado={resultado} grafoOrientado={grafoData.orientado} />
          ) : (
            <ResultadoPrim resultado={resultado as PrimResult} />
          )}
        </div>
      )}
    </div>
  );
}

export default AlgoritmoResultado;
