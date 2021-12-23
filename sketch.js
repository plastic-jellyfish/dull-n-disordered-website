let _people = []; 
let numPeople =100;
let dronex, droney, dronew, droneh, shoot, dspeed, ex, dx=0, k;
let fear;
let devkill =0 , civilian =0, sec;
let savedTime = 0;
let active;
let totalTime = 1000;
let _width, _height;

function preload() {
    font = loadFont('assets/ZillaSlab-Regular.ttf');
    _width = select(".container3").width;
    _height = select(".container3").height;
}

function setup() {
  var drone = createCanvas(_width,_height);  
  drone.parent('drone');
  background(0);
  dronex = width/2;
  droney = 0.15 * height;
  dronew = 0.1 * width;
  droneh = 0.2 * height;
  dspeed=1;
  shoot=50;
  restart();
  savedTime = millis();
  active=20;
  ex=0;
  k=0.05;
  textFont(font);
  textSize(12);
  fear = 0;
}

function windowResized() {
    _width = select(".container3").width;
    _height = select(".container3").height;
    resizeCanvas(_width, _height);
    restart();
}

function draw() {
  background(10);
  let eye = map(dronex,0,width, width/2 - 50, width/2 + 50);
  fill(255);
  noStroke();
  ellipse(width/2, droney, 250, droneh+10);
  beginShape();
    vertex(width/2 - 150, droney);
    vertex(width/2 - 100, droney-50);
    vertex(width/2 + 100, droney-50);
    vertex(width/2 + 150, droney);
    vertex(width/2 + 100, droney+50);
    vertex(width/2 - 100, droney+50);
  endShape();
  fill(0,50,200,50);
  ellipse(eye, droney, droneh-35);
  fill(0,100,200,50);
  ellipse(eye, droney, droneh-25);
  fill(0,50,200,50);
  ellipse(eye, droney, droneh-55);
  fill(0,100,200,50);
  ellipse(eye, droney, droneh-95);

  noStroke();
  fill(255, 20);
  for (let a=0; a<100; a+=20) {
    quad(eye, droney, eye, droney, dronex-((dronew-100)+a), height, dronex+((dronew-100)+a), height);
  }
  strokeWeight(5);
  stroke(255, 0, 0, shoot);
  line(eye, droney, dronex, height);

  if (fear<100) {
    let passedTime = millis() - savedTime;
    if (passedTime > totalTime) {
      fear=fear+1;
      if (active<49) {
        active=active+1;
      }
      savedTime = millis(); // Save the current time to restart the timer!
    }
    drone();
    for (let i =0 ; i<active;i++) {
      _people[i].move();
      _people[i].display();
    }
  }

  if (fear>=100) {
    let reset = createP('Good Job! You killed '+devkill+' Deviants & '+civilian+' Civilians today.\n Continue working Next Shift?');
    reset.style('background','#0050ff')
    reset.style('font-size','20px')
    reset.style('border','0')
    reset.style('padding','25px')
    reset.position(_width/2-120, _height/2+50)
    reset.style('width','200px')
    reset.mousePressed(restart)
  }

  fill(0);
  noStroke();
  textSize(15);
  textAlign(RIGHT,CENTER);
  text("ANXIETY :", (width/2)-10, droney-30);
  text("DEVIANTS :", (width/2)-10, droney+0);
  text("CIVILIANS :", (width/2)-10, droney+30);
  text(devkill, (width/2)+10, droney+0);
  text(civilian, (width/2)+10, droney+30);

  noStroke();
  fill(255, 0, 0);
  rect((width/2), droney-33, fear, 7,5);
  noFill();
  stroke(0);
  strokeWeight(1);
  rect((width/2)-3, droney-34, 105, 10,5);
}

function restart() {
  removeElements();
  fear = 0;
  devkill =0;
  civilian=0;
  active = 20;
  // _people = new People[numPeople];
  for (let i=0; i<numPeople; i++) {
    newpeople = new People(i);
    _people[i] = newpeople;
  }
}


class People {
  // float head, body, x, speed, limb;
  // int deviant, r, g, b, life;

  constructor(i) {
    this.head = random(10, 20);
    this.body = random(30, 70);
    this.limb= 0.4 * this.body;
    this.x = random(-width, 2*width);
    this.life = 1;
    this.speed = random(-1.5, 1.5);
    if (this.speed>0) {
      this.speed = this.speed + 0.5;
    }
    else { 
      this.speed = this.speed - 0.5;
    }
    this.deviant=int(random(2));
    if (this.deviant == 1) {
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
    }
  }

  move() {
    if ((this.x<-width)||(this.x>(2*width))) {
      this.speed = this.speed * -1;
    }
    this.x = this.x + this.speed;
  }

  kill() {
    this.speed=0;
    this.body = this.head/2;
    this.life = 0;
  }

