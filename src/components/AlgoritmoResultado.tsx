import { useState } from 'react';
import type { GrafoData } from '../types/grafo';
import { prim, type PrimResult } from '../algoritimos/prim';

interface AlgoritmoResultadoProps {
  algoritmoSelecionado: string;
  grafoData: GrafoData;
}

function AlgoritmoResultado({
  algoritmoSelecionado,
  grafoData,
}: AlgoritmoResultadoProps) {
  const [verticeInicial, setVerticeInicial] = useState<string>('');
  const [resultado, setResultado] = useState<PrimResult | null>(null);

  const executarAlgoritmo = () => {
    if (!verticeInicial.trim()) return;

    switch (algoritmoSelecionado) {
      case 'prim': {
        const resultadoPrim = prim(grafoData, verticeInicial);
        setResultado(resultadoPrim);
        break;
      }
      default:
        console.log('Algoritmo não implementado ainda');
    }
  };

  const resetarResultado = () => {
    setResultado(null);
    setVerticeInicial('');
  };

  if (algoritmoSelecionado === 'nenhum') {
    return null;
  }

  return (
    <div className="p-4 bg-purple-50 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        Resultado do Algoritmo: {algoritmoSelecionado.toUpperCase()}
      </h3>

      {/* Controles do algoritmo */}
      <div className="mb-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vértice inicial:
            </label>
            <select
              value={verticeInicial}
              onChange={e => setVerticeInicial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Selecione um vértice</option>
              {grafoData.vertices.map(vertice => (
                <option key={vertice.id} value={vertice.id}>
                  {vertice.nome}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={executarAlgoritmo}
            disabled={!verticeInicial}
            className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
        <div className="space-y-4">
          {/* Resumo */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Resumo da MST:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Arestas na MST:</strong> {resultado.mst.length}
              </div>
              <div>
                <strong>Peso Total:</strong> {resultado.pesoTotal}
              </div>
            </div>
          </div>

          {/* Arestas da MST */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">
              Arestas Selecionadas:
            </h4>
            {resultado.mst.length > 0 ? (
              <div className="space-y-1">
                {resultado.mst.map((aresta, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 bg-green-50 p-2 rounded"
                  >
                    <strong>
                      {aresta.origem} ↔ {aresta.destino}
                    </strong>{' '}
                    (peso: {aresta.peso})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Nenhuma aresta encontrada
              </p>
            )}
          </div>

          {/* Passos do algoritmo */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">
              Passos do Algoritmo:
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {resultado.passos.map((passo, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                >
                  <span className="font-mono text-xs text-gray-400 mr-2">
                    {String(index + 1).padStart(2, '0')}:
                  </span>
                  {passo}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlgoritmoResultado;
