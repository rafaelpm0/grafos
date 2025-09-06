import type { DFSResult } from '../algoritimos/dfs';

interface ResultadoDFSProps {
  resultado: DFSResult;
}

function ResultadoDFS({ resultado }: ResultadoDFSProps) {
  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Resumo da Busca em Profundidade:
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Arestas Descobertas:</strong> {resultado.arestas.length}
          </div>
          <div>
            <strong>Peso Total:</strong> {resultado.pesoTotal}
          </div>
          <div>
            <strong>Vértices Visitados:</strong> {resultado.ordemVisita.length}
          </div>
          <div>
            <strong>Arestas da Árvore:</strong>{' '}
            {resultado.arvoreExpansao.length} arestas
          </div>
        </div>
      </div>

      {/* Ordem de Visita */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Ordem de Visita dos Vértices:
        </h4>
        <div className="flex flex-wrap gap-2">
          {resultado.ordemVisita.map((vertice, index) => (
            <div key={index} className="flex items-center">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                {index + 1}. {vertice}
              </span>
              {index < resultado.ordemVisita.length - 1 && (
                <span className="mx-2 text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tempos de Descoberta e Finalização */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Tempos de Descoberta e Finalização:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong className="text-gray-700 block mb-1">Descoberta:</strong>
            <div className="space-y-1">
              {Object.entries(resultado.tempoDescoberta).map(
                ([vertice, tempo]) => (
                  <div key={vertice} className="text-sm bg-blue-50 p-2 rounded">
                    <strong>{vertice}:</strong> {tempo}
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <strong className="text-gray-700 block mb-1">Finalização:</strong>
            <div className="space-y-1">
              {Object.entries(resultado.tempoFinalizacao).map(
                ([vertice, tempo]) => (
                  <div key={vertice} className="text-sm bg-red-50 p-2 rounded">
                    <strong>{vertice}:</strong> {tempo}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arestas Descobertas */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">Arestas Descobertas:</h4>
        {resultado.arestas.length > 0 ? (
          <div className="space-y-1">
            {resultado.arestas.map((aresta, index) => (
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

      {/* Árvore de Busca */}
      {resultado.arvoreExpansao.length > 0 && (
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700 mb-2">
            Árvore de Busca (Arestas da Árvore):
          </h4>
          <div className="space-y-1">
            {resultado.arvoreExpansao.map((aresta, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 bg-green-100 p-2 rounded"
              >
                <strong>
                  {aresta.origem} ↔ {aresta.destino}
                </strong>{' '}
                (peso: {aresta.peso})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passos do algoritmo */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">Passos do Algoritmo:</h4>
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
  );
}

export default ResultadoDFS;
