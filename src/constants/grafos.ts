import type { GrafoData } from '../types/grafo';

export const GRAFOS_OPCOES = [
  {
    id: 'prim',
    nome: '🌲 Prim - Rede de Cidades (AGM)',
    data: {
      orientado: false,
      vertices: [
        { id: 'SP', nome: 'SP', x: 250, y: 150, conexoes: ['RJ', 'BH', 'PR', 'GO'] },
        { id: 'RJ', nome: 'RJ', x: 400, y: 180, conexoes: ['SP', 'BH', 'ES'] },
        { id: 'BH', nome: 'BH', x: 350, y: 120, conexoes: ['SP', 'RJ', 'GO', 'ES'] },
        { id: 'PR', nome: 'PR', x: 200, y: 250, conexoes: ['SP', 'SC', 'GO'] },
        { id: 'SC', nome: 'SC', x: 150, y: 320, conexoes: ['PR', 'RS'] },
        { id: 'RS', nome: 'RS', x: 100, y: 380, conexoes: ['SC'] },
        { id: 'GO', nome: 'GO', x: 300, y: 80, conexoes: ['SP', 'BH', 'PR', 'DF'] },
        { id: 'DF', nome: 'DF', x: 380, y: 60, conexoes: ['GO', 'ES'] },
        { id: 'ES', nome: 'ES', x: 450, y: 140, conexoes: ['RJ', 'BH', 'DF'] },
      ],
      arestas: [
        { origem: 'SP', destino: 'RJ', peso: 430 },
        { origem: 'SP', destino: 'BH', peso: 580 },
        { origem: 'SP', destino: 'PR', peso: 410 },
        { origem: 'SP', destino: 'GO', peso: 920 },
        { origem: 'RJ', destino: 'BH', peso: 440 },
        { origem: 'RJ', destino: 'ES', peso: 520 },
        { origem: 'BH', destino: 'GO', peso: 740 },
        { origem: 'BH', destino: 'ES', peso: 470 },
        { origem: 'PR', destino: 'SC', peso: 300 },
        { origem: 'PR', destino: 'GO', peso: 860 },
        { origem: 'SC', destino: 'RS', peso: 460 },
        { origem: 'GO', destino: 'DF', peso: 210 },
        { origem: 'DF', destino: 'ES', peso: 1270 },
      ]
    } as GrafoData
  },
  {
    id: 'bfs',
    nome: '🔍 BFS - Labirinto (Busca em Largura)',
    data: {
      orientado: false,
      vertices: [
        // Entrada
        { id: 'Start', nome: 'Start', x: 80, y: 100, conexoes: ['A', 'D'] },
        
        // Camadas do labirinto
        { id: 'A', nome: 'A', x: 180, y: 80, conexoes: ['Start', 'B', 'E'] },
        { id: 'B', nome: 'B', x: 280, y: 100, conexoes: ['A', 'C', 'F'] },
        { id: 'C', nome: 'C', x: 380, y: 80, conexoes: ['B', 'G'] },
        
        { id: 'D', nome: 'D', x: 120, y: 180, conexoes: ['Start', 'E', 'H'] },
        { id: 'E', nome: 'E', x: 220, y: 160, conexoes: ['A', 'D', 'F', 'I'] },
        { id: 'F', nome: 'F', x: 320, y: 180, conexoes: ['B', 'E', 'G', 'J'] },
        { id: 'G', nome: 'G', x: 420, y: 160, conexoes: ['C', 'F', 'Exit'] },
        
        { id: 'H', nome: 'H', x: 160, y: 260, conexoes: ['D', 'I'] },
        { id: 'I', nome: 'I', x: 260, y: 240, conexoes: ['E', 'H', 'J'] },
        { id: 'J', nome: 'J', x: 360, y: 260, conexoes: ['F', 'I', 'Exit'] },
        
        // Saída
        { id: 'Exit', nome: 'Exit', x: 480, y: 240, conexoes: ['G', 'J'] },
      ],
      arestas: [
        { origem: 'Start', destino: 'A', peso: 1 },
        { origem: 'Start', destino: 'D', peso: 1 },
        { origem: 'A', destino: 'B', peso: 1 },
        { origem: 'A', destino: 'E', peso: 1 },
        { origem: 'B', destino: 'C', peso: 1 },
        { origem: 'B', destino: 'F', peso: 1 },
        { origem: 'C', destino: 'G', peso: 1 },
        { origem: 'D', destino: 'E', peso: 1 },
        { origem: 'D', destino: 'H', peso: 1 },
        { origem: 'E', destino: 'F', peso: 1 },
        { origem: 'E', destino: 'I', peso: 1 },
        { origem: 'F', destino: 'G', peso: 1 },
        { origem: 'F', destino: 'J', peso: 1 },
        { origem: 'G', destino: 'Exit', peso: 1 },
        { origem: 'H', destino: 'I', peso: 1 },
        { origem: 'I', destino: 'J', peso: 1 },
        { origem: 'J', destino: 'Exit', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'dfs',
    nome: '🌊 DFS - Árvore Genealógica (Busca em Profundidade)',
    data: {
      orientado: false,
      vertices: [
        // Bisavós
        { id: 'Bisavo', nome: 'Bisavô', x: 300, y: 50, conexoes: ['AvoP', 'AvoM'] },
        
        // Avós
        { id: 'AvoP', nome: 'Avô P', x: 200, y: 120, conexoes: ['Bisavo', 'Pai', 'TioP'] },
        { id: 'AvoM', nome: 'Avô M', x: 400, y: 120, conexoes: ['Bisavo', 'Mae', 'TiaM'] },
        
        // Pais e Tios
        { id: 'Pai', nome: 'Pai', x: 150, y: 190, conexoes: ['AvoP', 'Voce', 'Irmao'] },
        { id: 'Mae', nome: 'Mãe', x: 350, y: 190, conexoes: ['AvoM', 'Voce', 'Irma'] },
        { id: 'TioP', nome: 'Tio P', x: 100, y: 160, conexoes: ['AvoP', 'PrimoP'] },
        { id: 'TiaM', nome: 'Tia M', x: 450, y: 160, conexoes: ['AvoM', 'PrimaM'] },
        
        // Você e Irmãos
        { id: 'Voce', nome: 'Você', x: 250, y: 260, conexoes: ['Pai', 'Mae', 'Filho'] },
        { id: 'Irmao', nome: 'Irmão', x: 180, y: 290, conexoes: ['Pai', 'Neto1'] },
        { id: 'Irma', nome: 'Irmã', x: 320, y: 290, conexoes: ['Mae', 'Neta'] },
        
        // Primos
        { id: 'PrimoP', nome: 'Primo P', x: 80, y: 230, conexoes: ['TioP'] },
        { id: 'PrimaM', nome: 'Prima M', x: 470, y: 230, conexoes: ['TiaM'] },
        
        // Filhos
        { id: 'Filho', nome: 'Filho', x: 250, y: 330, conexoes: ['Voce'] },
        { id: 'Neto1', nome: 'Neto 1', x: 180, y: 360, conexoes: ['Irmao'] },
        { id: 'Neta', nome: 'Neta', x: 320, y: 360, conexoes: ['Irma'] },
      ],
      arestas: [
        { origem: 'Bisavo', destino: 'AvoP', peso: 1 },
        { origem: 'Bisavo', destino: 'AvoM', peso: 1 },
        { origem: 'AvoP', destino: 'Pai', peso: 1 },
        { origem: 'AvoP', destino: 'TioP', peso: 1 },
        { origem: 'AvoM', destino: 'Mae', peso: 1 },
        { origem: 'AvoM', destino: 'TiaM', peso: 1 },
        { origem: 'Pai', destino: 'Voce', peso: 1 },
        { origem: 'Pai', destino: 'Irmao', peso: 1 },
        { origem: 'Mae', destino: 'Voce', peso: 1 },
        { origem: 'Mae', destino: 'Irma', peso: 1 },
        { origem: 'TioP', destino: 'PrimoP', peso: 1 },
        { origem: 'TiaM', destino: 'PrimaM', peso: 1 },
        { origem: 'Voce', destino: 'Filho', peso: 1 },
        { origem: 'Irmao', destino: 'Neto1', peso: 1 },
        { origem: 'Irma', destino: 'Neta', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'tarjan',
    nome: '🎯 Tarjan - Rede Social (Componentes Fortemente Conexas)',
    data: {
      orientado: true,
      vertices: [
        // Grupo 1 - Fortemente conectado
        { id: 'Ana', nome: 'Ana', x: 150, y: 100, conexoes: ['Bruno', 'Carlos'] },
        { id: 'Bruno', nome: 'Bruno', x: 250, y: 80, conexoes: ['Carlos'] },
        { id: 'Carlos', nome: 'Carlos', x: 200, y: 160, conexoes: ['Ana'] },
        
        // Grupo 2 - Fortemente conectado
        { id: 'Diana', nome: 'Diana', x: 400, y: 100, conexoes: ['Eva', 'Felipe'] },
        { id: 'Eva', nome: 'Eva', x: 500, y: 80, conexoes: ['Felipe'] },
        { id: 'Felipe', nome: 'Felipe', x: 450, y: 160, conexoes: ['Diana'] },
        
        // Grupo 3 - Conexão entre grupos
        { id: 'Gabriel', nome: 'Gabriel', x: 320, y: 200, conexoes: ['Helena'] },
        { id: 'Helena', nome: 'Helena', x: 380, y: 250, conexoes: ['Igor'] },
        { id: 'Igor', nome: 'Igor', x: 320, y: 280, conexoes: ['Gabriel'] },
        
        // Vértices de ligação
        { id: 'João', nome: 'João', x: 280, y: 120, conexoes: ['Diana', 'Gabriel'] },
        { id: 'Kelly', nome: 'Kelly', x: 180, y: 220, conexoes: ['Gabriel'] },
        { id: 'Lucas', nome: 'Lucas', x: 480, y: 200, conexoes: [] },
      ],
      arestas: [
        // Grupo 1 (SCC)
        { origem: 'Ana', destino: 'Bruno', peso: 1 },
        { origem: 'Bruno', destino: 'Carlos', peso: 1 },
        { origem: 'Carlos', destino: 'Ana', peso: 1 },
        { origem: 'Ana', destino: 'Carlos', peso: 1 },
        
        // Grupo 2 (SCC)
        { origem: 'Diana', destino: 'Eva', peso: 1 },
        { origem: 'Eva', destino: 'Felipe', peso: 1 },
        { origem: 'Felipe', destino: 'Diana', peso: 1 },
        { origem: 'Diana', destino: 'Felipe', peso: 1 },
        
        // Grupo 3 (SCC)
        { origem: 'Gabriel', destino: 'Helena', peso: 1 },
        { origem: 'Helena', destino: 'Igor', peso: 1 },
        { origem: 'Igor', destino: 'Gabriel', peso: 1 },
        
        // Conexões entre grupos
        { origem: 'Carlos', destino: 'João', peso: 1 },
        { origem: 'João', destino: 'Diana', peso: 1 },
        { origem: 'João', destino: 'Gabriel', peso: 1 },
        { origem: 'Ana', destino: 'Kelly', peso: 1 },
        { origem: 'Kelly', destino: 'Gabriel', peso: 1 },
        { origem: 'Eva', destino: 'Lucas', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'componentes',
    nome: '🧩 Componentes - Ilhas Desconectadas',
    data: {
      orientado: false,
      vertices: [
        // Ilha 1 - Triângulo
        { id: 'I1A', nome: 'I1A', x: 120, y: 100, conexoes: ['I1B', 'I1C'] },
        { id: 'I1B', nome: 'I1B', x: 200, y: 80, conexoes: ['I1A', 'I1C'] },
        { id: 'I1C', nome: 'I1C', x: 160, y: 160, conexoes: ['I1A', 'I1B'] },
        
        // Ilha 2 - Linha
        { id: 'I2A', nome: 'I2A', x: 300, y: 100, conexoes: ['I2B'] },
        { id: 'I2B', nome: 'I2B', x: 380, y: 100, conexoes: ['I2A', 'I2C'] },
        { id: 'I2C', nome: 'I2C', x: 460, y: 100, conexoes: ['I2B'] },
        
        // Ilha 3 - Estrela
        { id: 'I3Centro', nome: 'Centro', x: 200, y: 280, conexoes: ['I3A', 'I3B', 'I3C', 'I3D'] },
        { id: 'I3A', nome: 'I3A', x: 160, y: 240, conexoes: ['I3Centro'] },
        { id: 'I3B', nome: 'I3B', x: 240, y: 240, conexoes: ['I3Centro'] },
        { id: 'I3C', nome: 'I3C', x: 160, y: 320, conexoes: ['I3Centro'] },
        { id: 'I3D', nome: 'I3D', x: 240, y: 320, conexoes: ['I3Centro'] },
        
        // Ilha 4 - Par
        { id: 'I4A', nome: 'I4A', x: 400, y: 250, conexoes: ['I4B'] },
        { id: 'I4B', nome: 'I4B', x: 460, y: 250, conexoes: ['I4A'] },
        
        // Ilha 5 - Vértice isolado
        { id: 'Isolado', nome: 'Isolado', x: 350, y: 180, conexoes: [] },
      ],
      arestas: [
        // Ilha 1
        { origem: 'I1A', destino: 'I1B', peso: 1 },
        { origem: 'I1B', destino: 'I1C', peso: 1 },
        { origem: 'I1C', destino: 'I1A', peso: 1 },
        
        // Ilha 2
        { origem: 'I2A', destino: 'I2B', peso: 1 },
        { origem: 'I2B', destino: 'I2C', peso: 1 },
        
        // Ilha 3
        { origem: 'I3Centro', destino: 'I3A', peso: 1 },
        { origem: 'I3Centro', destino: 'I3B', peso: 1 },
        { origem: 'I3Centro', destino: 'I3C', peso: 1 },
        { origem: 'I3Centro', destino: 'I3D', peso: 1 },
        
        // Ilha 4
        { origem: 'I4A', destino: 'I4B', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'coloracao',
    nome: '🎨 Welsh-Powell - Coloração de Grafos',
    data: {
      orientado: false,
      vertices: [
        // Grafo que requer várias cores para demonstrar o algoritmo
        { id: 'A', nome: 'A', x: 200, y: 100, conexoes: ['B', 'C', 'D'] },
        { id: 'B', nome: 'B', x: 100, y: 180, conexoes: ['A', 'C', 'E'] },
        { id: 'C', nome: 'C', x: 300, y: 180, conexoes: ['A', 'B', 'F'] },
        { id: 'D', nome: 'D', x: 200, y: 280, conexoes: ['A', 'E', 'F'] },
        { id: 'E', nome: 'E', x: 120, y: 300, conexoes: ['B', 'D', 'G'] },
        { id: 'F', nome: 'F', x: 280, y: 300, conexoes: ['C', 'D', 'H'] },
        { id: 'G', nome: 'G', x: 150, y: 380, conexoes: ['E', 'H'] },
        { id: 'H', nome: 'H', x: 250, y: 380, conexoes: ['F', 'G'] },
      ],
      arestas: [
        // Vértice A conectado a B, C, D
        { origem: 'A', destino: 'B', peso: 1 },
        { origem: 'A', destino: 'C', peso: 1 },
        { origem: 'A', destino: 'D', peso: 1 },
        
        // Vértice B conectado a A, C, E
        { origem: 'B', destino: 'C', peso: 1 },
        { origem: 'B', destino: 'E', peso: 1 },
        
        // Vértice C conectado a A, B, F
        { origem: 'C', destino: 'F', peso: 1 },
        
        // Vértice D conectado a A, E, F
        { origem: 'D', destino: 'E', peso: 1 },
        { origem: 'D', destino: 'F', peso: 1 },
        
        // Vértice E conectado a B, D, G
        { origem: 'E', destino: 'G', peso: 1 },
        
        // Vértice F conectado a C, D, H
        { origem: 'F', destino: 'H', peso: 1 },
        
        // Vértice G conectado a E, H
        { origem: 'G', destino: 'H', peso: 1 },
      ]
    } as GrafoData
  },
  {
    id: 'astar',
    nome: '🎯 A* - Navegação com Obstáculos',
    data: {
      orientado: false,
      vertices: [
        // Grid de navegação com obstáculos
        { id: 'A1', nome: 'A1', x: 100, y: 100, conexoes: ['A2', 'B1'] },
        { id: 'A2', nome: 'A2', x: 200, y: 100, conexoes: ['A1', 'A3', 'B2'] },
        { id: 'A3', nome: 'A3', x: 300, y: 100, conexoes: ['A2', 'A4', 'B3'] },
        { id: 'A4', nome: 'A4', x: 400, y: 100, conexoes: ['A3', 'B4'] },
        { id: 'A5', nome: 'A5', x: 500, y: 100, conexoes: ['A4', 'B5'] },
        
        { id: 'B1', nome: 'B1', x: 100, y: 200, conexoes: ['A1', 'B2', 'C1'] },
        { id: 'B2', nome: 'B2', x: 200, y: 200, conexoes: ['A2', 'B1', 'B3', 'C2'] },
        { id: 'B3', nome: 'B3', x: 300, y: 200, conexoes: ['A3', 'B2', 'B4'] }, // Obstáculo - sem conexão para C3
        { id: 'B4', nome: 'B4', x: 400, y: 200, conexoes: ['A4', 'B3', 'B5', 'C4'] },
        { id: 'B5', nome: 'B5', x: 500, y: 200, conexoes: ['A5', 'B4', 'C5'] },
        
        { id: 'C1', nome: 'C1', x: 100, y: 300, conexoes: ['B1', 'C2', 'D1'] },
        { id: 'C2', nome: 'C2', x: 200, y: 300, conexoes: ['B2', 'C1', 'D2'] },
        // C3 não existe (obstáculo)
        { id: 'C4', nome: 'C4', x: 400, y: 300, conexoes: ['B4', 'C5', 'D4'] },
        { id: 'C5', nome: 'C5', x: 500, y: 300, conexoes: ['B5', 'C4', 'D5'] },
        
        { id: 'D1', nome: 'D1', x: 100, y: 400, conexoes: ['C1', 'D2'] },
        { id: 'D2', nome: 'D2', x: 200, y: 400, conexoes: ['C2', 'D1', 'D4'] },
        // D3 não existe (obstáculo)
        { id: 'D4', nome: 'D4', x: 400, y: 400, conexoes: ['C4', 'D2', 'D5'] },
        { id: 'D5', nome: 'D5', x: 500, y: 400, conexoes: ['C5', 'D4'] },
      ],
      arestas: [
        // Linha A
        { origem: 'A1', destino: 'A2', peso: 10 },
        { origem: 'A2', destino: 'A3', peso: 10 },
        { origem: 'A3', destino: 'A4', peso: 10 },
        { origem: 'A4', destino: 'A5', peso: 10 },
        
        // Conexões verticais A-B
        { origem: 'A1', destino: 'B1', peso: 10 },
        { origem: 'A2', destino: 'B2', peso: 10 },
        { origem: 'A3', destino: 'B3', peso: 10 },
        { origem: 'A4', destino: 'B4', peso: 10 },
        { origem: 'A5', destino: 'B5', peso: 10 },
        
        // Linha B
        { origem: 'B1', destino: 'B2', peso: 10 },
        { origem: 'B2', destino: 'B3', peso: 10 },
        { origem: 'B3', destino: 'B4', peso: 10 },
        { origem: 'B4', destino: 'B5', peso: 10 },
        
        // Conexões verticais B-C (sem B3-C3)
        { origem: 'B1', destino: 'C1', peso: 10 },
        { origem: 'B2', destino: 'C2', peso: 10 },
        { origem: 'B4', destino: 'C4', peso: 10 },
        { origem: 'B5', destino: 'C5', peso: 10 },
        
        // Linha C (sem C3)
        { origem: 'C1', destino: 'C2', peso: 10 },
        { origem: 'C4', destino: 'C5', peso: 10 },
        
        // Conexões verticais C-D
        { origem: 'C1', destino: 'D1', peso: 10 },
        { origem: 'C2', destino: 'D2', peso: 10 },
        { origem: 'C4', destino: 'D4', peso: 10 },
        { origem: 'C5', destino: 'D5', peso: 10 },
        
        // Linha D (com conexão especial D2-D4 para contornar obstáculo)
        { origem: 'D1', destino: 'D2', peso: 10 },
        { origem: 'D2', destino: 'D4', peso: 20 }, // Custo maior para contornar
        { origem: 'D4', destino: 'D5', peso: 10 },
      ]
    } as GrafoData
  },
  {
    id: 'curitiba',
    nome: '🎯 A* - Cidades do Paraná (Heurística Fixa)',
    data: {
      orientado: false,
      vertices: [
        { id: 'Cascavel', nome: 'Cascavel', x: 150, y: 200, conexoes: ['Toledo', 'Guarapuava', 'FozDoIguacu'] },
        { id: 'Toledo', nome: 'Toledo', x: 100, y: 150, conexoes: ['Cascavel', 'Umuarama'] },
        { id: 'FozDoIguacu', nome: 'Foz do Iguaçu', x: 50, y: 250, conexoes: ['FranciscoBeltrao', 'Cascavel', 'Umuarama'] },
        { id: 'FranciscoBeltrao', nome: 'Francisco Beltrão', x: 120, y: 280, conexoes: ['Guarapuava', 'FozDoIguacu'] },
        { id: 'SaoMateus', nome: 'São Mateus do Sul', x: 300, y: 350, conexoes: ['Guarapuava', 'Curitiba'] },
        { id: 'Paranagua', nome: 'Paranaguá', x: 450, y: 400, conexoes: ['Curitiba', 'Guarapuava'] },
        { id: 'Guarapuava', nome: 'Guarapuava', x: 200, y: 300, conexoes: ['Cascavel', 'PontaGrossa', 'FranciscoBeltrao', 'SaoMateus', 'Paranagua'] },
        { id: 'Londrina', nome: 'Londrina', x: 300, y: 100, conexoes: ['Maringa', 'PontaGrossa'] },
        { id: 'PontaGrossa', nome: 'Ponta Grossa', x: 350, y: 200, conexoes: ['Londrina', 'Curitiba', 'Guarapuava'] },
        { id: 'Maringa', nome: 'Maringá', x: 250, y: 80, conexoes: ['Umuarama', 'Londrina'] },
        { id: 'Umuarama', nome: 'Umuarama', x: 180, y: 120, conexoes: ['Toledo', 'Maringa', 'FozDoIguacu'] },
        { id: 'Curitiba', nome: 'Curitiba', x: 400, y: 300, conexoes: ['PontaGrossa', 'Paranagua', 'SaoMateus'] },
      ],
      arestas: [
        { origem: 'Cascavel', destino: 'Toledo', peso: 50 },
        { origem: 'Cascavel', destino: 'Guarapuava', peso: 165 },
        { origem: 'Cascavel', destino: 'FozDoIguacu', peso: 131 },
        { origem: 'Toledo', destino: 'Umuarama', peso: 126 },
        { origem: 'Umuarama', destino: 'Maringa', peso: 190 },
        { origem: 'Umuarama', destino: 'FozDoIguacu', peso: 133 },
        { origem: 'Maringa', destino: 'Londrina', peso: 114 },
        { origem: 'Londrina', destino: 'PontaGrossa', peso: 273 },
        { origem: 'PontaGrossa', destino: 'Curitiba', peso: 90 },
        { origem: 'PontaGrossa', destino: 'Guarapuava', peso: 157 },
        { origem: 'Curitiba', destino: 'Paranagua', peso: 114 },
        { origem: 'Curitiba', destino: 'SaoMateus', peso: 165 },
        { origem: 'Paranagua', destino: 'Guarapuava', peso: 354 },
        { origem: 'Guarapuava', destino: 'FranciscoBeltrao', peso: 186 },
        { origem: 'Guarapuava', destino: 'SaoMateus', peso: 314 },
        { origem: 'FranciscoBeltrao', destino: 'FozDoIguacu', peso: 143 },
      ]
    } as GrafoData
  },
  {
    id: 'parana2',
    nome: '🏙️ Paraná 2 - Teste de Quebra de Texto',
    data: {
      orientado: false,
      vertices: [
        { id: 'Maringa', nome: 'Maringá', x: 200, y: 50, conexoes: ['Londrina', 'Umuarama', 'PontaGrossa'] },
        { id: 'Londrina', nome: 'Londrina', x: 300, y: 50, conexoes: ['Maringa', 'PontaGrossa'] },
        { id: 'Umuarama', nome: 'Umuarama', x: 100, y: 50, conexoes: ['Maringa', 'Toledo'] },
        { id: 'PontaGrossa', nome: 'Ponta Grossa', x: 350, y: 150, conexoes: ['Londrina', 'Curitiba', 'Maringa', 'Guarapuava'] },
        { id: 'Curitiba', nome: 'Curitiba', x: 400, y: 200, conexoes: ['PontaGrossa', 'Paranagua', 'SaoMateus'] },
        { id: 'Paranagua', nome: 'Paranaguá', x: 450, y: 250, conexoes: ['Curitiba'] },
        { id: 'Guarapuava', nome: 'Guarapuava', x: 250, y: 150, conexoes: ['Maringa', 'PontaGrossa', 'Cascavel'] },
        { id: 'SaoMateus', nome: 'São Mateus do Sul', x: 350, y: 250, conexoes: ['Curitiba', 'FranciscoBeltrao'] },
        { id: 'Cascavel', nome: 'Cascavel', x: 100, y: 150, conexoes: ['Toledo', 'Guarapuava', 'Foz'] },
        { id: 'Toledo', nome: 'Toledo', x: 50, y: 100, conexoes: ['Cascavel', 'Umuarama'] },
        { id: 'Foz', nome: 'Foz do Iguaçu', x: 0, y: 150, conexoes: ['Cascavel'] },
        { id: 'FranciscoBeltrao', nome: 'Francisco Beltrão', x: 50, y: 200, conexoes: ['Cascavel', 'SaoMateus'] },
      ],
      arestas: [
        { origem: 'Maringa', destino: 'Londrina', peso: 114 },
        { origem: 'Maringa', destino: 'Umuarama', peso: 190 },
        { origem: 'Londrina', destino: 'PontaGrossa', peso: 273 },
        { origem: 'Maringa', destino: 'PontaGrossa', peso: 314 },
        { origem: 'PontaGrossa', destino: 'Curitiba', peso: 114 },
        { origem: 'Curitiba', destino: 'Paranagua', peso: 90 },
        { origem: 'Curitiba', destino: 'SaoMateus', peso: 157 },
        { origem: 'Guarapuava', destino: 'PontaGrossa', peso: 165 },
        { origem: 'Guarapuava', destino: 'Cascavel', peso: 250 },
        { origem: 'Cascavel', destino: 'Toledo', peso: 50 },
        { origem: 'Cascavel', destino: 'Foz', peso: 143 },
        { origem: 'FranciscoBeltrao', destino: 'Cascavel', peso: 186 },
        {origem: 'Toledo', destino: 'Umuarama', peso: 126},
        { origem: 'FranciscoBeltrao', destino: 'SaoMateus', peso: 354 },

      ]
    } as GrafoData
  },
  {
    id: 'vazio',
    nome: '📝 Grafo em Branco (Para Desenhar)',
    data: {
      orientado: false,
      vertices: [],
      arestas: []
    } as GrafoData
  }
];
