# 🧬 Implementação do Algoritmo Genético para o Problema do Caixeiro Viajante (PCV)

## 📋 Visão Geral

Implementação completa do Algoritmo Genético para resolver o Problema do Caixeiro Viajante, integrada à ferramenta de visualização de grafos.

## ✨ Características Implementadas

### ✅ Requisitos Obrigatórios Atendidos

#### 1. **População**
- ✅ Tamanho mínimo de 100 indivíduos (configurável)
- ✅ População inicial gerada aleatoriamente
- ✅ Cada indivíduo representa uma rota completa
- ✅ Cálculo correto de R(n) = (n-1)!

#### 2. **Taxa de Cruzamento**
- ✅ Faixa configurável entre 60% e 80%
- ✅ Default: 70%

#### 3. **Taxa de Mutação**
- ✅ Faixa configurável entre 0.5% e 1%
- ✅ Default: 1%

#### 4. **Operador de Cruzamento**
- ✅ **PMX (Partially Mapped Crossover)** com 2 pontos fixos
- ✅ Pontos configuráveis pelo usuário
- ✅ Preserva ordem relativa das cidades

#### 5. **Seleção Elitista**
- ✅ Estratégia elitista implementada
- ✅ Número de elite configurável (default: 5)
- ✅ Melhores sempre preservados

#### 6. **Critério de Parada**
- ✅ Número máximo de gerações (mínimo 20)
- ✅ Configurável pelo usuário
- ✅ Possibilidade de ampliar durante execução

#### 7. **Visualização de População**
- ✅ Opção de mostrar indivíduos e custos
- ✅ Filtros: Top 10, 20, 50 ou Todos
- ✅ Acompanhamento da convergência

#### 8. **Rotas Impossíveis**
- ✅ Arestas inexistentes recebem penalização (999999)
- ✅ AG automaticamente elimina da população

#### 9. **Visualização Final**
- ✅ Melhor rota destacada graficamente
- ✅ Custo total exibido
- ✅ Vértices e arestas coloridos

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

1. **`src/algoritimos/algoritmoGenetico.tsx`** (488 linhas)
   - Implementação completa do AG
   - Interfaces TypeScript
   - Funções auxiliares
   - Operadores genéticos

2. **`src/components/ResultadoAG.tsx`** (235 linhas)
   - Interface de visualização dos resultados
   - Gráficos de evolução
   - População final
   - Configurações utilizadas

3. **`AG_IMPLEMENTACAO.md`** (este arquivo)
   - Documentação completa

### Arquivos Modificados

1. **`src/constants/grafos.ts`**
   - Adicionado novo grafo "PCV - Cidades Brasileiras"
   - 10 cidades com distâncias realistas

2. **`src/components/AlgoritmoResultado.tsx`**
   - Integração do AG
   - UI de configuração
   - Type guards
   - Renderização condicional

3. **`src/components/mapa.tsx`**
   - Opção "Algoritmo Genético (PCV)" no select

## 🎯 Funcionalidades Implementadas

### Operadores Genéticos

#### 1. **PMX (Partially Mapped Crossover)**
```typescript
// Cruzamento em 2 pontos fixos
// Preserva ordem relativa das cidades
// Evita rotas inválidas
```

#### 2. **Mutação por Troca (Swap)**
```typescript
// Escolhe 2 cidades aleatórias
// Troca suas posições
// Recalcula fitness
```

#### 3. **Seleção por Torneio**
```typescript
// Torneio de 3 indivíduos
// Melhor fitness vence
// Usado junto com elitismo
```

### Cálculo de Fitness

```typescript
fitness = Σ(custos das arestas da rota)
// Menor fitness = melhor solução
// Arestas inexistentes = 999999 (penalização)
```

## 🎨 Interface do Usuário

### Painel de Configuração
- **População**: Input numérico (mín. 100)
- **Gerações**: Input numérico (mín. 20)
- **Elitismo**: Número de melhores preservados
- **Taxa Cruzamento**: Slider 60-80%
- **Taxa Mutação**: Slider 0.5-1%
- **Pontos PMX**: Dois inputs para pontos de cruzamento

### Painel de Resultados
1. **Resumo Principal**
   - Custo total da melhor rota
   - Percentual de melhoria

2. **Rota Ótima**
   - Sequência completa de cidades
   - Visual com badges coloridos
   - Origem/destino em verde

