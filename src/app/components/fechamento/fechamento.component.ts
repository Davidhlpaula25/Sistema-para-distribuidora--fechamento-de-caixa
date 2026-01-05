import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FechamentoCaixaService } from '../../services/fechamento-caixa.service';
import { DetalheDinheiro, FechamentoCaixa } from '../../models/fechamento-caixa.model';
import { Timestamp } from '@angular/fire/firestore';

interface DenominacaoItem {
  valor: number;
  tipo: 'moeda' | 'cedula';
  quantidade: number;
}

@Component({
  selector: 'app-fechamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fechamento.component.html',
  styleUrls: ['./fechamento.component.css']
})
export class FechamentoComponent {
  private fechamentoService = inject(FechamentoCaixaService);
  private router = inject(Router);

  // Denominações fixas de moedas e cédulas
  denominacoes = signal<DenominacaoItem[]>([
    { valor: 0.05, tipo: 'moeda', quantidade: 0 },
    { valor: 0.10, tipo: 'moeda', quantidade: 0 },
    { valor: 0.25, tipo: 'moeda', quantidade: 0 },
    { valor: 0.50, tipo: 'moeda', quantidade: 0 },
    { valor: 1.00, tipo: 'moeda', quantidade: 0 },
    { valor: 2, tipo: 'cedula', quantidade: 0 },
    { valor: 5, tipo: 'cedula', quantidade: 0 },
    { valor: 10, tipo: 'cedula', quantidade: 0 },
    { valor: 20, tipo: 'cedula', quantidade: 0 },
    { valor: 50, tipo: 'cedula', quantidade: 0 },
    { valor: 100, tipo: 'cedula', quantidade: 0 },
    { valor: 200, tipo: 'cedula', quantidade: 0 }
  ]);

  // Signals para valores extras
  dataFechamento = signal<string>(this.obterDataHoje());
  totalCartao = signal<number>(0);
  totalPix = signal<number>(0);
  sangria = signal<number>(0);

  // Estados da UI
  salvando = signal<boolean>(false);
  mensagemSucesso = signal<string>('');

  // Computed: Calcula o total em dinheiro automaticamente
  totalDinheiro = computed(() => {
    return this.denominacoes().reduce((total, item) => {
      return total + (item.valor * item.quantidade);
    }, 0);
  });

  // Computed: Calcula o total geral automaticamente
  totalGeral = computed(() => {
    return this.totalDinheiro() + 
           this.totalCartao() + 
           this.totalPix() - 
           this.sangria();
  });

  /**
   * Atualiza a quantidade de uma denominação específica
   */
  atualizarQuantidade(index: number, quantidade: number): void {
    const denominacoesAtuais = this.denominacoes();
    denominacoesAtuais[index].quantidade = quantidade || 0;
    this.denominacoes.set([...denominacoesAtuais]);
  }

  /**
   * Calcula o subtotal de uma denominação específica
   */
  calcularSubtotal(item: DenominacaoItem): number {
    return item.valor * item.quantidade;
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
   * Reseta todos os campos
   */
  resetarFormulario(): void {
    this.denominacoes.set(this.denominacoes().map(item => ({
      ...item,
      quantidade: 0
    })));
    this.dataFechamento.set(this.obterDataHoje());
    this.totalCartao.set(0);
    this.totalPix.set(0);
    this.sangria.set(0);
    this.mensagemSucesso.set('');
  }

  /**
   * Salva o fechamento no Firestore
   */
  async fecharCaixa(): Promise<void> {
    if (this.salvando()) return;

    this.salvando.set(true);
    this.mensagemSucesso.set('');

    try {
      // Prepara o array de detalhes do dinheiro
      const detalhesDinheiro: DetalheDinheiro[] = this.denominacoes()
        .filter(item => item.quantidade > 0)
        .map(item => ({
          valorUnitario: item.valor,
          quantidade: item.quantidade,
          subtotal: item.valor * item.quantidade
        }));

      // Converte a data selecionada para Timestamp
      const dataSelecionada = new Date(this.dataFechamento());
      // Ajusta para incluir a hora atual
      const agora = new Date();
      dataSelecionada.setHours(agora.getHours(), agora.getMinutes(), agora.getSeconds());

      // Cria o objeto de fechamento
      const fechamento: FechamentoCaixa = {
        data: Timestamp.fromDate(dataSelecionada),
        detalhesDinheiro,
        totalDinheiro: this.totalDinheiro(),
        totalCartao: this.totalCartao(),
        totalPix: this.totalPix(),
        sangria: this.sangria(),
        totalGeral: this.totalGeral()
      };

      // Salva no Firestore
      await this.fechamentoService.salvarFechamento(fechamento);

      this.mensagemSucesso.set('✅ Fechamento de caixa salvo com sucesso!');
      
      // Reseta o formulário após 2 segundos
      setTimeout(() => {
        this.resetarFormulario();
      }, 2000);

    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      alert('Erro ao salvar fechamento. Verifique o console.');
    } finally {
      this.salvando.set(false);
    }
  }

  /**
   * Navega para a tela de relatórios
   */
  irParaRelatorios(): void {
    this.router.navigate(['/relatorios']);
  }

  /**
   * Retorna a data de hoje para uso no template
   */
  obterDataHoje(): string {
    return new Date().toISOString().split('T')[0];
  }
}
