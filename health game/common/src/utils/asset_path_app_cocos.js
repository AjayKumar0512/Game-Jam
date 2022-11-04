// function asset_path(fileUrl, gameName) {
//   console.log("asset_path_app_cocos asset_path");
//   if ((/(.png|.jpg|.jpeg|.plist|.atlas|.json|.fnt)$/).test(fileUrl) && !SMCocosGame.getIsRetina()) {
//     fileUrl = fileUrl.replace('/retina/', '/non-retina/');
//   }
//   return fileUrl;
// }
(function (window) {
  window.asset_path = function (fileUrl, gameName) {
    //for spanish pitstop assets if assets depend on language 
    // following structure can be used assets->(en and es)
    //Prerna : for level wise asset loading of voice overs
    if (typeof SMCocosGame != "undefined") {
      if ((/(.png|.jpg|.jpeg|.plist|.atlas|.json|.fnt)$/).test(fileUrl) && !SMCocosGame.getIsRetina()) {
        fileUrl = fileUrl.replace('/retina/', '/non-retina/');
      }
      if (typeof SMCocosGame.smGameInstance.gameDBHandler != "undefined" &&
        typeof SMCocosGame.smGameInstance.gameDBHandler.getUserLang != "undefined") {
        var userLang = SMCocosGame.smGameInstance.gameDBHandler.getUserLang();
        if (userLang == "es" && (/\/voice-overs\/en\//).test(fileUrl)) {
          fileUrl = fileUrl.replace("/voice-overs/en/", "/voice-overs/es/");
        }
        if (userLang == 'es' && (/\/assets\/en\//).test(fileUrl)) {
          fileUrl = fileUrl.replace('/assets/en/', '/assets/es/');
        }
      }
    } else if ((typeof sm != "undefined") && (typeof sm.funGameDbHandler != "undefined")) {
      fileUrl = fileUrl.replace('/retina/', '/non-retina/');
      var userLang = sm.funGameDbHandler.getCurrentLanguageCode();
      if (userLang == "es") {
        fileUrl = fileUrl.replace("/en/", "/es/");
      }
    }
    else if (typeof ELAReadingGame != "undefined") {
      if ((/(.png|.jpg|.jpeg|.plist|.atlas|.json|.fnt)$/).test(fileUrl) && !ELAReadingGame.getIsRetina()) {
        fileUrl = fileUrl.replace('/retina/', '/non-retina/');
      }
      if (typeof ELAReadingGame.gameDBHandler != "undefined" && typeof ELAReadingGame.gameDBHandler.getUserLang != "undefined") {
        var userLang = ELAReadingGame.gameDBHandler.getUserLang();
        if (userLang == "es") {
          fileUrl = fileUrl.replace("/en/", "/es/");
        }
      }
    }
    return fileUrl;
  }
})(window);	