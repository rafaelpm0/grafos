
import './App.css'
import Mapa from './components/mapa'

function App() {

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Visualizador de Grafos
        </h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <Mapa />
      </div>
    </div>
  )
}

export default App
