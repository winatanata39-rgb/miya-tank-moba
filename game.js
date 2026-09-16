// ===== MIYA TANK - Mini MOBA Game =====
// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PLAYER_SIZE = 35;
const TOWER_WIDTH = 40;
const TOWER_HEIGHT = 80;
const POWERUP_SIZE = 20;

// Game State
let gameState = {
    isRunning: true,
    isPaused: false,
    gameOver: false,
    score: 0,
    level: 1,
    hp: 3,
    difficulty: 'normal',
    animationId: null
};

// Player Object (Miya Tank)
let player = {
    x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    y: CANVAS_HEIGHT - 100,
    vx: 0,
    vy: 0,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    jumpPower: -15,
    acceleration: 0.5,
    maxSpeed: 8,
    color: '#38bdf8'
};

// Game Arrays
let towers = [];
let powerUps = [];
let particles = [];

// Difficulty Settings
const difficultySettings = {
    easy: {
        towerSpeed: 3,
        spawnRate: 0.02,
        gravity: 0.4,
        scoreMultiplier: 1
    },
    normal: {
        towerSpeed: 5,
        spawnRate: 0.03,
        gravity: 0.5,
        scoreMultiplier: 1.5
    },
    hard: {
        towerSpeed: 7,
        spawnRate: 0.04,
        gravity: 0.6,
        scoreMultiplier: 2
    }
};

// Get Current Difficulty Settings
function getDiffSettings() {
    return difficultySettings[gameState.difficulty];
}

// Event Listeners
document.addEventListener('click', handleJump);
document.getElementById('gameCanvas').addEventListener('click', handleJump);

document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (!gameState.gameOver) {
            gameState.difficulty = e.target.value;
        }
    });
});

function handleJump() {
    if (gameState.isRunning && !gameState.isPaused && !gameState.gameOver) {
        player.vy = player.jumpPower;
    }
}

function togglePause() {
    if (!gameState.gameOver) {
        gameState.isPaused = !gameState.isPaused;
    }
}

function resetGame() {
    gameState = {
        isRunning: true,
        isPaused: false,
        gameOver: false,
        score: 0,
        level: 1,
        hp: 3,
        difficulty: gameState.difficulty,
        animationId: null
    };
    
    player = {
        x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
        y: CANVAS_HEIGHT - 100,
        vx: 0,
        vy: 0,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        jumpPower: -15,
        acceleration: 0.5,
        maxSpeed: 8,
        color: '#38bdf8'
    };
    
    towers = [];
    powerUps = [];
    particles = [];
    
    document.getElementById('gameOverMessage').textContent = '';
    
    gameLoop();
}

// Spawn Tower
function spawnTower() {
    const settings = getDiffSettings();
    if (Math.random() < settings.spawnRate) {
        towers.push({
            x: CANVAS_WIDTH,
            y: Math.random() * (CANVAS_HEIGHT - TOWER_HEIGHT - 100),
            width: TOWER_WIDTH,
            height: TOWER_HEIGHT,
            speed: settings.towerSpeed,
            color: '#ef4444',
            damage: 1
        });
    }
}

// Spawn Power-Up
function spawnPowerUp() {
    if (Math.random() < 0.01 && powerUps.length < 3) {
        powerUps.push({
            x: Math.random() * (CANVAS_WIDTH - POWERUP_SIZE),
            y: Math.random() * (CANVAS_HEIGHT / 2),
            width: POWERUP_SIZE,
            height: POWERUP_SIZE,
            type: 'health', // 'health' atau 'score'
            color: '#10b981',
            collected: false
        });
    }
}

// Create Particle Effect
function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4,
            life: 30,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

