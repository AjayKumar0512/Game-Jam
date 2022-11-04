(function (window) {

  /**
   * Function to return hash tag for a image file from the yml file
   */
  var asset_path = function (path, game_name, bypass_asset_host, bypass_asset_digest, bypass_adding_assets, useLocalDevelopmentAssetHost) {
    var asset_prefix = "assets";

    //Prerna : or level wise asset loading of voice overs and assets
    if (typeof SMCocosGame != "undefined") {
      if ((/(.png|.jpg|.jpeg|.plist|.atlas|.json|.fnt)$/).test(path) && !SMCocosGame.getIsRetina()) {
        path = path.replace('/retina/', '/non-retina/');
      }
      if (typeof SMCocosGame.smGameInstance.gameDBHandler != "undefined" &&
        typeof SMCocosGame.smGameInstance.gameDBHandler.getUserLang != "undefined") {
        var userLang = SMCocosGame.smGameInstance.gameDBHandler.getUserLang();
        if (userLang == "es" && (/\/voice-overs\/en\//).test(path)) {
          path = path.replace("/voice-overs/en/", "/voice-overs/es/");
        }
        if (userLang == 'es' && (/\/assets\/en\//).test(path)) {
          path = path.replace('/assets/en/', '/assets/es/');
        }
      }
    } else if ((typeof sm != "undefined") && (typeof sm.funGameDbHandler != "undefined")) {
      path = path.replace('/retina/', '/non-retina/');
      var userLang = sm.funGameDbHandler.getCurrentLanguageCode();
      if (userLang == "es") {
        path = path.replace("/en/", "/es/");
      }
    }
    else if (typeof ELAReadingGame != "undefined") {
      if ((/(.png|.jpg|.jpeg|.plist|.atlas|.json|.fnt)$/).test(path) && !ELAReadingGame.getIsRetina()) {
        path = path.replace('/retina/', '/non-retina/');
      }
      if (typeof ELAReadingGame.gameDBHandler != "undefined" && typeof ELAReadingGame.gameDBHandler.getUserLang != "undefined") {
        var userLang = ELAReadingGame.gameDBHandler.getUserLang();
        if (userLang == "es") {
          path = path.replace("/en/", "/es/");
        }
      }
    }


    if (path.indexOf('../common/res/') == 0) {
      path = path.replace('../common/res/fonts', 'dist/fonts');
      path = path.replace('../common/res/sounds/mp3', 'dist/sounds/common_cocos/mp3');
      path = path.replace('../common/res/retina', 'dist/resources/common_cocos/retina');
      path = path.replace('../common/res/non-retina', 'dist/resources/common_cocos/non-retina');
    } else if (path.indexOf('res/') == 0) {
      if (game_name == 'oddbods-books') {
        game_name = game_name + "/oddbods-common";
      }
      path = path.replace('res/retina', 'dist/resources/' + game_name + '/retina');
      path = path.replace('res/non-retina', 'dist/resources/' + game_name + '/non-retina');
      path = path.replace('res/sounds/mp3', 'dist/sounds/' + game_name + '/mp3');
    }

    var prefix_match = new RegExp("^\/" + asset_prefix + "\/|" + "^" + asset_prefix + "\/"); /* /^\/assets\/|^assets\// */
    var prefix;

    if (path.indexOf('./') == 0) {
      path = path.replace("./", "")
    }

    path = path.replace(prefix_match, "");
    if (window.ASSET_HOST && !bypass_asset_host) {
      prefix = "//" + window.ASSET_HOST + "/";
    } else {
      if (useLocalDevelopmentAssetHost && window.localDevelopmentAssetHost) {
        prefix = "//" + window.localDevelopmentAssetHost + "/";
      } else {
        prefix = "/";
      }
    }

    if (!bypass_adding_assets) {
      prefix += asset_prefix + "/";
    }

    if (window.ASSET_DIGEST_MAP && !bypass_asset_digest) {
      var digestMaping = window.ASSET_DIGEST_MAP[path];
      if (digestMaping) {
        return prefix + digestMaping;
      } else {
        return prefix + path;
      }
    }

    return prefix + path;
  }

  window['asset_path'] = window['asset_path'] || asset_path;
})(window);
