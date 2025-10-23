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
import { welshPowell, type ColoracaoResult } from '../algoritimos/welshPowell';
import { aStar, type AStarResult } from '../algoritimos/aStar';
import { hopcroftTarjanNaoOrientado, type PontesArticulacoesResult } from '../algoritimos/hopcroftTarjan';
import { verificarPlanaridade, type PlanaridadeResult } from '../algoritimos/planaridade';
import ResultadoPlanaridade from './ResultadoPlanaridade';
import ResultadoPrim from './ResultadoPrim';
import ResultadoBFS from './ResultadoBFS';
import ResultadoDFS from './ResultadoDFS';
import ResultadoComponentes from './ResultadoComponentes';
import ResultadoWelshPowell from './ResultadoWelshPowell';
import ResultadoAStar from './ResultadoAStar';
import ResultadoHopcroftTarjan from './ResultadoHopcroftTarjan';

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
  const [verticeFinal, setVerticeFinal] = useState<string>('');
  const [resultado, setResultado] = useState<
    PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult | null
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
      case 'welshPowell': {
        const resultadoColoracao = welshPowell(grafoData);
        setArestasSelecionadas([]);
        // Aplicar cores dos vértices
        if (resultadoColoracao.verticesColoridos) {
          setVerticesColoridos(resultadoColoracao.verticesColoridos);
        } else {
          setVerticesColoridos([]);
        }
        console.log('Resultado Welsh-Powell:', resultadoColoracao);
        setResultado(resultadoColoracao);
        break;
      }
      case 'astar': {
        if (!verticeInicial.trim() || !verticeFinal.trim()) return;
        const resultadoAStar = aStar(grafoData, verticeInicial, verticeFinal);
        // Aplicar arestas do caminho encontrado
        setArestasSelecionadas(resultadoAStar.arestas);
        // Aplicar cores dos vértices
        if (resultadoAStar.verticesColoridos) {
          setVerticesColoridos(resultadoAStar.verticesColoridos);
        } else {
          setVerticesColoridos([]);
        }
        console.log('Resultado A*:', resultadoAStar);
        setResultado(resultadoAStar);
        break;
      }
      case 'hopcroftTarjan': {
        const resultadoHopcroftTarjan = hopcroftTarjanNaoOrientado(grafoData);
        setArestasSelecionadas([]);
        // Aplicar cores dos vértices (vermelho=articulação, verde=normal)
        if (resultadoHopcroftTarjan.verticesColoridos) {
          setVerticesColoridos(resultadoHopcroftTarjan.verticesColoridos);
        } else {
          setVerticesColoridos([]);
        }
        console.log('Resultado Hopcroft-Tarjan:', resultadoHopcroftTarjan);
        setResultado(resultadoHopcroftTarjan);
        break;
      }
      case 'planaridade': {
        const resultadoPlanaridade = verificarPlanaridade(grafoData);
        setArestasSelecionadas([]);
        if (resultadoPlanaridade.verticesColoridos) {
          setVerticesColoridos(resultadoPlanaridade.verticesColoridos);
        } else {
          setVerticesColoridos([]);
        }
        console.log('Resultado Planaridade:', resultadoPlanaridade);
        setResultado(resultadoPlanaridade);
        break;
      }
      default:
        console.log('Algoritmo não implementado ainda');
    }
  };

  const resetarResultado = () => {
    setResultado(null);
    setVerticeInicial('');
    setVerticeFinal('');
    setArestasSelecionadas([]); // Reset arestas selecionadas
    setVerticesColoridos([]); // Reset cores dos vértices
  };

  // Funções auxiliares para verificar tipos
  const isBFSResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is BFResult => {
    return (
      'ordemVisita' in result &&
      'arvoreExpansao' in result &&
      'arestas' in result
    );
  };

  const isDFSResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is DFSResult => {
    return 'tempoDescoberta' in result && 'tempoFinalizacao' in result;
  };

  const isComponentesResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is ComponentesCaixas => {
    return 'componentes' in result && 'totalComponentes' in result;
  };

  const isColoracaoResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is ColoracaoResult => {
    return 'cores' in result && 'totalCores' in result && 'ordem' in result;
  };

  const isAStarResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is AStarResult => {
    return 'caminho' in result && 'heuristica' in result && 'fScores' in result;
  };

  const isHopcroftTarjanResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is PontesArticulacoesResult => {
    return 'pontes' in result && 'verticesArticulacao' in result && 'low' in result;
  };

  const isPlanaridadeResult = (
    result: PrimResult | BFResult | DFSResult | ComponentesCaixas | ColoracaoResult | AStarResult | PontesArticulacoesResult | PlanaridadeResult
  ): result is PlanaridadeResult => {
    return 'ePlanar' in result && 'criterioEuler' in result && 'subgrafosProibidos' in result;
  };

  if (algoritmoSelecionado === 'nenhum') {
    return null;
  }

  const getBackgroundColor = () => {
    if (!resultado) return 'bg-purple-50';
    if (isBFSResult(resultado)) return 'bg-blue-50';
    if (isDFSResult(resultado)) return 'bg-green-50';
    if (isComponentesResult(resultado)) return 'bg-orange-50';
    if (isColoracaoResult(resultado)) return 'bg-pink-50';
    if (isAStarResult(resultado)) return 'bg-yellow-50';
    if (isHopcroftTarjanResult(resultado)) return 'bg-red-50';
    if (isPlanaridadeResult(resultado)) return 'bg-cyan-50';
    return 'bg-purple-50'; // Prim
  };

  const getIconColor = () => {
    if (!resultado) return 'bg-purple-500';
    if (isBFSResult(resultado)) return 'bg-blue-500';
    if (isDFSResult(resultado)) return 'bg-green-500';
    if (isComponentesResult(resultado)) return 'bg-orange-500';
    if (isColoracaoResult(resultado)) return 'bg-pink-500';
    if (isAStarResult(resultado)) return 'bg-yellow-500';
    if (isHopcroftTarjanResult(resultado)) return 'bg-red-500';
    if (isPlanaridadeResult(resultado)) return 'bg-cyan-500';
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
      case 'welshPowell':
        return 'WELSH-POWELL (COLORAÇÃO)';
      case 'astar':
        return 'A* (BUSCA HEURÍSTICA)';
      case 'hopcroftTarjan':
        return 'HOPCROFT-TARJAN (PONTES E ARTICULAÇÕES)';
      case 'planaridade':
        return 'VERIFICAÇÃO DE PLANARIDADE';
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
          {algoritmoSelecionado !== 'componentes' && algoritmoSelecionado !== 'welshPowell' && algoritmoSelecionado !== 'hopcroftTarjan' && algoritmoSelecionado !== 'planaridade' && (
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
                    : algoritmoSelecionado === 'astar'
                    ? 'focus:ring-yellow-500 focus:border-yellow-500'
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
          {algoritmoSelecionado === 'astar' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vértice destino:
              </label>
              <select
                value={verticeFinal}
                onChange={e => setVerticeFinal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
            disabled={
              (algoritmoSelecionado !== 'componentes' && algoritmoSelecionado !== 'welshPowell' && algoritmoSelecionado !== 'hopcroftTarjan' && algoritmoSelecionado !== 'planaridade' && !verticeInicial) ||
              (algoritmoSelecionado === 'astar' && (!verticeInicial || !verticeFinal))
            }
            className={`px-4 py-2 text-white rounded-md text-sm focus:outline-none focus:ring-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${
              algoritmoSelecionado === 'bfs'
                ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                : algoritmoSelecionado === 'dfs'
                ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                : algoritmoSelecionado === 'componentes'
                ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
                : algoritmoSelecionado === 'welshPowell'
                ? 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-500'
                : algoritmoSelecionado === 'astar'
                ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
                : algoritmoSelecionado === 'hopcroftTarjan'
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
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
          ) : isColoracaoResult(resultado) ? (
            <ResultadoWelshPowell resultado={resultado} />
          ) : isAStarResult(resultado) ? (
            <ResultadoAStar resultado={resultado} />
          ) : isHopcroftTarjanResult(resultado) ? (
            <ResultadoHopcroftTarjan resultado={resultado} />
          ) : isPlanaridadeResult(resultado) ? (
            <ResultadoPlanaridade resultado={resultado} />
          ) : (
            <ResultadoPrim resultado={resultado as PrimResult} />
          )}
        </div>
      )}
    </div>
  );
}

export default AlgoritmoResultado;
