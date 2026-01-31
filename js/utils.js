// Función para cargar datos desde GitHub Pages o local
async function loadData() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages 
        ? window.location.pathname.split('/').slice(0, -2).join('/') + '/'
        : '../';
    
    try {
        const [charactersRes, fruitsRes, shipsRes] = await Promise.all([
            fetch(basePath + 'characters.json'),
            fetch(basePath + 'fruits.json'),
            fetch(basePath + 'ships.json')
        ]);
        
        const characters = await charactersRes.json();
        const fruits = await fruitsRes.json();
        const ships = await shipsRes.json();
        
        return { characters, fruits, ships };
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Función para obtener caracteres válidos por dificultad
function getValidCharactersByDifficulty(characters, difficultyLevels) {
    return characters.filter(c => 
        c.Nombre && difficultyLevels.includes(parseInt(c.Dificultad))
    );
}

// Función para formatear nombres con /
function formatNameWithSlash(name) {
    if (!name) return name;
    return name.replace(/\s*\/\s*/g, '<br>');
}

// Función para formatear valores múltiples (con comas)
function formatMultiValue(value) {
    if (!value || value === '---') return value;
    return value.split(',').map(v => v.trim()).join('<br>');
}

// Función para comparar cumpleaños
function compareBirthdays(guessVal, targetVal) {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const parseDate = (str) => {
        const parts = str.toLowerCase().split(' ').filter(p => p);
        if (parts.length < 2) return null;
        const day = parseInt(parts[0]);
        const monthIdx = months.indexOf(parts[1]);
        return monthIdx !== -1 ? { day, month: monthIdx } : null;
    };
    
    const gDate = parseDate(guessVal);
    const tDate = parseDate(targetVal);
    
    if (!gDate || !tDate) return null;
    
    const gTotal = gDate.month * 31 + gDate.day;
    const tTotal = tDate.month * 31 + tDate.day;
    
    return gTotal < tTotal ? '↑' : (gTotal > tTotal ? '↓' : null);
}

// Exportar funciones globalmente
window.loadData = loadData;
window.getValidCharactersByDifficulty = getValidCharactersByDifficulty;
window.formatNameWithSlash = formatNameWithSlash;
window.formatMultiValue = formatMultiValue;
window.compareBirthdays = compareBirthdays;
