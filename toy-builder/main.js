/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debugging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

var directoryPath = "";
var gameName = "treehouse-party";
var isGamifyDevelopment = true;
var isSmallDevice = false;
if (cc.sys.isNative) {
  baseDirPath = "cocos-native-games-devlop";
  directoryPath = baseDirPath + "/" + gameName + "/";
  require(baseDirPath + "/common/src/loader/LoadJs.js");
  LoadJs(directoryPath + "project.json");
  cc.eventManager.addCustomListener("game_on_show", function () {
    showResumeScreen();
  });
}

var showResumeScreen = function () {
  var runningScene = cc.director.getRunningScene();
  if (cc.game.resloaded && runningScene) {
    var prevResumeGamePopUp = runningScene.getChildByName("ResumeGamePopUp");
    if (!prevResumeGamePopUp) {
      var homeButtonCallback = () => {
        cc.log("home button clicked");
      };
      var resumeButtonCallback = () => {
        cc.log("resume button clicked");
      };
      var resumeGamePopUp = new ResumeGamePopUp(
        homeButtonCallback,
        resumeButtonCallback
      );
      runningScene.addChild(resumeGamePopUp);
    }
  }
};

cc.game.onStart = function () {
  // function preparePreloadAssetList() {
  //     var g_resources = [];
  //     var resDirectory = "";
  //     directoryPath && (resDirectory = directoryPath);

  //     for (var ri in res) {
  //         res[ri] = asset_path(resDirectory + res[ri], gameName);
  //         g_resources.push(res[ri]);
  //     }

  //     for (var ci in commonRes) {
  //         commonRes[ci] = asset_path(resDirectory + commonRes[ci], gameName);
  //         g_resources.push(commonRes[ci]);
  //     }

  //     for (var cfi in commonFonts) {
  //         commonFonts[cfi].srcs[0] = asset_path(resDirectory + commonFonts[cfi].srcs[0], gameName);
  //         g_resources.push(commonFonts[cfi]);
  //     }

  //     for (var cli in commonLoaderRes) {
  //         commonLoaderRes[cli] = asset_path(resDirectory + commonLoaderRes[cli], gameName);
  //     }

  //     return g_resources;
  // }

  var sys = cc.sys;
  cc.view.enableRetina(sys.os === sys.OS_IOS ? true : false);
  cc.view.adjustViewPort(true);
  cc.view.setOrientation(cc.ORIENTATION_LANDSCAPE);

  window.devicePixelRatio = 2;

  var designResolutionSize = cc.size(2048, 1536);
  if (!getIsRetina()) {
    designResolutionSize = cc.size(1024, 768);
  }
  // isSmallDevice = true;
  var frameSize = cc.view.getFrameSize();
  if (frameSize.width / frameSize.height > 1.4) {
    isSmallDevice = true;
  }
  if (cc.sys.isMobile) {
    cc.view.setDesignResolutionSize(
      designResolutionSize.width,
      designResolutionSize.height,
      cc.ResolutionPolicy.FIXED_HEIGHT
    );
  } else {
    isSmallDevice = false;
    cc.view.setDesignResolutionSize(
      designResolutionSize.width,
      designResolutionSize.height,
      cc.ResolutionPolicy.SHOW_ALL
    );
  }
  cc.view.resizeWithBrowserSize(true);
  initializeCocosSettings();
  var levelCluster = Object.keys(levelClusterMap);
  initAssetLoadingWithLoader(
    gameName,
    levelCluster,
    window.resourceCluster,
    window.levelClusterMap,
    function () {
      cc.game.resloaded = true;
      var path = directoryPath;
      cc.loader.loadJson(path + "data/data.json", function (error, data) {
        if (error) {
          cc.log("there is error loading json file");
        } else {
          window.CompleteGameData = data;
          window.gameManager = new GameManager(null);
        }
      });
    },
    this
  );
};

cc.game.run();

function getLevelData(level = 0) {
  let levelData = window.CompleteGameData;
  var curLevelData = levelData[level];
  return curLevelData;
}

cc.game.onPause = function () {
  cc.log("main.js onPause");
};

cc.game.onResume = function () {
  cc.log("main.js onResume");
  // showResumeScreen();
};
