var LOG = function (log) {
  // console.log(log);
};
/** to change texture of image using spriteframe
*/
var changeTextureImage = function (node,resPath)
{
      var sprite = new cc.Sprite(resPath);
      node.setSpriteFrame(sprite.getSpriteFrame());
};
//changes the strike of stroke according to the device pixel ratio
var getStrokeSize = function (size) {
  return cc.view.getDevicePixelRatio() * size;
};

var getFontName = function (resource) {
  var fontName = resource.name;
  if (cc.sys.isNative) {
    fontName = resource.srcs[0];
  }
  return fontName;
};

var getFontSize = function (fontSize) {
  let scaleFactor = cc.director.getContentScaleFactor() - 1;
  if (scaleFactor >= 0 && !getIsRetina()) {
    fontSize = fontSize * 0.5;
  }
  return fontSize;
}

var getNonRetinaValue = function (value) {
  let scaleFactor = cc.director.getContentScaleFactor() - 1;
  if (scaleFactor >= 0 && !getIsRetina()) {
    value = value * 0.5;
  }
  return value;
}

var getIsRetina = function () {
  if (typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) {
    return false;
  } else if (window.GAMES_IN_APP && window.BUILD && typeof (SMCocosGame) != 'undefined') {
    const scale = (SMCocosGame.dpr >= 2) ? 2 : 1;
    return (scale >= 2);
  } else if (window.GAMES_IN_APP && window.BUILD && typeof (ELAReadingGame) != 'undefined') {
    const scale = (ELAReadingGame.dpr >= 2) ? 2 : 1;
    return (scale >= 2);
  } else {
    const scale = window.devicePixelRatio >= 2 ? 2 : 1;
    return (scale >= 2);
  }
}

/** to check whether device is aarch64 or not
*/
var isAarch64Device = function () {
  if (typeof (window.navigator) != 'undefined' && typeof (window.navigator.userAgent) != 'undefined' &&
    window.navigator.userAgent.indexOf('aarch64') >= 0) {
    return true;
  }
  return false;
}

/**
 * To check safari browser only
 * There are scenarios which are required to be handled on safari browser only
 * ex: Play Button feature is there for safari browser only
 */
var checkSafariBrowserOnly = function() {
  if (typeof (window.navigator) != 'undefined' && typeof (window.navigator.vendor) != 'undefined') {
    var vendorName = window.navigator.vendor.toLowerCase();
    if (vendorName.indexOf("apple") >= 0) {
      return true;
    }
  }
  return false;
}

/**
 * Behaviour of safari, edge and internet explorer is same
 * while behaviour of mozilla and chrome is same for text positions
 * function returns true if browser is safari, edge or explorer
 */
var isSafariBrowser = function () {
  let result = false;
  if ((typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) ||
    (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment)) {
    if (typeof (window.navigator) != 'undefined') {
      if (typeof (window.navigator.vendor) != 'undefined') {
        let vendorName = window.navigator.vendor;
        let vendorNameStr = vendorName.toLowerCase();
        if (vendorNameStr.indexOf("apple") != -1) {
          result = true;
        }
      }

      if (!result) {
        if (typeof (window.navigator.userAgent) != 'undefined') {
          let userAgent = window.navigator.userAgent;
          let userAgentStr = userAgent.toLowerCase();
          if (userAgentStr.indexOf("trident/") != -1 || userAgentStr.indexOf("edge/") != -1) {
            result = true;
          }
        }
      }
    }
  } else if (typeof (window.GAMES_IN_APP) != 'undefined' && window.GAMES_IN_APP && window.BUILD) {
    if (window.game && window.game.platform && window.game.platform == 'android') {
      if ((typeof (window.navigator) != 'undefined') && (typeof (window.navigator.userAgent) != 'undefined')) {
        let userAgent = window.navigator.userAgent;
        let userAgentStr = userAgent.toLowerCase();
        if (userAgentStr.indexOf("moto") != -1) {
          result = true;
        }
      }
    } else {
      result = true;
    }
  }
  return result;
}

var isIE11 = function()
{
  var result = false;
    if (typeof window.GAMES_ON_WEB != 'undefined' && window.GAMES_ON_WEB && typeof window.navigator != 'undefined' && typeof window.navigator.userAgent != 'undefined') {
      var userAgentStr = window.navigator.userAgent.toLowerCase();
      if (userAgentStr.indexOf("trident/") != -1) {
        result = true;
      }
    }
    return result;
}
var checkForSafariBrowser = function () {
  return isSafariBrowser();
  // if (typeof (window.navigator) != 'undefined' && typeof (window.navigator.vendor) != 'undefined') {
  //   let vendorName = window.navigator.vendor;
  //   let vendorNameStr = vendorName.toLowerCase();
  //   if (vendorNameStr.indexOf("apple") != -1) {
  //     return true;
  //   }
  // }
  // return false;
};


