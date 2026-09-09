
    let chartReceitaInstance = null;

    window.addEventListener('DOMContentLoaded', () => {
      initCharts();
      initMobileSidebar();
    });

    function toggleMobileSidebar(force) {
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const toggleBtn = document.getElementById('sidebar-toggle');
      if (!sidebar || !backdrop) return;
      const isOpen = (typeof force === 'boolean') ? force : !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', isOpen);
      backdrop.classList.toggle('open', isOpen);
      document.body.classList.toggle('sidebar-open', isOpen);
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', isOpen);
        toggleBtn.innerHTML = isOpen ? '✕' : '☰';
      }
    }

    function toggleSidebarCollapse() {
      document.body.classList.toggle('collapsed');
    }

    function initMobileSidebar() {
      const toggleBtn = document.getElementById('sidebar-toggle');
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');

      if (toggleBtn) {
        toggleBtn.removeAttribute('onclick');
        toggleBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMobileSidebar();
        });
      }

      if (backdrop) {
        backdrop.removeAttribute('onclick');
        backdrop.addEventListener('click', function(e) {
          e.preventDefault();
          toggleMobileSidebar(false);
        });
      }

      if (sidebar) {
        sidebar.querySelectorAll('.sidebar-link').forEach(link => {
          link.addEventListener('click', function() {
            toggleMobileSidebar(false);
          });
        });
      }
    }


    function initCharts() {
      const ctxReceita = document.getElementById('chartReceitaMock');
      if (ctxReceita && window.Chart) {
        chartReceitaInstance = new Chart(ctxReceita, {
          type: 'line',
          data: {
            labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set'],
            datasets: [{
              label: 'Receita',
              data: [32000, 41000, 54000, 68300, 89300],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#86868b', font: { size: 11 } } },
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#86868b', font: { size: 11 } } }
            }
          }
        });
      }

      const ctxConv = document.getElementById('chartConversaoMock');
      if (ctxConv && window.Chart) {
        new Chart(ctxConv, {
          type: 'doughnut',
          data: {
            labels: ['Aprovadas (87.5%)', 'Em Análise (12.5%)'],
            datasets: [{
              data: [42, 6],
              backgroundColor: ['#34c759', '#6366f1'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 900 },
            plugins: { legend: { position: 'bottom', labels: { color: '#86868b', font: { size: 11 } } } },
            cutout: '72%'
          }
        });
      }
    }

    function switchPeriod(period, btn) {
      document.querySelectorAll('.period-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      const elReceita = document.getElementById('metric-receita');
      const elLucro = document.getElementById('metric-lucro');
      const elMargem = document.getElementById('metric-margem');
      const elSub = document.getElementById('metric-receita-sub');

      if (period === '30d') {
        if(elReceita) elReceita.textContent = 'R$ 89.300,00';
        if(elLucro) elLucro.textContent = 'R$ 38.220,00';
        if(elMargem) elMargem.textContent = '42.8%';
        if(elSub) elSub.textContent = '12 propostas faturadas';
        if (chartReceitaInstance) {
          chartReceitaInstance.data.labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
          chartReceitaInstance.data.datasets[0].data = [18000, 22400, 26900, 22000];
          chartReceitaInstance.update();
        }
      } else if (period === 'trimestre') {
        if(elReceita) elReceita.textContent = 'R$ 194.200,00';
        if(elLucro) elLucro.textContent = 'R$ 79.620,00';
        if(elMargem) elMargem.textContent = '41.0%';
        if(elSub) elSub.textContent = '28 propostas faturadas';
        if (chartReceitaInstance) {
          chartReceitaInstance.data.labels = ['Julho', 'Agosto', 'Setembro'];
          chartReceitaInstance.data.datasets[0].data = [54000, 68300, 89300];
          chartReceitaInstance.update();
        }
      } else {
        if(elReceita) elReceita.textContent = 'R$ 284.600,00';
        if(elLucro) elLucro.textContent = 'R$ 117.255,00';
        if(elMargem) elMargem.textContent = '41.2%';
        if(elSub) elSub.textContent = '42 propostas faturadas';
        if (chartReceitaInstance) {
          chartReceitaInstance.data.labels = ['Mai', 'Jun', 'Jul', 'Ago', 'Set'];
          chartReceitaInstance.data.datasets[0].data = [32000, 41000, 54000, 68300, 89300];
          chartReceitaInstance.update();
        }
      }

      showToast(`Visualização atualizada para: ${btn.textContent.trim()}`);
    }

    function showToast(msg) {
      const slot = document.getElementById('toast-slot');
      if (!slot) return;
      const toast = document.createElement('div');
      toast.className = 'mock-toast';
      toast.innerHTML = `<span>⚡</span><span>${msg}</span>`;
      slot.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 2500);
    }
  