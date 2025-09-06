import type { PrimResult } from '../algoritimos/prim';

interface ResultadoPrimProps {
  resultado: PrimResult;
}

function ResultadoPrim({ resultado }: ResultadoPrimProps) {
  return (
    <div className="space-y-4">
      {/* Resumo da AGM */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Resumo da Árvore Geradora Mínima (AGM):
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Arestas na AGM:</strong> {resultado.arestas.length}
          </div>
          <div>
            <strong>Peso Total Mínimo:</strong> {resultado.pesoTotal}
          </div>
        </div>
      </div>

      {/* Arestas da AGM */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Arestas Selecionadas na AGM:
        </h4>
        {resultado.arestas.length > 0 ? (
          <div className="space-y-1">
            {resultado.arestas.map((aresta, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 bg-purple-50 p-2 rounded"
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

      {/* Passos do algoritmo Prim */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Passos do Algoritmo de Prim:
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

export default ResultadoPrim;
