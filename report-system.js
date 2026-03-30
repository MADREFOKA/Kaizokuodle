// Sistema de Reporte de Errores
// Los reportes se envían a Google Sheets via Apps Script
// Configura REPORT_WEBHOOK_URL con la URL de tu Apps Script desplegado

const REPORT_WEBHOOK_URL = ''; // <-- PEGA AQUÍ TU URL DE APPS SCRIPT

class ErrorReporter {
    constructor(gameName) {
        this.gameName = gameName;
        this.setupButton();
    }

    setupButton() {
        const button = document.createElement('button');
        button.innerHTML = '⚠️ Reportar Error';
        button.style.cssText = `
            position:fixed;bottom:20px;right:20px;padding:.75rem 1.5rem;
            background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border:none;
            border-radius:25px;font-weight:700;font-size:.95rem;cursor:pointer;
            box-shadow:0 4px 15px rgba(239,68,68,.4);z-index:9999;transition:all .3s;
            font-family:'Outfit',sans-serif;`;
        button.onmouseover = () => { button.style.transform='scale(1.05)'; };
        button.onmouseout  = () => { button.style.transform='scale(1)'; };
        button.onclick = () => this.openModal();
        document.body.appendChild(button);
    }

    openModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;
            justify-content:center;align-items:center;z-index:10000;`;
        modal.innerHTML = `
            <div style="background:white;border-radius:20px;padding:2rem;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3);">
                <h2 style="font-family:'Bangers',cursive;font-size:2rem;color:#ef4444;margin-bottom:.5rem;text-align:center;">⚠️ REPORTAR ERROR</h2>
                <p style="color:#666;margin-bottom:1.2rem;text-align:center;font-size:.9rem;">Juego: <strong>${this.gameName}</strong></p>
                <div style="margin-bottom:.8rem;">
                    <label style="display:block;color:#1a1a2e;font-weight:600;margin-bottom:.4rem;">Tipo:</label>
                    <select id="rType" style="width:100%;padding:.7rem;border:2px solid #e5e7eb;border-radius:10px;font-size:1rem;">
                        <option value="bug">🐛 Bug / Error técnico</option>
                        <option value="data">📊 Datos incorrectos</option>
                        <option value="visual">🎨 Problema visual</option>
                        <option value="gameplay">🎮 Jugabilidad</option>
                        <option value="other">💡 Sugerencia / Otro</option>
                    </select>
                </div>
                <div style="margin-bottom:1.2rem;">
                    <label style="display:block;color:#1a1a2e;font-weight:600;margin-bottom:.4rem;">Descripción:</label>
                    <textarea id="rDesc" style="width:100%;padding:.7rem;border:2px solid #e5e7eb;border-radius:10px;font-size:.95rem;min-height:100px;resize:vertical;font-family:'Outfit',sans-serif;" placeholder="Describe el error..."></textarea>
                </div>
                <div style="display:flex;gap:.8rem;">
                    <button id="rCancel" style="flex:1;padding:.7rem;border:2px solid #e5e7eb;background:white;color:#666;border-radius:10px;font-weight:600;cursor:pointer;font-size:1rem;">Cancelar</button>
                    <button id="rSubmit" style="flex:2;padding:.7rem;border:none;background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border-radius:10px;font-weight:700;cursor:pointer;font-size:1rem;">Enviar Reporte</button>
                </div>
                <p id="rStatus" style="margin-top:.8rem;font-size:.82rem;color:#999;text-align:center;"></p>
            </div>`;

        document.body.appendChild(modal);
        modal.querySelector('#rCancel').onclick = () => modal.remove();
        modal.onclick = e => { if (e.target===modal) modal.remove(); };
        modal.querySelector('#rSubmit').onclick = () => {
            const type = modal.querySelector('#rType').value;
            const desc = modal.querySelector('#rDesc').value.trim();
            if (!desc) { alert('Describe el error por favor'); return; }
            this.submit(type, desc, modal);
        };
    }

    async submit(type, description, modal) {
        const btn = modal.querySelector('#rSubmit');
        const status = modal.querySelector('#rStatus');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        const report = {
            juego: this.gameName,
            tipo: type,
            descripcion: description,
            fecha: new Date().toLocaleString('es-ES'),
            url: window.location.href
        };

        // Guardar siempre en localStorage como backup
        const local = JSON.parse(localStorage.getItem('errorReports') || '[]');
        local.push(report);
        localStorage.setItem('errorReports', JSON.stringify(local));

        // Enviar a Google Sheets si hay URL configurada
        if (REPORT_WEBHOOK_URL) {
            try {
                await fetch(REPORT_WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(report)
                });
                status.style.color = '#10b981';
                status.textContent = '✓ Reporte enviado correctamente';
                setTimeout(() => modal.remove(), 1500);
            } catch (e) {
                status.style.color = '#ef4444';
                status.textContent = 'Error de red. Reporte guardado localmente.';
                btn.disabled = false;
                btn.textContent = 'Reintentar';
            }
        } else {
            // Sin URL configurada: descargar JSON como antes
            this.download(local);
            status.style.color = '#f59e0b';
            status.textContent = '⚠️ Sin webhook configurado. Descargando reporte...';
            setTimeout(() => modal.remove(), 2000);
        }
    }

    download(reports) {
        const blob = new Blob([JSON.stringify(reports, null, 2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'reports.json';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    }
}
