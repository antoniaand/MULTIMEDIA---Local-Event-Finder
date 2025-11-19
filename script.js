
window.onload = function () {
    var canvas = document.getElementById("event-map");

    if (!canvas.getContext) {
        alert("Canvas not supported.");
        return;
    }

    var ctx = canvas.getContext("2d");

    drawMapBackground(ctx, canvas);
    drawGrid(ctx, canvas);
    drawLegend(ctx);
    drawEventMarkers(ctx);
};

function drawMapBackground(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#dfe7f1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2e434c";
    ctx.font = "16px Arial";
    ctx.fillText("Local Events Map (Canvas Demo)", 20, 30);
}

function drawGrid(ctx, canvas) {
    var step = 50;
    var x, y;

    ctx.strokeStyle = "#b0c4de";
    ctx.lineWidth = 1;

    for (x = 0; x <= canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (y = 40; y <= canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawLegend(ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#2e434c";

    ctx.fillRect(600, 50, 170, 80);
    ctx.strokeRect(600, 50, 170, 80);

    ctx.fillStyle = "#2e434c";
    ctx.font = "12px Arial";
    ctx.fillText("Legend:", 610, 70);

    ctx.fillStyle = "#5D9CBA";
    ctx.beginPath();
    ctx.arc(620, 90, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#2e434c";
    ctx.fillText("Event location", 640, 94);
}

function drawEventMarkers(ctx) {
    var events = [
        { name: "Jazz Festival", x: 200, y: 150 },
        { name: "Tech Workshop", x: 450, y: 220 }
    ];

    var i;
    for (i = 0; i < events.length; i++) {
        var ev = events[i];

        ctx.fillStyle = "#5D9CBA";
        ctx.strokeStyle = "#2e434c";

        ctx.beginPath();
        ctx.arc(ev.x, ev.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#2e434c";
        ctx.font = "12px Arial";
        ctx.fillText(ev.name, ev.x + 14, ev.y + 4);
    }
}
