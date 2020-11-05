var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage, cloudImage, cloudsGroup;
var score;
var obs1, obs2, obs3, obs4, obs5, obs6;
var obs, obsGroup;
var PLAY = 1;
var OVER = 0;
var gameState = PLAY;
var resImage, resSprite;
var gmOvSprite, gmOvImage;
var checkpoint, jump, die;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");

  gmOvImage = loadImage("gameOver.png");
  resImage = loadImage("restart.png");
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  

}

function setup() {
  background(220)
  createCanvas(600, 200)
  
 
  score = 0;

  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //creating invisible ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //generate random numbers
  var rand = Math.round(random(1, 100))
  console.log(rand)

  cloudsGroup = new Group();
  obsGroup = new Group();

  gmOvSprite = createSprite(300, 100);
  gmOvSprite.addImage(gmOvImage);
  gmOvSprite.scale = 0.5;

  gmOvSprite.visible = false;

  resSprite = createSprite(300, 130);
  resSprite.addImage(resImage);
  resSprite.scale = 0.5;
  resSprite.visible = false;

}

function draw() {
  //set background color
  background("skyblue");
   


  //  console.log(trex.y)


  text("score: " + score, 500, 30);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(4 +3* Math.round(score / 100));

    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }

    // jump when the space key is pressed
    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -10;
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //stop trex from falling down
    trex.collide(invisibleGround);

    //Spawn Clouds
    spawnClouds();
    spawnObs();

    if (obsGroup.isTouching(trex)) {
      gameState = OVER;
      die.play();
    }
  } else if (gameState === OVER) {
    trex.velocityY = 0;
    ground.velocityX = 0;
    obsGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obsGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gmOvSprite.visible = true;
    resSprite.visible = true;
    trex.changeAnimation("collided",trex_collided);
  }
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 40);
  
  if(mousePressedOver(resSprite)){
    reset();
  // console.log("Game shuru");
  }
  drawSprites();
}

//function to spawn the clouds
function spawnClouds() {
  // write your code here
  if (frameCount % 60 === 0) {


    cloud = createSprite(600, 100, 15, 15);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(30, 70))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    cloud.lifetime = 200;


    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);


  }
}

function spawnObs() {
  // write your code here
  if (frameCount % 60 === 0) {


    obs = createSprite(600, 162, 15, 15);
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obs.addImage(obs1);
        break;
      case 2:
        obs.addImage(obs2);
        break;
      case 3:
        obs.addImage(obs3);
        break;
      case 4:
        obs.addImage(obs4);
        break;
      case 5:
        obs.addImage(obs5);
        break;
      case 6:
        obs.addImage(obs6);
        break;
    }


    obs.scale = 0.4;
    obs.velocityX = -(6 + 3*Math.round(score / 100));

    obs.lifetime = 200;
   obsGroup.add(obs);



  }
}

function reset(){
  
  gameState = PLAY;
  gmOvSprite.visible=false;
  resSprite.visible=false;
  obsGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  trex.changeAnimation("running", trex_running);
  
  
}



