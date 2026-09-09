
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

    

    function filterPropostas(status, btn) {
      document.querySelectorAll('.tab-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const rows = document.querySelectorAll('.prop-row');
      let visibleCount = 0;

      rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        if (status === 'todas' || rowStatus === status) {
          row.style.display = '';
          row.style.animation = 'rowFadeIn 0.25s ease-out';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      document.getElementById('footer-count').textContent = `Mostrando ${visibleCount} de ${rows.length} propostas`;
      showToast(`Filtro aplicado: ${btn.textContent.trim()}`);
    }

    function buscarPropostas(query) {
      const q = query.toLowerCase().trim();
      const rows = document.querySelectorAll('.prop-row');
      let visible = 0;

      rows.forEach(row => {
        const text = row.getAttribute('data-search') || '';
        if (text.includes(q)) {
          row.style.display = '';
          visible++;
        } else {
          row.style.display = 'none';
        }
      });

      document.getElementById('footer-count').textContent = `Mostrando ${visible} propostas encontradas`;
    }

    function openDetalhesModal(code, title, client, val, margin, status) {
      const modalSlot = document.getElementById('modal-slot');
      modalSlot.innerHTML = `
        <div class="mock-modal-overlay" onclick="if(event.target === this) closeModal()">
          <div class="mock-modal-card">
            <button type="button" class="mock-modal-close" onclick="closeModal()">✕</button>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--accent-purple-light);margin-bottom:6px">
              ✦ Detalhes da Proposta Comercial • ${code}
            </div>
            <h2 style="font-size:18px;font-weight:600;color:#fff;margin:0 0 12px 0">${title}</h2>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;background:rgba(255,255,255,0.03);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.06)">
              <div>
                <div style="font-size:11px;color:#86868b">Cliente Contratante</div>
                <strong style="font-size:13px;color:#fff">${client}</strong>
              </div>
              <div>
                <div style="font-size:11px;color:#86868b">Status do Contrato</div>
                <strong style="font-size:13px;color:#34c759">${status}</strong>
              </div>
              <div>
                <div style="font-size:11px;color:#86868b">Valor Total Sugerido</div>
                <strong style="font-size:16px;color:#2997ff">${val}</strong>
              </div>
              <div>
                <div style="font-size:11px;color:#86868b">Margem Líquida Real</div>
                <strong style="font-size:16px;color:#34c759">${margin}</strong>
              </div>
            </div>

            <div style="margin-bottom:18px">
              <div style="font-size:12px;font-weight:600;color:#86868b;text-transform:uppercase;margin-bottom:6px">Escopo & Entregáveis</div>
              <ul style="font-size:12px;color:#d1d5db;padding-left:18px;line-height:1.6;margin:0">
                <li>Arquitetura de microsserviços cloud com alta disponibilidade</li>
                <li>Garantia e envelope de entrega de segurança contra imprevistos</li>
                <li>Documentação técnica executiva e homologação com cliente</li>
              </ul>
            </div>

            <div style="padding:12px;background:rgba(52,199,89,0.08);border:1px solid rgba(52,199,89,0.25);border-radius:8px;display:flex;align-items:center;gap:10px;margin-bottom:18px">
              <span style="font-size:18px">🛡️</span>
              <div style="font-size:11px;color:#a1a1aa">
                <strong style="color:#34c759">Selo de Proteção de Margem ARNIX:</strong> Esta proposta foi calculada pelo motor de Envelopes de Segurança, sem riscos de perdas invisíveis.
              </div>
            </div>

            <div style="display:flex;gap:10px;justify-content:flex-end">
              <button type="button" class="btn btn-secondary" onclick="closeModal()">Fechar</button>
              <button type="button" class="btn btn-primary" onclick="closeModal(); exportarPDFMock('${code}')">📄 Baixar PDF</button>
            </div>
          </div>
        </div>
      `;
    }

    function openNovaPropostaModal() {
      const modalSlot = document.getElementById('modal-slot');
      modalSlot.innerHTML = `
        <div class="mock-modal-overlay" onclick="if(event.target === this) closeModal()">
          <div class="mock-modal-card">
            <button type="button" class="mock-modal-close" onclick="closeModal()">✕</button>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--accent-purple-light);margin-bottom:6px">
              ✦ Nova Proposta Comercial (Demonstração)
            </div>
            <h2 style="font-size:18px;font-weight:600;color:#fff;margin:0 0 16px 0">Cadastrar Proposta no Pipeline</h2>
            
            <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:20px">
              <div>
                <label style="font-size:12px;color:#86868b;display:block;margin-bottom:4px">Título do Projeto</label>
                <input type="text" value="Modernização de Infraestrutura Cloud" style="width:100%;background:#11111b;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:8px 12px;border-radius:6px;font-size:13px">
              </div>
              <div>
                <label style="font-size:12px;color:#86868b;display:block;margin-bottom:4px">Cliente</label>
                <input type="text" value="Nexus FinTech Brasil" style="width:100%;background:#11111b;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:8px 12px;border-radius:6px;font-size:13px">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div>
                  <label style="font-size:12px;color:#86868b;display:block;margin-bottom:4px">Valor Estimado</label>
                  <input type="text" value="R$ 42.000,00" style="width:100%;background:#11111b;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:8px 12px;border-radius:6px;font-size:13px">
                </div>
                <div>
                  <label style="font-size:12px;color:#86868b;display:block;margin-bottom:4px">Margem Alvo</label>
                  <input type="text" value="40%" style="width:100%;background:#11111b;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:8px 12px;border-radius:6px;font-size:13px">
                </div>
              </div>
            </div>

            <div style="display:flex;gap:10px;justify-content:flex-end">
              <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
              <button type="button" class="btn btn-primary" onclick="closeModal(); showToast('✓ Nova proposta PRO-2026-091 criada e adicionada ao Pipeline!')">Salvar Proposta</button>
            </div>
          </div>
        </div>
      `;
    }

    function closeModal() {
      const modalSlot = document.getElementById('modal-slot');
      modalSlot.innerHTML = '';
    }

    function exportarPDFMock(code) {
      showToast(`📄 Gerando PDF executivo da proposta comercial ${code}...`);
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
  