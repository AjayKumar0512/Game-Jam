class TutorialHandler {
  /**
   * 
   * @param {*} db_handler 
   * @param {*} jsonData {
   * feature_key : {
   *  action : "showFeature",
   *  data :{SOME_DATA}
   * }
   * }
   * @param {*} delegate 
   */
  constructor(db_handler, jsonData, delegate) {
    if (!db_handler) {
      console.log("Error: TutorialHandler's dbhandler cannot be null");
      this._currentData = {};
      return;
    }
    this._dbHandler = db_handler;
    this._gameTutorialData = jsonData;
    this._delegate = delegate;
    let data = this._dbHandler.getGameSetting("tutorial_data");
    if (!data) {
      this._currentData = {};
      return;
    }
    this._currentData = data;
  }

  playTutorial(key) {
    if (typeof key == "undefined") {
      return false;
    }
    let hasComplete = this.hasComplete(key);
    if (hasComplete) {
      return false;
    }
    if (!this._delegate || !this._gameTutorialData) {
      //need to show tutorial
      return true;
    }
    let tutData = this._gameTutorialData[key];
    if (tutData && tutData.action) {
      this._delegate[tutData.action](key, tutData.data, () => {
        this.complete(key);
      });
    }
    return true;
  }
  complete(key) {
    if (typeof key == "undefined") {
      return;
    }
    this._currentData[key] = true;
    let data = this._currentData;
    //let data = JSON.stringify(this._currentData);
    this._dbHandler.setGameSetting("tutorial_data", data);
  }
  hasComplete(key) {
    return this._currentData[key];
  }
  reset() {
    this._currentData = {};
    this._dbHandler.setGameSetting("tutorial_data", {});
  }
}