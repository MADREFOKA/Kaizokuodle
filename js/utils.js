// Load game data
let characters = [];
let fruits = [];
let ships = [];

async function loadData() {
    try {
        const [charsRes, fruitsRes, shipsRes] = await Promise.all([
            fetch('../characters.json'),
            fetch('../fruits.json'),
            fetch('../ships.json')
        ]);
        
        characters = await charsRes.json();
        fruits = await fruitsRes.json();
        ships = await shipsRes.json();
        
        return { characters, fruits, ships };
    } catch (error) {
        console.error('Error loading data:', error);
        return { characters: [], fruits: [], ships: [] };
    }
}

// Stats management
function saveStats(gameName, stats) {
    const allStats = JSON.parse(localStorage.getItem('opGamesStats') || '{}');
    allStats[gameName] = {
        ...(allStats[gameName] || {}),
        ...stats,
        lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('opGamesStats', JSON.stringify(allStats));
}

function getStats(gameName) {
    const allStats = JSON.parse(localStorage.getItem('opGamesStats') || '{}');
    return allStats[gameName] || {};
}

// Utility functions
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function parseNumeric(value) {
    return parseFloat(value.replace(/[^\d.]/g, ''));
}

function isEmptyValue(value) {
    return !value || value === '---' || value.trim() === '';
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadData,
        saveStats,
        getStats,
        shuffleArray,
        getRandomElement,
        parseNumeric,
        isEmptyValue
    };
}
