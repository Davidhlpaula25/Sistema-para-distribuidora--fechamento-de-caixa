import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fechamento',
    pathMatch: 'full'
  },
  {
    path: 'fechamento',
    loadComponent: () => 
      import('./components/fechamento/fechamento.component').then(m => m.FechamentoComponent),
    title: 'Fechamento de Caixa'
  },
  {
    path: 'relatorios',
    loadComponent: () => 
      import('./components/relatorios/relatorios.component').then(m => m.RelatoriosComponent),
    title: 'Relatórios e Dashboard'
  },
  {
    path: '**',
    redirectTo: 'fechamento'
  }
];
