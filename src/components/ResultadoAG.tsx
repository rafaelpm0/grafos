import { useState } from 'react';
import type { AGResult } from '../algoritimos/algoritmoGenetico';

interface ResultadoAGProps {
  resultado: AGResult;
}

function ResultadoAG({ resultado }: ResultadoAGProps) {
  const [mostrarPopulacao, setMostrarPopulacao] = useState(false);
  const [quantidadeMostrar, setQuantidadeMostrar] = useState(20);
  
  // Dados para gráfico de convergência (simplificado)
  const melhoriaPercentual = resultado.historicoGeracao.length > 0
    ? ((resultado.historicoGeracao[0].melhorFitness - resultado.custoMelhorRota) / 
       resultado.historicoGeracao[0].melhorFitness * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Resumo Principal */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
        <h4 className="font-bold text-purple-800 mb-3 text-lg flex items-center">
          🏆 Melhor Solução Encontrada
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-600">Custo Total</div>
            <div className="text-2xl font-bold text-purple-600">
              {resultado.custoMelhorRota.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-600">Melhoria Obtida</div>
            <div className="text-2xl font-bold text-green-600">
              {melhoriaPercentual.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Melhor Rota */}
      <div className="bg-white p-4 rounded border">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          🛣️ Rota Ótima Encontrada
        </h4>
        <div className="bg-purple-50 p-3 rounded border border-purple-200">
          <div className="flex flex-wrap items-center gap-2">
            {resultado.melhorRota.map((cidade, index) => (
              <div key={index} className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  index === 0 || index === resultado.melhorRota.length - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 text-white'
                }`}>
                  {cidade}
                </span>
                {index < resultado.melhorRota.length - 1 && (
                  <span className="mx-2 text-purple-600 font-bold">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          ✅ Rota completa visitando todas as cidades e retornando à origem
        </div>
      </div>

      {/* Configuração do AG */}
      <div className="bg-white p-4 rounded border">
        <h4 className="font-medium text-gray-700 mb-3">⚙️ Parâmetros Utilizados</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-semibold">População:</span> {resultado.configuracao.tamanhoPopulacao}
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-semibold">Gerações:</span> {resultado.configuracao.numeroGeracoes}
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-semibold">Taxa Cruzamento:</span> {(resultado.configuracao.taxaCruzamento * 100).toFixed(1)}%
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-semibold">Taxa Mutação:</span> {(resultado.configuracao.taxaMutacao * 100).toFixed(2)}%
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-semibold">Elitismo:</span> {resultado.configuracao.elitismo} indivíduos
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-semibold">Possibilidades:</span> {resultado.totalPossibilidades.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Histórico de Gerações */}
      <div className="bg-white p-4 rounded border">
        <h4 className="font-medium text-gray-700 mb-3">📈 Evolução das Gerações</h4>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">Geração</th>
                <th className="p-2 text-right">Melhor</th>
                <th className="p-2 text-right">Médio</th>
                <th className="p-2 text-right">Pior</th>
              </tr>
            </thead>
            <tbody>
              {resultado.historicoGeracao.map((hist, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-2">{hist.geracao}</td>
                  <td className="p-2 text-right font-semibold text-green-600">
                    {hist.melhorFitness.toFixed(2)}
                  </td>
                  <td className="p-2 text-right text-blue-600">
                    {hist.fitnessMedio.toFixed(2)}
                  </td>
                  <td className="p-2 text-right text-red-600">
                    {hist.piorFitness.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* População Final */}
      <div className="bg-white p-4 rounded border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700">👥 População Final</h4>
          <div className="flex items-center gap-2">
            <select
              value={quantidadeMostrar}
              onChange={(e) => setQuantidadeMostrar(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
              <option value={resultado.populacaoFinal.length}>Todos</option>
            </select>
            <button
              onClick={() => setMostrarPopulacao(!mostrarPopulacao)}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              {mostrarPopulacao ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
        
        {mostrarPopulacao && (
          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {resultado.populacaoFinal.slice(0, quantidadeMostrar).map((ind, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-sm ${
                    idx === 0
                      ? 'bg-green-100 border border-green-300'
                      : idx < 3
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`} 
                      {' '}Indivíduo {idx + 1}
                    </span>
                    <span className={`font-bold ${
                      ind.custoReal === Infinity ? 'text-red-600' : 'text-purple-600'
                    }`}>
                      {ind.custoReal === Infinity ? '∞ (inválida)' : ind.fitness.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {ind.rotaCompleta.join(' → ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Log de Execução */}
      <div className="bg-white p-4 rounded border">
        <h4 className="font-medium text-gray-700 mb-3">📋 Log de Execução</h4>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {resultado.passos.map((passo, index) => (
            <div
              key={index}
              className={`text-sm p-2 rounded ${
                passo.includes('===')
                  ? 'bg-purple-100 text-purple-800 font-semibold'
                  : passo.includes('❌')
                  ? 'bg-red-50 text-red-700'
                  : passo.includes('✅') || passo.includes('🎉')
                  ? 'bg-green-50 text-green-700'
                  : passo.includes('🔄')
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {passo}
            </div>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Sobre o Algoritmo</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Operador PMX:</strong> Cruzamento Parcialmente Mapeado preserva ordem relativa</p>
          <p>• <strong>Elitismo:</strong> Melhores indivíduos sempre passam para próxima geração</p>
          <p>• <strong>Seleção por Torneio:</strong> 3 indivíduos competem, melhor é escolhido</p>
          <p>• <strong>Mutação por Troca:</strong> Duas cidades aleatórias trocam de posição</p>
          <p>• <strong>Rotas Inválidas:</strong> Arestas inexistentes recebem custo infinito</p>
        </div>
      </div>
    </div>
  );
}

export default ResultadoAG;
