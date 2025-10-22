import type { ComponentesCaixas } from '../algoritimos/componentes';

interface ResultadoComponentesProps {
  resultado: ComponentesCaixas;
  grafoOrientado: boolean;
}

function ResultadoComponentes({ resultado, grafoOrientado }: ResultadoComponentesProps) {
  // Cores para diferenciar as componentes
  const coresComponentes = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-orange-100 text-orange-800 border-orange-200',
  ];

  return (
    <div className="space-y-4">
      {/* Aviso para grafos não orientados */}
      {!grafoOrientado && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-red-800 font-medium">Tarjan não se aplica</div>
          <div className="text-red-700 text-sm">Requer grafo orientado</div>
        </div>
      )}

      {/* Resumo */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          {grafoOrientado 
            ? 'Resumo das Componentes Fortemente Conexas:'
            : 'Resultado do Algoritmo de Tarjan:'
          }
        </h4>
        {grafoOrientado ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total de Componentes:</strong> {resultado.totalComponentes}
            </div>
            <div>
              <strong>Conectividade:</strong>{' '}
              <span
                className={`font-medium ${
                  resultado.totalComponentes === 1
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}
              >
                {resultado.totalComponentes === 1 ? 'FORTEMENTE CONEXO' : 'NÃO FORTEMENTE CONEXO'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center p-3">
            <div className="text-red-600 font-medium">Não aplicável</div>
            <div className="text-red-700 text-sm">Grafo deve ser orientado</div>
          </div>
        )}
      </div>

      {/* Lista das Componentes - só mostra se há componentes */}
      {resultado.componentes.length > 0 && (
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700 mb-3">
            Componentes Fortemente Conexas Encontradas:
          </h4>
          <div className="space-y-3">
            {resultado.componentes.map((componente, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">
                    Componente {index + 1}:
                  </span>
                </div>
                <div
                  className={`flex-1 p-3 rounded border-2 ${
                    coresComponentes[index % coresComponentes.length]
                  }`}
                >
                  <div className="flex flex-wrap gap-2">
                    {componente.map((vertice, vIndex) => (
                      <span
                        key={vIndex}
                        className="px-2 py-1 bg-white bg-opacity-70 rounded text-sm font-medium"
                      >
                        {vertice}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs opacity-75">
                    {componente.length} vértice
                    {componente.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passos do algoritmo */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">Passos do Algoritmo de Tarjan:</h4>
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

export default ResultadoComponentes;
