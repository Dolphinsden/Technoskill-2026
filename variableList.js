var canvasWidth = 800;  //800
var canvasHeight = 600; //600

var fightBackground;
var gameLose = false;
var gameStart = false;

var state = 0; //0 = menu, 1 = fight, 2 = item, 3 = skill
var gamePoint = 0;
var timer = 0;
var animationDone = false;
var battleStart = false;

var vector;
var distance;

//x, y, diameter, speed, is spawned, color, health, point, xp
var allEnemyDatabase = [
    [0, 0, 40, 1.75, 1, "#ffa600", 100, 10, 30],   //basic enemy
    [0, 0, 20, 3, 1, "#f5f05d", 30, 5, 15],       //speedy enemy
    [0, 0, 60, 1, 1, "#ff0000", 200, 50, 100]       //boss enemy
];
var allEnemy = [
    [0, 0, 1, 0, 0, "", 0, 0], 
    [0, 0, 1, 0, 0, "", 0, 0], 
    [0, 0, 1, 0, 0, "", 0, 0], 
    [0, 0, 1, 0, 0, "", 0, 0], 
    [0, 0, 1, 0, 0, "", 0, 0]
];
var enemyIndex = 0;
var enemyHit;
var enemyBossHealUsed = false;

var currentFloor = 1;
var characterXP = 50;
var characterCurrentXP = 0;
var characterLevel = 1;

var enemyDropDone = false;
//diameter, color
var enemyDropDatabase = [
    [10, "#00ff00"],
    [10, "#0000ff"], 
    [30, "#756116"]
];
//x, y, id, is picked up, is spawned
var enemyDrop = [
    [0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

var enemyCount = 0;
var lastEnemySpawned = 0;
var enemySpawnedInterval = 5000; //5 seconds

var characterTurn = true;

var enemyHealth = 100;
var enemyCurrentHealth = 0;
var enemySummoned = false;

var damageMultiplier = 100;
var damageIncrease = 0;
var accuracyMultiplier = 100;
var accuracyIncrease = 0;
var accuracyDecrease = 0;

var enemyFightFunction = [enemyBasicMove, enemySpeedyMove, enemyBossMove];
var enemyFight = [
    [
        ["Slash", 10], 
        ["Sharpen", 0]
    ], 
    [
        ["Quick Attack", 30], 
        ["Sharpen", 0]
    ], 
    [
        ["Bonk", 30], 
        ["Big Bonk", 50], 
        ["Snap", 25],
        ["Pray", 50]
    ]
];
var enemyDamageMultiplier;

var objectX = canvasWidth/2;
var objectY = canvasHeight/2;
var objectDiameter = 50;

var speedCharacter = 5;
var characterHealth = 200;
var characterCurrentHealth = 0;
var characterMana = 150;
var characterCurrentMana = 0;

//button for menu
var counter = 0;
var whichItem = 0;
var whichMove = 0
var whichSKill = 0;

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

var buttonFightFunction = [usePunch, useBulkUp, useFocus, useMegaPunch];
var buttonFightText = ["Punch", "Bulk Up", "Focus", "Mega Punch"];

//accuracy, damage
var moveStat = [
    [100, 10],  //Punch
    [100, 0],   //Bulk Up
    [80, 0],    //Focus
    [80, 30]   //Mega Punch
];
var hit = false;

var itemsUse = [useItemPotion, useItemCoffee, useItemStrengthPotion, useItemSmokeBomb];
var itemsName = ["Potion", "Coffee", "Strength Potion", "Smoke Bomb"];
var itemsAmount = [3, 3, 3, 3];

var skillFunction = [useFireball, useLightFoot, useBellyDrum, useExplosion];
var skillName = ["Fireball", "Light Foot", "Belly Drum", "Explosion"];
//mana, stat
var skillStat = [
    [20, 40],   //Fireball
    [40, 40],   //Light Foot
    [50, 50],   //Belly Drum
    [100, 100]  //Explosion
];
var bellyDrumFail = false;