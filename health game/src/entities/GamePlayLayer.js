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
    this.counterTime = 0;
    this.counterValue = 2;
  },
  update(deltaTime) {
    this.runningTime += deltaTime;
    if (this.counter && this.counterValue != 0) {
      this.counterTime += deltaTime;
      if (this.counterTime >= 1) {
        this.counterTime = 0;
        this.counterValue -= 1;
        this.counter.setString(this.counterValue.toString());
        if (this.counterValue == 0)
          this.timerEnds();
      }
    }
  },
  NoClicked() {
    this.popup.removeFromParent();
    this.selectedFeeling.setVisible(true);
    this.changeText("Dont worry!We got you");
  },
  YesClicked() {
    this.removeAllChildren();
    this.backGround = cc.Sprite.create(res.modebg);
    this.addChild(this.backGround);
    this.backGround.setScaleX(this.m_visibleSize.width / this.backGround.width);
    this.backGround.setScaleY(this.m_visibleSize.height / this.backGround.height);
  },
  timerEnds() {
    this.counter.removeFromParent();
    this.oolzoo.removeFromParent();
    this.popup = new ReplayPopUP(this);
    this.addChild(this.popup);
    this.selectedFeeling.setVisible(false);
    this.changeText("Does this help?");
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
    this.addFeelings();
    this.addDrag();
    this.addText("Find your emotion");

    this.runAction(cc.sequence(cc.delayTime(0.3),
      cc.callFunc(() => {
        window.gameManager.getVoAndPlay(res.emotion);
      })
    ))
  },
  addText(text) {
    if (this.label)
      return;
    var str = text;
    this.label = new cc.LabelTTF(
      str,
      getFontName(commonFonts.bookBagRegular),
      getFontSize(80)
    );

    this.label.setColor(cc.color(0, 107, 138));
    this.label.setPosition(0, 400);
    this.addChild(this.label, 3);

  },
  addDrag() {
    this.drag = cc.Sprite.create(res.drag);
    this.addChild(this.drag);
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
  addFeelings() {
    var assets = this.data.assets;
    this.elements = [];
    this.positions = [];
    var x = -this.m_visibleSize.width / 2 + 600;
    var y = -500;
    for (var i = 0; i < assets.length; i++) {
      var sprite = cc.Sprite.create(res[assets[i]]);
      this.addChild(sprite);
      this.elements.push(sprite);
      sprite.setPosition(cc.p(x, y));
      this.positions.push(cc.p(x, y));
      x += sprite.width * 2;
    }
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
    for (var i = 0; i < self.elements.length; i++) {
      var box = self.elements[i].getBoundingBox();
      if (cc.rectContainsPoint(box, Location)) {
        self.selectedCategory = i;
        self.elements[i].setLocalZOrder(1);
        return true;
      }

    }
  },
  startClicked() {
    var line = new cc.DrawNode.create();
    this.addChild(line);
    var pos1 = this.elements[0].getPosition();
    var pos2 = this.elements[1].getPosition();

    line.drawSegment(pos1, pos2, 5, cc.color(63, 28, 29));

  },
  onTouchMoved(touch, event) {
    var self = event.getCurrentTarget();
    var Location = self.convertToNodeSpace(touch.getLocation());
    if (self.selectedCategory != -1)
      self.elements[self.selectedCategory].setPosition(Location);
  },
  onTouchEnded(touch, event) {
    var self = event.getCurrentTarget();

    if (self.selectedCategory != -1)
      self.checkForCorrectRelease(touch);
  },
  checkForCorrectRelease(touch) {
    var pos = cc.p(0, 0);
    var releasedLoc = this.convertToNodeSpace(touch.getLocation());
    var distance = Math.abs(cc.pDistance(releasedLoc, pos));
    if (distance <= 200)
      this.setCategory(pos);
    else
      this.resetcategory(this.positions[this.selectedCategory]);
  },
  setCategory(pos) {
    window.gameManager.getVoAndPlay(res.angryy);
    this.selectedFeeling = this.elements[this.selectedCategory];
    this.elements[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.elements.splice(this.selectedCategory, 1);
        this.selectedCategory = -1;
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].removeFromParent();
        }
        this.changeText("Dont worry!We got you");
        this.addCounter();
      }))
    );
  },
  addCounter() {
    var str = "10";
    this.counter = new cc.LabelTTF(
      str,
      getFontName(commonFonts.bookBagRegular),
      getFontSize(80)
    );

    this.counter.setColor(cc.color(0, 107, 138));
    this.counter.setPosition(0, -300);
    this.addChild(this.counter, 3);

    this.oolzoo = new SpineUtils(res.oolzoo_json, res.oolzoo_atlas, 1);
    this.oolzoo.setPosition(-200, -300);
    this.addChild(this.oolzoo, 3);
    this.oolzoo.setAnimation(0, "magician1", true);
  },
  changeText(text) {
    this.label.setString(text);
  },
  resetcategory(pos) {
    this.elements[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.3, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.selectedCategory = -1;
      }))
    );

  },
  addBackground() {
    this.backGround = cc.Sprite.create(res.modebg);
    this.addChild(this.backGround);
    this.backGround.setScaleX(this.m_visibleSize.width / this.backGround.width);
    this.backGround.setScaleY(this.m_visibleSize.height / this.backGround.height);
    this.backGround1 = cc.Sprite.create(res.bg);
    this.addChild(this.backGround1);
  },
});
