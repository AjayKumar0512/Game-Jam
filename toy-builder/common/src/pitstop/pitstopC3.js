var PitStopC3 = cc.LayerColor.extend({

  ctor: function (options) {
    var visibleSize = cc.director.getVisibleSize();
    this._super(cc.color(0, 0, 0, 0));
    let po = options.pitstopOptions ? options.pitstopOptions : {};
    if (po && typeof (po.completed_cards) != "undefined" && window.GAMES_ON_WEB) {
      po.completed_cards = po.completed_cards - 1;
    }
    this.options = options;

    this.gameManager = options.game.gameManager;

    this.options.showAutoNextAnim = false;
    if (po && typeof (po.auto_next_cta) != "undefined" && po["auto_next_cta"] && po.next_item_url && window.GAMES_ON_WEB) {
      this.options.showAutoNextAnim = true;
    }

    this.options.isSplashVerse = false;
    if (typeof (this.gameManager.smCocosGameInstance) != "undefined" && this.gameManager.smCocosGameInstance != null) {
      const isSplashVerse = this.gameManager.smCocosGameInstance.isSplashVerse;
      if (isSplashVerse && (this.gameManager.getIsSmallDevice()) && window.GAMES_IN_APP) {
        this.options.isSplashVerse = true;
      }
    }

    this.options.delayTime = 3;

    const currentRunningScene = cc.director.getRunningScene(); //cc.director.getRunningScene();
    currentRunningScene.addChild(this, Z_ORDER_PITSTOP_C3, PITSTOP_C3_TAG);
    currentRunningScene.setName(PITSTOP_C3_TAG);
    this.addAudios();

    po.optionsType = 1;
    if (typeof (options.level) != "undefined") {
      po.optionsType = !options.levelFailed ? 1 : 2;
    } else {
      po.optionsType = 2;
    }



    // tempoarary remove it
    // po.optionsType = 2;
    // po.completed_cards = 2;
    // po.primary_btn_type = "replay";
    // this.options.isSplashVerse = true;
    // this.options.showAutoNextAnim = true;



    this["addPitstopType" + po.optionsType](po);

    this.addTouchListener();

  },

  getLang() {
    return this.gameManager.gameDBHandler.getUserLang();

    // if (window.GAMES_ON_WEB) {
    //   lang = GameData.user_lang || "en";
    // } else if (window.GAMES_IN_APP) {
    //   lang = User.current.preferred_language || "en";
    // } else {
    //   lang = "en";
    // }
  },



  addOverlay(bgOverlayTexture) {
    this.setColor(bgOverlayTexture);
    var fadeIn = cc.fadeTo(0.5, 220);
    this.runAction(
      fadeIn
    );
  },

  addPitstopType1() {
    const bgOverlayTexture = this.options.isSplashVerse ? cc.color(2, 5, 51, 0) : cc.color(0, 0, 0, 0);
    this.addOverlay(bgOverlayTexture);
    let spineJsonKey = "good-job-spine-json";
    let spineAtlasKey = "good-job-spine-atlas";

    // if (this.getLang() == "es") {
    //   spineJsonKey = "good-job-spine-spanish-json";
    //   spineAtlasKey = "good-job-spine-spanish-atlas";
    // }

    this.goodJobSpine = new SpineUtils(commonRes[spineJsonKey], commonRes[spineAtlasKey], getNonRetinaValue(1));
    this.addChild(this.goodJobSpine);
    this.goodJobSpine.setAnimation(0, "animation", false);
    this.goodJobSpine.setScale(2);

    this.soundManager.playEffect(commonRes["goodJobArrival"]);
    this.soundManager.playEffect(commonRes["goodJobDeparture"]);
    this.goodJobSpine.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.4));
    const visibleSize = this.getContentSize();
    if (visibleSize.height < 1200 && this.gameManager.getIsSmallDevice()) { //for different resolution policy
      this.goodJobSpine.setScale(1.8);
    }

    this.runAction(
      cc.sequence(
        cc.delayTime(3),
        cc.callFunc(() => {
          this.options.nextButtonCallback && this.options.nextButtonCallback();
          //this.removeFromParent(true);
          /* removed by Rahul as repacing scene will automatically remove pitstop. 
            In this way flicker will not appear*/
        })
      )
    );
  },


  /**
   * 
   * @param {parameters we got form backend} pitstopOptions 
   */
  getH2Text(pitstopOptions) {
    // if not sent from backend , select on no of stars earned 
    if (pitstopOptions.h2_text == "undefined" || pitstopOptions.h2_text == null) {
      return getPerformanceText(Math.round((this.options.collectedStars / this.options.totalStars) * 3), this.getLang())
    }

    return pitstopOptions.h2_text;
  },
  /**
   * pitstop type 2 is further of two types 1, 2
   * type 1 -> completed cards provided (blu n white base) 
   * type 2 -> no completed cards(blue base)
   * @param {parameters we got form backend} pitstopOptions 
   */
  getDefaultOptionsForPitstopType2(pitstopOptions) {
    let opts = {
      //informaiton to show
      completed_cards: pitstopOptions.completed_cards,
      h1_text: pitstopOptions.h1_text,
      h2_text: this.getH2Text(pitstopOptions),
      button_text: pitstopOptions.button_text || "OK",
      total_cards: pitstopOptions.total_cards || 4,
      primary_btn_type: pitstopOptions.primary_btn_type,


      //by default for type 1
      type: typeof (pitstopOptions.completed_cards) != "undefined" ? 1 : 2,
      addNextButton: this.addNextButton.bind(this),
      addExitButton: window.GAMES_ON_WEB ? () => {} : this.addExitButton.bind(this),
      baseTexture: "pitstop-c3-popup-card-png", //type 1
      emptyStarTexture: "pitstop-c3-empty-star-png", // type 1/2
      replayIconTexture: "pitstop-c3-replay-icon-png",
      nextButtonTexture: "pitstop-c3-next-button-png",
      nextButtonOverlayTexture: "pitstop-c3-next-button-overlay-png",
      nextButtonWidgetType: ccui.Widget.PLIST_TEXTURE,
      nextButtonTextFill: cc.color(255, 255, 255, 255),
      bgOverlayTexture: cc.color(0, 0, 0, 0),
      exitButtonTexture: "pitstop-c3-exit-button-png",
      exitButtonWidgetType: ccui.Widget.PLIST_TEXTURE


    };

    opts.type = typeof (opts.completed_cards) != "undefined" ? 1 : 2;

    if (opts.type == 2) {
      opts.baseTexture = "pitstop-c3-popup-card-2-png";
    }

    if (opts.primary_btn_type == "replay") {
      if (this.getLang() == "es") {
        opts.button_text = "Repetición";
      }
    } else if (this.options.showAutoNextAnim) {
      opts.button_text = "Next activity in";
      if (this.getLang() == "es") {
        opts.button_text = "Siguiente actividad en";
      }
      opts.addNextButton = this.addNextButtonForAnim.bind(this);
    }


    // CTA text is grater than 10 px , use large asset 
    if (opts.button_text && opts.button_text.length > 10) {
      opts.nextButtonTexture += "-large";
      opts.nextButtonOverlayTexture += "-large";
    }

    if (this.options.isSplashVerse) {
      opts.bgOverlayTexture = cc.color(2, 5, 51, 0); //blue colouroverlay 
      // opts.nextButtonWidgetType = ccui.LOCAL_TEXTURE;
      // opts.exitButtonWidgetType = ccui.LOCAL_TEXTURE
      this.setColor(opts.bgOverlayTexture);
      opts.emptyStarTexture = "pitstop-c3-empty-star-dark-blue-png";
      if (opts.type == 1) {
        opts.nextButtonTexture += "-blue";

      } else {
        opts.nextButtonTextFill = cc.color(20, 25, 117, 255);
        opts.replayIconTexture += "-blue";
        opts.nextButtonTexture += "-white";
      }
      opts.baseTexture += "-dark-blue";
      opts.exitButtonTexture += "-dark-blue";
    }

    return opts;
  },


  addPitstopType2(po) {
    let opts = this.getDefaultOptionsForPitstopType2(po);
    this.poOpts = opts;
    this.fadeBg(opts.type);
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

  onTouchMoved: function (touch, event) {},

  onTouchEnded: function (touch, event) {},

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

    this.soundManager = this.gameManager.getSoundManager();
    this.soundManager.stopAllEffects();
  },

  playLevelCompleteSound: function () {
    this.soundManager.playEffect(commonRes["levelCompleteBed"]);
    // this.levelCompleteAudio.play();
  },

  fadeBg: function (type) {

    this.addOverlay(this.poOpts.bgOverlayTexture);

    this.addBackGroundStar();
    this.addBase();
    this.addFonts();
    this.addButtons(type);
    this.addEmptyStars();
    this.addCompletionText();

    var callBgSprite = cc.callFunc(() => {
      this.base.visible = true;
      this.fillEmptyStars();
      if (this.poOpts.type == 1) {
        this.addEmptyGifts();
        this.makeEarlyWay(this.poOpts.completed_cards);
      }
      this.enlargeBase();
      this.playLevelCompleteSound();
    }, this);


    var fadeIn = cc.fadeTo(0.5, 220);
    var seq = cc.sequence(fadeIn, callBgSprite);
    // var seq = cc.spawn(fadeIn, callBgSprite);
    this.backGroundStar.runAction(cc.fadeIn(0.5));
    this.runAction(seq);
  },

  addBackGroundStar() {

    const backGroundStar = new cc.Sprite(commonRes["pitstop-background-star-png"]);
    this.addChild(backGroundStar);
    backGroundStar.setScale(2);
    backGroundStar.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5));
    // backGroundStar.setOpacity(0);
    this.backGroundStar = backGroundStar;

  },

  addBase: function () {
    const texture = this.poOpts.baseTexture;
    this.base = new cc.Sprite(commonRes[texture]);
    const visibleSize = this.getContentSize();
    this.base.setPosition(cc.p(visibleSize.width * 0.5, visibleSize.height * 0.5));
    this.addChild(this.base);
    const baseSize = this.base.getContentSize();
    this.base.width = baseSize.width;
    this.base.height = baseSize.height;
    if (this.gameManager.getIsSmallDevice()) {
      let scale = 1.2;
      // this.base.setScale(scale);
      const baseSize = this.base.getContentSize();
      if (baseSize.height * scale + getNonRetinaValue(115 / 2) > visibleSize.height) {
        scale = 0.95;
      }
      this.base.setScale(scale);
    }
    this.base.visible = false;
  },

  addFonts: function () {

    this.fontColor1 = cc.hexToColor("#9990a8");
    this.fontColor2 = cc.hexToColor("#de217a");
    this.fontColor3 = this.fontColor1;
    this.fontColor4 = cc.hexToColor("#ffffff");

    this.fontSize1 = 35 * this.multiplier;
    this.fontSize2 = 44 * this.multiplier;
    this.fontSize3 = 30 * this.multiplier;


  },

  addEmptyStars() {
    var s = this.base.getContentSize();
    const starTexture = this.poOpts.emptyStarTexture;
    const starsOffset = this.poOpts.type == 1 ? 0.02 : -0.1;
    this.emptyStars = [];
    const noOfEmptyStars = 3;
    for (let i = 0; i < noOfEmptyStars; i++) {
      const emptyStar = new cc.Sprite(commonRes[starTexture]);
      const starContentSize = emptyStar.getContentSize();
      emptyStar.setPosition(s.width * 0.26 + starContentSize.width * i * 1.2, s.height * (0.6 + starsOffset));
      this.emptyStars.push(emptyStar);
      emptyStar.setAnchorPoint(cc.p(0.5, 0.5));
      this.base.addChild(emptyStar);
    }
  },

  addPlist() {
    // this.loadAnim = new LoadAnimClass(this);
    // this.addChild(this.loadAnim);
  },

  fillEmptyStars() {
    let noOfStars = Math.round((this.options.collectedStars / this.options.totalStars) * 3);
    let counter = noOfStars;

    let tweenTime = 0.7;
    if (this.nextButton.scale.x == 1) {
      tweenTime = 0;
    }
    var scaleUp = cc.scaleTo(tweenTime, 1).easing(cc.easeBounceOut(0.5));

    var nextButtonAnim = cc.callFunc(() => {
      this.addNextAnim(); //adding autonext anim
    });

    if (!noOfStars) {
      this.nextButton.runAction(cc.sequence(
        scaleUp.clone(),
        nextButtonAnim
      ));
    }
    this.addPlist();
    while (noOfStars) {
      const star = this.emptyStars[--noOfStars];

      star.runAction(
        cc.sequence(
          cc.delayTime((noOfStars) * 0.5),
          cc.callFunc(() => {
            this.soundManager.playEffect(commonRes["crown1"]);
          }),
          cc.callFunc(() => {
            const starAnim = this.startAnim({
              str: "",
              n: 31,
              plist: commonRes["pitstop-c3-starSheet-plist"],
              png: commonRes["pitstop-c3-starSheet-png"],
            });
            star.addChild(starAnim);
            const starContentSize = star.getContentSize();
            starAnim.setPosition(starContentSize.width / 2, starContentSize.height / 2);


          }),

          // cc.scaleTo(0.5, 1).easing(cc.easeBackInOut(1)),
          cc.callFunc(() => {
            counter--;
            if (!counter) {
              this.nextButton.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(() => {
                  this.soundManager.playEffect(commonRes["trail"]);
                }),
                scaleUp.clone(),
                nextButtonAnim

              ));
              if (this.poOpts.type == 1) {
                this.makeWay(this.poOpts.completed_cards);
              }
            }
          })

        )
      );

    }
  },

  addNextAnim() {
    if (this.options.showAutoNextAnim && this.poOpts.primary_btn_type != "replay" && !this.nextButtonClicked && !this.crossButtonClicked) {
      this.runAction(
        cc.sequence(
          cc.callFunc(() => {
            if (!this.nextButtonClicked && !this.crossButtonClicked) {
              this.nextOverlayAnim(this.options.delayTime);
              this.startNextTextAnim();
            }
          }),
          cc.delayTime(this.options.delayTime),
          cc.callFunc(() => {
            if (!this.nextButtonClicked && !this.crossButtonClicked) {
              this.onNextButtonClicked(true);
            }
          })
        )
      );
    }

  },

  nextOverlayAnim(time = 5) {
    var overlayMove = cc.moveBy(time, cc.p(this.nextButton.width, 0));
    this.stencil && this.stencil.runAction(
      overlayMove
    );
  },

  startNextTextAnim(k = this.options.delayTime) {
    if (k == 1 || this.nextButtonClicked || this.crossButtonClicked || !this.options.showAutoNextAnim) {
      return;
    }
    this.runAction(
      cc.sequence(
        cc.delayTime(1),
        cc.callFunc(() => {
          if (!this.nextButtonClicked && !this.crossButtonClicked && this.options.showAutoNextAnim) {
            this.nextButtonText2.string = " " + (k - 1);
            k--;
          }
        }),
        cc.callFunc(() => {
          if (!this.nextButtonClicked && !this.crossButtonClicked && this.options.showAutoNextAnim) {
            this.startNextTextAnim(k);
          }
        })
      )
    );

  },

  addCompletionText() {

    // this.fillEmptyStars();
    let unitCompleteText;
    const textOffset = this.poOpts.type == 1 ? -this.base.height * 0.05 : -this.base.height * 0.1;
    if (this.poOpts.h1_text && this.poOpts.h1_text != "") {

      unitCompleteText = new ccui.Text(this.poOpts.h1_text, getFontName(commonFonts.quicksand_medium_ttf), getNonRetinaValue(48));
      unitCompleteText.setColor(this.fontColor4);

      unitCompleteText.setPosition(cc.p(this.base.width / 2,
        this.base.height / 2 + this.base.height * 0.38 + textOffset));
      this.base.addChild(unitCompleteText);
    }

    var quote = new ccui.Text(this.poOpts.h2_text, getFontName(commonFonts.quicksand_bold_ttf), getNonRetinaValue(80));
    quote.setColor(this.fontColor4);
    quote.setPosition(cc.p(this.base.width / 2,
      this.base.height * 0.8 + textOffset));
    if (!unitCompleteText) {
      quote.y += quote.height * 0.5;
    }

    this.base.addChild(quote);
  },

  makeEarlyWay(noOfGifts) {
    for (let i = 0; i < noOfGifts; i++) {
      const emptyBox = this.mileStones[i];
      let sp = cc.Sprite.create(commonRes["pitstop-c3-filled-box-png"]);
      emptyBox.setSpriteFrame(sp.getSpriteFrame());
      sp = cc.Sprite.create(commonRes["pitstop-c3-filled-progress-png"]);
      emptyBox.nextWay.setSpriteFrame(sp.getSpriteFrame());
      emptyBox.nextWay.setScaleX(emptyBox.nextWay.getScaleX() * 0.8);
    }
  },

  makeWay(noOfGifts) {
    if (noOfGifts > -1 && noOfGifts < this.mileStones.length && this.mileStones[noOfGifts]) {
      const lastBox = this.mileStones[noOfGifts];
      const lastBoxContent = lastBox.getContentSize();

      const lastBoxFilled = new cc.Sprite(commonRes["pitstop-c3-filled-box-png"]);
      lastBox.addChild(lastBoxFilled);
      lastBoxFilled.setScale(0);

      lastBoxFilled.x += lastBoxContent.width / 2;
      lastBoxFilled.y += lastBoxContent.height / 2;

      const lastProgress = lastBox.nextWay;
      lastProgress.runAction(cc.scaleTo(0.5, lastProgress.getScaleX() * 0.85, 1));
      lastProgress.runAction(cc.moveBy(0.5, getNonRetinaValue(4), 0));
      const lastProgressContent = lastProgress.getContentSize();
      const lastProgressFilled = new cc.Sprite(commonRes["pitstop-c3-filled-progress-png"]);
      lastProgressFilled.setAnchorPoint(0, 0.5);
      lastProgressFilled.y += lastProgressContent.height / 2;
      lastProgressFilled.setScaleX(0);
      lastProgress.addChild(lastProgressFilled);

      const boxEnlargeSequence = cc.scaleTo(0.5, 1);
      lastBoxFilled.runAction(cc.sequence(
        boxEnlargeSequence.clone(),
        cc.callFunc(() => {
          lastProgressFilled.runAction(
            boxEnlargeSequence.clone()
          );

        })
      ));
    }

  },


  addEmptyGifts() {
    const noOfMileStones = this.poOpts.total_cards;
    this.mileStones = [];
    this.mileStonesProgress = [];
    const cardsGroup = new cc.Sprite();
    const yPos = this.base.height * 0.1;

    var gapping = 170;
    switch (noOfMileStones) {
      case 5:
        gapping = 140;
        break;
      case 6:
        gapping = 125;
        break;
      default:
        break;
    }

    gapping = getNonRetinaValue(gapping);

    for (let i = 0; i < noOfMileStones; i++) {
      const emptyBox = new cc.Sprite(commonRes["pitstop-c3-empty-box-png"]);
      emptyBox.setPosition(cc.p(gapping * i, yPos));
      this.mileStones.push(emptyBox);
      cardsGroup.addChild(emptyBox, 1);

      const emptyBoxProgress = new cc.Sprite(commonRes["pitstop-c3-empty-progress-png"]);
      var scale = (emptyBoxProgress.width / gapping);
      switch (noOfMileStones) {
        case 5:
          scale *= 0.8;
          break;
        case 6:
          scale *= 0.54;
          break;
        default:
          scale *= 1.2;
          break;
      }
      emptyBoxProgress.setScaleX(scale);

      emptyBoxProgress.setPosition(emptyBox.x + gapping / 2, emptyBox.y);
      emptyBox.nextWay = emptyBoxProgress;
      this.mileStonesProgress.push(emptyBoxProgress);
      cardsGroup.addChild(emptyBoxProgress, 10);
      if (i == noOfMileStones - 1) {
        const lastGift = new cc.Sprite(commonRes["pitstop-c3-gift-icon-png"]);
        lastGift.setPosition(cc.p(gapping * (i + 1) - getNonRetinaValue(5), yPos + getNonRetinaValue(5)));
        cardsGroup.addChild(lastGift, 1);
      }
    }

    cardsGroup.setPosition(-gapping * 0.5 * noOfMileStones + this.base.width / 2, this.base.height / 2 - getNonRetinaValue(300));
    this.base.addChild(cardsGroup);
  },

  addButtons: function () {
    this.poOpts.addNextButton();
    this.poOpts.addExitButton();
  },

  //when autonext happens
  addNextButtonForAnim() {

    var s = this.base.getContentSize();

    // this.poOpts.button_text = "Next activity in";
    const buttonOffset = this.poOpts.type == 1 ? 0 : this.base.height * 0.02;
    const textOffset = this.poOpts.primary_btn_type == "replay" ? this.base.width * 0.04 : this.base.width * 0.02;

    // here widget is set to loacl for some assets as they are not includes in plist
    this.nextButton = new ccui.Button(getSpriteNameForButton(commonRes[this.poOpts.nextButtonTexture]),
      getSpriteNameForButton(commonRes[this.poOpts.nextButtonTexture]), getSpriteNameForButton(commonRes[this.poOpts.nextButtonTexture]), this.poOpts.nextButtonWidgetType); //ccui.Widget.LOCAL_TEXTURE

    this.nextButton.setPosition(cc.p(s.width / 2, getNonRetinaValue(200) + buttonOffset));
    this.nextButton.setTag(1);
    this.nextButton.addTouchEventListener(this.buttonTouchEvent, this);


    var nextButtonText = new ccui.Text(this.poOpts.button_text, getFontName(commonFonts.quicksand_bold_ttf), getNonRetinaValue(48));
    nextButtonText.setColor(this.poOpts.nextButtonTextFill);
    const buttonSize = this.nextButton.getContentSize();
    nextButtonText.setPosition(cc.p(buttonSize.width / 2 - textOffset, buttonSize.height / 2 - buttonSize.height * 0.05)); // 
    if (cc.sys.isNative || isSafariBrowser()) {
      nextButtonText.y += buttonSize.height * 0.07;
    }
    var nextButtonText2 = new ccui.Text(this.options.delayTime, getFontName(commonFonts.quicksand_bold_ttf), getNonRetinaValue(48));
    nextButtonText2.setColor(this.poOpts.nextButtonTextFill);
    nextButtonText2.setPosition(cc.p(nextButtonText.x + (nextButtonText.width / 2) + getNonRetinaValue(20), nextButtonText.y)); // 

    this.nextButton.addChild(nextButtonText);
    this.nextButton.addChild(nextButtonText2);
    this.nextButtonText2 = nextButtonText2;

    this.base.addChild(this.nextButton);

    const overlayTexture = this.poOpts.nextButtonOverlayTexture;
    this.nextButtonOverlay = new cc.Sprite(commonRes[overlayTexture]);
    this.nextButtonOverlay.setPosition(this.nextButton.width / 2, this.nextButton.height / 2 + getNonRetinaValue(5));
    this.addNextButtonMask(this.nextButtonOverlay);



  },

  addNextButtonMask(target) {
    var stencil = new cc.DrawNode();
    var color = cc.color(155, 155, 155, 105);
    stencil.drawPoly([
        cc.p(0, 0),
        cc.p(this.nextButton.width, 0),
        cc.p(this.nextButton.width, this.nextButton.height),
        cc.p(0, this.nextButton.height)
      ],
      color, 1, color);
    stencil.setPosition(cc.p(0, 0));
    this.stencil = stencil;
    // this.nextButton.addChild(stencil);
    this.mask = this.createMask(stencil);
    this.mask.addChild(target);
    this.nextButton.addChild(this.mask);
    // this.nextButton.addChild(this.nextButtonOverlay);


  },

  createMask(stencil) {
    this.clipper = new cc.ClippingNode();
    this.clipper.stencil = stencil;
    // this.clipper.setAlphaThreshold(0);
    return this.clipper;
  },

  getNextButtonTexture(type, params, large) {
    if (!this.options.isSplashVerse) {
      return params;
    }
    // params.widget = ccui.Widget.LOCAL_TEXTURE;
    if (type == 1) {
      if (large) {
        params.texture = "pitstop-c3-next-button-large-blue-png";
        return params;
      }
      params.texture = "pitstop-c3-next-button-blue-png";
      return params;
    } else {
      params.fill = "#141975";
      if (large) {
        params.texture = "pitstop-c3-next-button-large-white-png";
        return params;
      }
      params.texture = "pitstop-c3-next-button-white-png";
      return params;
    }
  },

  addNextButton(type) {
    var s = this.base.getContentSize();

    const buttonOffset = this.poOpts.type == 1 ? 0 : this.base.height * 0.02;

    const textOffset = this.poOpts.primary_btn_type == "replay" ? this.base.width * 0.04 : this.base.width * 0.02;


    this.nextButton = new ccui.Button(getSpriteNameForButton(commonRes[this.poOpts.nextButtonTexture]),
      getSpriteNameForButton(commonRes[this.poOpts.nextButtonTexture]), getSpriteNameForButton(commonRes[this.poOpts.nextButtonTexture]), this.poOpts.nextButtonWidgetType); //ccui.Widget.LOCAL_TEXTURE
    this.nextButton.setPosition(cc.p(s.width / 2, getNonRetinaValue(200) + buttonOffset));
    this.nextButton.setTag(1);
    this.nextButton.addTouchEventListener(this.buttonTouchEvent, this);


    var nextButtonText = new ccui.Text(this.poOpts.button_text, getFontName(commonFonts.quicksand_bold_ttf), getNonRetinaValue(48));
    nextButtonText.setColor(this.poOpts.nextButtonTextFill);
    const buttonSize = this.nextButton.getContentSize();
    nextButtonText.setPosition(cc.p(buttonSize.width / 2 - textOffset, buttonSize.height / 2 - buttonSize.height * 0.05)); // 
    if (cc.sys.isNative || isSafariBrowser()) {
      nextButtonText.y += buttonSize.height * 0.07;
    }


    var arrowButtonText;
    if (this.poOpts.primary_btn_type == "replay") {
      arrowButtonText = new cc.Sprite(commonRes[this.poOpts.replayIconTexture]);
    } else {
      arrowButtonText = new ccui.Text(" >", getFontName(commonFonts.quicksand_bold_ttf), getNonRetinaValue(48));
      arrowButtonText.setColor(this.poOpts.nextButtonTextFill);
    }

    arrowButtonText.x = nextButtonText.x + nextButtonText.width / 2 + textOffset;
    arrowButtonText.y = nextButtonText.y + this.base.height * 0.004;

    this.nextButton.addChild(nextButtonText);
    this.nextButton.addChild(arrowButtonText);

    this.base.addChild(this.nextButton);
    this.nextButton.setScale(0);
  },


  addExitButton() {
    var s = this.base.getContentSize();
    this.exitButton = new ccui.Button(getSpriteNameForButton(commonRes[this.poOpts.exitButtonTexture]), getSpriteNameForButton(commonRes[this.poOpts.exitButtonTexture]), getSpriteNameForButton(commonRes[this.poOpts.exitButtonTexture]), this.poOpts.exitButtonWidgetType);
    var exitButtonSize = this.exitButton.getContentSize();

    this.exitButton.setPosition(cc.p(s.width - exitButtonSize.width / 1.2, s.height - exitButtonSize.height / 1.5));
    this.exitButton.setTag(2);
    this.exitButton.addTouchEventListener(this.buttonTouchEvent, this);
    this.base.addChild(this.exitButton);
    !this.options.exitButtonCallback && (this.options.exitButtonCallback = this.addCancelButtonHandler.bind(this));
  },


  addCancelButtonHandler: function () {

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
    this.options.replayButtonCallback && this.options.replayButtonCallback(this.gameManager);
  },

  onNextButtonClicked: function (autoNext = false) {
    this.nextButtonClicked = true;
    this.options.nextButtonCallback && this.options.nextButtonCallback(autoNext);
  },

  onCrossButtonClicked: function () {
    this.crossButtonClicked = true;
    this.options.exitButtonCallback && this.options.exitButtonCallback();
  },

  buttonTouchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_ENDED:
        switch (sender.getTag()) {
          case 0: //REPLAY
            this.onReplayButtonClicked();
            break;
          case 1: //NEXT
            this.onNextButtonClicked(false);
            break;
          case 2: //EXIT
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

    this.exitButton && this.exitButton.setScale(0);
    var callOnComplete = cc.callFunc(() => {
      // Making Buttons Clickable only after score is displayed
      var scaleUp = cc.scaleTo(.7, 1).easing(cc.easeBounceOut(0.5));
      // this.nextButton.runAction(scaleUp.clone());
      this.exitButton && this.exitButton.runAction(scaleUp.clone());
    }, this);

    var scale_ease_out = cc.scaleTo(0.8, baseInitialScale);
    this.base.runAction(cc.sequence(scale_ease_out.easing(cc.easeElasticOut(0.5)), callOnComplete));

  },

  hide: function () {
    this.removeFromParent(true);
  },
  makeAnim: function (plist, png) {
    cc.spriteFrameCache.addSpriteFrames(plist, png); //MAHESH
  },

  loadAnim: function (string, n, time = 0.04, toReverse) {

    var animFrames = [];
    var str = "";
    for (var i = 1; i <= n; i++) {
      let num = i;
      if (i > 9) {
        num = i;
      }
      str = string + num + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    toReverse && animFrames.reverse();
    var animation = new cc.Animation(animFrames, time, 1); //m - > repeatNoOftimes
    const anim = new cc.Animate(animation);
    return anim;

  },



  //n -> no of frames, m -> repeat no of times
  startAnim: function (params) {
    //str, n, callback, repeatTimes = 0, time, notToDeleteFrames, toReverse) {
    const animationSprite = new cc.Sprite();
    this.visible = true;
    this.makeAnim(params.plist, params.png);
    const action = cc.sequence(
      this.loadAnim(params.str, params.n, params.time, params.toReverse),
      cc.callFunc(() => {
        if ((params.repeatTimes == 0) && !params.notToDeleteFrames) {
          animationSprite.removeFromParent();
        }
        params.callback && params.callback();
      })
    );
    animationSprite.runAction(action);
    // animationSprite.setPosition(this.width/2, this.height/2);
    return animationSprite;

  }
});