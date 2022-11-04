/**
 * For Circular arrangements
 * Sometimes we have to show same radius for both circles
 * Sometimes large circle should look big and small should look small
 * Sometimes large circle should look small and small should look big
 */
var Z_ORDER_SCORE_SCREEN = 7;
var Z_ORDER_PITSTOP = 2;
var Z_ORDER_HAND_GESTURE = 3;
var STARS_PER_SUBLEVEL = 3;

const ModeNames = ["Build", "Garrage"];

const GameConstants = {
  PAGES: {
    MODESELECTIONPAGE: "mode-selection-page",
    GAMEPLAYPAGE: "game-play-page",
  },
  MODESELECTIONPAGE: {
    MODE: 2,
    BACKGROUND: 1,
  },
  BUILDCATEGORY:
  {
    BODY: 0,
    COLOR: 1,
    STICKER: 8,
    ENGINE: 2,
    SILENCER: 3,
    TYRE: 4,
    GUN: 5,
    DRILL: 6,
    HAT: 7,
  },
  GARRAGECATEGORY:
  {

    ENGINE: 0,
    SILENCER: 1,
    TYRE: 2,
    GUN: 3,
    HAT: 4,
    STICKER: 5,
  },
  WHITEDOTWIDTH:
  {
    RETINA: 8,
    NONRETINA: 4,
  },
  TUTORIAL: {
    BUILD: "isTutorialCompletedForBuild",
    GARRAGE: "isTutorialCompletedForGarrage",
  },
  LEVELNAME: {
    NONE: "none",
    BUILD: "Build",
    GARRAGE: "Garrage",
  },
  INACTIVITY: {
    BUILD: 10,
  },
  Direction: {
    NONE: 1,
    LEFT: 2,
    RIGHT: 3
  },

};
