var GamePlayLayer = cc.Layer.extend({
  ctor: function (data, gameManager) {
    this._super();
    this.gameManager = gameManager;
    this.isSafariBrowseer = isSafariBrowser();
    this.contentScalefactor = 0.5;
    if (this.gameManager.isRetinaDevice)
      this.contentScalefactor = 1;
    window.gamePlay = this;
    this.basicIphoneRes = cc.rect(0, 0, 2436, 1125);
    this.basicIpadRes = cc.rect(0, 0, 2048, 1536);
    this.startSubLevel(data);
  },
  onEnter: function () {
    this._super();
    this.setContentSize(
      cc.size(this.m_visibleSize.width, this.m_visibleSize.height)
    );
    this.addTouchListener();
    this.hintManager = new HintManager(this);
    this.scheduleUpdate();
    this.addComponents();
  },
  update(deltaTime) {
    this.runningTime += deltaTime;
  },
  startSubLevel(data) {
    this.m_visibleSize = cc.director.getVisibleSize();
    this.data = data;
    this.touchAllowed = true;
    this.selectedCategory = -1;
    this.addComponents();
  },
  addComponents() {
    this.addBackground();
    this.addCircuitElements();
    this.addStartButton();
  },
  addStartButton() {
    this.start = cc.Sprite.create(res.start);
    this.addChild(this.start);
    this.start.setPosition(cc.p(this.m_visibleSize.width / 2 - 200, 0));
  },
  //based on the song sequence it plays the corresponding tools by getting time info from data.json
  addTouchListener() {
    cc.eventManager.addListener(
      {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onTouchBegan,
        onTouchMoved: this.onTouchMoved,
        onTouchEnded: this.onTouchEnded,
        onTouchCancelled: this.onTouchEnded,
      },
      this
    );
  },
  addCircuitElements() {
    var assets = this.data.assets;
    this.elements = [];
    var y = this.m_visibleSize.height / 2 - 400;
    for (var i = 0; i < assets.length; i++) {
      var sprite = cc.Sprite.create(res[assets[i]]);
      this.addChild(sprite);
      this.elements.push(sprite);
      sprite.setPosition(cc.p(-this.m_visibleSize.width / 2 + 200, y));
      y -= sprite.height * 1.5;
    }
  },
  onTouchBegan(touch, event) {
    var self = event.getCurrentTarget();
    var Location = self.convertToNodeSpace(touch.getLocation());
    var start = self.start.getBoundingBox();
    if (cc.rectContainsPoint(start, Location)) {
      self.startClicked();
      return false;
    }
    for (var i = 0; i < self.elements.length; i++) {
      var box = self.elements[i].getBoundingBox();
      if (cc.rectContainsPoint(box, Location)) {
        self.selectedCategory = i;
        return true;
      }

    }
  },
  startClicked() {
    console.log("start clicked");
  },
  onTouchMoved(touch, event) {
    var self = event.getCurrentTarget();
    var Location = self.convertToNodeSpace(touch.getLocation());
    if (self.selectedCategory != -1)
      self.elements[self.selectedCategory].setPosition(Location);
  },
  onTouchEnded(touch, event) {
    var self = event.getCurrentTarget();
    self.selectedCategory = -1;
  },
  addBackground() {
    this.backGround = cc.Sprite.create(res.bg);
    this.addChild(this.backGround);
    this.backGround.setScaleX(this.m_visibleSize.width / this.backGround.width);
    this.backGround.setScaleY(this.m_visibleSize.height / this.backGround.height);
  },
});
