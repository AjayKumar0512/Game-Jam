var isGamifyDevelopment = false;

function asset_path(fileUrl) {
  if ((/(.png|.jpg|.jpeg|.plist|.atlas|.json|.fnt)$/).test(fileUrl) && !getIsRetina()) {
    fileUrl = fileUrl.replace("/retina/", "/non-retina/");
  }

  var userLang = getUserCurrentLang();
  if (userLang == "es" && (/\/voice-overs\/en\//).test(fileUrl)) {
    fileUrl = fileUrl.replace("/voice-overs/en/", "/voice-overs/es/");
  }
  //for spanish pitstop assets
  // if assets depend on language 
  // following structure can be used
  //assets->(en and es)
  if (userLang == "es" && (/\/assets\/en\//).test(fileUrl)) {
    fileUrl = fileUrl.replace("/assets/en/", "/assets/es/");
  }
  return fileUrl;
}


/**
 * return 'en' for english language
 * 'es' for spanish language
 */
function getUserCurrentLang() {
  return "en";
}

function GamifyGameDBHandler(gameManager, smGameInstance) {
  this.smGameInstance = smGameInstance || {
    currentLevelIndex: 0,
    currentSubLevel: 0,
    gameManager: gameManager,
    slug: gameName,
    //has user interacted with the current question
    isInteractionPerQuestion: () => {
      return this.interactionInNewQuestion;
    },

    // user interacted with the current question
    //activate replay button on scorescreen
    setInteractionPerQuestion: () => {
      // console.log("interaction set in asset_path_local");
      this.interactionInNewQuestion = true;//true;
      if (window.game && window.game.progressBarOfGame) {
        window.game.progressBarOfGame.enableReplayButton();
      } else if (gameManager && gameManager.progressBarOfGame) {
        gameManager.progressBarOfGame.enableReplayButton();
      }
    },

    //user is attempting new question or pressed replay button with the current question
    resetInteractionPerQuestion: () => {
      // console.log("interaction reset in asset_path_local");
      this.interactionInNewQuestion = false;//true;
      if (window.game && window.game.progressBarOfGame) {
        window.game.progressBarOfGame.disableReplayButton();
      } else if (gameManager && gameManager.progressBarOfGame) {
        gameManager.progressBarOfGame.disableReplayButton();
      }
    }
  };
  this.currentLevelData = null;
  this.allProblems = [];
  this.syncProblemsPool = [];
  isGamifyDevelopment = true;
  this.attempt_count = 0;
}

GamifyGameDBHandler.prototype.getUserLang = function () {
  return "en";
};

GamifyGameDBHandler.prototype.setGameSetting = function (key, value) {
  // console.log("setGameSetting...key=" + key + " value=" + value);
  if (typeof (sessionStorage) != "undefined") {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};

GamifyGameDBHandler.prototype.getGameSetting = function (key) {
  if (typeof (sessionStorage) != "undefined") {
    var value = sessionStorage.getItem(key);
    if (typeof (value) == "object" && value == null) {
      return undefined;
    }
    return JSON.parse(value);
  }
};

GamifyGameDBHandler.prototype.getTopBarLevelString = function () {
  return "Level";
};

GamifyGameDBHandler.prototype.getLevelData = function (grade, level, callback) {
  this.currentLevelData = getLevelData(level);
  callback && callback();
};
GamifyGameDBHandler.prototype.getLevelDataForAssetLoading = function (grade, level, callback) {
  var that = this;
  this.currentLevelData = getLevelData(level);
  return this.currentLevelData;
};

GamifyGameDBHandler.prototype.getCurrentLevelData = function () {
  return this.currentLevelData;
};
GamifyGameDBHandler.prototype.start = function () {
  var that = this;
  return that.startLevel(that.smGameInstance.currentLevelIndex);
};

GamifyGameDBHandler.prototype.startLevel = function (level, subLevel = 0) {
  this.smGameInstance.currentLevelIndex = level;
  this.smGameInstance.currentSubLevel = subLevel;
  this.smGameInstance.problemOrdering = 0;
  return Promise.resolve();
};
GamifyGameDBHandler.prototype.addNewProblem = function (quesData, isTutorial = false) {
  // console.log("new problem added", JSON.stringify(quesData), isTutorial);
  this.attempt_count = 0;
  this.smGameInstance.resetInteractionPerQuestion();
  return Promise.resolve();
};
GamifyGameDBHandler.prototype.getCurrentLevelIndex = function () {
  return this.smGameInstance.currentLevelIndex;
};
GamifyGameDBHandler.prototype.getCurrentLevelName = function () {
  return this.getCurrentLevelIndex() + 1;
};
GamifyGameDBHandler.prototype.getCurrentSubLevelIndex = function () {
  return this.smGameInstance.currentSubLevel;
};
GamifyGameDBHandler.prototype.syncProblems = function (levelCompleted = false) {
  return Promise.resolve();
};


GamifyGameDBHandler.prototype.addProblemEvent = function (eventData, type = "attempt") {
  // TODO temporary, to be removed
  // console.log("problem event", eventData, type);
  if (type == "attempt" && typeof (eventData.is_correct) != "undefined" && !eventData.is_correct) {
    this.attempt_count++;
  } else if (type == "reset") {
    this.attempt_count++;
  }

  if (type == "reset") {
    this.smGameInstance.resetInteractionPerQuestion();
  }
  else if (eventData.event_type == EventType.USER_EVENT && !this.smGameInstance.isInteractionPerQuestion()) {
    this.smGameInstance.setInteractionPerQuestion();
  }
  // console.log("attempt count value .... " + this.attempt_count);
};
GamifyGameDBHandler.prototype.subLevelComplete = function () {
  this.smGameInstance.currentSubLevel += 1;
  return Promise.resolve();
};
GamifyGameDBHandler.prototype.showPitstop = function ({
  level,
  hideNext = false,
  totalLevels,
  totalStars,
  collectedStars,
  levelInfoStr
} = {}) {
  var nextButtonCallback = () => {
    var prArr = [];
    prArr.push(this.startLevel(this.smGameInstance.currentLevelIndex));
    Promise.all(prArr).then(() => {
      // var afterPreloadState = nextState || this.smGameInstance.game.state.getCurrentState().key;
      // this.smGameInstance.game.state.start("Splash");
      // this.smGameInstance.game.onPreloadComplete.addOnce(() => {
      // this.smGameInstance.game.state.start(afterPreloadState);
      // });
      // Loader.hide();
      if (this.getCurrentLevelIndex() < this.getTotalLevels()) {
        this.smGameInstance.gameManager.startLevel();
      } else {
        window.location.href = "/gamify/";
      }
    });
  };
  var replayButtonCallback = () => {
    this.smGameInstance.currentUserGameLevel.updateSubLevel(0);
    this.smGameInstance.currentUserGameLevel.updateLevel(Math.max(this.smGameInstance.currentUserGameLevel.level - 1, 0));

    var prArr = [];
    Loader.show(this.smGameInstance.game);
    prArr.push(this.smGameInstance.startLevel(this.smGameInstance.currentUserGameLevel.level));
    prArr.push(new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    }));

    Promise.all(prArr).then(() => {
      this.smGameInstance.game.sound.removeAll();
      this.smGameInstance.game.state.restart();
      Loader.hide();
    });
    // Loader.show(this.smGameInstance.game);
  };

  var exitButtonCallback = () => {
    window.location.href = "/gamify/";
  };

  return new PitStopC3({
    game: this.smGameInstance,
    level,
    totalLevels,
    totalStars,
    collectedStars,
    nextButtonCallback,
    replayButtonCallback,
    exitButtonCallback,
    hideNext,
    levelInfoStr
  });

};

GamifyGameDBHandler.prototype.levelComplete = function ({
  gameCompleted,
  totalStars,
  collectedStars,
  totalLevels,
  returnPitstopPromise
} = {}) {
  returnPitstopPromise = returnPitstopPromise || false;
  var that = this;
  var pr = new Promise((resolve, reject) => {
    if (returnPitstopPromise) {
      resolve(() => {
        that.showPitstop({
          hideNext: gameCompleted,
          totalStars,
          collectedStars,
          level: this.getNextLevelIndex(),
          totalLevels: totalLevels || this.getTotalLevels()
        });
        that.smGameInstance.currentSubLevel = 0;
        that.smGameInstance.currentLevelIndex += 1;
      });
    } else {
      that.showPitstop({
        hideNext: gameCompleted,
        totalStars,
        collectedStars,
        level: this.getNextLevelIndex(),
        totalLevels: totalLevels || this.getTotalLevels()
      });
      that.smGameInstance.currentSubLevel = 0;
      that.smGameInstance.currentLevelIndex += 1;
      resolve();
    }
  });
  return pr;
};

GamifyGameDBHandler.prototype.getNextLevelIndex = function () {
  let nextLevel = this.getCurrentLevelIndex() + 1;
  if (nextLevel >= this.getTotalLevels()) {
    nextLevel = undefined;
  }
  return nextLevel;
};

GamifyGameDBHandler.prototype.questionComplete = function (data) {
  // console.log("question complete", data);
};

GamifyGameDBHandler.prototype.logGameEvents = function (eventType, eventData) {
  console.log("GamifyGameDBHandler" + " " + "event: " + eventType + "  " + "EventData: " + JSON.stringify(eventData));
};

GamifyGameDBHandler.prototype.storeDataForKeyInLocalStorage = function (data) {
  console.log("GamifyGameDBHandler storeDataForKeyInLocalStorage data : " + data);
};

GamifyGameDBHandler.prototype.getDataForKeysFromLocalStorage = function (keysList) {
  console.log("GamifyGameDBHandler getDataForKeysFromLocalStorage keys : " + keysList);
};

GamifyGameDBHandler.prototype.saveImageToDevice = function (imageName, imageData) {
  //TODO: will implement these function
  console.log("GamifyGameDBHandler saveImageToDevice key : data : " + imageName);
};

GamifyGameDBHandler.prototype.levelFail = function ({
  nextState,
  totalStars,
  collectedStars,
  totalLevels
} = {}) {
  this.showPitstop({
    nextState,
    hideNext: true,
    level: this.getCurrentLevelIndex() + 1,
    totalStars,
    collectedStars,
    totalLevels: totalLevels || this.getTotalLevels(),
    levelInfoStr: "Try Again"
  });

  this.smGameInstance.currentSubLevel = 0;
};

GamifyGameDBHandler.prototype.getTotalLevels = function () {
  let totalLevels = window.CompleteGameData.length;
  return totalLevels;
};

GamifyGameDBHandler.prototype.showStory = function () {
  if (this.currentGameLevelIndex == 0) {
    return true;
  }

  return false;
};