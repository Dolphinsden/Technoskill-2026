function preload() {
    fightBackground = loadImage('fightBackground.jpeg');
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    characterCurrentHealth = characterHealth;
}

function draw() {
    if (checkCollision() <= 0) {
        if (state == 0) {
            //menu
            image(fightBackground, 0, 0, canvasWidth, canvasHeight);
            let counter = 0;

            if (battleStart == false) {
                battleStartSetup();
            }
            bottomBox();
            textBox();

            enemyHealthBar();
            characterHealthBar();

            for (let baris = 0; baris < 2; baris++) {
                for (let kolom = 0; kolom < 2; kolom++) {
                    let x = (canvasWidth - buttonGap*2 - buttonW*2) + kolom*(buttonW + buttonGap);
                    let y = (canvasHeight - buttonGap*2 - buttonH*2) + baris*(buttonH + buttonGap) - buttonGap/2;
                    makeButton(x, y, counter);
                    counter++;
                }
            }
        } else if (state == 1) {
            fight();
        } else if (state == 2) {
            item();
        } else if (state == 3) {
            skill();
        }
    } else {
        //adventure
        background("#000000");

        fill("#ffffff");
        textAlign(LEFT, CENTER);
        textSize(20);
        textStyle(BOLD);
        text("Current points: " + gamePoint, 10, 20);
        noFill();

        if (mouseIsPressed) {
            shoot();
        }
        character();
        move();

        spawnEnemy();
        followPlayer();
    }
}