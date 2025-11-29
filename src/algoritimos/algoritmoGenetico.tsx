import type { GrafoData, Aresta } from '../types/grafo';
import type { VerticeColorido } from './componentes';

// Configurações do Algoritmo Genético
export interface ConfigAG {
  tamanhoPopulacao: number;      // Mínimo 100
  taxaCruzamento: number;         // 0.6 - 0.8
  taxaMutacao: number;            // 0.005 - 0.01
  numeroGeracoes: number;         // Mínimo 20
  elitismo: number;               // Número de melhores a preservar
  pontosCruzamento: [number, number]; // 2 pontos fixos para PMX
}

// Representa um indivíduo (rota) na população
export interface Individuo {
  rota: string[];                 // Sequência de cidades (não repete inicial)
  fitness: number;                // Custo total da rota (menor é melhor)
  custoReal: number;              // Custo sem penalização
  rotaCompleta: string[];         // Inclui retorno à origem
}

// Resultado do AG
export interface AGResult {
  melhorRota: string[];
  custoMelhorRota: number;
  historicoGeracao: {
    geracao: number;
    melhorFitness: number;
    fitnessMedio: number;
    piorFitness: number;
  }[];
  populacaoFinal: Individuo[];
  arestas: Aresta[];
  verticesColoridos: VerticeColorido[];
  passos: string[];
  configuracao: ConfigAG;
  totalPossibilidades: number;
}

const PENALIDADE_ROTA_INVALIDA = 999999;

