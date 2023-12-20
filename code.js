
var programCode = function (p) {
    p.size(
        window.innerWidth,
        window.innerHeight
    );
    p.frameRate(60);
    let circleAngle = 0;

    // useful constants
    const w = window.innerWidth;
    const h = window.innerHeight;
    // how close knives can be before a game over
    const knifeAngle = 360 / (200 * Math.PI / 20) - 2;
    // time between shots, in milliseconds
    const cooldown = 100;

    // y-positions of all knives moving towards face (one not thrown is fake)
    var shotKnives = [];
    // angles relative to rotating face of all knives stuck on face
    var connectedKnives = [];

    var knifeSpeed = 1;

    var knifeCuttof = 100;

    var drawKnife = function (x, y) {
        p.translate(x, y);
        p.fill(0, 0, 0);
        p.rect(x - 10, y - 10, 20, 20);
        p.translate(-x, -y);
    };

    // Add new knife when key pressed
    let pressed = false;
    let lastShot = Number.NEGATIVE_INFINITY;
    p.keyPressed = function () {
        if (pressed) return;
        pressed = true;
        const time = p.millis();
        if (p.key.code === 32 && time - lastShot > cooldown) {
            shotKnives.push(120);
            lastShot = time;
        }
    };
    p.keyReleased = function () {
        pressed = false;
    };

    p.draw = function () {
        // Color background
        p.background(255, 255, 255);

        p.translate(w / 2, h / 2);
        p.rotate(p.radians(circleAngle));
        p.fill(255, 255, 0);
        p.ellipse(0, 0, 200, 200);

        p.noFill();
        p.stroke(0, 0, 0);
        p.strokeWeight(2);
        p.arc(0, 0, 150, 100, 0, Math.PI);

        p.fill(0, 0, 0);
        p.ellipse(50, 0, 10, 10);
        p.ellipse(-47, 0, 10, 10);

        for (const angle of connectedKnives) {
            p.rotate(p.radians(angle));
            drawKnife(54, 0);
            p.rotate(p.radians(-angle));
        }
        console.log(connectedKnives);

        p.rotate(p.radians(-circleAngle));

        p.fill(0, 0, 0);

        p.textSize(60);

        //println(rot+" , "+w+" , "+w)

        // Render each knife
        const newShotKnives = [];
        for (let y of shotKnives) {
            drawKnife(0, y);
            // Subtract one from each knife's position
            y -= 2;
            if (y < 54) {
                // When knife has hit
                console.log("Collision");
                const angle = (90 - circleAngle + 360) % 360;
                for (const existingAngle of connectedKnives) {
                    if (
                        Math.abs(angle - existingAngle) < knifeAngle
                        || Math.abs(angle - existingAngle) > 360 - knifeAngle
                    ) {
                        alert(`you lose >>>>:(\nScore: ${connectedKnives.length}`);
                        throw new Error("TBD");
                    }
                }
                connectedKnives.push(angle);
            } else {
                // delete all knives that have gone too far from list
                newShotKnives.push(y);
            }
        }
        shotKnives = newShotKnives;

        // Make circle rotate
        circleAngle += 3;
        circleAngle %= 360;

        // Draw fake knife
        drawKnife(0, 80);
    };

    // Code end:
};

const canvas = document.getElementById("mycanvas");
const processingInstance = new Processing(canvas, programCode);