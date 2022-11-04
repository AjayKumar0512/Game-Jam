var CrossButtonPopUp = cc.LayerColor.extend({

  ctor: function (yesButtonCallback, noButtonCallback, gameManager) {

    this.visibleSize = cc.director.getVisibleSize();
    this._super(cc.color(0, 0, 0, 0), this.visibleSize.width, this.visibleSize.height);

    // this.setTag(ScreenTag.CrossButtonLayer);

    this.gameManager = gameManager;

    this.yesButtonCallback = yesButtonCallback;
    this.noButtonCallback = noButtonCallback;

    this.isSplashVerse = false;
    if (typeof (this.gameManager.smCocosGameInstance) != "undefined" && this.gameManager.smCocosGameInstance != null) {
      const isSplashVerse = this.gameManager.smCocosGameInstance.isSplashVerse;
      if (isSplashVerse && (this.gameManager.getIsSmallDevice()) && window.GAMES_IN_APP) {
        this.isSplashVerse = true;
      }

    }

    // this.isSplashVerse = true;
    this.assets = this.getAssetParams(gameManager);
    this.addContainer();

    this.fadeInBg();

    this.addTouchListener();

  },

  getAssetParams() {

    let assets = {
      base: "CrossPopUp_Container_png",
      yes_button: "CrossPopUp_Button_png",
      no_button: "CrossPopUp_Button_png",
      widget: ccui.Widget.PLIST_TEXTURE,
      questionBreak: "\n",
      questionFont: commonFonts.mysteryQuest_ttf,
      yesNoTextColor: cc.hexToColor("#ffffff"),
      yesNoFont: commonFonts.noteworthy_bold_ttf,
      questionTextFill: cc.hexToColor("#de217a"),
      questionTextSize: 72,
      yesNoTestSize: 62,
      enableYesNoOutline: true,
      yesPos: "left",//cc.p(s.width * 0.32, s.height * 0.33),
      noPos: "right",//cc.p(s.width - s.width * 0.32, s.height * 0.33)
      bgTexture: cc.color(0, 0, 0, 0),
      bgOpacity: 180
    };
    if (this.isSplashVerse) {
      assets = {
        base: "SplashVerse_CrossPopUp_Container_png",
        yes_button: "SplashVerse_CrossPopUp_Yes_Button_png",
        no_button: "SplashVerse_CrossPopUp_No_Button_png",
        widget: ccui.Widget.PLIST_TEXTURE,
        questionBreak: " ",
        questionFont: commonFonts.openSans_Bold_ttf,
        yesNoFont: commonFonts.openSans_Bold_ttf,
        yesNoTextColor: cc.hexToColor("#141975"),
        questionTextFill: cc.hexToColor("#ffffff"),
        questionTextSize: 56,
        yesNoTestSize: 56,
        enableYesNoOutline: false,
        yesPos: "right",
        noPos: "left",
        bgTexture: cc.color(2, 5, 51, 0),
        bgOpacity: 180
      };
    }
    return assets;
  },

  addTouchListener: function () {
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded,
    }, this);
  },

  onTouchBegan: function (touch, event) {
    var target = event.getCurrentTarget();
    if (target && target.isVisible()) {
      return true;
    }
    return false;
  },

  onTouchMoved: function (touch, event) {
  },

  onTouchEnded: function (touch, event) {
  },

  show: function () {
    this.fadeInBg();
    this.setVisible(true);
  },

  hide: function () {
    this.setVisible(false);
  },

  remove: function () {
    this.removeFromParent(true);
  },

  fadeInBg: function () {
    this.setColor(this.assets.bgTexture);
    this.setOpacity(0);
    this.runAction(cc.fadeTo(0.1, this.assets.bgOpacity));
  },

  addContainer: function () {
    this.container = new cc.Sprite(commonRes[this.assets.base]);
    this.container.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5));
    this.addChild(this.container);
    this.addContainerText();
    this.addButtons();
    if (this.gameManager.getIsSmallDevice()) {
      const baseSize = this.container.getContentSize();
      let scale = this.visibleSize.height * 0.8 / baseSize.height;
      this.container.setScale(scale);
    }
  },

  addContainerText: function () {
    var s = this.container.getContentSize();

    let str1 = SPGameTranslate("areYouSureYouWantToPopUp");
    let str2 = SPGameTranslate("toExitPopUp");

    let str = str1 + this.assets.questionBreak + str2;
    // var textArea = cc.size(s.width * 0.9 * scal, s.height * 0.4 * scal);

    this.containerText = new ccui.Text(str, getFontName(this.assets.questionFont), getFontSize(this.assets.questionTextSize));

    this.containerText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.containerText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    this.containerText.setColor(this.assets.questionTextFill);
    this.containerText.setPosition(cc.p(s.width * 0.5, s.height * 0.66));
    this.container.addChild(this.containerText);
  },

  addButtons: function () {
    var s = this.container.getContentSize();

    this.yesButton = new ccui.Button(getSpriteNameForButton(commonRes[this.assets.yes_button]), getSpriteNameForButton(commonRes[this.assets.yes_button]), getSpriteNameForButton(commonRes[this.assets.yes_button]), this.assets.widget);
    const yesPos = (this.assets.yesPos == "left") ? cc.p(s.width * 0.32, s.height * 0.33) : cc.p(s.width - s.width * 0.32, s.height * 0.33);

    this.yesButton.setPosition(yesPos);
    //not using text separately
    let yesStr = SPGameTranslate("yesButtonText");
    this.yesButton.setTag(0);
    this.yesButton.addTouchEventListener(this.buttonTouchEvent, this);

    this.noButton = new ccui.Button(getSpriteNameForButton(commonRes[this.assets.no_button]), getSpriteNameForButton(commonRes[this.assets.no_button]), getSpriteNameForButton(commonRes[this.assets.no_button]), this.assets.widget);
    //this.noButton = new ccui.Button(commonRes.CrossPopUp_Button_png);
    const noPos = (this.assets.noPos == "left") ? cc.p(s.width * 0.32, s.height * 0.33) : cc.p(s.width - s.width * 0.32, s.height * 0.33);
    this.noButton.setPosition(noPos);

    //not using text separately
    let noStr = SPGameTranslate("noButtonText");
    this.noButton.setTag(1);
    this.noButton.addTouchEventListener(this.buttonTouchEvent, this);

    this.container.addChild(this.yesButton);
    this.container.addChild(this.noButton);
    this.addYesNoButtonText(this.yesButton, yesStr);
    this.addYesNoButtonText(this.noButton, noStr);
  },

  addYesNoButtonText: function (button, str) {
    buttonText = new ccui.Text(str, getFontName(this.assets.yesNoFont), getFontSize(this.assets.yesNoTestSize));
    // buttonText.setTextAreaSize(textArea);
    buttonText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    buttonText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    buttonText.setColor(this.assets.yesNoTextColor);
    if (this.assets.enableYesNoOutline) {
      buttonText.enableOutline(cc.color(0,0,0,0.5), getFontSize(2));
      buttonText.enableShadow(cc.color(0,0,0,0.5),{ x : 2, y : -1 }, 2);
    }
    buttonText.setPosition(cc.p(button.width * 0.5, button.height * 0.47));
    button.addChild(buttonText);
    if (cc.sys.isNative || isSafariBrowser()) {
      buttonText.y += getNonRetinaValue(10);
    }
  },

  onYesButtonClicked: function () {
    this.yesButtonCallback && this.yesButtonCallback();
  },

  onNoButtonClicked: function () {
    if (this.noButtonCallback) {
      this.noButtonCallback();
    } else {
      this.hide();
    }
  },

  buttonTouchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_ENDED:
        switch (sender.getTag()) {
          case 0://YES
            this.onYesButtonClicked();
            break;
          case 1://NO
            this.onNoButtonClicked();
            break;
        }
        break;
      default:
        break;
    }
  },

});