3. **Parâmetros Utilizados**
   - Grid 2x3 com todas as configs
   - Total de possibilidades R(n)

4. **Evolução das Gerações**
   - Tabela com: Geração, Melhor, Médio, Pior
   - Scroll automático
   - Cores diferentes por tipo

5. **População Final**
   - Botão mostrar/ocultar
   - Select de quantidade (10/20/50/todos)
   - Ranking com medalhas 🥇🥈🥉
   - Destaque para rotas inválidas

6. **Log de Execução**
   - Passos detalhados
   - Cores por tipo de mensagem
   - Scroll automático

7. **Informações Adicionais**
   - Explicação dos operadores
   - Boas práticas implementadas

## 📊 Grafo de Exemplo "PCV - Cidades Brasileiras"

### Cidades (10 vértices)
- Fortaleza (F)
- Recife (R)
- Salvador (S)
- Brasília (B)
- Belo Horizonte (BH)
- Rio de Janeiro (RJ)
- São Paulo (SP)
- Curitiba (C)
- Porto Alegre (PA)
- Goiânia (G)

### Características
- 18 arestas com distâncias em km
- Grafo não-orientado
- Nem todas as cidades conectadas diretamente
- Total de possibilidades: R(10) = 9! = 362,880

## 🚀 Como Usar

### 1. Selecionar Grafo
```
Grafo → "🚗 PCV - Cidades Brasileiras (Caixeiro Viajante)"
```

### 2. Selecionar Algoritmo
```
Algoritmo → "Algoritmo Genético (PCV)"
```

### 3. Configurar Parâmetros
- Ajuste população, gerações, taxas
- Configure pontos de cruzamento PMX
- Default já atende requisitos

### 4. Selecionar Cidade Inicial
```
Vértice inicial → Escolha uma cidade (ex: "Brasília")
```

### 5. Executar
```
Botão "Executar" → Aguarde processamento
```

### 6. Visualizar Resultados
- Melhor rota destacada no grafo (arestas laranjas)
- Cidade inicial em verde
- Outras cidades em azul
- Painéis com estatísticas completas

## 🔬 Algoritmo - Pseudocódigo

```
ALGORITMO_GENETICO(grafo, cidadeInicial, config):
    // 1. Criar população inicial aleatória
    populacao = criarPopulacaoInicial(config.tamanhoPopulacao)
    
    // 2. Avaliar fitness de todos
    para cada individuo em populacao:
        individuo.fitness = calcularFitness(individuo.rota)
    
    // 3. Evoluir por N gerações
    para geracao de 1 até config.numeroGeracoes:
        novaPopulacao = []
        
        // 3.1. Elitismo - preservar melhores
        para i de 0 até config.elitismo:
            novaPopulacao.adicionar(populacao[i])
        
        // 3.2. Gerar novos indivíduos
        enquanto tamanho(novaPopulacao) < config.tamanhoPopulacao:
            // Seleção por torneio
            pai1 = selecaoTorneio(populacao)
            pai2 = selecaoTorneio(populacao)
            
            // Cruzamento PMX
            se random() < config.taxaCruzamento:
                filho1, filho2 = pmxCruzamento(pai1, pai2)
            senão:
                filho1, filho2 = pai1, pai2
            
            // Mutação por troca
            se random() < config.taxaMutacao:
                filho1 = mutacao(filho1)
            se random() < config.taxaMutacao:
                filho2 = mutacao(filho2)
            
            novaPopulacao.adicionar(filho1, filho2)
        
        // 3.3. Substituir população
        populacao = novaPopulacao
        ordenar(populacao) por fitness
    
    // 4. Retornar melhor solução
    retornar populacao[0]
```

## 🎓 Conceitos Implementados

### 1. **Representação Cromossômica**
- Cada cromossomo = sequência de cidades
- Não repete cidade inicial no cromossomo
- Rota completa inclui retorno à origem

### 2. **Função de Fitness**
- Minimização: menor custo = melhor
- Soma dos pesos das arestas
- Penalização para rotas impossíveis

### 3. **Operador PMX Detalhado**
```
Pai1: [A, B, C, D, E]
Pai2: [C, D, A, E, B]
Pontos: [1, 3]

Passo 1: Copiar segmento entre pontos
Filho1: [?, D, A, E, ?]

Passo 2: Preencher gaps com mapeamento
- Posição 0: B de Pai1, mas B está em [1,3]
  B→D (mapa), D→A (mapa), A está em [1,3]
  A não conflita fora, então A na posição 0
  
Resultado: [C, D, A, E, B]
```

