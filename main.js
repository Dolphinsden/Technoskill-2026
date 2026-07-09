function preload() {
    fightBackground = loadImage('fightBackground.jpeg');
    adventureBackground = loadImage('stoneWallBackground.png');
    wallTile = loadImage('stoneWallTile.png');
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    characterCurrentHealth = characterHealth;
    characterCurrentMana = characterMana;
}

function draw() {
    if (gameStart) {
        if (gameLose == false) {
            if (anyCollision()) {
                if (battleStart == false) {
                    battleStartSetup();
                }
                
                let counter = 0;

                enemyHealthBar();
                characterHealthBar();
                characterManaBar();

                if (enemyCurrentHealth > 0) {
                    //encounter
                    if (animationDone) {
                        bottomBox();
                        if (characterTurn) {
                            if (characterCurrentHealth <= 0) {
                                console.log("die");
                                if (timer - millis() >= -1500) {
                                    if (animationDone) {
                                        gameLose = true;
                                        return;
                                    } else {
                                        bottomBox();
                                        fill("#000000");
                                        textAlign(CENTER, CENTER);
                                        textSize(40);
                                        textStyle(BOLD);
                                        text("You died!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                                        noFill();
                                        console.log("game lose = " + gameLose);
                                    }
                                } else {
                                    animationDone = true;
                                }

                                timer = millis();
                                return;
                            }
                            
                            if (state == 0) {
                                //menu

                                bottomBox();
                                textBox();

                                enemyHealthBar();
                                characterHealthBar();
                                characterManaBar();

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
                            if (animationDone) {
                                enemyMove();
                            } else {
                                if (state == 0) {
                                    //menu

                                    bottomBox();
                                    textBox();

                                    enemyHealthBar();
                                    characterHealthBar();
                                    characterManaBar();

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
                            }
                        }
                    }

                    if (timer - millis() >= -1500) {
                        return;
                    } else {
                        animationDone = true;
                    }

                    timer = 0
                    
                    
                } else {
                    if (enemyDropDone == false) {
                        for (let i = 0; i < enemyDrop.length; i++) {
                            if (enemyDrop[i][4] == 0) {
                                enemyDrop[i][0] = allEnemy[enemyHit][0];
                                enemyDrop[i][1] = allEnemy[enemyHit][1];

                                enemyDrop[i][2] = floor(random(0, enemyDropDatabase.length));
                                console.log("drop id: " + enemyDrop[enemyHit][2]);
                                enemyDrop[i][3] = 0;
                                enemyDrop[i][4] = 1;
                                enemyDropDone = true;
                                break;
                            }
                        }
                    }
                    
                    if (timer - millis() < -1500) {
                        if (animationDone) {
                            gamePoint += allEnemy[enemyHit][7]*(1 + 0.5*(currentFloor - 1));
                            characterCurrentXP += allEnemy[enemyHit][8]*(1 + 0.5*(currentFloor - 1));

                            animationDone = true;
                            characterTurn = false;
                            resetGame();
                        } else {
                            bottomBox();
                            fill("#000000");
                            textAlign(CENTER, CENTER);
                            textSize(40);
                            textStyle(BOLD);
                            text("Enemy defeated!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                            noFill();

                            if (timer - millis() < -3000) {
                                animationDone = true;
                                characterTurn = true;
                            }
                        }
                    }
                }
                
                
            } else {
                //adventure
                image(adventureBackground, 0, 0, canvasWidth, canvasHeight);

                character();
                move();

                if (characterCurrentXP >= characterXP) {
                    characterCurrentXP -= characterXP;
                    characterLevel++;
                    characterXP = characterXP*(1 + Math.pow(0.3*(characterLevel - 1), 2));
                }

                xpBar();

                fill("#ffffff");
                stroke("#000000");
                strokeWeight(2);
                textAlign(LEFT, TOP);
                textSize(20);
                textStyle(BOLD);
                text("Current points: " + gamePoint + "\nCurrent floor: " + currentFloor, 10, 10);
                noStroke();
                noFill();

                if (enemyCount < 5) {
                    if (millis() - lastEnemySpawned >= enemySpawnedInterval) {
                        enemyIndex = floor(random(0, allEnemyDatabase.length));
                        spawnEnemy(enemyIndex);
                    }
                }

                followPlayer();
                itemDrops();
            }
        } else {
            //die
            background("#ff0000");

            fill("#ffffff");
            stroke("#000000");
            strokeWeight(5);
            textAlign(CENTER, CENTER);
            textSize(50);
            textStyle(BOLD);
            text("You Lose!\nScore: " + gamePoint + "\nFloor: " + currentFloor, canvasWidth/2, canvasHeight/2);
            noStroke();
            noFill();
        }
    } else {
        //start screen
        background("#cecece");

        fill("#ffffff");
        stroke("#000000");
        strokeWeight(5);
        textAlign(CENTER, CENTER);
        textSize(50);
        textStyle(BOLD);
        text("Welcome!\nClick button to start", canvasWidth/2, canvasHeight/2 - 100);
        noStroke();
        noFill();

        if (mouseX > canvasWidth/2 - 100 && mouseX < canvasWidth/2 + 100 && mouseY > canvasHeight/2 + 50 && mouseY < canvasHeight/2 + 100) {
            fill("#3232325f");
            if (mouseIsPressed) {
                mouseIsPressed = false;
                gameStart = true;
            }
        } else {
            fill("#cecece");
        }
        stroke("#000000");
        strokeWeight(2);
        rect(canvasWidth/2 - 100, canvasHeight/2 + 50, 200, 50);
        noStroke();
        noFill();

        fill("#000000");
        textAlign(CENTER, CENTER);
        textSize(30);
        textStyle(BOLD);
        text("Start Game", canvasWidth/2 - 100, canvasHeight/2 + 50, 200, 50);
        noFill();
    }
}