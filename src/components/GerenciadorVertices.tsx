import { useState } from 'react';
import type { Vertice, Aresta, GrafoData } from '../types/grafo';

interface GerenciadorVerticesProps {
  grafoData: GrafoData;
  onGrafoUpdate: (novoGrafo: GrafoData) => void;
}

function GerenciadorVertices({ grafoData, onGrafoUpdate }: GerenciadorVerticesProps) {
  const [nomeVertice, setNomeVertice] = useState('');
  const [verticeDestino, setVerticeDestino] = useState('');
  const [pesoConexao, setPesoConexao] = useState<number>(1);
  const [verticeSelecionado, setVerticeSelecionado] = useState<string>('');

  const adicionarVertice = () => {
    if (!nomeVertice.trim()) return;

    const novoVertice: Vertice = {
      id: nomeVertice,
      nome: nomeVertice,
      x: Math.random() * 400 + 100, // Posição aleatória
      y: Math.random() * 300 + 100,
      conexoes: []
    };

    const novoGrafo: GrafoData = {
      ...grafoData,
      vertices: [...grafoData.vertices, novoVertice]
    };

    onGrafoUpdate(novoGrafo);
    setNomeVertice('');
  };

  const removerVertice = (verticeId: string) => {
    // Remove o vértice
    const novosVertices = grafoData.vertices.filter(v => v.id !== verticeId);
    
    // Remove as arestas que conectam a este vértice
    const novasArestas = grafoData.arestas.filter(
      a => a.origem !== verticeId && a.destino !== verticeId
    );

    // Remove as conexões dos outros vértices
    const verticesAtualizados = novosVertices.map(v => ({
      ...v,
      conexoes: v.conexoes.filter(conexao => conexao !== verticeId)
    }));

    const novoGrafo: GrafoData = {
      vertices: verticesAtualizados,
      arestas: novasArestas
    };

    onGrafoUpdate(novoGrafo);
  };

  const adicionarConexao = () => {
    if (!verticeSelecionado || !verticeDestino.trim()) return;

    const verticeDestinoObj = grafoData.vertices.find(v => v.id === verticeDestino);
    if (!verticeDestinoObj) return;

    // Verifica se a conexão já existe
    const verticeOrigem = grafoData.vertices.find(v => v.id === verticeSelecionado);
    if (verticeOrigem?.conexoes.includes(verticeDestino)) return;

    // Atualiza as conexões dos vértices
    const verticesAtualizados = grafoData.vertices.map(v => {
      if (v.id === verticeSelecionado) {
        return { ...v, conexoes: [...v.conexoes, verticeDestino] };
      }
      if (v.id === verticeDestino) {
        return { ...v, conexoes: [...v.conexoes, verticeSelecionado] };
      }
      return v;
    });

    // Adiciona a aresta com o peso especificado
    const novaAresta: Aresta = {
      origem: verticeSelecionado,
      destino: verticeDestino,
      peso: pesoConexao
    };

    const novoGrafo: GrafoData = {
      vertices: verticesAtualizados,
      arestas: [...grafoData.arestas, novaAresta]
    };

    onGrafoUpdate(novoGrafo);
    setVerticeDestino('');
    setPesoConexao(1);
  };

  const removerConexao = (origem: string, destino: string) => {
    // Remove a aresta correspondente
    const novasArestas = grafoData.arestas.filter(
      a => !(a.origem === origem && a.destino === destino) && 
           !(a.origem === destino && a.destino === origem)
    );

    // Remove as conexões dos vértices
    const verticesAtualizados = grafoData.vertices.map(v => {
      if (v.id === origem) {
        return { ...v, conexoes: v.conexoes.filter(conexao => conexao !== destino) };
      }
      if (v.id === destino) {
        return { ...v, conexoes: v.conexoes.filter(conexao => conexao !== origem) };
      }
      return v;
    });

    const novoGrafo: GrafoData = {
      vertices: verticesAtualizados,
      arestas: novasArestas
    };

    onGrafoUpdate(novoGrafo);
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md space-y-6">
      <h3 className="font-semibold text-gray-800 text-lg">Gerenciar Vértices</h3>
      
      {/* Lista de Vértices para Remover */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Remover Vértices
        </h4>
        {grafoData.vertices.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {grafoData.vertices.map(vertice => (
              <div key={vertice.id} className="flex justify-between items-center bg-white p-2 rounded border">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{vertice.nome}</span>
                  <span className="text-xs text-gray-500">
                    Conexões: {vertice.conexoes.length > 0 ? vertice.conexoes.join(', ') : 'Nenhuma'}
                  </span>
                </div>
                <button
                  onClick={() => removerVertice(vertice.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhum vértice disponível</p>
        )}
      </div>

      {/* Adicionar Novo Vértice */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Adicionar Vértice
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={nomeVertice}
            onChange={(e) => setNomeVertice(e.target.value)}
            placeholder="Nome do vértice (ex: F, G, H...)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={adicionarVertice}
            disabled={!nomeVertice.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Adicionar Conexão */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Adicionar Conexão
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vértice de origem:
            </label>
            <select
              value={verticeSelecionado}
              onChange={(e) => setVerticeSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione um vértice</option>
              {grafoData.vertices.map(vertice => (
                <option key={vertice.id} value={vertice.id}>
                  {vertice.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Conectar ao vértice:
              </label>
              <select
                value={verticeDestino}
                onChange={(e) => setVerticeDestino(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Selecione um vértice</option>
                {grafoData.vertices
                  .filter(vertice => vertice.id !== verticeSelecionado)
                  .map(vertice => (
                    <option key={vertice.id} value={vertice.id}>
                      {vertice.nome}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Peso da aresta:
              </label>
              <input
                type="number"
                value={pesoConexao}
                onChange={(e) => setPesoConexao(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <button
            onClick={adicionarConexao}
            disabled={!verticeSelecionado || !verticeDestino}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Criar Conexão
          </button>
        </div>
      </div>

      {/* Remover Conexão */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
          Remover Conexão
        </h4>
        {grafoData.arestas.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {grafoData.arestas.map((aresta, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {aresta.origem} ↔ {aresta.destino}
                  </span>
                  <span className="text-xs text-gray-500">
                    Peso: {aresta.peso}
                  </span>
                </div>
                <button
                  onClick={() => removerConexao(aresta.origem, aresta.destino)}
                  className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhuma conexão disponível</p>
        )}
      </div>
    </div>
  );
}

export default GerenciadorVertices;
