import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FechamentoCaixaService } from '../../services/fechamento-caixa.service';
import { FechamentoCaixa, KPI } from '../../models/fechamento-caixa.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  private fechamentoService = inject(FechamentoCaixaService);
  private router = inject(Router);

  // Signals para filtros
  dataInicio = signal<string>(this.obterDataHoje(-7)); // Últimos 7 dias
  dataFim = signal<string>(this.obterDataHoje(0));

  // Signals para dados
  fechamentos = signal<FechamentoCaixa[]>([]);
  kpis = signal<KPI>({
    totalVendido: 0,
    ticketMedio: 0,
    totalDinheiro: 0,
    totalCartao: 0,
    totalPix: 0,
    totalSangria: 0,
    quantidadeFechamentos: 0
  });

  // Estados da UI
  carregando = signal<boolean>(false);
  
  // Configuração do Gráfico
  chartData = signal<ChartConfiguration['data']>({
    labels: [],
    datasets: []
  });

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Evolução do Faturamento',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  ngOnInit(): void {
    this.filtrarRelatorios();
  }

  /**
   * Obtém uma data relativa ao dia atual
   */
  private obterDataHoje(diasOffset: number): string {
    const data = new Date();
    data.setDate(data.getDate() + diasOffset);
    return data.toISOString().split('T')[0];
  }

  /**
   * Filtra relatórios por período
   */
  filtrarRelatorios(): void {
    this.carregando.set(true);

    const inicio = new Date(this.dataInicio());
    const fim = new Date(this.dataFim());

    this.fechamentoService.filtrarPorPeriodo(inicio, fim).subscribe({
      next: (fechamentos) => {
        this.fechamentos.set(fechamentos);
        
        // Calcula KPIs
        const kpis = this.fechamentoService.calcularKPIs(fechamentos);
        this.kpis.set(kpis);

        // Prepara dados do gráfico
        const dadosGrafico = this.fechamentoService.prepararDadosGrafico(fechamentos);
        this.chartData.set(dadosGrafico);

        this.carregando.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar fechamentos:', error);
        this.carregando.set(false);
      }
    });
  }

  /**
   * Formata valor monetário
   */
  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  /**
   * Formata data/hora do Timestamp
   */
  formatarData(timestamp: any): string {
    const data = timestamp.toDate();
    return data.toLocaleString('pt-BR');
  }

  /**
   * Exporta dados para Excel
   */
  exportarExcel(): void {
    const dadosExcel = this.fechamentos().map(f => ({
      'Data': this.formatarData(f.data),
      'Total Dinheiro': f.totalDinheiro,
      'Total Cartão': f.totalCartao,
      'Total PIX': f.totalPix,
      'Sangria': f.sangria,
      'Total Geral': f.totalGeral
    }));

    const ws = XLSX.utils.json_to_sheet(dadosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fechamentos');
    
    const nomeArquivo = `fechamentos_${this.dataInicio()}_a_${this.dataFim()}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);
  }

  /**
   * Exporta dados para PDF
   */
  exportarPDF(): void {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Fechamentos de Caixa', 14, 20);
    
    // Período
    doc.setFontSize(12);
    doc.text(`Período: ${this.dataInicio()} a ${this.dataFim()}`, 14, 30);
    
    // KPIs
    doc.setFontSize(10);
    doc.text(`Total Vendido: ${this.formatarMoeda(this.kpis().totalVendido)}`, 14, 40);
    doc.text(`Ticket Médio: ${this.formatarMoeda(this.kpis().ticketMedio)}`, 14, 47);
    
    // Tabela
    const dadosTabela = this.fechamentos().map(f => [
      this.formatarData(f.data),
      this.formatarMoeda(f.totalDinheiro),
      this.formatarMoeda(f.totalCartao),
      this.formatarMoeda(f.totalPix),
      this.formatarMoeda(f.sangria),
      this.formatarMoeda(f.totalGeral)
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Data', 'Dinheiro', 'Cartão', 'PIX', 'Sangria', 'Total']],
      body: dadosTabela,
      theme: 'grid',
      headStyles: { fillColor: [44, 62, 80] },
      styles: { fontSize: 8 }
    });
    
    const nomeArquivo = `fechamentos_${this.dataInicio()}_a_${this.dataFim()}.pdf`;
    doc.save(nomeArquivo);
  }

  /**
   * Navega para a tela de fechamento
   */
  irParaFechamento(): void {
    this.router.navigate(['/fechamento']);
  }
}
