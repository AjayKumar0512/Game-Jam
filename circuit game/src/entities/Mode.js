var Mode = cc.Sprite.extend({
  ctor: function (data, index) {
    var path = res.mode;
    this._super(path);
    this.data = data;
    this.modeIndex = index;
    this.isSafariBrowseer = isSafariBrowser();
  },

  onEnter: function () {
    this._super();
    this.m_visibleSize = cc.director.getVisibleSize();
    this.addComponents();
    this.addTouchListener();
  },

  addTouchListener() {
    cc.eventManager.addListener(
      {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onTouchBegan,
      },
      this
    );
  },

  onTouchBegan(touch, event) {
    var target = event.getCurrentTarget();
    var box = target.getBoundingBox();
    var headingBox = target.heading.getBoundingBox();
    var location = touch.getLocation();
    var boxLocation = target.getParent().convertToNodeSpace(location);
    var headingLocation = target.convertToNodeSpace(location);
    if (
      (cc.rectContainsPoint(box, boxLocation) || cc.rectContainsPoint(headingBox, headingLocation)) &&
      target.getParent().isTouchAllowed
    ) {

      target.changeToSelectedSprite();
      target.getParent().selectedIndex = target.modeIndex;
      target.changeToGamePlaylayerPage(target.modeIndex);
    }
  },
  changeToGamePlaylayerPage(index) {
    this.parent.gameManager.startLevelNumber(index);
  },
  addComponents() {
    this.addThumbnail();
    this.addHeading();
  },
  addHeading() {
    var fontSize = 50;
    path = res.title;
    this.heading = new cc.Sprite(path);
    this.heading.setPosition(this.width / 2, -this.heading.height);
    this.addChild(this.heading);
    //increasing heading height to fit sub text too
    this.heading.setScale(1.2);

    let str = this.data;
    this.label = new cc.LabelTTF(
      str,
      getFontName(commonFonts.bookBagRegular),
      getFontSize(fontSize)
    );

    this.label.setColor(cc.color(0, 107, 138));
    this.label.setPosition(this.heading.width / 2, this.heading.height / 1.8);
    if (this.isSafariBrowseer) this.label.y += this.heading.height * 0.1;
    this.heading.addChild(this.label);
    //adding sub text based on mode
    switch (this.data) {
      case "Build":
        str = "Build It!";
        break;
      case "Garrage":
        str = "Test It!";
        break;
    }
    fontSize = 25;
    this.subLabel = new cc.LabelTTF(
      str,
      getFontName(commonFonts.bookBagRegular),
      getFontSize(fontSize)
    );

    this.subLabel.setColor(cc.color(0, 107, 138));
    this.subLabel.setPosition(this.heading.width / 2, this.heading.height / 4);
    if (this.isSafariBrowseer) this.subLabel.y += this.heading.height * 0.1;
    this.heading.addChild(this.subLabel);
  },
  addThumbnail() {
    var path = "";
    if (this.data == GameConstants.LEVELNAME.BUILD)
      path = res.freeplay_thumbnail;
    else
      path = res.followplay_thumbnail;
    this.thumbnail = new cc.Sprite(path);
    this.thumbnail.setPosition(this.width / 2 - Math.floor(this.width * 0.01), this.height / 2 + Math.floor(this.height * 0.032));
    this.addChild(this.thumbnail);
  },
  changeToSelectedSprite() {
    let sp = new cc.Sprite(res.mode_selected);
    this.setSpriteFrame(sp.getSpriteFrame());
    this.selectedHeading = cc.Sprite.create(res.title_selected);
    this.selectedHeading.setPosition(-this.heading.width * 0.08, -this.heading.height * 0.8);
    this.addChild(this.selectedHeading);
    this.label._textFillColor = cc.color(0, 177, 125);
    this.subLabel._textFillColor = cc.color(0, 177, 125);
  },
});