var isSafariOrNative = function () {
  return isSafariBrowser() || cc.sys.isNative;
}

var getSpriteFrameAnimation = function (name, from, to, delay) {
  var animFrames = [];
  var str = "";
  for (var i = from; i <= to; i++) {
    str = name + (i < 10 ? ("0" + i) : i) + ".png";
    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
    var animFrame = new cc.AnimationFrame();
    animFrame.initWithSpriteFrame(spriteFrame, 1, null);
    animFrames.push(animFrame);
  }
  var animation = new cc.Animation(animFrames, delay);
  return new cc.Animate(animation);
};

var distanceBetweenPointAndPoint = function (point1, point2) {
  var dx = point1.x - point2.x;
  var dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

var getVerticesForCircle = function (center, size, segments) {
  var angle = 0;
  var coef = 2.0 * Math.PI / segments;
  var vertices = [];
  for (var i = 0; i <= segments; i++) {
    var rads = i * coef;
    var j = size.width * Math.cos(rads + angle) + center.x;
    var k = size.height * Math.sin(rads + angle) + center.y;
    vertices.push(cc.p(j, k));
  }
  return vertices;
};

var getVerticesForDottedRect = function (rect, length) {
  let A = cc.p(rect.x, rect.y);
  let B = cc.p(rect.x + rect.width, rect.y);
  let C = cc.p(rect.x + rect.width, rect.y + rect.height);
  let D = cc.p(rect.x, rect.y + rect.height);
  var vertices = [];
  calculatePointOnLine(A, B, vertices, length);
  calculatePointOnLine(B, C, vertices, length);
  calculatePointOnLine(C, D, vertices, length);
  calculatePointOnLine(D, A, vertices, length);
  return vertices;
};

var drawDottedCircle = function (drawNode, center, size, segments, lineWidth, color) {
  var vertices = getVerticesForCircle(center, size, segments);
  drawDotted(drawNode, vertices, lineWidth, color);
};

//give length around 40 in the function
var drawDottedLine = function (drawNode, point1, point2, length, color = cc.p(255, 255, 255, 255)) {
  var vertices = [];
  calculatePointOnLine(point1, point2, vertices, length);
  drawDotted(drawNode, vertices, 3, color);
};

var drawDottedRect = function (drawNode, rect, size, color) {
  var vertices = getVerticesForDottedRect(rect, size.width);
  drawDotted(drawNode, vertices, size.height, color);
};

var drawDotted = function (drawNode, vertices, lineWidth, color) {
  let draw = true;
  var p1 = vertices[0];
  var p2 = vertices[1];
  for (var i = 0; i < vertices.length; i++) {
    p1 = vertices[i];
    if (i === vertices.length - 1)
      p2 = vertices[0];
    else
      p2 = vertices[i + 1];
    if (draw)
      drawNode.drawSegment(p1, p2, lineWidth, color);
    draw = !draw;
  }
};

var calculatePointOnLine = function (A, B, vertices, length) {
  var dt = 0;
  var x = 0;
  var y = 0;
  var pstart = A;
  var pend = B;
  var d = distanceBetweenPointAndPoint(pstart, pend);
  while (dt < d) {
    dt += length;
    if (dt < d) {
      x = pstart.x - dt * (pstart.x - pend.x) / d;
      y = pstart.y - dt * (pstart.y - pend.y) / d;
    } else {
      x = pend.x;
      y = pend.y;
    }
    vertices.push(cc.p(x, y));
  }
};

function getIsDeviceWithNotchInAndroid() {
  return window.deviceAspectRatio == 2.17;
}

function getSpriteNameForButton(textureName) {
  if (textureName[0] === "#") {
    textureName = textureName.substr(1, textureName.length - 1);
  }
  return textureName;
}

/**
 * Due to safari auto-play feature disabled, sounds doesn't play automatically, sounds are played on first interaction
 * few games already have interacting element before moving to the gameplay
 * those games in which there is no interaction before gameplay we will show a play button to get user first interaction
 * 
 * This function will check whether play button is required or not for the current game
 */
function isPlayButtonRequired() {
  if (!checkSafariBrowserOnly())
    return false;
  else
    return true;

  /*
    //code commented as in ELA games with elements
    // bg music doesnot start before clicking on baba, hence implementing play button on those games too
    https://studypad.atlassian.net/browse/CQ-3118

  if (typeof (SMCocosGame) != 'undefined') {
    var GAMES_WITH_ELEMENT = [
      'bubble-trouble',
      'bucbucs-burrow',
      'case-carnival',
      'i-spy',
      'magic-e-bubble',
      'mine-cart',
      'sound-pops',
      'string-and-bubble',
      'think-and-link'
    ];

    let result = true;
    let gameName = SMCocosGame.getGameName();
    if (gameName.length != 0 && GAMES_WITH_ELEMENT.indexOf(gameName) != -1) {
      result = false;
    }
    return result;
  }*/
}

function initAssetLoadingWithLoader(gameName, levelCluster, resourceCluster, levelClusterMap, callback) {

  LoaderScreen.preload(preparePreloadAssetList(gameName, levelCluster), function () {
    if (levelCluster && resourceCluster && levelClusterMap) {
      var plistMap = getPlistPngMap(levelCluster, resourceCluster, levelClusterMap);
      if (plistMap) {
        for (var plistKey in plistMap) {
          var pngKey = plistMap[plistKey];
          if (res[plistKey]) {
            cc.spriteFrameCache.addSpriteFrames(res[plistKey], res[pngKey]);
          } else if (commonRes[plistKey]) {
            cc.spriteFrameCache.addSpriteFrames(commonRes[plistKey], commonRes[pngKey]);
          }
        }
      }
    }
    cc.game.resloaded = true;
    callback && callback();
  });
}

function preparePreloadAssetList(gameName, levelCluster) {
  var g_resources = [];
  var resDirectory = "";
  var resourceList = {};
  var directoryPath = window.directoryPath || "";
  let common_root_path = "res/../../..";
  if (cc.sys.isNative) {
    directoryPath = baseDirPath + "/" + gameName + "/";
    resDirectory = directoryPath;
  }
  if (window.GAMES_IN_APP && window.BUILD) {
    resDirectory = directoryPath + "dist/cocos-game-app-dist/" + gameName + "/";

  } else if (typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) {
    common_root_path = "dist"
  } else if (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment) {
    common_root_path = "res/../../../../dist";
  }


  if (typeof (getResourceListFromLevelData) != 'undefined') {
    //loading level wise assets dynamically
    if (levelCluster.length > 0 && typeof (SMCocosGame) != 'undefined') {
      levelCluster.forEach(function (level, index) {
        //SMCocosGame.smGameInstance.gameDBHandler.getLevelData("",level-1);
        //let levelData = SMCocosGame.smGameInstance.gameDBHandler.getCurrentLevelData();
        let levelData = SMCocosGame.smGameInstance.gameDBHandler.getLevelDataForAssetLoading(level - 1);
        let obj = getResourceListFromLevelData(levelData, common_root_path);
        resourceList = {
          ...resourceList,
          ...obj
        };
      });
    } else {

      let levelData = getLevelData(window.levelForAssetLoading);
      let obj = getResourceListFromLevelData(levelData, common_root_path);
      resourceList = {
        ...resourceList,
        ...obj
      };
    }
  }
  ////////
  var resList = getLevelResources(levelCluster, window.resourceCluster, window.levelClusterMap);
  
  let isSplashverseThemeForPitstop = false;
  if (typeof (SMCocosGame) != 'undefined') {

    let userLang = SMCocosGame.smGameInstance.gameDBHandler.getUserLang();
    isSplashverseThemeForPitstop = SMCocosGame.isSplashVerse;

    for (var resKey in resList) {
      var resPath = resList[resKey];

      // check for small-device assets
      if (SMCocosGame.getIsSmallDevice()) {
        if ((/retina\/ipad\//).test(resPath)) {
          delete (resList[resKey]);
        }
      } else {
        if ((/retina\/small-device\//).test(resPath)) {
          delete (resList[resKey]);
        }
      }

      if (userLang == 'es' && (/\/voice-overs\/en\//).test(resPath)) {
        resList[resKey] = resPath.replace('/voice-overs/en/', '/voice-overs/es/');
      }

      
    }
  }
  //to load assets for particular game theme and also to load condition specific assets
  if (typeof (loadAssetsForTheme) != 'undefined') {
    loadAssetsForTheme(resList);
  }

  //added commonFolderAssets from game in commonRes
  if (typeof (window.resourceCluster.commonFolderAssets) != 'undefined') {
    for (var assets in window.resourceCluster.commonFolderAssets) {
      commonRes[assets] = window.resourceCluster.commonFolderAssets[assets];
    }
  }

  for (var ri in res) {
    if ((/(.png|.jpg|.jpeg)$/).test(res[ri]) && typeof (resList[ri]) == 'undefined') {
      var pathParts = res[ri].split('/');
      if (pathParts[pathParts.length - 1][0] != "#")
        res[ri] = '#' + pathParts[pathParts.length - 1];
    }
  }
  for (ri in resourceList) {
    res[ri] = asset_path(resDirectory + resourceList[ri], gameName);
    g_resources.push(res[ri]);
  }
  for (var ri in resList) {
    if (typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) {
      //Mahesh : Done change for common central game screen 
      var pathParts = resList[ri].split('/');
      if ((pathParts[0] == "..") && (pathParts[2] == "res")) {
        let search_str = "res/";
        let index = resList[ri].indexOf(search_str);
        let path = resList[ri].substr(index);
        res[ri] = asset_path(resDirectory + path, pathParts[1]);
      } else {
        res[ri] = asset_path(resDirectory + resList[ri], gameName);
      }
    } else {
      res[ri] = asset_path(resDirectory + resList[ri], gameName);
    }
    g_resources.push(res[ri]);
  }

  for (var ci in commonRes) {

    commonRes[ci] = asset_path(resDirectory + commonRes[ci], gameName);

    //deleting splashverse assets url if not required
    if (!isSplashverseThemeForPitstop && (/\/splash-verse\//).test(commonRes[ci])) {
      delete (commonRes[ci]);
      continue;
    }

    g_resources.push(commonRes[ci]);

  }
  let search_str = "retina/";
  for (var ri in commonResSpriteFrames) {
    let res = commonResSpriteFrames[ri];
    if (res[0] == "#") {
      continue;
    }
    if ((/(.png|.jpg|.jpeg)$/).test(res) && typeof (resList[ri]) == 'undefined') {
      let index = res.indexOf(search_str);
      let path = res.substr(index + search_str.length);
      if (path[0] != "#") {
        commonResSpriteFrames[ri] = '#' + path;
      }

    }
  }

  for (ri in commonResSpriteFrames) {
    commonRes[ri] = commonResSpriteFrames[ri];
  }

  let fontPathPrefix = "../common/res/fonts/";
  if (window.GAMES_IN_APP && window.BUILD) {
    fontPathPrefix = "../../fonts/";
  }

  //added gameFonts in commonFonts
  if (typeof (window.resourceCluster.fonts) != 'undefined') {
    for (var gFont in window.resourceCluster.fonts) {
      commonFonts[gFont] = window.resourceCluster.fonts[gFont];
    }
  }

  //added gameFonts in commonFonts which are bundled in game itself
  if (typeof (window.resourceCluster.gameFonts) != 'undefined') {
    window.res.gameFonts = window.resourceCluster.gameFonts;
    for (var gFont in window.resourceCluster.gameFonts) {
      let gameFont = window.resourceCluster.gameFonts[gFont];
      var fontsSrcLength = gameFont.srcs.length;
      for (var i = 0; i < fontsSrcLength; i++) {
        gameFont.srcs[i] = asset_path(resDirectory + gameFont.srcs[i], gameName);
      }
      g_resources.push(gameFont);
    }
  }

  for (var cfi in commonFonts) {
    var fontsSrcLength = commonFonts[cfi].srcs.length;
    for (var i = 0; i < fontsSrcLength; i++) {
      let fontPath = commonFonts[cfi].srcs[i];
      fontPath = fontPathPrefix + fontPath;
      commonFonts[cfi].srcs[i] = asset_path(resDirectory + fontPath, gameName);
    }
    g_resources.push(commonFonts[cfi]);
  }

  for (var cli in commonLoaderRes) {
    commonLoaderRes[cli] = asset_path(resDirectory + commonLoaderRes[cli], gameName);
  }

 

  return g_resources;

};

var clearInner = function (node) {
  LOG("clearInner");
  while (node.getChildren().length > 0) {
    clear(node.getChildren()[0]);
  }
};

var clear = function (node) {
  LOG("clear");
  while (node.getChildren().length > 0) {
    clear(node.getChildren()[0]);
  }
  node.getParent().removeChild(node);
};


var doesSupportsTouch = function () {
  // taken from https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
  if ('createTouch' in document ||
    window.onmsgesturechange ||
    navigator.maxTouchPoints ||
    ('ontouchstart' in window) ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }
  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return window.matchMedia(query).matches;
};

var detectMob = function () {
  return ((window.innerWidth <= 800) && (window.innerHeight <= 600));
};