// Calcula o fatorial para mostrar total de possibilidades
function fatorial(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

// Obtém o peso de uma aresta entre duas cidades
function obterPesoAresta(
  origem: string,
  destino: string,
  arestas: Aresta[],
  orientado: boolean
): number {
  const aresta = arestas.find(
    a =>
      (a.origem === origem && a.destino === destino) ||
      (!orientado && a.origem === destino && a.destino === origem)
  );
  return aresta ? aresta.peso : PENALIDADE_ROTA_INVALIDA;
}

// Calcula o fitness (custo total) de uma rota
function calcularFitness(
  rota: string[],
  cidadeInicial: string,
  grafo: GrafoData
): { fitness: number; custoReal: number } {
  const rotaCompleta = [cidadeInicial, ...rota, cidadeInicial];
  let custoTotal = 0;
  let temRotaInvalida = false;

  for (let i = 0; i < rotaCompleta.length - 1; i++) {
    const peso = obterPesoAresta(
      rotaCompleta[i],
      rotaCompleta[i + 1],
      grafo.arestas,
      grafo.orientado
    );
    
    if (peso === PENALIDADE_ROTA_INVALIDA) {
      temRotaInvalida = true;
    }
    custoTotal += peso;
  }

  return {
    fitness: custoTotal,
    custoReal: temRotaInvalida ? Infinity : custoTotal
  };
}

// Cria um indivíduo com rota aleatória
function criarIndividuoAleatorio(
  cidades: string[],
  cidadeInicial: string,
  grafo: GrafoData
): Individuo {
  const cidadesRestantes = cidades.filter(c => c !== cidadeInicial);
  const rota = [...cidadesRestantes].sort(() => Math.random() - 0.5);
  
  const { fitness, custoReal } = calcularFitness(rota, cidadeInicial, grafo);
  
  return {
    rota,
    fitness,
    custoReal,
    rotaCompleta: [cidadeInicial, ...rota, cidadeInicial]
  };
}

// Cria a população inicial
function criarPopulacaoInicial(
  tamanho: number,
  cidades: string[],
  cidadeInicial: string,
  grafo: GrafoData
): Individuo[] {
  const populacao: Individuo[] = [];
  
  for (let i = 0; i < tamanho; i++) {
    populacao.push(criarIndividuoAleatorio(cidades, cidadeInicial, grafo));
  }
  
  return populacao;
}

// Operador PMX (Partially Mapped Crossover) com 2 pontos fixos
function pmxCruzamento(
  pai1: Individuo,
  pai2: Individuo,
  ponto1: number,
  ponto2: number,
  cidadeInicial: string,
  grafo: GrafoData
): [Individuo, Individuo] {
  const tamanho = pai1.rota.length;
  
  // Garante que ponto1 < ponto2
  const p1 = Math.min(ponto1, ponto2);
  const p2 = Math.max(ponto1, ponto2);
  
  // Ajusta pontos para não ultrapassar o tamanho da rota
  const p1Ajustado = Math.min(p1, tamanho - 1);
  const p2Ajustado = Math.min(p2, tamanho - 1);
  
  // Cria filhos copiando segmento do outro pai
  const filho1Rota = new Array(tamanho).fill(null);
  const filho2Rota = new Array(tamanho).fill(null);
  
  // Copia segmento entre os pontos de cruzamento
  for (let i = p1Ajustado; i <= p2Ajustado; i++) {
    filho1Rota[i] = pai2.rota[i];
    filho2Rota[i] = pai1.rota[i];
  }
  
  // Preenche o restante usando mapeamento PMX
  const preencherPMX = (filho: (string | null)[], pai: string[], outroPai: string[]) => {
    for (let i = 0; i < tamanho; i++) {
      if (i >= p1Ajustado && i <= p2Ajustado) continue; // Pula segmento já copiado
      
      let valor = pai[i];
      
      // Se valor já existe no segmento copiado, encontra substituição
      while (filho.slice(p1Ajustado, p2Ajustado + 1).includes(valor)) {
        const idx = outroPai.indexOf(valor);
        valor = pai[idx];
      }
      
      filho[i] = valor;
    }
  };
  
  preencherPMX(filho1Rota, pai1.rota, pai2.rota);
  preencherPMX(filho2Rota, pai2.rota, pai1.rota);
  
  // Cria indivíduos filhos
  const fitness1 = calcularFitness(filho1Rota as string[], cidadeInicial, grafo);
  const fitness2 = calcularFitness(filho2Rota as string[], cidadeInicial, grafo);
  
  return [
    {
      rota: filho1Rota as string[],
      fitness: fitness1.fitness,
      custoReal: fitness1.custoReal,
      rotaCompleta: [cidadeInicial, ...(filho1Rota as string[]), cidadeInicial]
    },
    {
      rota: filho2Rota as string[],
      fitness: fitness2.fitness,
      custoReal: fitness2.custoReal,
      rotaCompleta: [cidadeInicial, ...(filho2Rota as string[]), cidadeInicial]
    }
  ];
}

// Operador de mutação por troca (swap)
function mutacao(individuo: Individuo, cidadeInicial: string, grafo: GrafoData): Individuo {
  const novaRota = [...individuo.rota];
  
  // Escolhe dois pontos aleatórios e troca
  const idx1 = Math.floor(Math.random() * novaRota.length);
  const idx2 = Math.floor(Math.random() * novaRota.length);
  
  [novaRota[idx1], novaRota[idx2]] = [novaRota[idx2], novaRota[idx1]];
  
  const { fitness, custoReal } = calcularFitness(novaRota, cidadeInicial, grafo);
  
  return {
    rota: novaRota,
    fitness,
    custoReal,
    rotaCompleta: [cidadeInicial, ...novaRota, cidadeInicial]
  };
}

// Seleção por torneio (usado junto com elitismo)
function selecaoTorneio(populacao: Individuo[], tamanhoTorneio: number = 3): Individuo {
  const competidores: Individuo[] = [];
  
  for (let i = 0; i < tamanhoTorneio; i++) {
    const idx = Math.floor(Math.random() * populacao.length);
    competidores.push(populacao[idx]);
  }
  
  return competidores.reduce((melhor, atual) => 
    atual.fitness < melhor.fitness ? atual : melhor
  );
}

// Algoritmo Genético principal
export function algoritmoGeneticoPCV(
  grafo: GrafoData,
  cidadeInicial: string,
  config: ConfigAG,
  callbackProgresso?: (geracao: number, melhorIndividuo: Individuo, populacao: Individuo[]) => boolean
): AGResult {
  const { vertices } = grafo;
  const passos: string[] = [];
  
  // Validações
  if (!vertices.find(v => v.id === cidadeInicial)) {
    return {
      melhorRota: [],
      custoMelhorRota: Infinity,
      historicoGeracao: [],
      populacaoFinal: [],
      arestas: [],
      verticesColoridos: [],
      passos: ['❌ Cidade inicial não encontrada'],
      configuracao: config,
      totalPossibilidades: 0
    };
  }
  
  if (vertices.length < 3) {
    return {
      melhorRota: [],
      custoMelhorRota: Infinity,
      historicoGeracao: [],
      populacaoFinal: [],
      arestas: [],
      verticesColoridos: [],
      passos: ['❌ O grafo precisa ter pelo menos 3 cidades'],
      configuracao: config,
      totalPossibilidades: 0
    };
  }
  
  const totalPossibilidades = fatorial(vertices.length - 1);
  
  passos.push('🧬 === ALGORITMO GENÉTICO - PROBLEMA DO CAIXEIRO VIAJANTE ===');
  passos.push(`📍 Cidade inicial: ${cidadeInicial}`);
  passos.push(`🏙️  Total de cidades: ${vertices.length}`);
  passos.push(`🔢 Total de rotas possíveis: R(${vertices.length}) = (${vertices.length}-1)! = ${totalPossibilidades.toLocaleString()}`);
  passos.push('');
  passos.push('⚙️  === CONFIGURAÇÃO DO ALGORITMO ===');
  passos.push(`👥 Tamanho da população: ${config.tamanhoPopulacao}`);
  passos.push(`🔄 Taxa de cruzamento: ${(config.taxaCruzamento * 100).toFixed(1)}%`);
  passos.push(`🎲 Taxa de mutação: ${(config.taxaMutacao * 100).toFixed(2)}%`);
  passos.push(`🏆 Elitismo: ${config.elitismo} melhores preservados`);
  passos.push(`🔀 Pontos de cruzamento PMX: [${config.pontosCruzamento[0]}, ${config.pontosCruzamento[1]}]`);
  passos.push(`🔁 Número de gerações: ${config.numeroGeracoes}`);
  passos.push('');
  
  // Cria população inicial
  passos.push('🎲 Criando população inicial aleatória...');
  const cidades = vertices.map(v => v.id);
  let populacao = criarPopulacaoInicial(
    config.tamanhoPopulacao,
    cidades,
    cidadeInicial,
    grafo
  );
  
  // Ordena por fitness
  populacao.sort((a, b) => a.fitness - b.fitness);
  
  const historicoGeracao: AGResult['historicoGeracao'] = [];
  
  passos.push(`✅ População inicial criada`);
  passos.push(`   🥇 Melhor fitness inicial: ${populacao[0].fitness.toFixed(2)}`);
  passos.push(`   📊 Fitness médio: ${(populacao.reduce((sum, ind) => sum + ind.fitness, 0) / populacao.length).toFixed(2)}`);
  passos.push('');
  
  // Evolução
  for (let geracao = 1; geracao <= config.numeroGeracoes; geracao++) {
    const novaPopulacao: Individuo[] = [];
    
    // Elitismo: preserva os melhores
    for (let i = 0; i < config.elitismo; i++) {
      novaPopulacao.push({ ...populacao[i] });
    }
    
    // Gera novos indivíduos por cruzamento e mutação
    while (novaPopulacao.length < config.tamanhoPopulacao) {
      // Seleção dos pais
      const pai1 = selecaoTorneio(populacao);
      const pai2 = selecaoTorneio(populacao);
      
      let filho1: Individuo, filho2: Individuo;
      
      // Cruzamento
      if (Math.random() < config.taxaCruzamento) {
        [filho1, filho2] = pmxCruzamento(
          pai1,
          pai2,
          config.pontosCruzamento[0],
          config.pontosCruzamento[1],
          cidadeInicial,
          grafo
        );
      } else {
        filho1 = { ...pai1 };
        filho2 = { ...pai2 };
      }
      
      // Mutação
      if (Math.random() < config.taxaMutacao) {
        filho1 = mutacao(filho1, cidadeInicial, grafo);
      }
      if (Math.random() < config.taxaMutacao) {
        filho2 = mutacao(filho2, cidadeInicial, grafo);
      }
      
      novaPopulacao.push(filho1);
      if (novaPopulacao.length < config.tamanhoPopulacao) {
        novaPopulacao.push(filho2);
      }
    }
    
    // Atualiza população
    populacao = novaPopulacao;
    populacao.sort((a, b) => a.fitness - b.fitness);
    
    // Estatísticas da geração
    const melhorFitness = populacao[0].fitness;
    const fitnessMedio = populacao.reduce((sum, ind) => sum + ind.fitness, 0) / populacao.length;
    const piorFitness = populacao[populacao.length - 1].fitness;
    
    historicoGeracao.push({
      geracao,
      melhorFitness,
      fitnessMedio,
      piorFitness
    });
    
    passos.push(`🔄 Geração ${geracao}/${config.numeroGeracoes}`);
    passos.push(`   🥇 Melhor: ${melhorFitness.toFixed(2)} | 📊 Médio: ${fitnessMedio.toFixed(2)} | 🥉 Pior: ${piorFitness.toFixed(2)}`);
    passos.push(`   🛣️  Melhor rota: ${populacao[0].rotaCompleta.join(' → ')}`);
    
    // Callback para permitir interação durante execução
    if (callbackProgresso) {
      const continuar = callbackProgresso(geracao, populacao[0], populacao);
      if (!continuar) {
        passos.push(`⏸️  Execução interrompida pelo usuário na geração ${geracao}`);
        break;
      }
    }
  }
  
  const melhorIndividuo = populacao[0];
  
  passos.push('');
  passos.push('🎉 === ALGORITMO CONCLUÍDO ===');
  passos.push(`🏆 Melhor rota encontrada: ${melhorIndividuo.rotaCompleta.join(' → ')}`);
  passos.push(`💰 Custo total: ${melhorIndividuo.fitness.toFixed(2)}`);
  
  if (historicoGeracao.length > 0) {
    passos.push(`📈 Melhoria: ${((historicoGeracao[0].melhorFitness - melhorIndividuo.fitness) / historicoGeracao[0].melhorFitness * 100).toFixed(2)}% em relação à geração inicial`);
  }
  
  // Cria arestas para visualização
  const arestas: Aresta[] = [];
  for (let i = 0; i < melhorIndividuo.rotaCompleta.length - 1; i++) {
    const origem = melhorIndividuo.rotaCompleta[i];
    const destino = melhorIndividuo.rotaCompleta[i + 1];
    const peso = obterPesoAresta(origem, destino, grafo.arestas, grafo.orientado);
    arestas.push({ origem, destino, peso });
  }
  
  // Cria vértices coloridos (cidade inicial em verde, outras em azul)
  const verticesColoridos: VerticeColorido[] = vertices.map(v => ({
    ...v,
    cor: v.id === cidadeInicial ? '#22c55e' : '#3b82f6'
  }));
  
  return {
    melhorRota: melhorIndividuo.rotaCompleta,
    custoMelhorRota: melhorIndividuo.fitness,
    historicoGeracao,
    populacaoFinal: populacao,
    arestas,
    verticesColoridos,
    passos,
    configuracao: config,
    totalPossibilidades
  };
}
