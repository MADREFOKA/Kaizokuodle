// Sistema de Reporte de Errores - Versión GitHub/Vercel
class ErrorReporter {
    constructor(gameName) {
        this.gameName = gameName;
        this.setupButton();
    }

    setupButton() {
        const button = document.createElement('button');
        button.innerHTML = '⚠️ Reportar Error';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            border-radius: 25px;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
            z-index: 9999;
            transition: all 0.3s;
            font-family: 'Outfit', sans-serif;
        `;
        
        button.onmouseover = () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
        };
        
        button.onclick = () => this.openReportModal();
        
        document.body.appendChild(button);
    }

    openReportModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <h2 style="
                    font-family: 'Bangers', cursive;
                    font-size: 2rem;
                    color: #ef4444;
                    margin-bottom: 1rem;
                    text-align: center;
                ">⚠️ REPORTAR ERROR</h2>
                
                <p style="
                    color: #666;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-size: 0.95rem;
                ">
                    Juego: <strong>${this.gameName}</strong>
                </p>

                <div style="margin-bottom: 1rem;">
                    <label style="
                        display: block;
                        color: #1a1a2e;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    ">Tipo de Error:</label>
                    <select id="errorType" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 2px solid #e5e7eb;
                        border-radius: 10px;
                        font-size: 1rem;
                    ">
                        <option value="bug">🐛 Bug / Error técnico</option>
                        <option value="data">📊 Datos incorrectos</option>
                        <option value="visual">🎨 Problema visual</option>
                        <option value="gameplay">🎮 Jugabilidad</option>
                        <option value="other">💡 Sugerencia / Otro</option>
                    </select>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="
                        display: block;
                        color: #1a1a2e;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    ">Descripción del problema:</label>
                    <textarea id="errorDescription" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 2px solid #e5e7eb;
                        border-radius: 10px;
                        font-size: 1rem;
                        min-height: 120px;
                        resize: vertical;
                        font-family: 'Outfit', sans-serif;
                    " placeholder="Describe el error que encontraste..."></textarea>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button id="cancelBtn" style="
                        flex: 1;
                        padding: 0.75rem;
                        border: 2px solid #e5e7eb;
                        background: white;
                        color: #666;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Cancelar</button>
                    
                    <button id="submitBtn" style="
                        flex: 2;
                        padding: 0.75rem;
                        border: none;
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                        color: white;
                        border-radius: 10px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Enviar Reporte</button>
                </div>

                <p style="
                    margin-top: 1rem;
                    font-size: 0.8rem;
                    color: #999;
                    text-align: center;
                ">
                    Se descargará <strong>reports.json</strong> con todos los reportes.<br>
                    Súbelo a GitHub para actualizar la lista.
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#cancelBtn').onclick = () => {
            document.body.removeChild(modal);
        };

        modal.querySelector('#submitBtn').onclick = () => {
            const type = modal.querySelector('#errorType').value;
            const description = modal.querySelector('#errorDescription').value.trim();
            
            if (!description) {
                alert('Por favor describe el error encontrado');
                return;
            }

            this.submitReport(type, description);
            document.body.removeChild(modal);
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    submitReport(type, description) {
        const report = {
            game: this.gameName,
            type: type,
            description: description,
            timestamp: new Date().toISOString()
        };

        // Guardar en localStorage
        const reports = JSON.parse(localStorage.getItem('errorReports') || '[]');
        reports.push(report);
        localStorage.setItem('errorReports', JSON.stringify(reports));

        // Descargar TODOS los reportes en un solo archivo
        this.downloadAllReports(reports);
        this.showSuccessMessage('✓ Reporte guardado\nDescarga reports.json y súbelo a GitHub');

        console.log('📝 Nuevo reporte:', report);
    }

    downloadAllReports(reports) {
        const filename = 'reports.json';
        
        // Crear y descargar archivo con TODOS los reportes
        const dataStr = JSON.stringify(reports, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showReportText(text) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 2rem; max-width: 600px; width: 90%;">
                <h3 style="color: #1a1a2e; margin-bottom: 1rem;">Copia este reporte:</h3>
                <textarea readonly style="
                    width: 100%;
                    min-height: 200px;
                    padding: 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-family: monospace;
                    font-size: 0.9rem;
                ">${text}</textarea>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    margin-top: 1rem;
                    width: 100%;
                    padding: 0.75rem;
                    background: #10b981;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                ">Cerrar</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showSuccessMessage(text) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            z-index: 10001;
            white-space: pre-line;
            text-align: center;
        `;
        
        message.innerHTML = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 4000);
    }
}
