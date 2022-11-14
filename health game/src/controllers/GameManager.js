class GameManager {
  constructor(initObject) {
    this.smCocosGameInstance = null;
    this.gameDBHandler = null;
    if (initObject && initObject.cocosGameInstance) {
      this.smCocosGameInstance = initObject.cocosGameInstance;
      this.gameDBHandler =
        this.smCocosGameInstance.smGameInstance.gameDBHandler;
    } else {
      this.gameDBHandler = new GamifyGameDBHandler(this);
    }
    this.currentLevel = 0;
    this.currentSubLevel = 0;
    if (initObject && initObject.cocosGameInstance) {
      this.isSmallDevice = initObject.cocosGameInstance.getIsSmallDevice();
    } else {
      if (typeof isSmallDevice != "undefined")
        this.isSmallDevice = isSmallDevice;
      else this.isSmallDevice = false;
    }
    this.isSoundOn = true;
    this.soundManager = new SoundManagerNew();
    this.isRetinaDevice = getIsRetina();
    this.gameScene = null;
    this.currentPage = null;
    this.levelStars = 0;
    this.allLevelStars = 0;
    this.maxLevelStars = 0;
    window.gameManager = this;
    this.resetDesignResolution();
    this.createLevelManagerObject();
    this.start();
    this.sendAnalyticsEvent(StringConstants.MIX_PANEL_EVENT.OPENED_ACTIVITY, {
      "Activity Name": StringConstants.ACTIVITY_NAME,
    });

  }
  resetDesignResolution() {
    if (this.getIsSmallDevice()) {
      if (
        typeof isBuildForPlayTesting != "undefined" &&
        isBuildForPlayTesting
      ) {
        cc.view.setDesignResolutionSize(
          2436,
          1125,
          cc.ResolutionPolicy.SHOW_ALL
        );
      } else {
        cc.view.setDesignResolutionSize(
          2436,
          1125,
          cc.ResolutionPolicy.FIXED_HEIGHT
        );
      }
    }
  }

  onEnter() {
  }

  getIsSmallDevice() {
    return this.isSmallDevice;
  }

  getSoundManager() {
    return this.soundManager;
  }

  start() {
    this.createCurrentGamePlayLayer();
  }

  createCurrentGamePlayLayer() {
    if (this.gameScene === null) this.createGamePlayScene();
    this.changeToModeSelectionPage();
  }

  createGamePlayScene() {
    if (this.gameScene === null) {
      this.gameScene = new GamePlayScene(this);
      cc.director.runScene(this.gameScene);
    }
  }
  changeCurrentpage(page) {
    switch (page) {
      case GameConstants.PAGES.MODESELECTIONPAGE:
        if (this.gameScene.topBar != null)
          this.gameScene.topBar.hideBackButton();
        break;
      case GameConstants.PAGES.GAMEPLAYPAGE:
        if (this.gameScene.topBar != null)
          this.gameScene.topBar.showBackButton();
        break;
    }
    this.currentPage = page;
  }
  changeToModeSelectionPage() {
    this.stopPreviousVo();
    //to reset the tool bar selected option to default tool
    if (this.currentPage == GameConstants.PAGES.GAMEPLAYPAGE)
      this.gamePlayLayerPage.removeFromParent();
    this.gamePlayLayerPage = null;
    this.changeCurrentpage(GameConstants.PAGES.MODESELECTIONPAGE);
    this.modeSelectionPage = new ModeSelectionPage(this);
    this.modeSelectionPage.setPosition(
      cc.p(
        this.gameScene.m_visibleSize.width / 2,
        this.gameScene.m_visibleSize.height / 2
      )
    );
    this.gameScene.addChild(this.modeSelectionPage, 1);
  }
  updateQuestionComplete(isCorrect, isComplete, count, levelStars) {
    let quesComplete = {
      is_correct: isCorrect,
      is_complete: isComplete,
      reward_count: levelStars,
      user_answer: count,//how many oolzo tapped before tapping obstacle
    };

    this.levelStars += levelStars;
    this.maxLevelStars += STARS_PER_SUBLEVEL;
    this.updateDBOnQuestionComplete(quesComplete);
  }
  startLevelNumber(level) {
    this.currentLevel = level;
    var that = this;
    this.levelStars = 0;
    this.maxLevelStars = 0;
    this.gameDBHandler.startLevel(level + 1);
    this.gameDBHandler.getLevelData("", this.currentLevel, function () {
      const currentRunningScene = cc.director.getRunningScene();
      if (currentRunningScene.getChildByName(PITSTOP_C3_TAG))
        currentRunningScene.getChildByName(PITSTOP_C3_TAG).removeFromParent();
      that.showNextQuestion();
    });
  }
  getCurrentLevelIndex() {
    return this.currentLevel;
  }
  updateLevelComplete() {
    let collectedStars = Math.round((this.levelStars / this.maxLevelStars) * STARS_PER_SUBLEVEL);
    if (this.allLevelStars == 0)
      this.allLevelStars = collectedStars;
    else
      this.allLevelStars = Math.round((this.allLevelStars + collectedStars) / 2);
    let cardCompleted = false;
    let playableRewardCount = 0;
    if (window.GAMES_IN_APP && window.BUILD) {
      UserGameLevelAttempt.current.updateLevelComplete(
        collectedStars,
        cardCompleted,
        playableRewardCount,
        () => { }
      );
    }
  }

  createLevelManagerObject() {
    this.levelObject = new LevelManager(
      this,
      this.currentLevel,
      this.currentSubLevel
    );
  }

  getIsRetinaDevice() {
    return this.isRetinaDevice;
  }

  showNextQuestion() {
    this.getCurrentLevelData();
  }
  getCurrentLevelData() {
    if (this.levelObject) {
      this.currentLevelData = this.levelObject.getCurrentLevelData();
      this.changeToGamePlaylayerPage(this.currentLevelData);
    }
  }
  //based on selected mode it leads to that particular page with respective assets
  changeToGamePlaylayerPage(data) {
    this.stopPreviousVo();
    // this.startLevelNumber(index);
    if (this.currentPage == GameConstants.PAGES.MODESELECTIONPAGE) {
      this.modeSelectionPage.removeModeSelectionPage();
      this.modeSelectionPage = null;
      this.changeCurrentpage(GameConstants.PAGES.GAMEPLAYPAGE);
      this.gamePlayLayerPage = new GamePlayLayer(
        data,
        this
      );
      this.m_visibleSize = this.gameScene.m_visibleSize;
      this.gamePlayLayerPage.setPosition(
        this.gameScene.width / 2,
        this.gameScene.height / 2
      );
      if (this.getIsSmallDevice()) {
        this.gamePlayLayerPage.y -= 50;
      }
      this.gameScene.addChild(this.gamePlayLayerPage);
    } else if (this.currentPage == GameConstants.PAGES.GAMEPLAYPAGE) {
      this.changeCurrentpage(GameConstants.PAGES.GAMEPLAYPAGE);
      this.gamePlayLayerPage.resetGamePlaylayer();
      this.gamePlayLayerPage.startSubLevel(data);
    }
  }
  updatePlayableComplete() {
    let playableRewardCount = 0;
    if (this.allLevelStars > 0) {
      playableRewardCount = this.allLevelStars;
      if (window.GAMES_IN_APP && window.BUILD) {
        UserPlayableAttempt.current.updateLevelComplete(
          playableRewardCount,
          () => { }
        );
      }
    }
  }
  closedActivity() {
    //for analytics of closing game
    this.sendAnalyticsEvent(StringConstants.MIX_PANEL_EVENT.CLOSED_ACTIVITY, {
      "Activity Name": StringConstants.ACTIVITY_NAME,
    });
  }
  moveBack() {
    switch (this.currentPage) {
      case GameConstants.PAGES.GAMEPLAYPAGE:
        this.soundManager.stopAllSFX();
        this.changeToModeSelectionPage();
        break;
    }
  }

  getVoAndPlay(name) {
    this.stopPreviousVo();
    this.current_vo_name = this.soundManager.playEffect(name, false);
  }

  playConcatenatedSoundArray(soundArray, cb, loop) {
    this.stopPreviousVo();
    this.current_vo_name = this.soundManager.playSoundArray(
      soundArray,
      cb,
      loop
    );
  }

  getMusicAndPlay(name) {
    if (!this.isSoundOn) return;
    if (!this.soundManager.isMusicPlaying()) {
      this.soundManager.playMusic(name, true);
    }
  }

  getSfxAndPlay(name) {
    if (!this.isSoundOn) return;
    this.soundManager.playEffect(name, false);
  }
  stopAllEffects() {
    this.soundManager.stopAllEffects();
  }

  stopPreviousVo() {
    if (this.current_vo_name) {
      this.soundManager.stopSound(this.current_vo_name, true);
      // this.soundManager.stopAllVO();
    }
  }
  /**
   * DB update functions, to track the student progress we are storing few data
   * in our database, related calls are as follows
   */

  /**
   * A problem is a Comparison problem shown to the student
   * It contains two sets of Containers having diff count of balloons, color etc
   *
   * @param {DataObject} problemObject data object for the current problem
   */
  updateDBOnNewProblem(problemObject) {
    var isTutorial = !this.isTutorialCompleted[this.currentLevel];
    this.gameDBHandler.addNewProblem(problemObject, isTutorial);
  }

  updateDBOnQuestionComplete(questionCompleteObject) {
    this.gameDBHandler.questionComplete(questionCompleteObject);
  }

  /**
   * Whenever user attempt a problem DB is updated for the same
   */
  updateAttemptInDB(attemptObject) {
    this.gameDBHandler.addProblemEvent(attemptObject, "attempt");
  }

  /**
   * When user give one wrong attempt we change the problem
   * parameters on which we can change the problem
   * Arrangement, BubbleColor, position
   * @param {Object} newProblemObject
   */
  updateDBOnProblemModified(newProblemObject) {
    this.gameDBHandler.addProblemEvent(newProblemObject, "problem_modified");
  }

  sendAnalyticsEvent(eventType, eventData) {
    if (eventType) {
      this.gameDBHandler.logGameEvents(eventType, eventData);
    }
  }
}
