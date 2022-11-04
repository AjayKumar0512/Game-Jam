var OptimisedSprite = cc.Sprite.extend({
  ctor(resPath) {
    this._super(resPath);
    this.setResPath(resPath);
    this._active = true;
  },
  setResPath(resPath) {
    this.resPath = resPath;
  },
  getResPath() {
    return this.resPath;
  },
  isActive() {
    return this._active;
  },
  onEnter() {
    this._super();
  },
  removeFromParent() {
    this._active = false;
  },
});
class SpritePool {
  constructor() {
    this._whiteSprites = [];
    this.index = -1;
    this.threshold = 500;
    this.counter = 0;
  }

  getResourceWhiteSprite(resPath) {
    this.index++;
    this.counter++;
    if (this.counter >= this.threshold) {
      this.gamePlay.poolThresholdReached();
      this.flushAllWhiteSprites();
      this.index = 0;
    }
    let resourceList = this._whiteSprites || [];
    if (resourceList.length > this.index) {
      let resource = resourceList[this.index];
      if (resource.getResPath() == resPath && !resource.isActive()) {
        resource._active = true;
        return resource;
      }
    }
    var sprite = new OptimisedSprite(resPath);
    this._whiteSprites.push(sprite);
    return sprite;
  }
  assignGamePlayReference(gamePlay) {
    this.gamePlay = gamePlay;
  }
  flushAllWhiteSprites() {
    this.index = -1;
    this.counter = 0;
    let resourceList = this._whiteSprites || [];
    for (let i = 0; i < resourceList.length; i++) {
      resourceList[i].removeFromParent();
    }
  }
}
