/** as of now there is no game define, hence levelManager will handle all the Level Management things 
 * all the game API's are commented for now, and local calls are made
 * will change this, once game is implemented
*/

class LevelManager {
  constructor(gameManager, level = 0, subLevel = 0) {
    this.gameManager = gameManager;
    this.gameDBHandler = gameManager.gameDBHandler;
    this.currentLevelIndex = level;
    this.currentSubLevelIndex = subLevel;
  }

  goToNextSubLevel(starsCollected) {
    this.gameDBHandler.subLevelComplete();
    this.currentSubLevelIndex = this.gameDBHandler.getCurrentSubLevelIndex();

    let totalSubLevels = this.currentLevelData.subLevels.length;
    if (this.currentSubLevelIndex >= totalSubLevels) {
      this.goToNextLevel(starsCollected);
    }
  }

  goToNextLevel(starsCollected, allStars) {
    const levelCompleteOptions = {
      gameCompleted: this.isGameComplete(),
      totalLevels: this.getTotalLevels(),
      totalStars: allStars,
      collectedStars: starsCollected
    };

    this.gameDBHandler.levelComplete(levelCompleteOptions);
    this.currentLevelIndex = this.gameDBHandler.getCurrentLevelIndex();
    this.currentSubLevelIndex = this.gameDBHandler.getCurrentSubLevelIndex();
    this.currentLevelData = this.getCurrentLevelData();
  }

  isLevelComplete() {
    let subLevelsCount = this.currentLevelData.subLevels.length;
    return this.currentSubLevelIndex >= subLevelsCount;
  }

  getTotalSubLevels() {
    return this.currentLevelData.subLevels.length;
  }

  isGameComplete() {
    return this.isLevelComplete() && this.currentLevelIndex === this.getTotalLevels() - 1;
  }

  getCurrentLevel() {
    this.currentLevelIndex = this.gameDBHandler.getCurrentLevelIndex();
    return this.currentLevelIndex;
  }

  getCurrentLevelData() {
    this.currentLevelData = this.gameDBHandler.getCurrentLevelData();
    return this.currentLevelData;
  }

  getCurrentSubLevelIndex() {
    this.currentSubLevelIndex = this.gameDBHandler.getCurrentSubLevelIndex();
    return this.currentSubLevelIndex;
  }

  getTotalLevels() {
    return this.gameDBHandler.getTotalLevels();
  }

  levelComplete(gameCompleted, totalStars, collectedStars, totalLevels) {
    this.gameDBHandler.levelComplete(gameCompleted, totalStars, collectedStars, totalLevels);
  }

  questionComplete(quesData) {
    this.gameDBHandler.questionComplete(quesData);
  }

  subLevelComplete() {
    this.gameDBHandler.subLevelComplete();
  }
}