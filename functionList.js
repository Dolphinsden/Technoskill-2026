/* ===== Adventure ===== */
function character() {
    fill("#1e17e3");
    circle(objectX, objectY, objectDiameter);
    noFill();
}

function spawnEnemy() {
    fill("#f5f05d");
    circle(enemyX, enemyY, enemyDiameter); 
    noFill();
}

function checkCollision() {
    var vector = getDirectionVector();
    var distance = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y)) - (objectDiameter/2 + enemyDiameter/2);

    return(distance);
}

function move() {
    if (keyIsDown(65)) objectX -= speedCharacter; //a
    if (keyIsDown(68)) objectX += speedCharacter; //d
    if (keyIsDown(87)) objectY -= speedCharacter; //w
    if (keyIsDown(83)) objectY += speedCharacter; //s

    objectX = constrain(objectX, objectDiameter/2, width - objectDiameter/2);
    objectY = constrain(objectY, objectDiameter/2, height - objectDiameter/2);
}

function shoot() {
    background("#ff0000");
}

function followPlayer() {
    var vector = getDirectionVector();
    //Speed vaires depending on distance
    //enemyX += ((vector.x)/200);
    //enemyY += ((vector.y)/200);

    //Constant Speed
    if (vector.x > 0) enemyX += speedEnemy;
    if (vector.x < 0) enemyX -= speedEnemy;
    if (vector.y > 0) enemyY += speedEnemy;
    if (vector.y < 0) enemyY -= speedEnemy;
}

function getDirectionVector() {
    return(createVector((objectX - enemyX), (objectY - enemyY)));
}

/* ===== Menu ===== */
function bottomBox() {
    fill("#ffffff");
    stroke("#000000");
    strokeWeight(2);
    rect(buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5, 10, 10, 10, 10);
    noStroke();
    noFill();
}

function textBox() {
    fill("#ffffff");
    stroke("#000000");
    strokeWeight(2);
    rect(buttonGap, canvasHeight - buttonH*2 - buttonGap*2.5, canvasWidth - buttonGap*4 - buttonW*2, buttonH*2 + buttonGap, 10, 10, 10, 10);
    noStroke();
    noFill();

    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("What will you do?", buttonGap, canvasHeight - buttonH*2 - buttonGap*2.5, canvasWidth - buttonGap*4 - buttonW*2, buttonH*2 + buttonGap);
    noFill();
}

function textBoxEvent(eventArray, eventX, eventY, counter) {
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(25);
    textStyle(NORMAL);
    text(eventArray[counter], eventX + buttonFightW/2, eventY + buttonFightH/2);
    noFill();
}

function makeButton(x, y, index) {
    //button
    stroke("#000000");
    strokeWeight(2);
    
    if (mouseX > x && mouseX < x + buttonW && mouseY > y && mouseY < y + buttonH) {
        fill(buttonColorSecond[index]);
        if (mouseIsPressed) {
            mouseIsPressed = false;
            if (index == 0) {
                state = 1;
                fight();
            } else if (index == 1) {
                state = 2;
                item();
            } else if (index == 2) {
                state = 3;
                skill();
            } else if (index == 3) {
                state == 0;
                resetGame();
            }
        }
    } else {
        fill(buttonColor[index]);
    }

    rect(x, y, buttonW, buttonH, buttonRounding[index][0], buttonRounding[index][1], buttonRounding[index][2], buttonRounding[index][3]);
    noFill();
    noStroke();

    //text
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(25);
    textStyle(BOLD);
    text(buttonText[index], x + (buttonW/2), y + (buttonH/2));
    noFill();
}

/* ===== Fight ===== */
function fight() {
    enemyHealthBar();
    characterHealthBar();
    
    if (characterTurn) {
        fightBox();
    } else {
        if (animationDone) {
            enemyMove();
        } else {
            fightBox();
        }
    }
}

