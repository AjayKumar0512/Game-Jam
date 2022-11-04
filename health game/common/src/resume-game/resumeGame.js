var ResumeGamePopUp = cc.LayerColor.extend({

  ctor: function (homeButtonCallback, resumeButtonCallback) {

    var visibleSize = cc.director.getVisibleSize();
    this._super(cc.color(0, 0, 0, 0), visibleSize.width, visibleSize.height);

    this.setName("ResumeGamePopUp");

    this.homeButtonCallback = homeButtonCallback;
    this.resumeButtonCallback = resumeButtonCallback;

    this.fadeInBg();

    this.addTouchListener();

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
    return true;
  },

  onTouchMoved: function (touch, event) {
  },

  onTouchEnded: function (touch, event) {
  },

  show: function () {
    this.setVisible(true);
  },

  hide: function () {
    this.setVisible(false);
  },

  remove: function () {
    this.removeFromParent(true);
  },

  fadeInBg: function () {
    this.runAction(cc.fadeTo(0.2, 220));
    this.addContainer();
  },

  addContainer: function () {
    this.container = new cc.Sprite(commonRes.ResumePopUp_Container_png);
    this.container.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5));
    this.addChild(this.container);
    this.addContainerText();
    this.addButtons();
    this.container.setScale(getNonRetinaValue(2));
  },

  addContainerText: function () {
    var s = this.container.getContentSize();

    const str = "Welcome Back!";
    this.containerTitle = new ccui.Text(str, getFontName(commonFonts.mysteryQuest_ttf), 55);
    this.containerTitle.setColor(cc.hexToColor("#de217a"));
    this.containerTitle.setTextAreaSize(cc.size(0, 0));
    this.containerTitle.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.containerTitle.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
    this.containerTitle.setPosition(cc.p(s.width * 0.5, s.height * 0.8));
    this.container.addChild(this.containerTitle);

    const str2 = "Hey, great to see you again. Let us begin from where you left off.";
    this.containerText = new ccui.Text(str2, getFontName(commonFonts.openSans_ttf), 23);
    this.containerText.setColor(cc.hexToColor("#9990a8"));
    this.containerText.setTextAreaSize(cc.size(s.width * 0.8, 0));
    this.containerText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
    this.containerText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);

    this.containerText.setPosition(cc.p(s.width * 0.5, s.height * 0.56));
    this.container.addChild(this.containerText);
  },

  addButtons: function () {
    var s = this.container.getContentSize();
    this.homeButton = new ccui.Button(getSpriteNameForButton(commonRes.ResumePopUp_Home_Button_png), getSpriteNameForButton(commonRes.ResumePopUp_Home_Button_png) , getSpriteNameForButton(commonRes.ResumePopUp_Home_Button_png), ccui.Widget.PLIST_TEXTURE);
    //this.homeButton = new ccui.Button(commonRes.ResumePopUp_Home_Button_png);
    this.homeButton.setPosition(cc.p(s.width * 0.3, s.height * 0.26));
    this.homeButton.setTag(0);
    this.homeButton.addTouchEventListener(this.buttonTouchEvent, this);

    this.resumeButton = new ccui.Button(getSpriteNameForButton(commonRes.ResumePopUp_Resume_Button_png), getSpriteNameForButton(commonRes.ResumePopUp_Resume_Button_png) , getSpriteNameForButton(commonRes.ResumePopUp_Resume_Button_png), ccui.Widget.PLIST_TEXTURE);
    //this.resumeButton = new ccui.Button(commonRes.ResumePopUp_Resume_Button_png);
    this.resumeButton.setPosition(cc.p(s.width - this.homeButton.getPositionX(), this.homeButton.getPositionY()));
    this.resumeButton.setTag(1);
    this.resumeButton.addTouchEventListener(this.buttonTouchEvent, this);

    this.container.addChild(this.homeButton);
    this.container.addChild(this.resumeButton);

  },

  onHomeButtonClicked: function () {
    this.homeButtonCallback && this.homeButtonCallback();
    this.remove();
  },

  onResumeButtonClicked: function () {
    this.resumeButtonCallback && this.resumeButtonCallback();
    this.remove();
  },

  buttonTouchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_ENDED:
        switch (sender.getTag()) {
          case 0://HOME
            this.onHomeButtonClicked();
            break;
          case 1://RESUME
            this.onResumeButtonClicked();
            break;
        }
        break;
      default:
        break;
    }
  },

});