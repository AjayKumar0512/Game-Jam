//layer deals with displaying all the available modes present
//in the game,on selecting particular mode respective
//game will start to play
var ModeSelectionPage = cc.Layer.extend({
  ctor: function (gameManager) {
    this._super();
    this.gameManager = gameManager;
    this.isSafariBrowseer = isSafariBrowser();
  },
  onEnter: function () {
    this._super();
    this.m_visibleSize = cc.director.getVisibleSize();
    this.setContentSize(
      cc.size(this.m_visibleSize.width, this.m_visibleSize.height)
    );
    this.isTouchAllowed = false;
    this.selectedIndex = 0;
    this.addTouchListener();
    this.addComponents();

  },
  //adds required components to the mode selection page
  addComponents() {
    this.addBackground();
    this.runAction(cc.sequence(cc.delayTime(1),
      cc.callFunc(() => {
        this.addTint();
        this.addOolzooPopUP();
      })
    ));

  },
  addTint() {
    this.backTint = new cc.LayerColor(
      cc.color(28, 28, 28, 200),
      this.m_visibleSize.width,
      this.m_visibleSize.height
    );
    this.backTint.setPosition(-this.m_visibleSize.width / 2, -this.m_visibleSize.height / 2);
    this.addChild(this.backTint, GameConstants.MODESELECTIONPAGE.BACKGROUND);
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
    let self = event.getCurrentTarget();
    let location = self.convertToNodeSpace(touch.getLocation());
    if (self.popup) {
      let popupBox = self.popup.getBoundingBox();
      if (cc.rectContainsPoint(popupBox, location)) {
        self.onPopUpClicked();
      }
    }
  },
  onPopUpClicked() {
    window.gameManager.startLevelNumber(1);
  },
  //add background to the mode slection page
  addBackground() {
    this.background = new cc.Sprite(res.modebg);
    if (window.gameManager.getIsSmallDevice())
      this.background = new cc.Sprite(res.modebg_small);
    this.background.setScaleX(this.m_visibleSize.width / this.background.width);
    this.background.setScaleY(
      this.m_visibleSize.height / this.background.height
    );
    this.addChild(this.background, GameConstants.MODESELECTIONPAGE.BACKGROUND);
  },
  addOolzooPopUP() {
    this.popup = new cc.Sprite(res.title);
    this.addChild(this.popup, 3);
    this.popup.setScale(1.5, 3);
    this.popup.setPosition(-this.m_visibleSize.width / 2 - this.popup.width * 2, -this.m_visibleSize.height / 2 - this.popup.height * 2);
    this.popup.runAction(cc.sequence(cc.moveTo(0.3, cc.p(-this.m_visibleSize.width / 2 + this.popup.width * 1.5, this.popup.height * 2.5)),
      cc.callFunc(() => {
        this.addText();


      })
    ));

  },

  addText() {
    var str = "Hey,Do You Want to \n     do Something    \n            new";
    this.label = new cc.LabelTTF(
      str,
      getFontName(commonFonts.bookBagRegular),
      getFontSize(60)
    );

    this.label.setColor(cc.color(0, 107, 138));
    this.label.setPosition(-this.m_visibleSize.width / 2 + this.popup.width * 1.5, this.popup.height * 2.5);
    this.addChild(this.label, 3);

  },
  //add the given three modes on the mode selection page
  addModes() {
    this.totalModes = ModeNames.length;
    let mode = new Mode();
    this.modes = [];
    this.gap =
      (this.m_visibleSize.width - mode.width * this.totalModes) /
      (this.totalModes + 1);
    var x = this.gap + mode.width / 2;
    for (let i = 0; i < this.totalModes; i++) {
      let modeTemp = new Mode(ModeNames[i], i);
      let newX = x + (this.gap + mode.width) * i - this.width / 2;
      let y = 0;
      modeTemp.setScale(0);
      modeTemp.setPosition(newX, y);
      this.addChild(modeTemp, GameConstants.MODESELECTIONPAGE.MODE);
      this.modes.push(modeTemp);
    }
    this.lastIndex = 0;
    this.schedule(this.showModes, 0.2);
  },
  showModes() {
    var scale = 1;
    var action = cc.sequence(
      cc.scaleTo(0.2, scale + 0.2),
      cc.scaleTo(0.2, scale)
    );
    this.modes[this.lastIndex].runAction(action);
    this.lastIndex++;
    if (this.lastIndex == ModeNames.length) {
      this.isTouchAllowed = true;
      this.unschedule(this.showModes);
    }
  },
  zoomInSelectedMode() {
    this.background.runAction(cc.fadeOut(0.4));
    var centerPosition = cc.p(this.modes[1].x, this.modes[1].y);
    for (let i = 0; i < this.modes.length; i++) {
      let action = cc.fadeOut(0.4);
      if (i == this.selectedIndex)
        action = cc.spawn(
          cc.scaleTo(0.4, 2.5),
          cc.fadeOut(0.4),
          cc.moveTo(0.4, centerPosition)
        );
      this.modes[i].runAction(action);
      this.modes[i].thumbnail.runAction(cc.fadeOut(0.4));
      this.modes[i].heading.runAction(cc.fadeOut(0.4));
      this.modes[i].label.runAction(cc.fadeOut(0.4));
    }
  },
  removeModeSelectionPage() {
    this.runAction(
      cc.sequence(
        cc.callFunc(() => {
          // this.zoomInSelectedMode();
        }),
        cc.delayTime(0.4),
        cc.callFunc(() => {
          this.removeFromParent();
        })
      )
    );
  },
});
