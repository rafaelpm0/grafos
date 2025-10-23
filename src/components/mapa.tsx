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
  const [algoritimoSelecionado, setAlgoritimoSelecionado] =
    useState<string>('nenhum');
  const [verticesColoridos, setVerticesColoridos] = useState<VerticeColorido[]>([]);

  // Dados do grafo baseado na seleção
  const [grafoData, setGrafoData] = useState<GrafoData>(GRAFOS_OPCOES[0].data);

  const handleGrafoChange = (novoGrafoId: string) => {
    setGrafoSelecionado(novoGrafoId);
    const novoGrafo = GRAFOS_OPCOES.find(g => g.id === novoGrafoId);
    if (novoGrafo) {
      setGrafoData(novoGrafo.data);
      setArestasSelecionadas([]); // Reset arestas selecionadas
      setVerticesColoridos([]); // Reset cores dos vértices
    }
  };

  const handleAlgoritmoChange = (novoAlgoritmo: string) => {
    setAlgoritimoSelecionado(novoAlgoritmo);
    setArestasSelecionadas([]); // Reset arestas selecionadas quando trocar algoritmo
    setVerticesColoridos([]); // Reset cores dos vértices quando trocar algoritmo
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
    <div className="h-full flex flex-col bg-slate-600 rounded-lg overflow-hidden shadow-lg">
      {/* SEÇÃO 1: CONTROLES - Barra superior */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 rounded-t-lg">
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Seletor de Grafo */}
            <div className="flex items-center gap-3">
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
              
              {/* Controle de Orientação */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Tipo:
                </label>
                <button
                  onClick={() => {
                    const novoGrafo = { ...grafoData, orientado: !grafoData.orientado };
                    setGrafoData(novoGrafo);
                    setArestasSelecionadas([]); // Reset arestas selecionadas
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

            {/* Controles de Algoritmo */}
            <div className="flex items-center gap-2">
              <label htmlFor="algoritimo-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Algoritmo:
              </label>
              <select
                id="algoritimo-select"
                value={algoritimoSelecionado}
                onChange={e => handleAlgoritmoChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
              >
                <option value="nenhum">Selecione um algoritmo</option>
                <option value="prim">Prim (AGM)</option>
                <option value="bfs">Busca em Largura (BFS)</option>
                <option value="dfs">Busca em Profundidade (DFS)</option>
                <option value="componentes">Tarjan (SCC)</option>
                <option value="welshPowell">Welsh-Powell (Coloração)</option>
                <option value="astar">A* (Busca Heurística)</option>
                <option value="hopcroftTarjan">Hopcroft-Tarjan (Pontes e Articulações)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2 e 3: Layout principal com Mapa e Painéis laterais */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Painel Esquerdo: Gerenciador de Vértices */}
        <div className="flex-1 bg-white border-r border-gray-200 overflow-y-auto min-w-0">
          <div className="p-4">
            <GerenciadorVertices
              grafoData={grafoData}
              onGrafoUpdate={handleGrafoUpdate}
            />
          </div>
        </div>

        {/* SEÇÃO 2: MAPA - Área central flexível */}
        <div className="flex-[2] flex flex-col bg-slate-100 min-w-0">
          {/* Área do Grafo */}
          <div className="flex-1 p-4 min-h-0">
            <div className="w-full h-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden relative">
              <svg
                width="100%"
                height="100%"
                className="cursor-default absolute inset-0"
                viewBox="0 0 800 500"
                preserveAspectRatio="xMidYMid meet"
                style={{ background: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}
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
                {grafoData.vertices.map(vertice => {
                  // Buscar cor do vértice se existir nos vértices coloridos
                  const verticeColorido = verticesColoridos.find(v => v.id === vertice.id);
                  return (
                    <VerticeComponent
                      key={vertice.id}
                      vertice={vertice}
                      onDrag={handleVerticePosition}
                      isDragging={draggingVertice === vertice.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      cor={verticeColorido?.cor}
                      verticesColoridos={verticesColoridos}
                    />
                  );
                })}
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

        {/* SEÇÃO 3: ALGORITMOS - Painel direito flexível */}
        <div className="flex-1 bg-white border-l border-gray-200 overflow-y-auto min-w-0 rounded-br-lg">
          <div className="p-4 h-full">
            {algoritimoSelecionado !== 'nenhum' ? (
              <AlgoritmoResultado
                algoritmoSelecionado={algoritimoSelecionado}
                setArestasSelecionadas={setArestasSelecionadas}
                setVerticesColoridos={setVerticesColoridos}
                grafoData={grafoData}
              />
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">Selecione um Algoritmo</h3>
                <p className="text-sm">
                  Escolha um algoritmo na barra superior para visualizar seus resultados aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mapa;
