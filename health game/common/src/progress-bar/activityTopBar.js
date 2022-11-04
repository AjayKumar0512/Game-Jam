var TopBar = ccui.Layout.extend({
  ctor: function (gameManager, callBack, yesCallBack, noCallBack) {
    this._super();
    this.gameManager = gameManager;
    this.setAnchorPoint(cc.p(0, 1));
    this.setBackGroundImage(window.commonRes.Progress_Container_png);
    this.setBackGroundImageScale9Enabled(true);
    var sprite = new cc.Sprite(window.commonRes.Progress_Container_png);
    this.size = sprite.getContentSize();
    this.m_visibleSize = cc.director.getVisibleSize();
    this.size.width = this.m_visibleSize.width;
    if (this.gameManager.getIsSmallDevice()) {
      this.size.height = this.size.height * 1.25;
    }
    this.setContentSize(this.size);
    this.callBack = callBack;
    this.yesCallBack = yesCallBack;
    this.noCallBack = noCallBack;
    this.buttons = [];
    this.loadTopBarSpriteSheet();
    this.addComponents();
  },

  loadTopBarSpriteSheet () {
    cc.spriteFrameCache.addSpriteFrames(commonRes.ActivityTopBarIcons_plist, commonRes.ActivityTopBarIcons_png);
  },

  onEnter: function () {
    this._super();
  },

  onExit: function () {
    this._super();
    this.removeAllChildren(true);
  },

  addComponents: function () {
    if (window.GAMES_IN_APP && window.BUILD){
      this.addCrossButton();
    }
    this.addMusicButton();
    this.addBackButton();
    this.getButtonLocation();
  },

  getButtonLocation: function () {
    if(!this.buttons.length)
      return;
    let offset = this.buttons[0].width;
    let pos = this.m_visibleSize.width - offset;
    if(this.gameManager.getIsSmallDevice())
      pos -= offset* 1.5;
    let posArray = [];
    posArray.push(pos);
    for(let i = 1; i < this.buttons.length; i++){
      let tempPos = posArray[posArray.length - 1] - offset * 1.5;
      if(this.gameManager.getIsSmallDevice())
        tempPos -= offset* 1.5;
      posArray.push(tempPos);
    }
    for(let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].setPosition(posArray[i], this.size.height * 0.5);
    }
  },

  addMusicButton: function () {
    this.musicButton = new ccui.Button(getSpriteNameForButton(res.Activity_Top_Bar_Music_Button), getSpriteNameForButton(res.Activity_Top_Bar_Music_Button), getSpriteNameForButton(res.Activity_Top_Bar_Music_Button),ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.musicButton);
    let scale = 1;
    if (this.gameManager.getIsSmallDevice()) {
      scale = 1.5;
    }
    this.musicButton.setScale(scale);
    // this.musicButton.setPosition(cc.p(this.m_visibleSize.width - this.crossButton.getBoundingBox().width - this.musicButton.getBoundingBox().width * 1.5, this.size.height * 0.5));
    this.musicButton.setTag(0);
    this.musicButton.addTouchEventListener(this.buttonTouchEvent, this);
    this.buttons.push(this.musicButton);
  },

  addBackButton: function () {
    this.backButton = new ccui.Button(getSpriteNameForButton(res.Activity_Top_Bar_Back), getSpriteNameForButton(res.Activity_Top_Bar_Back), getSpriteNameForButton(res.Activity_Top_Bar_Back),ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.backButton);
    this.backButton.setPosition(cc.p(this.backButton.getBoundingBox().width, this.size.height * 0.5));
    let scale = 1;
    if (this.gameManager.getIsSmallDevice()) {
      this.backButton.x += this.backButton.getBoundingBox().width * 1.5;
      scale = 1.5;
    }
    this.backButton.setScale(scale);
    this.backButton.setTag(1);
    this.backButton.addTouchEventListener(this.buttonTouchEvent, this);
  },

  addCrossButton: function () {
    this.crossButton = new ccui.Button(getSpriteNameForButton(res.Activity_Top_Bar_Cross), getSpriteNameForButton(res.Activity_Top_Bar_Cross), getSpriteNameForButton(res.Activity_Top_Bar_Cross),ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.crossButton);
    let scale = 1;
    if (this.gameManager.getIsSmallDevice()) {
      scale = 1.5;
    }
    this.crossButton.setScale(scale);
    // this.crossButton.setPosition(cc.p(this.m_visibleSize.width - this.crossButton.getBoundingBox().width, this.size.height * 0.5));
    this.crossButton.setTag(2);
    this.crossButton.addTouchEventListener(this.buttonTouchEvent, this);
    this.buttons.push(this.crossButton);
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
      this.musicButton.loadTextureNormal(getSpriteNameForButton(res.Activity_Top_Bar_Music_Button),ccui.Widget.PLIST_TEXTURE);
    } else {
      this.musicButton.loadTextureNormal(getSpriteNameForButton(res.Activity_Top_Bar_Nomusic_Button),ccui.Widget.PLIST_TEXTURE);
    }
    this.gameManager.getSoundManager().setMusicFlag(this.gameManager.isMusicOn);
  },

  onBackBUttonClicked: function () {
    // this.gameManager.soundManager.playSound(res.tap);
    this.gameManager.moveBack();
  },

  onCrossButtonClicked: function () {
    this.callBack && this.callBack();
    var yesButtonCallback = () => {
      cc.soundHandler.stopAll();
      cc.soundHandler.uncacheAll();
      cc.soundHandler.end();
      this.yesCallBack  && this.yesCallBack();

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
      this.noCallBack && this.noCallBack();
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
  
  hideBackButton() {
    this.backButton && this.backButton.setVisible(false);
  },
  showBackButton() {
    this.backButton && this.backButton.setVisible(true);
  },
});