### 4. **Estratégia Elitista**
- Garante não-degeneração
- Monotonicamente não-decrescente
- Preserva descobertas importantes

### 5. **Diversidade Genética**
- Mutação adiciona exploração
- Torneio mantém pressão seletiva
- Taxa controlada evita convergência prematura

## 📈 Resultados Esperados

### Convergência Típica (100 indivíduos, 50 gerações)
- **Geração 1**: Fitness médio alto, variância grande
- **Geração 10-20**: Rápida melhoria
- **Geração 30-40**: Estabilização
- **Geração 50**: Solução próxima do ótimo

### Métricas de Qualidade
- **Melhoria**: 20-40% em relação à geração inicial
- **Tempo**: ~1-2 segundos para 50 gerações
- **Convergência**: Visível no histórico de gerações

## 🔧 Parâmetros Recomendados

### Configuração Padrão (Balanceada)
```typescript
{
  tamanhoPopulacao: 100,
  numeroGeracoes: 50,
  taxaCruzamento: 0.7,    // 70%
  taxaMutacao: 0.01,      // 1%
  elitismo: 5,
  pontosCruzamento: [2, 5]
}
```

### Configuração Exploratória
```typescript
{
  tamanhoPopulacao: 200,
  numeroGeracoes: 100,
  taxaCruzamento: 0.6,    // 60%
  taxaMutacao: 0.01,      // 1%
  elitismo: 10,
  pontosCruzamento: [1, 6]
}
```

### Configuração Rápida
```typescript
{
  tamanhoPopulacao: 100,
  numeroGeracoes: 20,
  taxaCruzamento: 0.8,    // 80%
  taxaMutacao: 0.005,     // 0.5%
  elitismo: 3,
  pontosCruzamento: [2, 4]
}
```

## 🐛 Tratamento de Erros

### Validações Implementadas
- ✅ Cidade inicial deve existir
- ✅ Mínimo 3 cidades no grafo
- ✅ População mínima de 100
- ✅ Gerações mínimas de 20
- ✅ Pontos PMX dentro dos limites
- ✅ Taxas dentro das faixas especificadas

### Casos Especiais
- **Grafo Desconexo**: Penalização automática
- **Rota Impossível**: Fitness = 999999
- **Cromossomo Inválido**: Corrigido pelo PMX

## 🎯 Cumprimento dos Requisitos

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| População ≥ 100 | ✅ | Validação + Default 100 |
| Taxa Cruzamento 60-80% | ✅ | Input limitado + Default 70% |
| Taxa Mutação 0.5-1% | ✅ | Input limitado + Default 1% |
| PMX 2 pontos | ✅ | Implementado + Configurável |
| Seleção Elitista | ✅ | Com torneio |
| Gerações ≥ 20 | ✅ | Validação + Default 50 |
| Visualizar População | ✅ | Botão show/hide + Filtros |
| Rotas Impossíveis | ✅ | Penalização 999999 |
| Mostrar Melhor Rota | ✅ | Visual + Custo |
| Integração Ferramenta | ✅ | Totalmente integrado |

## 📚 Referências Técnicas

### Operador PMX
- Goldberg, D. E., & Lingle, R. (1985). "Alleles, loci, and the traveling salesman problem"

### Algoritmos Genéticos
- Holland, J. H. (1992). "Adaptation in Natural and Artificial Systems"

### PCV
- Lawler et al. (1985). "The Traveling Salesman Problem"

## 🌟 Destaques da Implementação

1. **Type-Safe**: TypeScript completo
2. **Modular**: Funções bem separadas
3. **Configurável**: Todos os parâmetros ajustáveis
4. **Visual**: Interface rica e informativa
5. **Educacional**: Logs detalhados passo-a-passo
6. **Performático**: Estruturas de dados eficientes
7. **Robusto**: Tratamento de casos extremos
8. **Integrado**: Seamless com o projeto existente

## 🎉 Conclusão

Implementação completa e funcional do Algoritmo Genético para o Problema do Caixeiro Viajante, atendendo **100% dos requisitos** especificados e oferecendo uma experiência de usuário rica e educacional.

---

**Desenvolvido por**: GitHub Copilot (Claude Sonnet 4.5)  
**Data**: 29 de novembro de 2025  
**Versão**: 1.0.0
