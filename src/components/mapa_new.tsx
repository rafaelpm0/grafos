import { useState } from 'react';
import type { Aresta, GrafoData } from '../types/grafo';
import type { VerticeColorido } from '../algoritimos/componentes';
import VerticeComponent from './VerticeComponent';
import ArestaComponent from './ArestaComponent';
import GerenciadorVertices from './GerenciadorVertices';
import AlgoritmoResultado from './AlgoritmoResultado';
import { GRAFOS_OPCOES } from '../constants/grafos';

function Mapa() {
  const [draggingVertice, setDraggingVertice] = useState<string | null>(null);
  const [grafoSelecionado, setGrafoSelecionado] = useState<string>('grafo1');
  const [arestasSelecionadas, setArestasSelecionadas] = useState<Aresta[]>([]);
  const [verticesColoridos, setVerticesColoridos] = useState<VerticeColorido[]>([]);
  const [algoritimoSelecionado, setAlgoritimoSelecionado] =
    useState<string>('nenhum');

  // Dados do grafo baseado na seleção
  const [grafoData, setGrafoData] = useState<GrafoData>(GRAFOS_OPCOES[0].data);

  const handleGrafoChange = (novoGrafoId: string) => {
    setGrafoSelecionado(novoGrafoId);
    const novoGrafo = GRAFOS_OPCOES.find(g => g.id === novoGrafoId);
    if (novoGrafo) {
      setGrafoData(novoGrafo.data);
    }
  };

  const handleGrafoUpdate = (novoGrafo: GrafoData) => {
    setGrafoData(novoGrafo);
  };

  const handleVerticePosition = (id: string, x: number, y: number) => {
    setGrafoData(prev => ({
      ...prev,
      vertices: prev.vertices.map(vertice =>
        vertice.id === id ? { ...vertice, x, y } : vertice
      ),
    }));
  };

  const handleDragStart = (id: string) => {
    setDraggingVertice(id);
  };

  const handleDragEnd = () => {
    setDraggingVertice(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* SEÇÃO 1: CONTROLES - Barra superior */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Controles de Algoritmo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="algoritimo-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Algoritmo:
              </label>
              <select
                id="algoritimo-select"
                value={algoritimoSelecionado}
                onChange={e => setAlgoritimoSelecionado(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
              >
                <option value="nenhum">Selecione um algoritmo</option>
                <option value="prim">Prim (AGM)</option>
                <option value="bfs">Busca em Largura (BFS)</option>
                <option value="dfs">Busca em Profundidade (DFS)</option>
                <option value="componentes">Componentes Conexas</option>
                <option value="welshPowell">Welsh-Powell (Coloração)</option>
                <option value="astar">A* (Busca Heurística)</option>
                <option value="hopcroftTarjan">Hopcroft-Tarjan (Pontes e Articulações)</option>
                <option value="planaridade">Verificação de Planaridade</option>
              </select>
            </div>
            
            {/* Controle de Orientação */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Tipo:
              </label>
              <button
                onClick={() => {
                  const novoGrafo = { ...grafoData, orientado: !grafoData.orientado };
                  setGrafoData(novoGrafo);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-[120px] ${
                  grafoData.orientado
                    ? 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                {grafoData.orientado ? 'Orientado' : 'Não-Orientado'}
              </button>
            </div>
          </div>

          {/* Seletor de Grafo */}
          <div className="flex items-center gap-2">
            <label htmlFor="grafo-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Grafo:
            </label>
            <select
              id="grafo-select"
              value={grafoSelecionado}
              onChange={e => handleGrafoChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              {GRAFOS_OPCOES.map(grafo => (
                <option key={grafo.id} value={grafo.id}>
                  {grafo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2 e 3: Layout principal com Mapa e Painéis laterais */}
      <div className="flex-1 flex overflow-hidden">
        {/* Painel Esquerdo: Gerenciador de Vértices */}
        <div className="flex-none bg-white border-r border-gray-200 overflow-y-auto" style={{ width: '320px' }}>
          <div className="p-4">
            <GerenciadorVertices
              grafoData={grafoData}
              onGrafoUpdate={handleGrafoUpdate}
            />
          </div>
        </div>

        {/* SEÇÃO 2: MAPA - Área central */}
        <div className="flex-1 flex flex-col bg-gray-100 min-w-0">
          {/* Área do Grafo */}
          <div className="flex-1 p-4">
            <div className="w-full h-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden relative">
              <svg
                width="100%"
                height="100%"
                className="cursor-default absolute inset-0"
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Renderizar arestas primeiro (para ficarem atrás dos vértices) */}
                {grafoData.arestas.map((aresta, index) => (
                  <ArestaComponent
                    key={`${aresta.origem}-${aresta.destino}-${index}`}
                    aresta={aresta}
                    vertices={grafoData.vertices}
                    arestaColorida={arestasSelecionadas}
                    orientado={grafoData.orientado}
                  />
                ))}

                {/* Renderizar vértices */}
                {grafoData.vertices.map(vertice => (
                  <VerticeComponent
                    key={vertice.id}
                    vertice={vertice}
                    onDrag={handleVerticePosition}
                    isDragging={draggingVertice === vertice.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    verticesColoridos={verticesColoridos}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Informações do Grafo - Barra inferior */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-800">Vértices</div>
                <div className="text-2xl font-bold text-blue-600">{grafoData.vertices.length}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">Arestas</div>
                <div className="text-2xl font-bold text-green-600">{grafoData.arestas.length}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">Tipo</div>
                <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                  grafoData.orientado 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {grafoData.orientado ? 'Orientado' : 'Não-Orientado'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: ALGORITMOS - Painel direito */}
        <div className="flex-none bg-white border-l border-gray-200 overflow-y-auto" style={{ width: '380px' }}>
          <div className="p-4">
            <AlgoritmoResultado
              algoritmoSelecionado={algoritimoSelecionado}
              setArestasSelecionadas={setArestasSelecionadas}
              setVerticesColoridos={setVerticesColoridos}
              grafoData={grafoData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mapa;
