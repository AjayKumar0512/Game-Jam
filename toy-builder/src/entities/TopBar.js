var TopBar = ccui.Layout.extend({
  ctor: function () {
    this._super();
    this.setAnchorPoint(cc.p(0, 1));
    this.setBackGroundImage(res.ui_bar);
    this.setBackGroundImageScale9Enabled(true);
    var sprite = new cc.Sprite(res.ui_bar);
    this.size = sprite.getContentSize();
    this.m_visibleSize = cc.director.getVisibleSize();
    this.size.width = this.m_visibleSize.width;
    if (window.gameManager.getIsSmallDevice()) {
      this.size.height = this.size.height * 1.25;
    }
    this.setContentSize(this.size);
    this.gameManager = window.gameManager;
  },
  onEnter: function () {
    this._super();
    this.addComponents();
  },

  onExit: function () {
    this._super();
    this.removeAllChildren(true);
  },

  addComponents: function () {
    this.addCrossButton();
    this.addMusicButton();
    this.addBackButton();
  },

  addMusicButton: function () {
    this.musicButton = new ccui.Button(getSpriteNameForButton(res.music_button), getSpriteNameForButton(res.music_button), getSpriteNameForButton(res.music_button), ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.musicButton);
    let scale = 1;
    if (window.gameManager.getIsSmallDevice()) {
      scale = 1.5;
    }
    this.musicButton.setScale(scale);
    this.musicButton.setPosition(cc.p(this.m_visibleSize.width - this.crossButton.getBoundingBox().width - this.musicButton.getBoundingBox().width * 1.5, this.size.height * 0.5));
    this.musicButton.setTag(0);
    this.musicButton.addTouchEventListener(this.buttonTouchEvent, this);
  },

  addBackButton: function () {
    this.backButton = new ccui.Button(getSpriteNameForButton(res.back), getSpriteNameForButton(res.back), getSpriteNameForButton(res.back), ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.backButton);
    let scale = 1;
    if (window.gameManager.getIsSmallDevice()) {
      scale = 1.5;
    }
    this.backButton.setScale(scale);
    this.backButton.setPosition(cc.p(this.backButton.getBoundingBox().width, this.size.height * 0.5));
    this.backButton.setTag(1);
    this.backButton.addTouchEventListener(this.buttonTouchEvent, this);
  },

  addCrossButton: function () {
    this.crossButton = new ccui.Button(getSpriteNameForButton(res.cross), getSpriteNameForButton(res.cross), getSpriteNameForButton(res.cross), ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.crossButton);
    let scale = 1;
    if (window.gameManager.getIsSmallDevice()) {
      scale = 1.5;
    }
    this.crossButton.setScale(scale);
    this.crossButton.setPosition(cc.p(this.m_visibleSize.width - this.crossButton.getBoundingBox().width, this.size.height * 0.5));
    this.crossButton.setTag(2);
    this.crossButton.addTouchEventListener(this.buttonTouchEvent, this);
  },

  buttonTouchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_ENDED:
        switch (sender.getTag()) {
          case 0:
            this.onMusicBUttonClicked();
            break;
          case 1:
            this.onBackBUttonClicked();
            break;
          case 2:
            this.onCrossButtonClicked();
            break;
        }
        break;
      default:
        break;
    }
  },

  onMusicBUttonClicked: function () {
    this.gameManager.isMusicOn = !this.gameManager.isMusicOn;
    this.changeMusicTexture();

    let value = this.gameManager.isMusicOn ? "On" : "Off";
    let musicEventObject = {
      event_name: EventType.SET_MUSIC,
      To: value,
      From: "Games",
      PlayableName: (this.smCocosGameInstance ? this.smCocosGameInstance.getPlayableCode() : "")
    };
    this.gameManager.gameDBHandler.logGameEvents(EventType.SET_MUSIC, musicEventObject);
  },

  changeMusicTexture: function () {
    if (this.gameManager.isMusicOn) {
      this.musicButton.loadTextureNormal(getSpriteNameForButton(res.music_button), ccui.Widget.PLIST_TEXTURE);
    } else {
      this.musicButton.loadTextureNormal(getSpriteNameForButton(res.nomusic_button), ccui.Widget.PLIST_TEXTURE);
    }
    this.gameManager.getSoundManager().setMusicFlag(this.gameManager.isMusicOn);
  },

  onBackBUttonClicked: function () {
    this.gameManager.moveBack();
  },

  onCrossButtonClicked: function () {
    var yesButtonCallback = () => {
      cc.soundHandler.stopAll();
      cc.soundHandler.uncacheAll();
      cc.soundHandler.end();

      this.gameManager.closedActivity();
      if (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment) {
        this.popup && this.popup.hide();
        window.location.href = '/gamify/';
        return;
      }
      if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
        this.gameManager.updatePlayableComplete();

        WebViewHandler.playablePitstopCloseButtonTapped();
        setTimeout(() => {
          cc.spriteFrameCache.removeSpriteFrames();
          cc.textureCache.removeAllTextures();
          cc.game.restart();
        }, 0.1);
      } else {
        if (window.parent && window.parent != window) {
          window.parent.postMessage({ key: 'closeCGOverlayPopup', params: [{ updateWebContent: true }] }, "*");
        } else {
          this.popup && this.popup.hide();
          window.location.reload();
        }
      }

    };
    var noButtonCallback = () => {
      if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
        window.game.resumeGame();
      } else {
        this.popup && this.popup.hide();
      }
    };

    if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
      window.exitCocosPopUp(noButtonCallback, yesButtonCallback);
    } else {
      if (!this.popup) {
        this.addCrossButtonPopUp(yesButtonCallback, noButtonCallback);
      }
      this.popup.show();
    }
  },
  addCrossButtonPopUp: function (yesButtonCallback = () => { }, noButtonCallback = () => { }) {
    this.popup = new CrossButtonPopUp(yesButtonCallback, noButtonCallback, this.gameManager);
    this.getParent().addChild(this.popup, this.getLocalZOrder() + 1);
    this.popup.hide();
  },
  removeLevelDisplayer() {
    if (this.levelDisplayer != null) this.levelDisplayer.removeFromParent();
    this.levelDisplayer = null;
  },
  addLevelDisplayer(data, subLevel, isTutorial, gamePlay) {
    if (this.levelDisplayer == null) {
      //to have level displayer for hide and seek
      this.levelDisplayer = new LevelDisplayer(
        data,
        subLevel,
        isTutorial,
        gamePlay
      );
      this.levelDisplayer.setPosition(
        cc.p(this.size.width / 2, this.size.height / 2)
      );
      this.addChild(this.levelDisplayer);
      this.levelDisplayer.getLevelPositions();
    }
    else
      this.levelDisplayer.changeLevel(subLevel);
  },
  hideBackButton() {
    this.backButton && this.backButton.setVisible(false);
  },
  showBackButton() {
    this.backButton && this.backButton.setVisible(true);
  },
});
