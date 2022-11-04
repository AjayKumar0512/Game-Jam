var levelData = require("../../data/data.json");
var gradeData = require("../../data/grade.json");

function getLevelData(grade = "all", level = 0) {
  var _gradeLevels = gradeData[grade];
  if (!_gradeLevels) {
    _gradeLevels = gradeData["all"];
  }
  var levelNum = _gradeLevels[level];
  var curLevelData = levelData[levelNum];
  return curLevelData;
}

module.exports = getLevelData;
