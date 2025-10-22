import type { PlanaridadeResult } from '../algoritimos/planaridade';

interface ResultadoPlanarideProps {
  resultado: PlanaridadeResult;
}

function ResultadoPlanaridade({ resultado }: ResultadoPlanarideProps) {
  const { ePlanar, criterioEuler, subgrafosProibidos, grauVertices, passos } = resultado;

  return (
    <div className="space-y-4">
      {/* Resumo do Resultado */}
      <div className={`border rounded-lg p-4 ${ePlanar ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">{ePlanar ? '✅' : '❌'}</span>
          <h4 className={`font-semibold ${ePlanar ? 'text-green-800' : 'text-red-800'}`}>
            {ePlanar ? 'GRAFO PLANAR' : 'GRAFO NÃO-PLANAR'}
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={`font-medium ${ePlanar ? 'text-green-700' : 'text-red-700'}`}>
              Vértices:
            </span>
            <div className={`font-mono text-lg font-bold ${ePlanar ? 'text-green-600' : 'text-red-600'}`}>
              {criterioEuler.vertices}
            </div>
          </div>
          <div>
            <span className={`font-medium ${ePlanar ? 'text-green-700' : 'text-red-700'}`}>
              Arestas:
            </span>
            <div className={`font-mono text-lg font-bold ${ePlanar ? 'text-green-600' : 'text-red-600'}`}>
              {criterioEuler.arestas}
            </div>
          </div>
          <div>
            <span className={`font-medium ${ePlanar ? 'text-green-700' : 'text-red-700'}`}>
              Faces (estimadas):
            </span>
            <div className={`font-mono text-lg font-bold ${ePlanar ? 'text-green-600' : 'text-red-600'}`}>
              {criterioEuler.faces}
            </div>
          </div>
          <div>
            <span className={`font-medium ${ePlanar ? 'text-green-700' : 'text-red-700'}`}>
              Status:
            </span>
            <div className={`text-sm font-medium ${ePlanar ? 'text-green-600' : 'text-red-600'}`}>
              {ePlanar ? 'Pode ser desenhado no plano' : 'Requer espaço 3D'}
            </div>
          </div>
        </div>
      </div>

      {/* Critério de Euler */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📐</span>
          Critério de Euler para Grafos Planares
        </h4>
        
        <div className="space-y-2">
          <div className="text-blue-700">
            <strong>Fórmula:</strong> V - E + F = 2 (para grafos conexos)
          </div>
          <div className="text-blue-700">
            <strong>Limite de arestas:</strong> E ≤ 3V - 6 (para grafos simples)
          </div>
          <div className="bg-blue-100 p-3 rounded font-mono text-center text-lg">
            {criterioEuler.formula}
          </div>
          <div className={`text-center font-medium ${criterioEuler.valido ? 'text-green-600' : 'text-red-600'}`}>
            {criterioEuler.valido ? '✅ Passa no critério de Euler' : '❌ Falha no critério de Euler'}
          </div>
        </div>
      </div>

      {/* Subgrafos Proibidos */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
          <span className="text-xl mr-2">🚫</span>
          Teorema de Kuratowski - Subgrafos Proibidos
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded ${subgrafosProibidos.k5 ? 'bg-red-100' : 'bg-green-100'}`}>
            <div className="font-medium">K₅ (Grafo Completo)</div>
            <div className="text-sm text-gray-600">5 vértices totalmente conectados</div>
            <div className={`font-bold mt-1 ${subgrafosProibidos.k5 ? 'text-red-600' : 'text-green-600'}`}>
              {subgrafosProibidos.k5 ? '❌ Encontrado' : '✅ Não encontrado'}
            </div>
          </div>
          
          <div className={`p-3 rounded ${subgrafosProibidos.k33 ? 'bg-red-100' : 'bg-green-100'}`}>
            <div className="font-medium">K₃,₃ (Bipartido Completo)</div>
            <div className="text-sm text-gray-600">3×3 vértices completamente conectados</div>
            <div className={`font-bold mt-1 ${subgrafosProibidos.k33 ? 'text-red-600' : 'text-green-600'}`}>
              {subgrafosProibidos.k33 ? '❌ Encontrado' : '✅ Não encontrado'}
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-orange-600">
          <strong>Teorema:</strong> Um grafo é planar se e somente se não contém um subgrafo homeomorfo a K₅ ou K₃,₃
        </div>
      </div>

      {/* Grau dos Vértices */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📊</span>
          Grau dos Vértices
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-3 py-2 text-left font-medium text-purple-800">Vértice</th>
                <th className="px-3 py-2 text-left font-medium text-purple-800">Grau</th>
                <th className="px-3 py-2 text-left font-medium text-purple-800">Observação</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grauVertices)
                .sort((a, b) => b[1] - a[1])
                .map(([verticeId, grau]) => (
                  <tr key={verticeId} className="border-b border-purple-100">
                    <td className="px-3 py-2 font-mono font-medium">
                      {verticeId}
                    </td>
                    <td className="px-3 py-2 font-mono text-purple-600">
                      {grau}
                    </td>
                    <td className="px-3 py-2 text-xs text-purple-600">
                      {grau >= 5 ? 'Alto grau' : grau <= 1 ? 'Grau baixo' : 'Normal'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-xs text-purple-600">
          <div className="flex flex-wrap gap-4">
            <div><strong>Grau médio:</strong> {(Object.values(grauVertices).reduce((a, b) => a + b, 0) / Object.keys(grauVertices).length).toFixed(2)}</div>
            <div><strong>Grau máximo:</strong> {Math.max(...Object.values(grauVertices))}</div>
            <div><strong>Grau mínimo:</strong> {Math.min(...Object.values(grauVertices))}</div>
          </div>
        </div>
      </div>

      {/* Definições e Conceitos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📚</span>
          Conceitos de Planaridade
        </h4>
        
        <div className="space-y-2 text-sm text-gray-700">
          <div><strong>Grafo Planar:</strong> Pode ser desenhado no plano sem que suas arestas se cruzem</div>
          <div><strong>Faces:</strong> Regiões delimitadas pelas arestas (incluindo a face externa infinita)</div>
          <div><strong>K₅:</strong> Grafo completo com 5 vértices (10 arestas)</div>
          <div><strong>K₃,₃:</strong> Grafo bipartido completo com 3+3 vértices (9 arestas)</div>
          <div><strong>Homeomorfismo:</strong> Transformação que preserva propriedades topológicas</div>
        </div>
      </div>

      {/* Passos do Algoritmo */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📝</span>
          Passo a Passo da Verificação
        </h4>
        
        <div className="max-h-80 overflow-y-auto">
          <div className="space-y-1">
            {passos.map((passo, index) => (
              <div
                key={index}
                className={`text-sm font-mono leading-relaxed ${
                  passo.includes('===') 
                    ? 'font-bold text-blue-700 border-b border-blue-200 pb-1 mb-2' 
                    : passo.includes('✅') || passo.includes('PLANAR')
                    ? 'text-green-700'
                    : passo.includes('❌') || passo.includes('NÃO')
                    ? 'text-red-600'
                    : passo.includes('⚠️')
                    ? 'text-orange-600'
                    : passo.includes('🔍')
                    ? 'text-purple-700'
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

export default ResultadoPlanaridade;
