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

function pointToLine(l1x, l1y, l2x, l2y, x, y) { //credit: stackoverflow "Or Betzalel"
    return ((Math.abs((l2y - l1y) * x - (l2x - l1x) * y + l2x * l1y - l2y * l1x)) /
    (Math.pow((Math.pow(l2y - l1y, 2) + Math.pow(l2x - l1x, 2)), 0.5)));
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