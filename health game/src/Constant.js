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

const ModeNames = ["Exploration", "Compete"];

const GameConstants = {
  PAGES: {
    MODESELECTIONPAGE: "mode-selection-page",
    GAMEPLAYPAGE: "game-play-page",
  },
  MODESELECTIONPAGE: {
    MODE: 2,
    BACKGROUND: 1,
  },
  FEELINGS: {
    ANGRY: 0,
    SAD: 1,
    CRYING: 2,
    HAPPY: 3,
  },
  LEVELNAME: {
    NONE: "none",
    EXPLORATION: "Exploration",
    COMPETE: "Compete",
  },

};
