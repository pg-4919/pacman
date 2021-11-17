/*
Programming model:
Each component has a draw function, which draws it to the screen.
It should have a position parameter, if applicable, and a time
parameter for animations.

Collisions should be handled in the main frame loop.
*/

const walls = [
    [250, 0, 300, 70]
]

async function main() {
    const canvas = document.getElementById("gameScreen");
    const context = canvas.getContext("2d");
    canvas.style.background = "black";

    let time = 0;
    let xPos = 0;
    let yPos = 50;
    let colliders = [];

    walls.forEach(wall => colliders.push(wall));

    while (true) {
        drawPacman(context, xPos, yPos, time, "yellow");
        await sleep(10);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        
        drawWalls(context, colliders);

        const collisions = colliders.map(collider => checkCollision(collider[0], collider[1], collider[2], collider[3], xPos, yPos, 10));
        if (!collisions.includes(true)) xPos += 1;

        time += 0.1;

        if (time > 2 * Math.Pi) i = 0;
    }
}

function sleep(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

function pointToLine(x1, y1, x2, y2, x, y) { //stackoverflow.com/a/6853926
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) param = dot / len_sq;
    var xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkCollision(l1x, l1y, l2x, l2y, x, y, minDistance) {
    const distance = pointToLine(l1x, l1y, l2x, l2y, x, y);
    if (distance <= minDistance + 2) return true; //slight addition to stop overlapping
    else return false;
}

function drawSector(context, cx, cy, radius, startAngle, endAngle, fill) {
    context.moveTo(cx, cy);
    context.arc(cx, cy, radius, startAngle, endAngle);
    context.lineTo(cx, cy);
    context.fillStyle = fill;
    context.fill();
}

function drawPacman(context, cx, cy, time) {
    const positiveSin = Math.sin(time) + 1;
    const normalizedSin = positiveSin / 8
    drawSector(context, cx, cy, 10, (0 + normalizedSin) * Math.PI, (2 - normalizedSin) * Math.PI, "yellow");
}

function drawWalls(context, colliders) {
    walls.forEach(wall => {
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(wall[0], wall[1]);
        context.lineTo(wall[2], wall[3]);
        context.strokeStyle = "blue";
        context.stroke();
    });
}

window.onload = main;
