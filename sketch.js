// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
   resultImg = sepiaFilter(imgIn,resultImg);
   resultImg = darkCorners(resultImg);
   resultImg = radialBlurFilter(resultImg);
   resultImg = borderFilter(resultImg)
  return resultImg;
}


function borderFilter(imgIn){

  var resultImg = createGraphics(imgIn.width, imgIn.height);

  resultImg.image(imgIn,0,0);

  resultImg.noFill();
  resultImg.stroke(255);
  resultImg.strokeWeight(20);
  resultImg.rect(0,0,imgIn.width, imgIn.height, 50);


  resultImg.noFill();
  resultImg.strokeWeight(20);
  resultImg.stroke(255);
  
  resultImg.rect(0,0,imgIn.width, imgIn.height);

  return resultImg;
}

function radialBlurFilter(imgIn){
  imgIn.loadPixels();
  for(var x=0; x<imgIn.width; x++){
    for(var y=0; y<imgIn.height; y++){

      var pixelIndex = ((imgIn.width * y) + x) * 4 ;

      var oldRed = imgIn.pixels[pixelIndex+0];
    var oldBlue = imgIn.pixels[pixelIndex+2];
    var oldGreen = imgIn.pixels[pixelIndex+1];

    var c = convolution(x,y,matrix,matrix.length,imgIn);

    var mouseDist = abs(dist(x,y, mouseX, mouseY));
    var dynBlur = map(mouseDist, 100,300, 0,1);
    dynBlur = constrain(dynBlur, 0,1);

    var newRed = c[0] * dynBlur + oldRed* (1-dynBlur);
    var newGreen = c[1] * dynBlur + oldGreen* (1-dynBlur);

    var newBlue = c[2] * dynBlur + oldBlue*(1-dynBlur);

    imgIn.pixels[pixelIndex+0] = newRed;
    imgIn.pixels[pixelIndex+1] = newGreen;

    imgIn.pixels[pixelIndex+2] = newBlue;



    }
  }

  imgIn.updatePixels();
  return imgIn;

}


function convolution(x,y,matrix,matrixSize,img){

  var totalRed = 0.0;
  var totalGreen = 0.0;
  var totalBlue  = 0.0;
  var offset = floor(matrixSize/2);

  for (var i = 0; i < matrixSize; i++){

    for (var j = 0; j< matrixSize; j++){

      var xloc = x + i- offset;
      var yloc = y + j - offset;
      var index = (xloc + img.width * yloc) * 4;

      index = constrain(index,0,img.pixels.length-1);

      totalRed += img.pixels[index + 0] * matrix[i][j];
      totalGreen += img.pixels[index + 1]* matrix[i][j];
      totalBlue += img.pixels[index + 2]* matrix[i][j];
    }
  }
return [totalRed, totalGreen,totalBlue];
}
function darkCorners(imgIn){
  imgIn.loadPixels();
var midX = imgIn.width/2;
var midY = imgIn.height/2;
var maxDist = abs(dist(midX,midY,0,0));
var dynLum = 1;


for(var x=0; x<imgIn.width; x++){
  for(var y=0; y<imgIn.height; y++){

    var d = abs(dist(midX,midY, x,y));

    if(d>300){ // process pixels 300 pixels away from center
    var pixelIndex = ((imgIn.width * y) + x) * 4 ;
    var oldRed = imgIn.pixels[pixelIndex+0];
    var oldBlue = imgIn.pixels[pixelIndex+2];
    var oldGreen = imgIn.pixels[pixelIndex+1];


    if(d<=450){ // 300 to 450 distance
      dynLum = map(d, 300,450, 1,0.4);
    }

    else{ // above 450 to maxDist
      dynLum = map(d, 450, maxDist, 0.4, 0);
    }


    dynLum = constrain(dynLum,0,1);
    imgIn.pixels[pixelIndex+0] = oldRed*dynLum;
    imgIn.pixels[pixelIndex+1] = oldGreen * dynLum;
    imgIn.pixels[pixelIndex+2] = oldBlue * dynLum;
  }


  }
}

imgIn.updatePixels();
  return imgIn;

}


function sepiaFilter(imgIn,resultImg){

  imgIn.loadPixels();
  resultImg.loadPixels();

  for(var x=0; x<imgIn.width; x++){
    for(var y=0; y<imgIn.height; y++){

      var pixelIndex = ((imgIn.width * y) + x) * 4 ;
      var oldRed = imgIn.pixels[pixelIndex+0];
      var oldBlue = imgIn.pixels[pixelIndex+2];
      var oldGreen = imgIn.pixels[pixelIndex+1];

      var newRed = (oldRed * .393) + (oldGreen * .769) + (oldBlue * .189);

      var newGreen = (oldRed * .349) + (oldGreen * .686) + (oldBlue * .168);

      var newBlue = (oldRed * .272) + (oldGreen * .534) + (oldBlue * .131);

      newRed = constrain(newRed, 0,255);
      newGreen = constrain(newGreen, 0,255);
      newBlue = constrain(newBlue, 0,255);

      resultImg.pixels[pixelIndex+0] = newRed;
      resultImg.pixels[pixelIndex+1] = newGreen;
      resultImg.pixels[pixelIndex+2] = newBlue;
      resultImg.pixels[pixelIndex+3] = 255;
      

      
      
    }
  }

  resultImg.updatePixels();
  return resultImg;
}
