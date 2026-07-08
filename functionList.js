/* ===== Adventure ===== */
function character() {
    fill("#1e17e3");
    stroke("#000000");
    strokeWeight(objectDiameter*0.03);
    circle(objectX, objectY, objectDiameter);
    noStroke();
    noFill();
}

function spawnEnemy(id) {
    let x = random((allEnemyDatabase[id][2])/2, canvasWidth - (allEnemyDatabase[id][2])/2);
    let y = random((allEnemyDatabase[id][2])/2, canvasHeight - (allEnemyDatabase[id][2])/2);
    
    if (checkCollision(x, y, allEnemyDatabase[id][2])) {
        for (let i = 0; i < allEnemy.length; i++) {
            if (allEnemy[i][4] == 0) {
                allEnemy[i][0] = x;
                allEnemy[i][1] = y;

                for (let j = 2; j < allEnemyDatabase[id].length; j++) {
                    allEnemy[i][j] = allEnemyDatabase[id][j];
                }

                fill(allEnemy[i][5]);
                stroke("#000000");
                strokeWeight(allEnemy[id][2]*0.03);
                circle(allEnemy[id][0], allEnemy[id][1], allEnemy[id][2]);
                noStroke();
                noFill();
                    
                enemyCount++;
                lastEnemySpawned = millis();
                break;
            }
        }
    }
}

function anyCollision() {
    if (enemyCount == 0) {
        return false;
    }

    for (let i = 0; i < allEnemy.length; i++) {
        if (allEnemy[i][4] == 1) {
            if (checkCollision(allEnemy[i][0], allEnemy[i][1], allEnemy[i][2]) == false) {
                enemyHit = i;
                return true;
            }
        }
    }
    return false;
}