// Update Game Logic
function update() {
    if (gameState.isPaused || gameState.gameOver) return;
    
    const settings = getDiffSettings();
    
    // Update Player
    player.vy += settings.gravity;
    player.y += player.vy;
    
    // Handle horizontal movement (keyboard/touch)
    player.x = Math.max(0, Math.min(player.x, CANVAS_WIDTH - player.width));
    
    // Ground collision
    if (player.y + player.height >= CANVAS_HEIGHT) {
        player.y = CANVAS_HEIGHT - player.height;
        player.vy = 0;
    }
    
    // Spawn new towers
    spawnTower();
    spawnPowerUp();
    
    // Update towers
    towers = towers.filter(tower => {
        tower.x -= tower.speed;
        
        // Collision detection with player
        if (checkCollision(player, tower)) {
            gameState.hp -= tower.damage;
            createParticles(tower.x + tower.width / 2, tower.y + tower.height / 2, '#ef4444');
            
            if (gameState.hp <= 0) {
                endGame();
            }
            return false;
        }
        
        return tower.x + tower.width > 0;
    });
    
    // Update power-ups
    powerUps = powerUps.filter(powerUp => {
        if (!powerUp.collected) {
            // Sway effect
            powerUp.x += Math.sin(Date.now() / 500) * 0.5;
            
            if (checkCollision(player, powerUp)) {
                powerUp.collected = true;
                createParticles(powerUp.x, powerUp.y, '#10b981', 15);
                
                if (powerUp.type === 'health') {
                    gameState.hp = Math.min(3, gameState.hp + 1);
                    gameState.score += 50;
                } else if (powerUp.type === 'score') {
                    gameState.score += 100;
                }
                
                return false;
            }
        }
        
        return !powerUp.collected;
    });
    
    // Update particles
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        return p.life > 0;
    });
    
    // Update score and level
    gameState.score++;
    gameState.level = Math.floor(gameState.score / 500) + 1;
    
    // Update difficulty settings for enemies
    if (gameState.score % 200 === 0) {
        const settings = getDiffSettings();
        settings.towerSpeed += 0.5;
        settings.spawnRate += 0.002;
    }
}

// Collision Detection
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// End Game
function endGame() {
    gameState.gameOver = true;
    gameState.isRunning = false;
    document.getElementById('gameOverMessage').textContent = 
        `💀 GAME OVER! Score: ${gameState.score} | Level: ${gameState.level}`;
}

// Draw Functions
function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, 'rgba(30, 41, 59, 0.1)');
    gradient.addColorStop(1, 'rgba(2, 6, 23, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw Player (Miya Tank)
    drawPlayer();
    
    // Draw Towers
    towers.forEach(tower => drawTower(tower));
    
    // Draw Power-ups
    powerUps.forEach(powerUp => {
        if (!powerUp.collected) {
            drawPowerUp(powerUp);
        }
    });
    
    // Draw Particles
    particles.forEach(particle => drawParticle(particle));
    
    // Draw HUD
    drawHUD();
    
    // Draw Pause Message
    if (gameState.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⏸️ PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

function drawPlayer() {
    // Body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Border
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    
    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
    ctx.fillRect(player.x + 21, player.y + 8, 6, 6);
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 9, player.y + 9, 4, 4);
    ctx.fillRect(player.x + 22, player.y + 9, 4, 4);
    
    // Label
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MIYA', player.x + player.width / 2, player.y - 5);
}

function drawTower(tower) {
    // Main tower
    ctx.fillStyle = tower.color;
    ctx.fillRect(tower.x, tower.y, tower.width, tower.height);
    
    // Tower outline
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(tower.x, tower.y, tower.width, tower.height);
    
    // Tower top (turret)
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(tower.x + 5, tower.y - 8, tower.width - 10, 8);
    
    // Warning symbol
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️', tower.x + tower.width / 2, tower.y + tower.height / 2);
}

function drawPowerUp(powerUp) {
    // Glow effect
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.beginPath();
    ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, 
            powerUp.width + 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Power-up body
    ctx.fillStyle = powerUp.color;
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    
    // Border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    
    // Icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
}

function drawParticle(particle) {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life / 30;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    ctx.globalAlpha = 1;
}

function drawHUD() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 60);
    
    // Score
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 25);
    ctx.fillText(`Level: ${gameState.level}`, 20, 45);
    
    // HP
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i < gameState.hp; i++) {
        ctx.fillText('❤️', CANVAS_WIDTH - 30 - (i * 30), 30);
    }
}

// Main Game Loop
function gameLoop() {
    update();
    draw();
    
    if (gameState.isRunning) {
        gameState.animationId = requestAnimationFrame(gameLoop);
    }
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('hp').textContent = gameState.hp;
}

// Main Update Loop for UI
setInterval(() => {
    updateUI();
}, 100);

// Start Game
gameLoop();
