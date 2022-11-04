var PitStop = cc.LayerColor.extend({

  ctor: function (options) {
    var visibleSize = cc.director.getVisibleSize();
    this._super(cc.color(0, 0, 0, 0), visibleSize.width, visibleSize.height);

    // this.setTag(ScreenTag.PitStopLayer);
    this.gameManager = options.game;
    this.options = options;
    this.multiplier = 2;
    !options.hideNext && (options.hideNext = false);
    !options.levelInfoStr && (options.levelInfoStr = "Completed");
    !options.collectedStars && (options.collectedStars = 0);
    !options.totalStars && (options.totalStars = 12);

    this.smallAnimatingStarArray = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
    this.shuffleArray(this.smallAnimatingStarArray);
    this.arrayIndex = 0;

    this.addAudios();
    this.fadeBg();

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

  /**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
  shuffleArray: function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  },


  addAudios: function () {
    // this.levelCompleteAudio = this.game.add.audio("level-complete-bed", 1);
  },

  playLevelCompleteSound: function () {
    // this.levelCompleteAudio.play();
  },

  fadeBg: function () {

    var callBgSprite = cc.callFunc(() => {
      this.playLevelCompleteSound();
      this.addBase();
      this.addLevel();
      this.addButtons();
      this.enlargeBase();
    }, this);

    var fadeIn = cc.fadeTo(0.5, 220);
    var seq = cc.sequence(fadeIn, callBgSprite);
    this.runAction(seq);
  },

  addBase: function () {
    this.base = new cc.Sprite(commonRes.PitStop_Base_png);
    this.base.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5));
    this.addChild(this.base);
    this.base.setRotation(1);
    var visibleSize = cc.director.getVisibleSize();
    var scale = (visibleSize.height - visibleSize.height*0.05) / this.base.getContentSize().height;
    cc.log("scale = " + scale);
    if (scale < 1) {
      this.base.setScale(scale);
    }
  },

  addLevel: function () {

    this.fontColor1 = cc.hexToColor("#9990a8");
    this.fontColor2 = cc.hexToColor("#de217a");
    this.fontColor3 = this.fontColor1;

    this.fontSize1 = 35 * this.multiplier;
    this.fontSize2 = 44 * this.multiplier;
    this.fontSize3 = 30 * this.multiplier;

    var s = this.base.getContentSize();

    // const levelStr = "Level " + this.game.smGameInstance.getCurrentLevelName() + "/" + this.game.smGameInstance.getTotalLevels();
    const levelStr = "Level " + this.options.level + "/" + this.options.totalLevels;

    var levelCompletedText = new ccui.Text(this.options.levelInfoStr, getFontName(commonFonts.schoolbellregular_ttf), this.fontSize2);
    levelCompletedText.setColor(this.fontColor2);
    levelCompletedText.setPosition(cc.p(s.width * 0.5, s.height * 0.45));
    this.base.addChild(levelCompletedText);

    var levelText = new ccui.Text(levelStr, getFontName(commonFonts.schoolbellregular_ttf), this.fontSize1);
    levelText.setColor(this.fontColor1);
    levelText.setPosition(cc.p(s.width * 0.5, levelCompletedText.getPositionY() - s.height * 0.125));
    this.base.addChild(levelText);

    this.addStarScore(this.options.collectedStars, this.options.totalStars);

  },

  /*
 *
 *
 * @param {*} collected 
 * @param {*} total
 * @memberof PitStop
 */
  addStarScore: function (collected, total) {

    this.addBigStar();

    var totalStarScore = new ccui.Text("/ " + total, getFontName(commonFonts.schoolbellregular_ttf), this.fontSize3);
    totalStarScore.setColor(this.fontColor3);
    totalStarScore.setAnchorPoint(cc.p(0, 0.5));
    totalStarScore.setPosition(cc.p(this.base.getContentSize().width * 0.54, this.base.getContentSize().height * 0.62));
    this.base.addChild(totalStarScore);

    this.addCounter(collected, 30 * this.multiplier, this.fontColor3);//for collected stars

  },

  /*
  * adds counter to the screen from 0 -> collected stars
  */
  addCounter: function (collected, fontsize, color) {
    this.smallStar = new cc.Sprite(commonRes.PitStop_Small_Star_png);
    this.base.addChild(this.smallStar);
    this.smallStar.setPosition(cc.p(this.base.getContentSize().width * 0.42, this.base.getContentSize().height * 0.635));

    this.counter = new Counter(collected, fontsize, color, this.animatedBigStar.bind(this), this.animateSmallStar.bind(this));
    this.counter.setPosition(cc.p(this.base.getContentSize().width * 0.53, this.base.getContentSize().height * 0.62));
    this.base.addChild(this.counter);
  },

  addBigStar: function () {
    this.bigStar = new cc.Sprite(commonRes.PitStop_Big_Star_png);
    this.bigStar.setAnchorPoint(cc.p(0.5, 1));
    this.bigStar.setPosition(cc.p(this.base.getContentSize().width * 0.5, this.base.getContentSize().height * 0.92));
    this.base.addChild(this.bigStar);

    this.bigStar.setOpacity(0);
    this.bigStar.setScale(3);
  },

  animateSmallStar: function () {

    var totaltime = 0.9, scaleUpTime = 0.3;
    var s = this.base.getContentSize();
    var startPos = cc.p(s.width * this.smallAnimatingStarArray[this.arrayIndex], -s.height * 0.1);
    this.arrayIndex++;
    if (this.arrayIndex > this.smallAnimatingStarArray.length - 1) {
      this.arrayIndex = 0;
    }

    var smallAnimatingStar = new cc.Sprite(commonRes.PitStop_Small_Star_png);
    this.base.addChild(smallAnimatingStar);
    smallAnimatingStar.setScale(3);
    smallAnimatingStar.setPosition(startPos);
    var controlPoints = [cc.p(startPos.x, startPos.y),
    cc.p(this.smallStar.getPositionX() - 120, this.smallStar.getPositionY() - (this.smallStar.getPositionY() - startPos.y) / 2),
    cc.p(this.smallStar.getPositionX(), this.smallStar.getPositionY())];

    var bezierForward = cc.bezierTo(totaltime - scaleUpTime, controlPoints);
    var callStartRemove = cc.callFunc(() => {
      var starBlast = new StarsBlast(this.smallStar.getPosition());
      this.base.addChild(starBlast);
      starBlast.startAnimation();
      starBlast.setScale(0.3);

      smallAnimatingStar.removeFromParent(true);
    }, this);
    smallAnimatingStar.runAction(cc.spawn(cc.scaleTo(totaltime - scaleUpTime, 1), cc.rotateBy(totaltime - scaleUpTime, 359), cc.sequence(bezierForward, callStartRemove)));

    this.smallStar.runAction(cc.sequence(cc.delayTime(totaltime - scaleUpTime * 2), cc.scaleTo(scaleUpTime, 1.2), cc.scaleTo(scaleUpTime, 1)));
  },

  animatedBigStar: function () {
    // this.bigStar.runAction(cc.fadeTo(0.3, 255));
    var callStartFrameAnim = cc.callFunc(() => {
      var pos = cc.p(cc.p(this.bigStar.getPositionX(), this.bigStar.getPositionY() - this.bigStar.getContentSize().height / 2));
      var starBlast = new StarsBlast(pos);
      this.base.addChild(starBlast);
      starBlast.startAnimation();
      starBlast.setScale(0.8);
    }, this);
    var delay = 0.3;
    this.bigStar.runAction(cc.spawn(cc.sequence(cc.delayTime(delay), cc.fadeTo(0.15, 255)), cc.sequence(cc.delayTime(delay), cc.scaleTo(0.6, 1).easing(cc.easeElasticOut(0.7))), cc.sequence(cc.delayTime(delay + 0.2), callStartFrameAnim)));
  },

  addButtons: function () {
    var s = this.base.getContentSize();

    //this.replayButton = new ccui.Button(commonRes.PitStop_Replay_Button_png);
    this.replayButton = new ccui.Button(getSpriteNameForButton(commonRes.PitStop_Replay_Button_png), getSpriteNameForButton(commonRes.PitStop_Replay_Button_png), getSpriteNameForButton(commonRes.PitStop_Replay_Button_png),ccui.Widget.PLIST_TEXTURE);
    this.replayButton.setPosition(cc.p(s.width * 0.32, s.height * 0.2));
    this.replayButton.setRotation(-2);
    this.replayButton.setTag(0);
    this.replayButton.addTouchEventListener(this.buttonTouchEvent, this);

    //this.nextButton = new ccui.Button(commonRes.PitStop_Next_Button_png);
    this.nextButton = new ccui.Button(getSpriteNameForButton(commonRes.PitStop_Next_Button_png), getSpriteNameForButton(commonRes.PitStop_Next_Button_png), getSpriteNameForButton(commonRes.PitStop_Next_Button_png),ccui.Widget.PLIST_TEXTURE);
    this.nextButton.setPosition(cc.p(s.width - this.replayButton.getPositionX(), this.replayButton.getPositionY()));
    this.nextButton.setRotation(-2);
    this.nextButton.setTag(1);
    this.nextButton.addTouchEventListener(this.buttonTouchEvent, this);

    //this.exitButton = new ccui.Button(commonRes.PitStop_Exit_Button_png);
    this.exitButton = new ccui.Button(getSpriteNameForButton(commonRes.PitStop_Exit_Button_png), getSpriteNameForButton(commonRes.PitStop_Exit_Button_png), getSpriteNameForButton(commonRes.PitStop_Exit_Button_png),ccui.Widget.PLIST_TEXTURE);
    this.exitButton.setPosition(cc.p(s.width * 0.975, s.height * 0.962));
    this.exitButton.setTag(2);
    this.exitButton.addTouchEventListener(this.buttonTouchEvent, this);

    this.base.addChild(this.nextButton);
    this.base.addChild(this.replayButton);
    this.base.addChild(this.exitButton);

    !this.options.exitButtonCallback && (this.options.exitButtonCallback = this.addCancelButton.bind(this));

    if (this.options.hideNext || (this.options.level == this.options.totalLevels)) {
      this.nextButton.setVisible(false);
      this.replayButton.setPositionX(s.width / 2);
    }

  },

  addCancelButton: function () {

    cc.log("pitstop exit button clicked");
    // cc.log(this);

    // if (window.GAMES_IN_APP && window.BUILD) {
    //   // Kill Current State
    //   this.game && this.game.destroy();
    //   WebViewHandler.handleGameExit();
    // } else {
    //   if (typeof (window.getParameterByName) != "undefined") {
    //     var grade = getParameterByName("grade");
    //     if (grade) {
    //       window.location.href = "../grade-" + grade + ".html";
    //     } else {
    //       window.location.href = "../";
    //     }
    //   } else {
    //     window.location.href = "../";
    //   }
    // }
    this.hide();
  },

  onReplayButtonClicked: function () {
    this.options.replayButtonCallback && this.options.replayButtonCallback(this.options.game);
  },

  onNextButtonClicked: function () {
    this.options.nextButtonCallback && this.options.nextButtonCallback(this.options.game);
  },

  onCrossButtonClicked: function () {
    this.options.exitButtonCallback && this.options.exitButtonCallback();
  },

  buttonTouchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_ENDED:
        switch (sender.getTag()) {
          case 0://REPLAY
            this.onReplayButtonClicked();
            break;
          case 1://NEXT
            this.onNextButtonClicked();
            break;
          case 2://EXIT
            this.onCrossButtonClicked();
            break;
        }
        break;
      default:
        break;
    }
  },

  enlargeBase: function () {
    var baseInitialScale = this.base.getScale();
    this.base.setScale(0.7);

    this.replayButton.setScale(0);
    this.nextButton.setScale(0);
    this.exitButton.setScale(0);

    var callOnComplete = cc.callFunc(() => {
      // Making Buttons Clickable only after score is displayed
      var scaleUp = cc.scaleTo(.7, 1).easing(cc.easeBounceOut(0.5));

      this.replayButton.runAction(scaleUp.clone());
      this.nextButton.runAction(scaleUp.clone());
      this.exitButton.runAction(scaleUp.clone());
    }, this);

    var callStartCounterAnim = cc.callFunc(() => {
      this.counter.addMoveUpTween(0.4);
    }, this);

    var scale_ease_out = cc.scaleTo(0.8, baseInitialScale);

    this.base.runAction(cc.sequence(scale_ease_out.easing(cc.easeElasticOut(0.5)), callOnComplete, cc.delayTime(0.2), callStartCounterAnim));

  },

  hide: function () {
    this.removeFromParent(true);
  },
});
