import { useState } from 'react';
import type { GrafoData } from '../types/grafo';
import VerticeComponent from './VerticeComponent';
import ArestaComponent from './ArestaComponent';
import GerenciadorVertices from './GerenciadorVertices';
import AlgoritmoResultado from './AlgoritmoResultado';
import { GRAFOS_OPCOES } from '../constants/grafos';

function Mapa() {
  const [draggingVertice, setDraggingVertice] = useState<string | null>(null);
  const [grafoSelecionado, setGrafoSelecionado] = useState<string>('grafo1');
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
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
      {/* Painel lateral com gerenciador */}
      <div className="lg:w-1/3 space-y-4">
        {/* Gerenciador de Vértices */}
        <GerenciadorVertices
          grafoData={grafoData}
          onGrafoUpdate={handleGrafoUpdate}
        />
      </div>

      {/* Área do grafo e informações */}
      <div className="lg:w-2/3 space-y-4">
        {/* Controles do algoritimo */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="algoritimo-select"
              className="text-sm font-medium text-gray-700"
            >
              Escolher algoritimo:
            </label>
            <select
              id="algoritimo-select"
              value={algoritimoSelecionado}
              onChange={e => setAlgoritimoSelecionado(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nenhum">Selecione um algoritmo</option>
              <option value="prim">Prim (MST)</option>
              <option value="dijkstra">Dijkstra (em breve)</option>
              <option value="kruskal">Kruskal (em breve)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="grafo-select"
              className="text-sm font-medium text-gray-700"
            >
              Escolher Grafo:
            </label>
            <select
              id="grafo-select"
              value={grafoSelecionado}
              onChange={e => handleGrafoChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {GRAFOS_OPCOES.map(grafo => (
                <option key={grafo.id} value={grafo.id}>
                  {grafo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Área do grafo */}
        <div className="w-full h-[60vh] bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <svg
            width="100%"
            height="100%"
            className="cursor-default"
            style={{ minHeight: '400px' }}
          >
            {/* Renderizar arestas primeiro (para ficarem atrás dos vértices) */}
            {grafoData.arestas.map((aresta, index) => (
              <ArestaComponent
                key={`${aresta.origem}-${aresta.destino}-${index}`}
                aresta={aresta}
                vertices={grafoData.vertices}
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
              />
            ))}
          </svg>
        </div>

        {/* Informações sobre o grafo - movidas para baixo */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">
            Informações do Grafo:
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
            <div>
              <strong>Vértices:</strong> {grafoData.vertices.length}
            </div>
            <div>
              <strong>Arestas:</strong> {grafoData.arestas.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vértices e suas conexões */}
            <div>
              <strong className="text-gray-800">Vértices e Conexões:</strong>
              <div className="mt-1 space-y-1">
                {grafoData.vertices.map(vertice => (
                  <div key={vertice.id} className="text-sm text-gray-600">
                    <strong>{vertice.nome}:</strong> conectado a [
                    {vertice.conexoes.join(', ')}]
                  </div>
                ))}
              </div>
            </div>

            {/* Arestas e seus pesos */}
            <div>
              <strong className="text-gray-800">Arestas e Pesos:</strong>
              <div className="mt-1 space-y-1">
                {grafoData.arestas.map((aresta, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <strong>
                      {aresta.origem} ↔ {aresta.destino}:
                    </strong>{' '}
                    peso {aresta.peso}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resultado do Algoritmo */}
        <AlgoritmoResultado
          algoritmoSelecionado={algoritimoSelecionado}
          grafoData={grafoData}
        />
      </div>
    </div>
  );
}

export default Mapa;
