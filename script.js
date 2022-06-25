var width = document.body.clientWidth;
var height = document.body.clientHeight;
var plane = document.getElementById("plane");
var ground = document.getElementById("ground");

var skydiverNb = 0;
var jumpTimeOut = 2000;
var divingTime = 20000;
var moveDuration = 5000;

anime({
    targets: '.plane',
    translateX: width + plane.clientWidth*2,
    duration: 9000,
    easing: 'linear',
    loop: true,
    delay: 500
});

function getPlaneLeftPosition() {
  return plane.getBoundingClientRect().left;
}

function getPlaneTopPosition() {
  return plane.getBoundingClientRect().top;
}

function getRandomPositiveOrNegativeWithMax(max) {
  var randomNum = Math.floor(Math.random() * max + 1);
  var randomSign = Math.round(Math.random());
  
  if(randomSign) {
    return randomNum
  } else {
    return -randomNum;
  }
}

function generateSkyMoveX() {
  var moves = [];
  var nbMaxMove = divingTime/moveDuration - 2;
  var nbMove =  Math.floor(Math.random() * nbMaxMove) + 1;

  var indexX = 0;

  for (let move = 0; move < nbMove; move++) {
    indexX += getRandomPositiveOrNegativeWithMax(400);
    moves.push({
      value: indexX,
      duration: moveDuration,
      delay: 500
    });
  }

  for(let moveLeft = 0; moveLeft < nbMaxMove-nbMove; moveLeft++) {
    moves.push({
      value: indexX,
      duration: moveDuration
    });
  }

  moves.sort( () => Math.random() - 0.5);
  
  return moves;
}

function createSkydiver() {
  var newSkydiver = document.createElement("object");
  newSkydiver.type = "image/svg+xml";
  newSkydiver.data = 'images/skydiver.svg';
  newSkydiver.classList.add("skydiver");
  
  var skydiverName = "skydiver" + skydiverNb;
  var skydiverID = "#" + skydiverName;
  newSkydiver.id = skydiverName;
  
  skydiverNb++;
  if(skydiverNb == 100) {
    skydiverNb = 0;
  }

  document.body.appendChild(newSkydiver);

  var randomLaunch = getRandomPositiveOrNegativeWithMax(20);

  newSkydiver.style.position = 'absolute';
  newSkydiver.style.left = getPlaneLeftPosition() + randomLaunch + 'px';
  newSkydiver.style.top = getPlaneTopPosition() + 'px';

  newSkydiver.addEventListener("load",function(){
    var svgDoc = newSkydiver.contentDocument;

    var randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);

    var elements = svgDoc.getElementsByClassName("parachute");
    for (var i = 0; i < elements.length; i++) elements[i].style.fill = randomColor;
}, false);

  anime({
    targets: skydiverID,
    translateY: height - ground.clientHeight - newSkydiver.clientHeight - getPlaneTopPosition(),
    translateX: generateSkyMoveX(),
    duration: divingTime,
    easing: 'easeInOutQuad',
  }).finished.then(() => {
    document.body.removeChild(newSkydiver);
  });
}

const inJumpZone = setInterval(function() {
  var planeLeftPosition = getPlaneLeftPosition();
  var percentBorderStart = 10;
  var percentBorderEnd = 90;

  if(planeLeftPosition > (percentBorderStart*width)/100
  && planeLeftPosition < (percentBorderEnd*width)/100) {
    createSkydiver();
  }
}, jumpTimeOut);

//clearInterval(inJumpZone);
