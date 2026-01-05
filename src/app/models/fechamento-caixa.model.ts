import { Timestamp } from '@angular/fire/firestore';

/**
 * Interface para detalhamento de dinheiro (moedas e cédulas)
 */
export interface DetalheDinheiro {
  valorUnitario: number;  // Valor da nota/moeda (ex: 50, 100, 0.50)
  quantidade: number;     // Quantidade de notas/moedas
  subtotal: number;       // valorUnitario * quantidade
}

/**
 * Interface principal para o fechamento de caixa
 */
export interface FechamentoCaixa {
  id?: string;                          // ID do documento no Firestore
  data: Timestamp;                      // Data e hora do fechamento
  detalhesDinheiro: DetalheDinheiro[];  // Array com detalhamento de notas e moedas
  totalDinheiro: number;                // Soma de todos os subtotais de dinheiro
  totalCartao: number;                  // Total recebido em cartão
  totalPix: number;                     // Total recebido via PIX
  sangria: number;                      // Despesas/retiradas
  totalGeral: number;                   // Soma de tudo (dinheiro + cartão + pix - sangria)
}

/**
 * Interface para KPIs do dashboard
 */
export interface KPI {
  totalVendido: number;
  ticketMedio: number;
  totalDinheiro: number;
  totalCartao: number;
  totalPix: number;
  totalSangria: number;
  quantidadeFechamentos: number;
}

/**
 * Interface para dados do gráfico
 */
export interface DadosGrafico {
  labels: string[];        // Datas no eixo X
  datasets: {
    label: string;
    data: number[];        // Valores no eixo Y
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}