function checkCollision(targetX, targetY, targetDiameter) {
    vector = getDirectionVector(objectX, objectY, targetX, targetY);
    distance = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y)) - (objectDiameter/2 + targetDiameter/2);

    return(distance >= 0);
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
    //Constant Speed
    for (let i = 0; i < allEnemy.length - 1; i++) {
        if (allEnemy[i][4] == 1) {
            var vector = getDirectionVector(objectX, objectY, allEnemy[i][0], allEnemy[i][1]);

            if (vector.x != 0) {
                if (vector.x >= 1) allEnemy[i][0] += allEnemy[i][3];
                if (vector.x <= -1) allEnemy[i][0] -= allEnemy[i][3];
            }
            
            if (vector.y != 0) {
                if (vector.y >= 1) allEnemy[i][1] += allEnemy[i][3];
                if (vector.y <= -1) allEnemy[i][1] -= allEnemy[i][3];
            }

            fill(allEnemy[i][5]);
            stroke("#000000");
            strokeWeight(allEnemy[i][2]*0.03);
            circle(allEnemy[i][0], allEnemy[i][1], allEnemy[i][2]);
            noStroke();
            noFill();
        }
    }
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
    characterManaBar();
    
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
        noStroke();
    } else {
        if (timer - millis() < -1500) {
            if (animationDone) {
                gamePoint += allEnemy[enemyHit][7];
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

function enemyBasicMove() {
    //basic enemy
    let index = floor(random(0, 2));

    if (characterCurrentHealth > 0) {
        accuracyCheck(random(0, 100), 100 - accuracyDecrease);
        if (hit) {
            if (enemyFight[enemyIndex][index][1] > 0) {
                let damage = enemyFight[index][1]*(enemyDamageMultiplier/100);
                characterCurrentHealth -= damage;

                bottomBox();
                fill("#000000");
                textAlign(CENTER, CENTER);
                textSize(40);
                textStyle(BOLD);
                text(enemyFight[enemyIndex][index][0] + " landed! Enemy dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                noFill();
            } else {
                enemyDamageMultiplier += 25;

                bottomBox();
                fill("#000000");
                textAlign(CENTER, CENTER);
                textSize(40);
                textStyle(BOLD);
                text(enemyFight[enemyIndex][index][0] + " landed! Enemy damage dealt increased by 25%", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
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

function enemySpeedyMove() {
    //speedy enemy
    let index = floor(random(0, 2));

    if (characterCurrentHealth > 0) {
        accuracyCheck(random(0, 100), 100 - accuracyDecrease);
        if (hit) {
            if (enemyFight[enemyIndex][index][1] > 0) {
                let damage = enemyFight[enemyIndex][index][1]*(enemyDamageMultiplier/100);
                characterCurrentHealth -= damage;

                bottomBox();
                fill("#000000");
                textAlign(CENTER, CENTER);
                textSize(40);
                textStyle(BOLD);
                text(enemyFight[enemyIndex][index][0] + " landed! Enemy dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                noFill();
            } else {
                enemyDamageMultiplier += 25;

                bottomBox();
                fill("#000000");
                textAlign(CENTER, CENTER);
                textSize(40);
                textStyle(BOLD);
                text(enemyFight[enemyIndex][index][0] + " landed! Enemy damage dealt increased by 25%", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
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

function enemyBossMove() {
    //basic enemy
    let index = floor(random(0, 3));

    if (characterCurrentHealth > 0) {
        if (enemyCurrentHealth > allEnemyDatabase[enemyIndex][6]/2) {
            accuracyCheck(random(0, 100), 100 - accuracyDecrease);
            if (hit) {
                if (index < 2) {
                    let damage = enemyFight[enemyIndex][index][1]*(enemyDamageMultiplier/100);
                    characterCurrentHealth -= damage;

                    bottomBox();
                    fill("#000000");
                    textAlign(CENTER, CENTER);
                    textSize(40);
                    textStyle(BOLD);
                    text(enemyFight[enemyIndex][index][0] + " landed! Enemy dealt " + damage + " damage!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
                    noFill();
                } else {
                    enemyDamageMultiplier += enemyFight[enemyIndex][index][1];
                    damageMultiplier += enemyFight[enemyIndex][index][1];

                    bottomBox();
                    fill("#000000");
                    textAlign(CENTER, CENTER);
                    textSize(40);
                    textStyle(BOLD);
                    text("The boss is mad! Damage dealt and damage taken is increased by 25%", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
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
        } else {
            let heal = allEnemyDatabase[enemyIndex][6]*(enemyFight[enemyIndex][3][1]/100);
            enemyCurrentHealth += heal;

            bottomBox();
            fill("#000000");
            textAlign(CENTER, CENTER);
            textSize(40);
            textStyle(BOLD);
            text("The boss prayed to his deity! Healed by " + heal + "!", buttonGap/4, canvasHeight - buttonH*2 - buttonGap*3.25, canvasWidth - buttonGap/2, buttonH*2 + buttonGap*2.5);
            noFill();
        }

        timer = millis();
        animationDone = false;
        characterTurn = true;
        
    }
}

function enemyMove() {
    //enemy damage
    for (let i = 0; i < enemyFight.length; i++) {
        if (enemyIndex == i) {
            enemyFightFunction[i]();
        }
    }
}

function battleStartSetup() {
    //start of battle
    damageMultiplier = 100;
    accuracyMultiplier = 100;

    enemyCurrentHealth = allEnemy[enemyHit][6];
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

    fill(allEnemy[enemyHit][5]);
    stroke("#000000");
    strokeWeight(allEnemy[enemyHit][2]*0.03);
    circle(canvasWidth*0.75, canvasHeight*0.3, allEnemy[enemyHit][2]*2);
    noStroke();
    noFill();

    if (enemyCurrentHealth > 0) {
        stroke("#000000");
        strokeWeight(2);
        fill("#28ff36");
        rect(buttonGap, buttonGap, constrain(healthBarWidth*(enemyCurrentHealth/allEnemyDatabase[enemyIndex][6]), 0, healthBarWidth), buttonGap, 10, 10, 10, 10);
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

function characterManaBar() {
    let manaBarWidth = (0 - (canvasWidth - buttonGap*4 - buttonW*2))*0.75;

    stroke("#000000");
    strokeWeight(2);
    fill("#ffffff");
    rect(canvasWidth - buttonGap, canvasHeight - buttonGap*6 - buttonH*2, manaBarWidth, buttonGap*0.75, 10, 10, 10, 10);
    noFill();
    noStroke();

    if (characterCurrentMana > 0) {
        stroke("#000000");
        strokeWeight(2);
        fill("#008cff");
        rect(canvasWidth - buttonGap, canvasHeight - buttonGap*6 - buttonH*2, constrain(manaBarWidth*(characterCurrentMana/characterMana), manaBarWidth, 0), buttonGap*0.75, 10, 10, 10, 10);
        noFill();
        noStroke();
    }
}

/* ===== Item ===== */
function item() {
    enemyHealthBar();
    characterHealthBar();
    characterManaBar();

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
    characterManaBar();

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
    if (enemyCurrentHealth > 0) {
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

                        if (characterCurrentMana > skillStat[whichSKill][0] || whichSKill == 2) {
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
    } else {
        if (timer - millis() < -1500) {
            if (animationDone) {
                gamePoint += allEnemy[enemyHit][7];
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
    characterCurrentMana -= skillStat[whichSKill][0];

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
    allEnemy[enemyHit][4] = 0;
    distance = 0;
    state = 0;
    enemyCount--;
    lastEnemySpawned = millis();

    enemySummoned = false;
    battleStart = false;
    enemySpawned = false;
}

function doubleClicked() {
    if (characterTurn) {
        state = 0;
    }
}