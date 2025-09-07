
import './App.css'
import Mapa from './components/mapa'

function App() {

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex-none">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Visualizador de Grafos
        </h1>
      </header>
      <div className="flex-1 overflow-hidden min-h-0">
        <Mapa />
      </div>
    </div>
  )
}

export default App
