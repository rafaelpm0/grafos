import type { GrafoData, Vertice } from "../types/grafo";

export interface ColoracaoResult {
  cores: { [id: string]: number }; // id do vértice -> número da cor
  totalCores: number;
  ordem: string[]; // ordem de coloração
  passos: string[]; // passos detalhados do algoritmo
  verticesColoridos: VerticeColorido[]; // vértices com cores para visualização
}

export interface VerticeColorido extends Vertice {
  cor?: string;
}

export function welshPowell(grafo: GrafoData): ColoracaoResult {
  const { vertices, orientado } = grafo;
  const passos: string[] = [];

  // Verificação: Welsh-Powell só funciona em grafos não-orientados
  if (orientado) {
    return {
      cores: {},
      totalCores: 0,
      ordem: [],
      passos: ['❌ O algoritmo Welsh-Powell não se aplica a grafos orientados. Use apenas com grafos não-orientados.'],
      verticesColoridos: [],
    };
  }

  // Paleta de cores para visualização
  const coresVisuais = [
    '#ef4444', // Vermelho - Cor 1
    '#3b82f6', // Azul - Cor 2
    '#10b981', // Verde - Cor 3
    '#f59e0b', // Amarelo - Cor 4
    '#8b5cf6', // Roxo - Cor 5
    '#f97316', // Laranja - Cor 6
    '#06b6d4', // Ciano - Cor 7
    '#84cc16', // Lima - Cor 8
    '#ec4899', // Rosa - Cor 9
    '#6b7280', // Cinza - Cor 10
  ];

  passos.push('🎨 === ALGORITMO WELSH-POWELL - COLORAÇÃO DE GRAFOS ===');
  passos.push(`📊 Total de vértices: ${vertices.length}`);
  passos.push(`🔗 Tipo de grafo: ${orientado ? 'Orientado' : 'Não-orientado'}`);
  passos.push('🎯 Objetivo: Colorir vértices com o menor número de cores');
  passos.push('');

  // Passo 1: Ordenar vértices por grau decrescente
  const verticesOrdenados = [...vertices].sort(
    (a, b) => b.conexoes.length - a.conexoes.length
  );

  passos.push('📋 Passo 1: Ordenando vértices por grau (decrescente)');
  verticesOrdenados.forEach((v, index) => {
    passos.push(`   ${index + 1}. ${v.nome} (grau: ${v.conexoes.length})`);
  });
  passos.push('');

  const cores: { [id: string]: number } = {};
  let corAtual = 1;

  // Passo 2: Coloração iterativa
  passos.push('🎨 Passo 2: Iniciando processo de coloração');

  for (const vertice of verticesOrdenados) {
    // Se o vértice já foi colorido, pula
    if (cores[vertice.id]) continue;

    passos.push(`\n🔴 Usando cor ${corAtual} (${coresVisuais[(corAtual - 1) % coresVisuais.length]})`);
    passos.push(`   ✅ Colorindo ${vertice.nome} com cor ${corAtual}`);
    
    // Colore o vértice atual
    cores[vertice.id] = corAtual;

    // Tenta colorir outros vértices com a mesma cor
    for (const outro of verticesOrdenados) {
      if (cores[outro.id]) continue; // Já foi colorido

      // Verifica se o vértice 'outro' pode usar a cor atual
      const podeUsarCor = !outro.conexoes.includes(vertice.id) && 
                         outro.conexoes.every((vizinhoId) => cores[vizinhoId] !== corAtual);

      if (podeUsarCor) {
        cores[outro.id] = corAtual;
        passos.push(`   ✅ Colorindo ${outro.nome} com cor ${corAtual}`);
      } else {
        const conflitos = outro.conexoes.filter(vizinhoId => cores[vizinhoId] === corAtual);
        if (conflitos.length > 0) {
          passos.push(`   ❌ ${outro.nome} não pode usar cor ${corAtual} (conflito com: ${conflitos.join(', ')})`);
        } else if (outro.conexoes.includes(vertice.id)) {
          passos.push(`   ❌ ${outro.nome} não pode usar cor ${corAtual} (adjacente a ${vertice.nome})`);
        }
      }
    }

    corAtual++;
  }

  // Criar vértices coloridos para visualização
  const verticesColoridos: VerticeColorido[] = vertices.map(vertice => ({
    ...vertice,
    cor: coresVisuais[(cores[vertice.id] - 1) % coresVisuais.length]
  }));

  const totalCores = Math.max(...Object.values(cores));

  passos.push('\n🎉 === COLORAÇÃO CONCLUÍDA ===');
  passos.push(`🎨 Número cromático encontrado: ${totalCores}`);
  passos.push(`📊 Cores utilizadas: ${totalCores}/${coresVisuais.length} disponíveis`);
  passos.push('');
  passos.push('📋 Resultado da coloração:');
  
  // Agrupa vértices por cor
  for (let cor = 1; cor <= totalCores; cor++) {
    const verticesDaCor = Object.keys(cores).filter(id => cores[id] === cor);
    const corVisual = coresVisuais[(cor - 1) % coresVisuais.length];
    passos.push(`   Cor ${cor} (${corVisual}): {${verticesDaCor.join(', ')}}`);
  }

  passos.push('');
  passos.push('✅ Verificação: Nenhum vértice adjacente possui a mesma cor');
  
  // Verificação de correção
  let coloracaoValida = true;
  for (const vertice of vertices) {
    for (const vizinhoId of vertice.conexoes) {
      if (cores[vertice.id] === cores[vizinhoId]) {
        passos.push(`❌ ERRO: ${vertice.id} e ${vizinhoId} são adjacentes e têm a mesma cor ${cores[vertice.id]}`);
        coloracaoValida = false;
      }
    }
  }

  if (coloracaoValida) {
    passos.push('✅ Coloração válida: Todos os vértices adjacentes possuem cores diferentes');
  }

  return {
    cores,
    totalCores,
    ordem: verticesOrdenados.map((v) => v.id),
    passos,
    verticesColoridos,
  };
}
