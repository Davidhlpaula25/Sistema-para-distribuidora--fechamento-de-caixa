import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  orderBy,
  Timestamp,
  getDocs,
  QueryConstraint
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { FechamentoCaixa } from '../models/fechamento-caixa.model';

@Injectable({
  providedIn: 'root'
})
export class FechamentoCaixaService {
  private firestore = inject(Firestore);

  /**
   * Salva um novo fechamento de caixa no Firestore
   */
  async salvarFechamento(fechamento: FechamentoCaixa): Promise<string> {
    try {
      const fechamentosCol = collection(this.firestore, 'fechamentos');
      const docRef = await addDoc(fechamentosCol, fechamento);
      console.log('Fechamento salvo com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar fechamento:', error);
      throw error;
    }
  }

  /**
   * Busca todos os fechamentos
   */
  obterTodosFechamentos(): Observable<FechamentoCaixa[]> {
    const fechamentosCol = collection(this.firestore, 'fechamentos');
    const q = query(fechamentosCol, orderBy('data', 'desc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FechamentoCaixa[];
      })
    );
  }

  /**
   * Filtra fechamentos por período de data
   */
  filtrarPorPeriodo(dataInicio: Date, dataFim: Date): Observable<FechamentoCaixa[]> {
    // Ajusta a data fim para incluir todo o dia
    const dataFimAjustada = new Date(dataFim);
    dataFimAjustada.setHours(23, 59, 59, 999);

    const timestampInicio = Timestamp.fromDate(dataInicio);
    const timestampFim = Timestamp.fromDate(dataFimAjustada);

    const fechamentosCol = collection(this.firestore, 'fechamentos');
    const q = query(
      fechamentosCol,
      where('data', '>=', timestampInicio),
      where('data', '<=', timestampFim),
      orderBy('data', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FechamentoCaixa[];
      })
    );
  }

  /**
   * Calcula KPIs a partir de uma lista de fechamentos
   */
  calcularKPIs(fechamentos: FechamentoCaixa[]) {
    const totalVendido = fechamentos.reduce((acc, f) => acc + f.totalGeral, 0);
    const quantidadeFechamentos = fechamentos.length;
    const ticketMedio = quantidadeFechamentos > 0 ? totalVendido / quantidadeFechamentos : 0;
    const totalDinheiro = fechamentos.reduce((acc, f) => acc + f.totalDinheiro, 0);
    const totalCartao = fechamentos.reduce((acc, f) => acc + f.totalCartao, 0);
    const totalPix = fechamentos.reduce((acc, f) => acc + f.totalPix, 0);
    const totalSangria = fechamentos.reduce((acc, f) => acc + f.sangria, 0);

    return {
      totalVendido,
      ticketMedio,
      totalDinheiro,
      totalCartao,
      totalPix,
      totalSangria,
      quantidadeFechamentos
    };
  }

  /**
   * Prepara dados para o gráfico de evolução
   */
  prepararDadosGrafico(fechamentos: FechamentoCaixa[]) {
    // Agrupa fechamentos por data
    const fechamentosPorData = new Map<string, number>();

    fechamentos.forEach(fechamento => {
      const data = fechamento.data.toDate();
      const dataKey = data.toLocaleDateString('pt-BR');
      
      const totalExistente = fechamentosPorData.get(dataKey) || 0;
      fechamentosPorData.set(dataKey, totalExistente + fechamento.totalGeral);
    });

    // Ordena as datas
    const datasOrdenadas = Array.from(fechamentosPorData.keys()).sort((a, b) => {
      const [diaA, mesA, anoA] = a.split('/').map(Number);
      const [diaB, mesB, anoB] = b.split('/').map(Number);
      return new Date(anoA, mesA - 1, diaA).getTime() - new Date(anoB, mesB - 1, diaB).getTime();
    });

    const valores = datasOrdenadas.map(data => fechamentosPorData.get(data) || 0);

    return {
      labels: datasOrdenadas,
      datasets: [{
        label: 'Faturamento Diário (R$)',
        data: valores,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4
      }]
    };
  }
}
