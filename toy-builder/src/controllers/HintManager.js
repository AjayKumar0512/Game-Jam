//this class handles all inactivity,hints 
class HintManager {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.gameManager = this.gamePlay.gameManager;
    this.runningTime = 0;
    this.inActivityTime = 0;
  }
  //calls every frame
  update(deltaTime) {
    this.runningTime += deltaTime;
  }
}
