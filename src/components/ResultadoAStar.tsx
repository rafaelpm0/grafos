import type { AStarResult } from '../algoritimos/aStar';

interface ResultadoAStarProps {
  resultado: AStarResult;
}

function ResultadoAStar({ resultado }: ResultadoAStarProps) {
  const { caminho, custoTotal, passos, heuristica, visitados, distancias, fScores } = resultado;

  return (
    <div className="space-y-4">
      {/* Resumo do Resultado */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">🎯</span>
          <h4 className="font-semibold text-orange-800">Resultado A*</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-orange-700">Caminho:</span>
            <div className="text-orange-600 font-mono">
              {caminho.length > 0 ? caminho.join(' → ') : 'Nenhum caminho encontrado'}
            </div>
          </div>
          <div>
            <span className="font-medium text-orange-700">Custo Total:</span>
            <div className="text-orange-600 font-mono text-lg font-bold">
              {custoTotal.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="font-medium text-orange-700">Vértices no Caminho:</span>
            <div className="text-orange-600 font-mono">
              {caminho.length}
            </div>
          </div>
          <div>
            <span className="font-medium text-orange-700">Vértices Visitados:</span>
            <div className="text-orange-600 font-mono">
              {visitados.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Heurística h(n) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📐</span>
          Tabela de Heurística h(n) - Distância de Manhattan até o Destino
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-3 py-2 text-left font-medium text-blue-800">Vértice</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">h(n)</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">g(n)</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">f(n)</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(heuristica)
                .sort((a, b) => fScores[a] - fScores[b])
                .map((verticeId) => {
                  const noCaminho = caminho.includes(verticeId);
                  const visitado = visitados.includes(verticeId);
                  
                  return (
                    <tr 
                      key={verticeId} 
                      className={`border-b border-blue-100 ${
                        noCaminho ? 'bg-green-50' : 
                        visitado ? 'bg-yellow-50' : 
                        'bg-white'
                      }`}
                    >
                      <td className="px-3 py-2 font-mono font-medium">
                        {verticeId}
                        {noCaminho && <span className="ml-2 text-green-600">🎯</span>}
                      </td>
                      <td className="px-3 py-2 font-mono text-blue-600">
                        {heuristica[verticeId].toFixed(2)}
                      </td>
                      <td className="px-3 py-2 font-mono text-purple-600">
                        {distancias[verticeId] === Infinity ? '∞' : distancias[verticeId].toFixed(2)}
                      </td>
                      <td className="px-3 py-2 font-mono text-orange-600 font-medium">
                        {fScores[verticeId] === Infinity ? '∞' : fScores[verticeId].toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {noCaminho ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Caminho
                          </span>
                        ) : visitado ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            Visitado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            Não Visitado
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-xs text-blue-600">
          <div className="flex flex-wrap gap-4">
            <div><strong>h(n):</strong> Heurística (distância de Manhattan)</div>
            <div><strong>g(n):</strong> Custo real do início</div>
            <div><strong>f(n):</strong> Custo estimado total / = g(n) + h(n)</div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {caminho.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
            <span className="text-xl mr-2">📊</span>
            Estatísticas da Busca
          </h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Eficiência:</span>
              <div className="text-green-600">
                {visitados.length}/{Object.keys(heuristica).length} vértices visitados
                ({(100 - (visitados.length / Object.keys(heuristica).length * 100)).toFixed(1)}% economia)
              </div>
            </div>
            <div>
              <span className="font-medium text-green-700">Ordem de Visita:</span>
              <div className="text-green-600 font-mono text-xs">
                {visitados.join(' → ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passos do Algoritmo */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📝</span>
          Passo a Passo do Algoritmo
        </h4>
        
        <div className="max-h-80 overflow-y-auto">
          <div className="space-y-1">
            {passos.map((passo, index) => (
              <div
                key={index}
                className={`text-sm font-mono leading-relaxed ${
                  passo.includes('===') 
                    ? 'font-bold text-orange-700 border-b border-orange-200 pb-1 mb-2' 
                    : passo.includes('Passo')
                    ? 'font-semibold text-blue-700 mt-2'
                    : passo.includes('✅') || passo.includes('🎉')
                    ? 'text-green-700'
                    : passo.includes('❌') || passo.includes('⚠️')
                    ? 'text-red-600'
                    : passo.includes('👑') || passo.includes('⭐')
                    ? 'text-purple-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {passo || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultadoAStar;
