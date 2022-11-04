var ScoreScreen = ccui.Layout.extend({

  ctor: function (configObject) {

    this._super();

    this.configObject = configObject;
    this.gameManager = this.configObject.gameManager;

    this.smCocosGameInstance = this.gameManager.smCocosGameInstance;
    this.setAnchorPoint(cc.p(0, 1));
    this.setBackGroundImage(commonRes.Progress_Container_png);
    this.setBackGroundImageScale9Enabled(true);
    var sprite = new cc.Sprite(commonRes.Progress_Container_png);
    this.size = sprite.getContentSize();
    this.m_visibleSize = cc.director.getVisibleSize();

    this.size.width = this.m_visibleSize.width;

    if (this.gameManager.getIsSmallDevice()) {
      LOG("IsSmallDevice");
      if (this.m_visibleSize.height > getNonRetinaValue(1200)) {
        LOG("IsSmallDevice 1536");
        this.size.height = this.size.height * 1.3;
      }
    }

    this.setContentSize(this.size);
    // window.GAMES_PLAYABLE = true;
    if (window.GAMES_PLAYABLE) {
      this.starTexture = commonRes.Progress_Coin_png;
      this.emptyStarTexture = commonRes.Progress_Empty_Coin_png;
    } else {
      this.starTexture = commonRes.Progress_Star_png;
      this.emptyStarTexture = commonRes.Progress_Empty_Star_png;
    }

    this.configObject.cancelButton = window.GAMES_ON_WEB ? false : this.configObject.cancelButton;

    if (typeof (this.gameManager.isMusicOn) == 'undefined') {
      this.gameManager.isMusicOn = true;
    }

    this.stars = [];

    if (this.configObject.text1Flag) {
      this.addLevelText();
    }
    if (this.configObject.progressBar) {
      this.addProgressBar();
    }
    if (this.configObject.showStarsFlag) {
      this.addStars(this.configObject.maxStars);
    }
    this.addButtons();

    if (this.gameManager.getIsSmallDevice()) {
      if (this.m_visibleSize.height > getNonRetinaValue(1200)) {
        var scaleUp = 1.25;
        this.undoButton && this.undoButton.setScale(scaleUp);
        this.replayButton && this.replayButton.setScale(scaleUp);
        this.musicButton && this.musicButton.setScale(scaleUp);
        this.cancelButton && this.cancelButton.setScale(scaleUp);
      }
    }
    if(window ){
      if(window.game){
        window.game.progressBarOfGame = this;
      }
    }
    this.gameManager.progressBarOfGame = this;
    
  },

  onEnter: function () {
    this._super();
  },

  onExit: function () {
    this._super();
    this.stars = null;
    this.removeAllChildren(true);
  },

  addLevelText: function () {
    this.levelText = new ccui.Text("", getFontName(commonFonts.open_sanssemibold_ttf), this.size.height * 0.5);
    this.levelText.setColor(cc.color(255, 255, 255, 255));
    this.levelText.setAnchorPoint(cc.p(0, 0.5));
    this.levelText.setPosition(cc.p(this.size.width * 0.017, this.size.height * 0.38));
    if (isSafariBrowser()) {
      this.levelText.setPositionY(this.size.height * 0.5);
    }
    if (this.gameManager.getIsSmallDevice()) {
      this.levelText.setPositionX(this.size.width * 0.025);
    }
    this.addChild(this.levelText);
    this.updateLevelText();
  },

  updateLevelText: function () {
    const levelStr = this.gameManager.gameDBHandler.getTopBarLevelString() + ' '; // "Level  ";
    const str = levelStr + this.gameManager.gameDBHandler.getCurrentLevelName() + "/" + this.gameManager.gameDBHandler.getTotalLevels();
    this.levelText.setString(str);
  },

  addProgressBar: function () {
    this.progressBar = new ProgressBar(commonRes.Progress_Filled_Bar_png, 0);
    this.progressBar.setAnchorPoint(cc.p(0, 0.5));
    this.progressBar.setPosition(cc.p(this.size.width * 0.18, this.size.height * 0.5));
    this.addChild(this.progressBar);
    this.resetProgress();
  },

  // Add Percentage To Update progress Bar
  updateProgress: function (percentage, callback = () => { }) {
    this.progressBar.updateProgressBar(percentage, callback);
  },

  resetProgress: function (callback = () => { }) {
    this.progressBar.resetProgressBar(callback);
  },

  addStars: function (starsCount) {
    this.starPanel = new cc.Sprite(commonRes.Progress_Star_Pannel_png);
    this.addChild(this.starPanel);
    this.starPanel.setAnchorPoint(cc.p(0, 0.5));
    this.starPanel.setPosition(cc.p(this.size.width * 0.63, this.size.height * 0.5));

    let startPos = cc.p(this.starPanel.getContentSize().width * 0.21, this.starPanel.getContentSize().height * 0.54);
    let displaceX = this.starPanel.getContentSize().width * 0.5 - startPos.x;
    for (let i = 0; i < starsCount; i++) {
      var star = new ProgressBarStar(this.starTexture, this.emptyStarTexture);
      star.setPosition(cc.p(startPos.x + displaceX * i, startPos.y));
      star.fade();
      this.starPanel.addChild(star);
      this.stars.push(star);
    }
  },

  resetStars: function () {
    this.stars.forEach((star) => star.fade());
  },

  // Function To Show Star
  showStars: function (starCount = 0, callback = () => { }) {
    this.currentStars = starCount;
    const upperLimit = Math.min(starCount, this.configObject.maxStars);

    for (let i = 0; i < upperLimit; i++) {
      const star = this.stars[i];
      let cb = () => { };
      if (i === upperLimit - 1) {
        cb = callback;
      }
      const delay = i * 0;
      this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(() => {
        star.show(cb);
      }, this)));
    }
  },

  addButtons: function () {


    this.replayButtonAllowed = true;
    this.undoButtonAllowed = true;
    this.musicButtonAllowed = true;
    this.cancelButtonAllowed = true;
    this.buttons = [];
    if (this.configObject.replayButton) {
      this.addReplayButton();
    }
    if (this.configObject.undoButton) {
      this.addUndoButton();
    }
    if (this.configObject.musicButton) {
      this.addMusicButton();
    }
    if (this.configObject.cancelButton) {
      this.addCancelButton();
    }
    this.updateButtonPositions();
  },

  updateButtonPositions() {
    this.buttonRevPos = [0.965, 0.91, 0.855, 0.8];
    let buttonIndex = 0;
    for (let i = this.buttons.length - 1; i >= 0; i--) {
      const button = this.buttons[i];
      const posX = this.buttonRevPos[buttonIndex];
      button.setPosition(cc.p(posX * this.size.width, this.size.height * 0.5));
      buttonIndex++;
    }
  },

  addUndoButton: function () {
    this.undoButton = new ccui.Button(getSpriteNameForButton(commonRes.Progress_Undo_Button_png), getSpriteNameForButton(commonRes.Progress_Undo_Button_png), getSpriteNameForButton(commonRes.Progress_Undo_Button_png), ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.undoButton);
    this.undoButton.setPosition(cc.p(this.size.width * 0.8, this.size.height * 0.5));
    this.undoButton.setTag(0);
    this.undoButton.addTouchEventListener(this.buttonTouchEvent, this);
  },

  getReplayButton: function () {
    return this.replayButton;
  },

  enableReplayButton(){
    if(this.replayButton && this.configObject.handleReplayButtonFading){
      // console.log("activating replay button");
      this.replayButton.setOpacity(255);
      // this.replayButton.visible = true;
    }
  },

  disableReplayButton(){
    if(this.replayButton && this.configObject.handleReplayButtonFading){
      // console.log("deactivating replay button");
      this.replayButton.setOpacity(155);
      // this.replayButton.visible = false;
    }
  },

  addReplayButton: function () {
    //config object has two new parameters now 
    // handleReplaybuttonFading -> if fadinng of buttons to be handled from common
    // handleReplayButtonInteraction -> if interaction of replay button is to be controlled from common
    this.replayButton = new ccui.Button(getSpriteNameForButton(commonRes.Progress_Replay_Button_png), getSpriteNameForButton(commonRes.Progress_Replay_Button_png), getSpriteNameForButton(commonRes.Progress_Replay_Button_png), ccui.Widget.PLIST_TEXTURE);
    this.addChild(this.replayButton);
    this.replayButton.setPosition(cc.p(this.size.width * 0.855, this.size.height * 0.5));
    this.replayButton.setTag(1);
    this.replayButton.addTouchEventListener(this.buttonTouchEvent, this);
    this.buttons.push(this.replayButton);
    this.disableReplayButton();
  },

  addMusicButton: function () {
    this.musicButton = new ccui.Button(getSpriteNameForButton(commonRes.Progress_Music_On_Button_png), getSpriteNameForButton(commonRes.Progress_Music_On_Button_png), getSpriteNameForButton(commonRes.Progress_Music_On_Button_png), ccui.Widget.PLIST_TEXTURE);
    //this.musicButton = new ccui.Button(commonRes.Progress_Music_On_Button_png);
    this.addChild(this.musicButton);
    this.musicButton.setPosition(cc.p(this.size.width * 0.91, this.size.height * 0.5));
    this.musicButton.setTag(2);
    this.musicButton.addTouchEventListener(this.buttonTouchEvent, this);
    this.changeMusicTexture();
    this.buttons.push(this.musicButton);
  },

  changeMusicTexture: function () {

    if (this.gameManager.isMusicOn) {
      this.musicButton.loadTextureNormal(getSpriteNameForButton(commonRes.Progress_Music_On_Button_png), ccui.Widget.PLIST_TEXTURE);
      //this.musicButton.loadTextureNormal(commonRes.Progress_Music_On_Button_png);
    } else {
      this.musicButton.loadTextureNormal(getSpriteNameForButton(commonRes.Progress_Music_Off_Button_png), ccui.Widget.PLIST_TEXTURE);
      //this.musicButton.loadTextureNormal(commonRes.Progress_Music_Off_Button_png);
    }
    this.gameManager.getSoundManager().setMusicFlag(this.gameManager.isMusicOn);
  },

  addCancelButton: function () {
    this.cancelButton = new ccui.Button(getSpriteNameForButton(commonRes.Progress_Wrong_Button_png), getSpriteNameForButton(commonRes.Progress_Wrong_Button_png), getSpriteNameForButton(commonRes.Progress_Wrong_Button_png), ccui.Widget.PLIST_TEXTURE);
    //this.cancelButton = new ccui.Button(commonRes.Progress_Wrong_Button_png);
    this.addChild(this.cancelButton);
    this.cancelButton.setPosition(cc.p(this.size.width * 0.965, this.size.height * 0.5));
    this.cancelButton.setTag(3);
    this.cancelButton.addTouchEventListener(this.buttonTouchEvent, this);
    this.buttons.push(this.cancelButton);
  },

  addCrossButtonPopUp: function (yesButtonCallback =()=>{}, noButtonCallback = ()=>{}) {
    //console.log("ADDING addCrossButtonPopUp");
    // var yesButtonCallback = () => {
    //   cc.soundHandler.stopAll();
    //   cc.soundHandler.uncacheAll();
    //   cc.soundHandler.end();

    //   this.popup.hide();

    //   if (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment) {
    //     // cc.spriteFrameCache.removeSpriteFrames();
    //     // cc.textureCache.removeAllTextures();
    //     // cc.game.restart();
    //     window.location.href = '/gamify/';
    //     return;
    //   }

    //   if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
    //     // get the current level
    //     //console.log("window.GAMES_IN_APP");
    //     WebViewHandler.playablePitstopCloseButtonTapped();
    //     setTimeout(() => {
    //       cc.spriteFrameCache.removeSpriteFrames();
    //       cc.textureCache.removeAllTextures();
    //       cc.game.restart();
    //     }, 0.1);
    //   } else {
    //     if (window.parent && window.parent != window && window.parent.SPWidget) {
    //       window.parent.SPWidget.closeCGOverlayPopup({
    //         updateWebContent: true
    //       });
    //     } else {
    //       window.location.reload();
    //     }
    //   }

    // };

    // var noButtonCallback = () => {
    //   this.popup.hide();
    // };

    this.popup = new CrossButtonPopUp(yesButtonCallback, noButtonCallback, this.gameManager);
    this.getParent().addChild(this.popup, this.getLocalZOrder() + 1);
    this.popup.hide();
  },

  onUndoButtonClicked: function () {
    this.configObject.undoButtonCallback && this.configObject.undoButtonCallback();
  },

  onReplayButtonClicked: function () {
    if(this.configObject.replayButtonCallback){
      if(this.gameManager.gameDBHandler.smGameInstance.isInteractionPerQuestion() || !this.configObject.handleReplayButtonInteraction){
        this.configObject.replayButtonCallback();
      }else{
        // console.log("interaction not allowed");
      }
    }
  },

  onMusicButtonClicked: function () {
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

    this.configObject.musicButtonCallback && this.configObject.musicButtonCallback();
  },

  onCancelButtonClicked: function () {
    var yesButtonCallback = () => {
      cc.soundHandler.stopAll();
      cc.soundHandler.uncacheAll();
      cc.soundHandler.end();

      
      if (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment) {
        this.popup &&  this.popup.hide();
        // cc.spriteFrameCache.removeSpriteFrames();
        // cc.textureCache.removeAllTextures();
        // cc.game.restart();
        window.location.href = '/gamify/';
        return;
      }

      if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
        // get the current level
        //console.log("window.GAMES_IN_APP");
        WebViewHandler.playablePitstopCloseButtonTapped();
        setTimeout(() => {
          cc.spriteFrameCache.removeSpriteFrames();
          cc.textureCache.removeAllTextures();
          cc.game.restart();
        }, 0.1);
      } else {
        if (window.parent && window.parent != window && window.parent.SPWidget) {
          window.parent.SPWidget.closeCGOverlayPopup({
            updateWebContent: true
          });
        } else {
          this.popup && this.popup.hide();
          window.location.reload();
        }
      }

    };
    var noButtonCallback = () => {
      if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
        // console.log("resuming game ", window.game.showingExitPitstop);
        window.game.resumeGame();
      }else{
        this.popup && this.popup.hide();
      }
    };

    if (window.GAMES_IN_APP && window.BUILD && (typeof (WebViewHandler) != 'undefined')) {
      window.exitCocosPopUp(noButtonCallback, yesButtonCallback);
    }else{
      if (!this.popup) {
        this.addCrossButtonPopUp(yesButtonCallback, noButtonCallback);
      }
      this.popup.show();
    }
  },

  buttonTouchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_ENDED:
        switch (sender.getTag()) {
          case 0: //UNDO
            this.undoButtonAllowed && this.onUndoButtonClicked();
            break;
          case 1: //REPLAY
            this.replayButtonAllowed && this.onReplayButtonClicked();
            break;
          case 2: //MUSIC
            this.musicButtonAllowed && this.onMusicButtonClicked();
            break;
          case 3: //CANCEL OR CROSS
            this.cancelButtonAllowed && this.onCancelButtonClicked();
            break;
        }
        break;
      default:
        break;
    }
  },

  disableButtons: function (configObject) {
    if (configObject.replayButton) {
      this.replayButtonAllowed = false;
      this.replayButton.setOpacity(155);
    }
    if (configObject.undoButton) {
      this.undoButtonAllowed = false;
      this.undoButton.setOpacity(155);
    }
    if (configObject.musicButton) {
      this.musicButtonAllowed = false;
      this.musicButton.setOpacity(155);
    }
    if (configObject.cancelButton) {
      this.cancelButtonAllowed = false;
      this.cancelButton.setOpacity(155);
    }
  },

  enableButtons: function (configObject) {
    if (configObject.replayButton) {
      this.replayButtonAllowed = true;
      this.replayButton.setOpacity(255);
    }
    if (configObject.undoButton) {
      this.undoButtonAllowed = true;
      this.undoButton.setOpacity(255);
    }
    if (configObject.musicButton) {
      this.musicButtonAllowed = true;
      this.musicButton.setOpacity(255);
    }
    if (configObject.cancelButton) {
      this.cancelButtonAllowed = true;
      this.cancelButton.setOpacity(255);
    }
  }
});