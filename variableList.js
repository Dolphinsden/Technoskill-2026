var canvasWidth = 800;  //800
var canvasHeight = 600; //600

var fightBackground;

var state = 0; //0 = menu, 1 = fight, 2 = item, 3 = skill
var gamePoint = 0;
var timer = 0;
var animationDone = false;
var battleStart = false;

var speedEnemy = 1;
var enemyX = 50;
var enemyY = 50;
var enemyDiameter = 20;

var characterTurn = true;

var enemyHealth = 100;
var enemyCurrentHealth = 0;
var enemySummoned = false;

var damageMultiplier = 100;
var damageIncrease = 0;
var accuracyMultiplier = 100;
var accuracyIncrease = 0;
var accuracyDecrease = 0;

var enemyFight = [["Move 1", 10], ["Move 2", 0]];
var enemyDamageMultiplier;

var objectX = 300;
var objectY = 200;
var objectDiameter = 50;

var speedCharacter = 5;
var characterHealth = 200;
var characterCurrentHealth = 0;

//button for menu
var buttonW = canvasWidth/5;    //160
var buttonH = canvasHeight/9; //80
var buttonGap = buttonH/4;      //20

var buttonRounding =[[10, 0, 0, 0], [0, 10, 0, 0], [0, 0, 0, 10], [0, 0, 10, 0]];

var buttonColor = ["#ff0000", "#00ff66", "#5dd7f5", "#fbff2d"];
var buttonColorSecond = ["#bd0000", "#00ad45", "#3396ae", "#c2c600"];
var buttonText = ["Basic", "Item", "Skill", "Run"];

//button for fight

var buttonFightH = buttonH;                             //80
var buttonFightGap = buttonFightH/2                     //40
var buttonFightW = (canvasWidth - buttonFightGap*3)/2;  //320

var buttonFightText = ["Move 1", "Move 2", "Move 3", "Move 4"];
//accuracy, damage
var moveStat = [
    [100, 10],  //move 1
    [100, 0],   //move 2
    [80, 0],    //move 3
    [100, 50]   //move 4
];
var hit = false;

var itemsUse = [useItemPotion, useItemCoffee, useItemStrengthPotion, useItemSmokeBomb];
var itemsName = ["Potion", "Coffee", "Strength Potion", "Smoke Bomb"];
var itemsAmount = [3, 3, 3, 3];