  display() {
    if (this.life==1) {
      if ((this.deviant == 1) && ((this.x > (dronex-dronew))&&(this.x < (dronex+dronew)))) {
        fill(this.r, this.g, this.b);
        stroke(this.r, this.g, this.b);
      }
      else if ((this.deviant == 0) && ((this.x > (dronex-dronew))&&(this.x < (dronex+dronew)))) {
        fill(255);
        stroke(255);
      }
      else {
        fill(255, 100);
        stroke(255, 100);
      }
      strokeWeight(0);
      ellipse(this.x, (height - this.body), this.head, this.head);
      strokeWeight(5);
      noFill();
      if (this.speed>0) {
        bezier(this.x, height-this.body, this.x-(2*this.head), height-this.limb, this.x+(2*this.head), height-this.limb, (this.x-this.head)+dx, height);
        curve( this.x-(2*this.head), height-this.body, this.x, height-(this.body/2), (this.x+this.head)-dx, height, this.x+(2*this.head), height-this.limb );
        curve( this.x-(2*this.head), height-this.body, this.x-(this.head/2), height-(this.body*3/4), (this.x+this.head)-dx, height-(this.body/2), this.x+(2*this.head), height-this.limb );
        curve( this.x-(2*this.head), height-this.body, this.x-(this.head/2), height-(this.body*3/4), (this.x-this.head)+dx, height-(this.body/2), this.x+(2*this.head), height-this.limb );
      }
      else {
        bezier(this.x, height-this.body, this.x+(2*this.head), height-this.limb, this.x-(2*this.head), height-this.limb, (this.x+this.head)-dx, height);
        curve( this.x+(2*this.head), height-this.limb, this.x, height-(this.body/2), (this.x-this.head)+dx, height, this.x-(2*this.head), height-this.body);
        curve( this.x+(2*this.head), height-this.limb, this.x+(this.head/2), height-(this.body*3/4), (this.x-this.head)+dx, height-(this.body/2), this.x-(2*this.head), height-this.body);
        curve(this.x+(2*this.head), height-this.limb, this.x+(this.head/2), height-(this.body*3/4), (this.x+this.head)-dx, height-(this.body/2), this.x-(2*this.head), height-this.body);
      }

      if ((dx<0)||(dx>(2*this.head))) {
        k=k*-1;
      }
      dx=dx+k;
    }
    if (this.life==0) {
      if ((this.deviant==1) && ((this.x>(dronex-dronew))&&(this.x<(dronex+dronew)))) {
        fill(this.r,this.g, this.b);
      }
      else if ((this.deviant==0) && ((this.x>(dronex-dronew))&&(this.x<(dronex+dronew)))) {
        fill(255);
      }
      else {
        fill(255, 100);
      }
      noStroke();
      triangle(this.x, height-this.head, this.x-this.head, height, this.x+this.head, height);
    }
  }
}

function drone() {
    if ((dronex>= 0)&&(dronex<=width)) {
        dronex=dronex+dspeed;       
    }
    if (dronex<0) {
        dronex=0;
        dspeed *= -1;
    }
    if (dronex>width) {
        dronex=width;
        dspeed *= -1;
    }
    // select(".Left").mouseClicked(()=>{
    //     if ((dronex>= 0)&&(dronex<=width)) {
    //         dronex=dronex-.05*dspeed;
    //         if (dronex<0) {
    //           dronex=0;
    //         }
    //     }
    //     if (dronex>(width-200)) {
    //           dronex=dronex-.05*dspeed;
    //     }
    // })

    // select(".Right").mouseClicked(()=>{
    //     if ((dronex>= 0)&&(dronex<=width)) {
    //         dronex=dronex+.05*dspeed;
    //         if (dronex>width) {
    //           dronex=width;
    //         }
    //     }
    //     if (dronex>(width-200)) {
    //           ex=ex-.05*dspeed;
    //     }
    // })

    select(".Shoot").touchStarted(()=>{
      shoot=255;
      for (let i=0; i<active ; i++) {
        if ((_people[i].x >= (dronex-_people[i].head)) && (_people[i].x <= (dronex+_people[i].head))) {
          if ((_people[i].deviant == 1) && (_people[i].life==1)) {
            devkill=devkill+1;
            if (fear>10) {
              fear=fear-1;
            }
          }
          else if ((_people[i].deviant == 0) && (_people[i].life==1)) {
            civilian=civilian+1;
            fear=fear+1;
          }
          _people[i].kill();
        }
      }
    })
    select(".Shoot").touchEnded(()=>{
      if (shoot == 255) {
          shoot=50;
        }
    })
    
    select(".Shoot").mousePressed(()=>{
        shoot=255;
        for (let i=0; i<active ; i++) {
          if ((_people[i].x >= (dronex-_people[i].head)) && (_people[i].x <= (dronex+_people[i].head))) {
            if ((_people[i].deviant == 1) && (_people[i].life==1)) {
              devkill=devkill+1;
              if (fear>10) {
                fear=fear-1;
              }
            }
            else if ((_people[i].deviant == 0) && (_people[i].life==1)) {
              civilian=civilian+1;
              fear=fear+1;
            }
            _people[i].kill();
          }
        }
    })
    select(".Shoot").mouseReleased(()=>{
        if (shoot == 255) {
            shoot=50;
          }
    })
}