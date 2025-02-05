const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// 游戏配置
const difficulties = {
    easy: { speed: 150, color: '#4CAF50' },
    medium: { speed: 100, color: '#FFC107' },
    hard: { speed: 50, color: '#F44336' }
};

let currentDifficulty = 'medium';
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;

// 初始化游戏
function initGame() {
    document.addEventListener('keydown', changeDirection);
    generateFood();
    resetGame();
}

// 改变难度
function changeDifficulty(difficulty) {
    currentDifficulty = difficulty;
    resetGame();
}

// 游戏控制
function changeDirection(event) {
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;
    
    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function drawGame() {
    // 移动蛇
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').innerHTML = `得分: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇(使用难度颜色)
    ctx.fillStyle = difficulties[currentDifficulty].color;
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
    });

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);

    // 碰撞检测
    if (head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount ||
        collisionWithSelf()) {
        clearInterval(gameLoop);
        alert(`游戏结束! 得分: ${score} (难度: ${currentDifficulty})`);
        resetGame();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function collisionWithSelf() {
    return snake.slice(1).some(
        segment => segment.x === snake[0].x && segment.y === snake[0].y
    );
}

function resetGame() {
    clearInterval(gameLoop);
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').innerHTML = '得分: 0';
    generateFood();
    gameLoop = setInterval(
        drawGame, 
        difficulties[currentDifficulty].speed
    );
}

// 启动游戏
initGame();
