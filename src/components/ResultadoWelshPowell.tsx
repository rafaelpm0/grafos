import type { ColoracaoResult } from '../algoritimos/welshPowell';

interface ResultadoWelshPowellProps {
  resultado: ColoracaoResult;
}

function ResultadoWelshPowell({ resultado }: ResultadoWelshPowellProps) {
  // Paleta de cores para visualização (mesma do algoritmo)
  const coresVisuais = [
    '#ef4444', // Vermelho - Cor 1
    '#3b82f6', // Azul - Cor 2
    '#10b981', // Verde - Cor 3
    '#f59e0b', // Amarelo - Cor 4
    '#8b5cf6', // Roxo - Cor 5
    '#f97316', // Laranja - Cor 6
    '#06b6d4', // Ciano - Cor 7
    '#84cc16', // Lima - Cor 8
    '#ec4899', // Rosa - Cor 9
    '#6b7280', // Cinza - Cor 10
  ];

  // Agrupa vértices por cor
  const verticesPorCor: { [cor: number]: string[] } = {};
  Object.entries(resultado.cores).forEach(([verticeId, cor]) => {
    if (!verticesPorCor[cor]) {
      verticesPorCor[cor] = [];
    }
    verticesPorCor[cor].push(verticeId);
  });

  return (
    <div className="space-y-4">
      {/* Resumo da Coloração */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Resumo da Coloração Welsh-Powell:
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Número Cromático:</strong> {resultado.totalCores}
          </div>
          <div>
            <strong>Vértices Coloridos:</strong> {Object.keys(resultado.cores).length}
          </div>
        </div>
      </div>

      {/* Coloração por Grupos */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Grupos de Coloração:
        </h4>
        {resultado.totalCores > 0 ? (
          <div className="space-y-2">
            {Array.from({ length: resultado.totalCores }, (_, i) => i + 1).map(cor => (
              <div
                key={cor}
                className="flex items-center gap-2 p-2 rounded"
                style={{ backgroundColor: `${coresVisuais[(cor - 1) % coresVisuais.length]}15` }}
              >
                {/* Círculo colorido */}
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: coresVisuais[(cor - 1) % coresVisuais.length] }}
                ></div>
                <div className="text-sm">
                  <strong>Cor {cor}:</strong> {verticesPorCor[cor]?.join(', ') || 'Nenhum vértice'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Nenhuma coloração realizada
          </p>
        )}
      </div>

      {/* Ordem de Processamento */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Ordem de Processamento (por grau decrescente):
        </h4>
        <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
          {resultado.ordem.length > 0 ? (
            resultado.ordem.join(' → ')
          ) : (
            <span className="italic">Nenhuma ordem definida</span>
          )}
        </div>
      </div>

      {/* Passos do algoritmo Welsh-Powell */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700 mb-2">
          Passos do Algoritmo Welsh-Powell:
        </h4>
        <div className="max-h-60 overflow-y-auto space-y-1">
          {resultado.passos.map((passo, index) => (
            <div
              key={index}
              className={`text-sm p-2 rounded ${
                passo.includes('❌') 
                  ? 'text-red-700 bg-red-50' 
                  : passo.includes('✅') 
                  ? 'text-green-700 bg-green-50'
                  : passo.includes('🎨') || passo.includes('🔴')
                  ? 'text-purple-700 bg-purple-50'
                  : passo.includes('===')
                  ? 'text-blue-700 bg-blue-50 font-medium'
                  : 'text-gray-600 bg-gray-50'
              }`}
            >
              <span className="font-mono text-xs text-gray-400 mr-2">
                {String(index + 1).padStart(2, '0')}:
              </span>
              {passo}
            </div>
          ))}
        </div>
      </div>

      {/* Status da Coloração */}
      {resultado.totalCores > 0 && (
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700 mb-2">
            Status da Coloração:
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              Coloração válida - Nenhum vértice adjacente possui a mesma cor
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            ℹ️ O algoritmo Welsh-Powell é um algoritmo guloso que pode não encontrar sempre a coloração ótima, 
            mas garante uma solução válida.
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultadoWelshPowell;
