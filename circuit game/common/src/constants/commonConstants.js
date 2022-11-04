var DesignSize = {
  width: 2048,
  height: 1536
};

var EventType = {
  SET_MUSIC: "Set Music",
  AUTO_EVENT: "auto_generated",
  USER_EVENT: "user_generated"

};

var PITSTOP_C3_TAG = "pitstopC3";
var Z_ORDER_PITSTOP_C3 = 10000;
// pitstop text based on stars out of 3;
function getPerformanceText(rc, lang) {
  let rewardText = {
    en: [
      ["Activity Completed"],
      ["Activity Completed"],
      ["Well Done", "Good Going"],
      ["Fabulous", "Awesome"]
    ],
    es: [
      ["Actividad Completada"],
      ["Actividad Completada"],
      ["Bien Hecho"],
      ["Fabuloso", "Increíble"]
    ]
  };


  let randIndex = Math.floor(Math.random() * rewardText[lang][rc].length);
  return rewardText[lang][rc][randIndex];
}