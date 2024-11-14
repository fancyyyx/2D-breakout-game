// 获取画布和绘图上下文
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 初始化球的属性
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;  // 球的水平速度
var dy = -2; // 球的垂直速度

// 初始化挡板的属性
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;  // 计算初始位置为画布中心
var rightPressed = false;
var leftPressed = false;

// 初始化砖块的属性
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// 游戏分数和生命
var score = 0;
var lives = 3;

// 砖块数据结构，用于保存每个砖块的状态
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // 砖块的初始状态是可见
    }
}

// 监听键盘和鼠标事件
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// 处理键盘按下事件
function keyDownHandler(e) {
    if (e.code == "ArrowRight") {
        rightPressed = true;
    } else if (e.code == "ArrowLeft") {
        leftPressed = true;
    }
}

// 处理键盘松开事件
function keyUpHandler(e) {
    if (e.code == "ArrowRight") {
        rightPressed = false;
    } else if (e.code == "ArrowLeft") {
        leftPressed = false;
    }
}

// 处理鼠标移动事件，移动挡板
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// 检测球与砖块的碰撞
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            // 如果砖块还未被打掉
            if (b.status == 1) {
                // 检测球是否与砖块碰撞
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; // 反弹
                    b.status = 0; // 砖块被打掉
                    score++; // 增加分数
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload(); // 刷新页面重新开始游戏
                    }
                }
            }
        }
    }
}

// 绘制球
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF5722";  // 设置球的颜色为橙色
    ctx.fill();
    ctx.closePath();
}

// 绘制挡板
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";  // 设置挡板颜色为蓝色
    ctx.fill();
    ctx.closePath();
}

// 绘制砖块
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {  // 只有未消失的砖块才会绘制
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;  // 更新砖块的 x 坐标
                bricks[c][r].y = brickY;  // 更新砖块的 y 坐标
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#4CAF50";  // 设置砖块颜色为绿色
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 更新分数
function updateScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

// 更新生命
function updateLives() {
    document.getElementById("lives").textContent = "Lives: " + lives;
}

// 绘制游戏元素并进行更新
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // 碰撞检测：左右边界
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;  // 水平反弹
    }

    // 碰撞检测：上边界
    if (y + dy < ballRadius) {
        dy = -dy;  // 垂直反弹
    } 
    // 如果球碰到下边界（掉出画布）
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;  // 如果球撞到挡板，反弹
        } else {
            lives--;  // 失去一条生命
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();  // 游戏结束，刷新页面
            } else {
                // 重置球的位置
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;  // 重新设置挡板位置
            }
        }
    }

    // 控制挡板的移动
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;  // 向右移动
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;  // 向左移动
    }

    // 更新球的位置
    x += dx;
    y += dy;

    // 每帧更新分数和生命显示
    updateScore();
    updateLives();

    // 请求下一帧，保持动画循环
    requestAnimationFrame(draw);
}

// 启动游戏
draw();



