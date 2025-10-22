import type { PontesArticulacoesResult } from '../algoritimos/hopcroftTarjan';

interface ResultadoHopcroftTarjanProps {
  resultado: PontesArticulacoesResult;
}

function ResultadoHopcroftTarjan({ resultado }: ResultadoHopcroftTarjanProps) {
  const { pontes, verticesArticulacao, tempoDescoberta, low, passos } = resultado;

  return (
    <div className="space-y-4">
      {/* Resumo do Resultado */}
      <div className="border rounded-lg p-4 bg-red-50 border-red-200">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">🔍</span>
          <h4 className="font-semibold text-red-800">
            HOPCROFT-TARJAN - PONTES E ARTICULAÇÕES
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-red-700">Pontes encontradas:</span>
            <div className="font-mono text-lg font-bold text-red-600">
              {pontes.length}
            </div>
          </div>
          <div>
            <span className="font-medium text-red-700">Vértices de Articulação:</span>
            <div className="font-mono text-lg font-bold text-red-600">
              {verticesArticulacao.length}
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-red-600">
          <div><strong>Pontes:</strong> Arestas cuja remoção desconecta o grafo</div>
          <div><strong>Articulações:</strong> Vértices cuja remoção desconecta o grafo</div>
        </div>
      </div>

      {/* Pontes Encontradas */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
          <span className="text-xl mr-2">⚡</span>
          Pontes (Arestas Críticas)
        </h4>
        
        {pontes.length > 0 ? (
          <div className="space-y-2">
            {pontes.map((ponte, index) => (
              <div key={index} className="bg-orange-100 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-mono font-bold text-orange-800">
                    {ponte.origem} ↔ {ponte.destino}
                  </div>
                  <div className="text-xs text-orange-600">
                    Peso: {ponte.peso || 'N/A'}
                  </div>
                </div>
                <div className="text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded">
                  Ponte #{index + 1}
                </div>
              </div>
            ))}
            <div className="mt-3 text-xs text-orange-600">
              <strong>⚠️ Atenção:</strong> A remoção de qualquer dessas arestas desconectará o grafo
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-medium text-green-700">Nenhuma ponte encontrada</div>
            <div className="text-xs text-green-600 mt-1">
              O grafo é 2-aresta-conexo (resistente a falhas de arestas)
            </div>
          </div>
        )}
      </div>

      {/* Vértices de Articulação */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
          <span className="text-xl mr-2">🔗</span>
          Vértices de Articulação (Pontos Críticos)
        </h4>
        
        {verticesArticulacao.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {verticesArticulacao.map((vertice, index) => (
                <div key={vertice} className="bg-purple-100 p-3 rounded text-center">
                  <div className="font-mono font-bold text-purple-800">
                    {vertice}
                  </div>
                  <div className="text-xs text-purple-600">
                    Articulação #{index + 1}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Tempo: {tempoDescoberta[vertice]}, Low: {low[vertice]}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-purple-600">
              <strong>⚠️ Atenção:</strong> A remoção de qualquer desses vértices desconectará o grafo
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-medium text-green-700">Nenhum vértice de articulação</div>
            <div className="text-xs text-green-600 mt-1">
              O grafo é 2-vértice-conexo (resistente a falhas de vértices)
            </div>
          </div>
        )}
      </div>

      {/* Tempos de Descoberta e Low */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
          <span className="text-xl mr-2">🕐</span>
          Tempos de Descoberta e Low Values
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-3 py-2 text-left font-medium text-blue-800">Vértice</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">Tempo Descoberta</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">Low Value</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tempoDescoberta)
                .sort((a, b) => a[1] - b[1])
                .map(([vertice, tempo]) => (
                  <tr key={vertice} className="border-b border-blue-100">
                    <td className="px-3 py-2 font-mono font-medium">
                      {vertice}
                    </td>
                    <td className="px-3 py-2 font-mono text-blue-600">
                      {tempo}
                    </td>
                    <td className="px-3 py-2 font-mono text-blue-600">
                      {low[vertice]}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {verticesArticulacao.includes(vertice) ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                          Articulação
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-xs text-blue-600">
          <div><strong>Tempo de Descoberta:</strong> Ordem em que os vértices foram visitados no DFS</div>
          <div><strong>Low Value:</strong> Menor tempo de descoberta alcançável a partir do vértice</div>
        </div>
      </div>

      {/* Análise de Conectividade */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📈</span>
          Análise de Conectividade
        </h4>
        
        <div className="space-y-2 text-sm">
          {pontes.length === 0 && verticesArticulacao.length === 0 ? (
            <div className="bg-green-100 p-3 rounded">
              <div className="flex items-center">
                <span className="text-xl mr-2">✅</span>
                <div>
                  <div className="font-medium text-green-800">Grafo 2-Conexo</div>
                  <div className="text-xs text-green-600">
                    Resistente à remoção de qualquer vértice ou aresta
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {pontes.length > 0 && (
                <div className="bg-yellow-100 p-3 rounded">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    <div>
                      <div className="font-medium text-yellow-800">Vulnerável a Falhas de Arestas</div>
                      <div className="text-xs text-yellow-600">
                        {pontes.length} ponte(s) crítica(s) identificada(s)
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {verticesArticulacao.length > 0 && (
                <div className="bg-red-100 p-3 rounded">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🚨</span>
                    <div>
                      <div className="font-medium text-red-800">Vulnerável a Falhas de Vértices</div>
                      <div className="text-xs text-red-600">
                        {verticesArticulacao.length} ponto(s) de articulação identificado(s)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
                    ? 'font-bold text-blue-700 border-b border-blue-200 pb-1 mb-2' 
                    : passo.includes('🚀')
                    ? 'font-medium text-purple-700'
                    : passo.includes('⚡') || passo.includes('PONTE')
                    ? 'text-orange-600 font-medium'
                    : passo.includes('🔗') || passo.includes('ARTICULAÇÃO')
                    ? 'text-red-600 font-medium'
                    : passo.includes('✅')
                    ? 'text-green-700'
                    : passo.includes('⚠️')
                    ? 'text-yellow-600'
                    : passo.includes('🔍')
                    ? 'text-blue-700'
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

export default ResultadoHopcroftTarjan;
