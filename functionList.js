/* ===== Adventure ===== */
function character() {
    fill("#1e17e3");
    stroke("#000000");
    strokeWeight(objectDiameter*0.03);
    circle(objectX, objectY, objectDiameter);
    noStroke();
    noFill();
}

function spawnEnemy() {
    enemyX = random(enemyDiameter/2, canvasWidth - enemyDiameter/2);
    enemyY = random(enemyDiameter/2, canvasHeight - enemyDiameter/2);

    if (checkCollision() > 50) {
        fill("#f5f05d");
        stroke("#000000");
        strokeWeight(enemyDiameter*0.03);
        circle(enemyX, enemyY, enemyDiameter);
        noStroke();
        noFill();

        console.log("Enemy Spawned");

        enemySpawned = true;
    } else {
        console.log("Enemy not spawned");
        enemySpawned = false;
    }
}

function checkCollision() {
    var vector = getDirectionVector(objectX, objectY, enemyX, enemyY);
    var distance = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y)) - (objectDiameter/2 + enemyDiameter/2);

    return(distance);
}

function move() {
    if (keyIsDown(65)) objectX -= speedCharacter; //a
    if (keyIsDown(68)) objectX += speedCharacter; //d
    if (keyIsDown(87)) objectY -= speedCharacter; //w
    if (keyIsDown(83)) objectY += speedCharacter; //s

    objectX = constrain(objectX, objectDiameter/2, canvasWidth - objectDiameter/2);
    objectY = constrain(objectY, objectDiameter/2, canvasHeight - objectDiameter/2);
}

function shoot() {
    background("#ff0000");
}

function followPlayer() {
    var vector = getDirectionVector(objectX, objectY, enemyX, enemyY);
    //Speed vaires depending on distance
    /*enemyX += ((vector.x)/200);
    enemyY += ((vector.y)/200);*/

    //Constant Speed
    if (vector.x != 0) {
        if (vector.x >= 1) enemyX += speedEnemy;
        if (vector.x <= -1) enemyX -= speedEnemy;
    }
    
    if (vector.y != 0) {
        if (vector.y >= 1) enemyY += speedEnemy;
        if (vector.y <= -1) enemyY -= speedEnemy;
    }

    fill("#f5f05d");
    stroke("#000000");
    strokeWeight(enemyDiameter*0.03);
    circle(enemyX, enemyY, enemyDiameter);
    noStroke();
    noFill();
}