function fightBox() {
    if (enemyCurrentHealth > 0) {
        let counter = 0;

        let fightX = [buttonFightGap, buttonFightGap*2 + buttonFightW];
        
        hit = false;
        let whichMove;

        if (animationDone) {
            bottomBox();
        }

        stroke("#000000");
        strokeWeight(2);

        for (let baris = 0; baris < 2; baris++) {

            if (timer - millis() >= -1500) {
                break;
            } else {
                animationDone = true;
            }

            timer = 0;

            for (let kolom = 0; kolom < 2; kolom++) {
                let fightY = (canvasHeight - buttonGap*2 - buttonH*2) + baris*(buttonH + buttonGap) - buttonGap/2;

                if (mouseX > fightX[kolom] && mouseX < fightX[kolom] + buttonFightW  && mouseY > fightY && mouseY < fightY + buttonFightH) {
                    fill("#d8d8d8");
                    if (mouseIsPressed) {
                        mouseIsPressed = false;
                        whichMove = counter;

                        accuracyCheck(random(0, 100), moveStat[whichMove][0]*(accuracyMultiplier/100) + accuracyIncrease);
                        if (hit) {
                            //hit
                            if (moveStat[whichMove][1] > 0) { //attack
                                let damage = (moveStat[whichMove][1])*(damageMultiplier/100) + damageIncrease;
                                enemyCurrentHealth -= damage;

                                bottomBox();
                                fill("#000000");
                                textAlign(CENTER, CENTER);
                                textSize(40);
                                textStyle(BOLD);
                                text(buttonFightText[whichMove] + " landed! Dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                                noFill();
                            } else { //status
                                switch (whichMove) {
                                    case 1:
                                        damageMultiplier += 25;

                                        bottomBox();
                                        fill("#000000");
                                        textAlign(CENTER, CENTER);
                                        textSize(40);
                                        textStyle(BOLD);
                                        text(buttonFightText[whichMove] + " landed! Damage dealt is increased by 25%!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                                        noFill();

                                        break;
                                    
                                    case 2:
                                        accuracyMultiplier += 20;

                                        bottomBox();
                                        fill("#000000");
                                        textAlign(CENTER, CENTER);
                                        textSize(40);
                                        textStyle(BOLD);
                                        text(buttonFightText[whichMove] + " landed! Accuracy is increased by 20%!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                                        noFill();

                                        break;

                                }
                            }

                            if (enemyCurrentHealth <= 0) {
                                animationDone = false;
                            }
                        } else {
                            //miss
                            bottomBox();
                            fill("#000000");
                            textAlign(CENTER, CENTER);
                            textSize(40);
                            textStyle(BOLD);
                            text(buttonFightText[whichMove] + " missed!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                            noFill();
                        }

                        timer = millis();
                        animationDone = false;
                        characterTurn = false;

                        state = 1;
                        break;
                    }
                } else {
                    fill("#ffffff");
                }

                rect(fightX[kolom], fightY, buttonFightW, buttonFightH, 10, 10, 10, 10);
                noFill();

                //text
                textBoxEvent(buttonFightText, fightX[kolom], fightY, counter);
                counter++;
            }
        }
    } else {
        if (timer - millis() < -1500) {
            if (animationDone) {
                gamePoint++;
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
}

function enemyMove() {
    //enemy damage
    let index = floor(random(0, 2));

    if (characterCurrentHealth > 0) {
        accuracyCheck(random(0, 100), 100 - accuracyDecrease);
        if (hit) {
            if (enemyFight[index][1] > 0) {
                let damage = enemyFight[index][1]*(enemyDamageMultiplier/100);
                characterCurrentHealth -= damage;

                bottomBox();
                fill("#000000");
                textAlign(CENTER, CENTER);
                textSize(40);
                textStyle(BOLD);
                text(enemyFight[index][0] + " landed! Enemy dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                noFill();
            } else {
                enemyDamageMultiplier += 25;

                bottomBox();
                fill("#000000");
                textAlign(CENTER, CENTER);
                textSize(40);
                textStyle(BOLD);
                text(enemyFight[index][0] + " landed! Enemy damage dealt increased by 25%", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                noFill();
            }
        } else {
            bottomBox();
            fill("#000000");
            textAlign(CENTER, CENTER);
            textSize(40);
            textStyle(BOLD);
            text("Enemy move missed!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
            noFill();
        }
        
        timer = millis();
        animationDone = false;
        characterTurn = true;
    }
}

function battleStartSetup() {
    //start of battle
    damageMultiplier = 100;
    accuracyMultiplier = 100;

    enemyCurrentHealth = 100;
    enemyDamageMultiplier = 100;

    battleStart = true;
    characterTurn = true;
}

function accuracyCheck(roll, accuracy) {
    if (roll <= accuracy) {
        //hit
        hit = true;
    } else {
        hit = false;
    }
}

function enemyHealthBar() {
    let healthBarWidth = canvasWidth - buttonGap*4 - buttonW*2;

    stroke("#000000");
    strokeWeight(2);
    fill("#a10000");
    rect(buttonGap, buttonGap, healthBarWidth, buttonGap, 10, 10, 10, 10);
    noFill();
    noStroke();

    if (enemyCurrentHealth > 0) {
        stroke("#000000");
        strokeWeight(2);
        fill("#28ff36");
        rect(buttonGap, buttonGap, constrain(healthBarWidth*(enemyCurrentHealth/enemyHealth), 0, healthBarWidth), buttonGap, 10, 10, 10, 10);
        noFill();
        noStroke();
    }
}

function characterHealthBar() {
    let healthBarWidth = canvasWidth - buttonGap*4 - buttonW*2

    stroke("#000000");
    strokeWeight(2);
    fill("#a10000");
    rect(canvasWidth - buttonGap - healthBarWidth, canvasHeight - buttonGap*5 - buttonH*2, healthBarWidth, buttonGap, 10, 10, 10, 10);
    noFill();
    noStroke();

    if (characterCurrentHealth > 0) {
        stroke("#000000");
        strokeWeight(2);
        fill("#28ff36");
        rect(canvasWidth - buttonGap - healthBarWidth, canvasHeight - buttonGap*5 - buttonH*2, constrain(healthBarWidth*(characterCurrentHealth/characterHealth), 0, healthBarWidth), buttonGap, 10, 10, 10, 10);
        noFill();
        noStroke();
    }
}

/* ===== Item ===== */
function item() {
    enemyHealthBar();
    characterHealthBar();

    if (characterTurn) {
        itemBox();
    } else {
        if (animationDone) {
            enemyMove();
        } else {
            itemBox();
        }
    }
}

function itemBox() {
    //item
    counter = 0;

    if (animationDone) {
        bottomBox();
    }

    stroke("#000000");
    strokeWeight(2);

    let whichItem;
    
    for (let baris = 0; baris < 2; baris++) {
        if (timer - millis() >= -1500) {
            break;
        } else {
            animationDone = true;
        }

        timer = 0;

        let fightX = [buttonFightGap, buttonFightGap*2 + buttonFightW];

        for (let kolom = 0; kolom < 2; kolom++) {
            let fightY = (canvasHeight - buttonGap*2 - buttonH*2) + baris*(buttonH + buttonGap) - buttonGap/2;

            if (mouseX > fightX[kolom] && mouseX < fightX[kolom] + buttonFightW  && mouseY > fightY && mouseY < fightY + buttonFightH) {
                fill("#d8d8d8");
                if (mouseIsPressed) {
                    mouseIsPressed = false;
                    whichItem = counter;

                    if (itemsAmount[counter] > 0) {
                        itemsAmount[counter]--;
                        itemsUse[counter]();
                    } else {
                        bottomBox();
                        fill("#000000");
                        textAlign(CENTER, CENTER);
                        textSize(40);
                        textStyle(BOLD);
                        text(itemsName[counter] + " has run out!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                        noFill();

                        timer = millis();
                        animationDone = false;
                        break;
                    }

                    timer = millis();
                    animationDone = false;
                    characterTurn = false;

                    state = 2;
                    break;
                    }
            } else {
                fill("#ffffff");
            }

            rect(fightX[kolom], fightY, buttonFightW, buttonFightH, 10, 10, 10, 10);
            noFill();

            //text
            textBoxEvent(itemsName, fightX[kolom], fightY, counter);
            counter++;
        }
    }
    noStroke();
}

function useItemPotion() {
    characterCurrentHealth += 20;

    if (characterCurrentHealth > characterHealth) {
        characterCurrentHealth = characterHealth;
    }

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("Potion has been used! Healed 20 HP!\nYou have " + itemsAmount[counter] + " potions left!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useItemCoffee() {
    accuracyIncrease += 20;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("Coffee has been used! Accuracy is increased by 20!\nYou have " + itemsAmount[counter] + " coffees left!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useItemStrengthPotion() {
    damageIncrease += 20;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("Streng Potion has been used! Damage is increased by 20!\nYou Have " + itemsAmount[counter] + " Smoke bombs left!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useItemSmokeBomb() {
    accuracyDecrease = 20;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("Smoke bomb has been used! Enemy's accuracy is reduced by 20!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

/* ===== Skill ===== */
function skill() {
    //skill
    state = 0;
}

/* ===== Run ===== */
function resetGame() {
    enemyX = 50;
    enemyY = 50;

    objectX = 300;
    objectY = 200;

    distance = 0;
    state = 0;

    enemySummoned = false;
    battleStart = false;
}

function doubleClicked() {
    if (characterTurn) {
        state = 0;
    }
}