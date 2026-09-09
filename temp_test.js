
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

    
    }


    let currentUrgencyMultiplier = 1.0;

    // Mobile Hamburger Menu Handler
    window.addEventListener('DOMContentLoaded', () => {
      initMobileSidebar();
    });

    function initMobileSidebar() {
      const toggleBtn = document.getElementById('sidebar-toggle');
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (!toggleBtn || !sidebar || !backdrop) return;

      function setMenuState(open) {
        sidebar.classList.toggle('open', open);
        backdrop.classList.toggle('open', open);
        document.body.classList.toggle('sidebar-open', open);
        toggleBtn.setAttribute('aria-expanded', open);
        toggleBtn.innerHTML = open ? '✕' : '☰';
      }

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !sidebar.classList.contains('open');
        setMenuState(willOpen);
      });

      backdrop.addEventListener('click', () => {
        setMenuState(false);
      });

      sidebar.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
          setMenuState(false);
        });
      });
    }

    function formatBRL(num) {
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function setUrgency(multiplier, el) {
      currentUrgencyMultiplier = multiplier;
      document.querySelectorAll('.urgency-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      recalcMock();
      showToast(`Multiplicador de urgência ajustado: ${multiplier}x`);
    }

    function applyPreset(horas, valorHora, margem, btn) {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.getElementById('range-horas').value = horas;
      document.getElementById('range-valor-hora').value = valorHora;
      document.getElementById('range-margem').value = margem;

      recalcMock();
      showToast(`Preset aplicado: ${horas}h × R${valorHora}/h`);
    }

    function recalcMock() {
      const horas = Number(document.getElementById('range-horas').value);
      const valorHora = Number(document.getElementById('range-valor-hora').value);
      const margem = Number(document.getElementById('range-margem').value);

      // Atualiza labels dos sliders
      document.getElementById('label-horas').textContent = `${horas} horas`;
      document.getElementById('slider-sub-horas').textContent = `${horas} horas`;

      document.getElementById('label-valor-hora').textContent = `${formatBRL(valorHora)} / hora`;
      document.getElementById('slider-sub-valor').textContent = formatBRL(valorHora);

      document.getElementById('label-margem').textContent = `${margem}% de Lucro Real`;
      document.getElementById('slider-sub-margem').textContent = `${margem}% Selecionado`;

      // Simulação simples e ilustrativa
      const custoHoras = horas * valorHora;
      const custosFixos = 500;
      const amortizacao = 350;
      const custosTotais = custoHoras + custosFixos + amortizacao;

      const fatorMargem = (1 - (margem / 100)) || 0.6;
      let precoBase = Math.round(custosTotais / fatorMargem);
      
      const taxaUrgencia = Math.round(precoBase * (currentUrgencyMultiplier - 1.0));
      const precoIdeal = precoBase + taxaUrgencia;
      const piso = Math.round(custosTotais * 1.12);
      const teto = Math.round(precoIdeal * 1.25);
      const lucroReal = Math.round(precoIdeal - custosTotais);
      const valorHoraEfetivo = (precoIdeal / horas).toFixed(2);

      // Animação de pulso no número principal
      const numEl = document.getElementById('display-preco-final');
      numEl.classList.remove('bump');
      void numEl.offsetWidth;
      numEl.classList.add('bump');

      // Atualiza displays
      numEl.textContent = formatBRL(precoIdeal);
      document.getElementById('display-hora-efetiva').textContent = `${formatBRL(Number(valorHoraEfetivo))} / h`;

      document.getElementById('display-piso').textContent = formatBRL(piso);
      document.getElementById('display-ideal').textContent = formatBRL(precoIdeal);
      document.getElementById('display-sub-margem').textContent = `margem líquida ${margem}%`;
      document.getElementById('display-teto').textContent = formatBRL(teto);

      document.getElementById('lbl-horas-valor').textContent = `Horas Técnicas (${horas}h × ${formatBRL(valorHora)})`;
      document.getElementById('display-subtotal-horas').textContent = formatBRL(custoHoras);
      document.getElementById('display-taxa-urgencia').textContent = formatBRL(taxaUrgencia);
      document.getElementById('lbl-margem-pct').textContent = `Margem Líquida Real (${margem}%)`;
      document.getElementById('display-lucro-real').textContent = `+ ${formatBRL(lucroReal)}`;
      document.getElementById('display-total-row').textContent = formatBRL(precoIdeal);

      document.getElementById('display-indicador-lucro').textContent = `${margem}.0% Líquido`;
      document.getElementById('display-indicador-hora-efetiva').textContent = `${formatBRL(Number(valorHoraEfetivo))} / h`;
    }

    function salvarPropostaMock() {
      showToast('✓ Proposta comercial gerada com sucesso a partir desta simulação!');
    }

    function showToast(msg) {
      const slot = document.getElementById('toast-slot');
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
  