function getDirectionVector(objectX, objectY, targetX, targetY) {
    return(createVector((objectX - targetX), (objectY - targetY)));
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
        counter = 0;

        let fightX = [buttonFightGap, buttonFightGap*2 + buttonFightW];
        
        hit = false;
        whichMove;

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
                            buttonFightFunction[whichMove](whichMove);

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

function usePunch(whichMove) {
    //punch
    let damage = (moveStat[whichMove][1])*(damageMultiplier/100) + damageIncrease;
    enemyCurrentHealth -= damage;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("Punch landed! Dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useBulkUp(whichMove) {
    //bulk up
    damageMultiplier += 20;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("You used bulk up! Damage dealt is increased by 20%!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useFocus(whichMove) {
    //focus
    accuracyMultiplier += 20;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("You locked in! Accuracy is increased by 20%!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useMegaPunch(whichMove) {
    //mega punch
    let damage = (moveStat[whichMove][1])*(damageMultiplier/100) + damageIncrease;
    enemyCurrentHealth -= damage;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("Mega punch landed! Dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
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
    let healthBarWidth = 0 - (canvasWidth - buttonGap*4 - buttonW*2);

    stroke("#000000");
    strokeWeight(2);
    fill("#a10000");
    rect(canvasWidth - buttonGap, canvasHeight - buttonGap*5 - buttonH*2, healthBarWidth, buttonGap, 10, 10, 10, 10);
    noFill();
    noStroke();

    if (characterCurrentHealth > 0) {
        stroke("#000000");
        strokeWeight(2);
        fill("#28ff36");
        rect(canvasWidth - buttonGap, canvasHeight - buttonGap*5 - buttonH*2, constrain(healthBarWidth*(characterCurrentHealth/characterHealth), healthBarWidth, 0), buttonGap, 10, 10, 10, 10);
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

    whichItem;
    
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
    enemyHealthBar();
    characterHealthBar();

    if (characterTurn) {
        skillBox();
    } else {
        if (animationDone) {
            enemyMove();
        } else {
            skillBox();
        }
    }
}

function skillBox() {
    counter = 0;
    bellyDrumFail = false;

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

        let fightX = [buttonFightGap, buttonFightGap*2 + buttonFightW];

        for (let kolom = 0; kolom < 2; kolom++) {
            let fightY = (canvasHeight - buttonGap*2 - buttonH*2) + baris*(buttonH + buttonGap) - buttonGap/2;

            if (mouseX > fightX[kolom] && mouseX < fightX[kolom] + buttonFightW  && mouseY > fightY && mouseY < fightY + buttonFightH) {
                fill("#d8d8d8");
                if (mouseIsPressed) {
                    mouseIsPressed = false;
                    whichSKill = counter;

                    if (characterCurrentMana > skillStat[whichSKill][0]) {
                        skillFunction[whichSKill]();

                        if (bellyDrumFail) {
                            break;
                        }
                    } else {
                        //not enough
                        bottomBox();
                        fill("#000000");
                        textAlign(CENTER, CENTER);
                        textSize(40);
                        textStyle(BOLD);
                        text("You don't have enough mana!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                        noFill();

                        timer = millis();
                        animationDone = false;
                        break;
                    }

                    timer = millis();
                    animationDone = false;
                    characterTurn = false;

                    state = 3;
                    break;
                    }
            } else {
                fill("#ffffff");
            }

            rect(fightX[kolom], fightY, buttonFightW, buttonFightH, 10, 10, 10, 10);
            noFill();

            //text
            textBoxEvent(skillName, fightX[kolom], fightY, counter);
            counter++;
        }
    }
    noStroke();
}

function useFireball() {
    //fireball
    let damage = (skillStat[whichSKill][1])*(damageMultiplier/100) + damageIncrease;
    enemyCurrentHealth -= damage;
    characterCurrentMana -= skillStat[whichSKill][0];

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("You use fireball! Dealt " + damage +" damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useLightFoot() {
    //light foot
    accuracyDecrease -= skillStat[whichSKill][1];
    characterCurrentMana -= skillStat[whichSKill][0];

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("You danced around, the enemy is confused! Enemy accuracy is reduced by " + skillStat[whichSKill][1] + " !", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

function useBellyDrum() {
    //belly drum
    damageMultiplier += skillStat[whichSKill][1];

    if (characterCurrentHealth > characterHealth*0.5) {
        characterCurrentHealth -= characterHealth*0.5;

        bottomBox();
        fill("#000000");
        textAlign(CENTER, CENTER);
        textSize(40);
        textStyle(BOLD);
        text("You beat your belly to the rythm of a drum! Damage is increased by " + skillStat[whichSKill][1] + "%!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
        noFill();
    } else {
        bottomBox();
        fill("#000000");
        textAlign(CENTER, CENTER);
        textSize(40);
        textStyle(BOLD);
        text("You don't have enough HP!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
        noFill();

        timer = millis();
        animationDone = false;
        bellyDrumFail = true;
    }
}

function useExplosion() {
    //explosion
    let damage = (skillStat[whichSKill][1])*(damageMultiplier/100) + damageIncrease;
    enemyCurrentHealth -= damage;

    bottomBox();
    fill("#000000");
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    text("You use explosion Dealt " + damage +" damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
    noFill();
}

/* ===== Run ===== */
function resetGame() {
    enemyX = 0;
    enemyY = 0;

    distance = 0;
    state = 0;

    enemySummoned = false;
    battleStart = false;
    enemySpawned = false;
}

function doubleClicked() {
    if (characterTurn) {
        state = 0;
    }
}