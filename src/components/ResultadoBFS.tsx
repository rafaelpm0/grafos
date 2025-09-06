import type { BFResult } from '../algoritimos/bf';

interface ResultadoBFSProps {
  resultado: BFResult;
}

function ResultadoBFS({ resultado }: ResultadoBFSProps) {
  return (
    <div className="space-y-4">
      {/* Resumo da Busca em Largura */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Resumo da Busca em Largura (BFS):
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Arestas Descobertas:</strong> {resultado.arestas.length}
          </div>
          <div>
            <strong>Peso Total:</strong> {resultado.pesoTotal}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div>
            <strong>Vértices Visitados:</strong> {resultado.ordemVisita.length}
          </div>
          <div>
            <strong>Arestas da Árvore de Busca:</strong>{' '}
            {resultado.arvoreExpansao.length} arestas
          </div>
        </div>
      </div>

      {/* Ordem de Visita dos Vértices */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Ordem de Visita dos Vértices:
        </h4>
        <div className="flex flex-wrap gap-2">
          {resultado.ordemVisita.map((vertice, index) => (
            <div key={index} className="flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                {index + 1}. {vertice}
              </span>
              {index < resultado.ordemVisita.length - 1 && (
                <span className="mx-2 text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arestas Descobertas durante a Busca */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Todas as Arestas Descobertas:
        </h4>
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
            Árvore de Busca (Arestas Utilizadas na Travessia):
          </h4>
          <div className="space-y-1">
            {resultado.arvoreExpansao.map((aresta, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 bg-blue-50 p-2 rounded"
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

      {/* Passos do algoritmo BFS */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Passos da Busca em Largura:
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
  );
}

export default ResultadoBFS;
