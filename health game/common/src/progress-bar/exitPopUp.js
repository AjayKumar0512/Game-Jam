(function (window) {
  window.exitCocosPopUp = function (noButtonCallback, yesButtonCallback) {


    //Prerna : to check if we want to show splashverse popUp
    if (window.GAMES_IN_APP) {
      this.isSplashVerse = true;
    }

    //shortcut to test
    // this.isSplashVerse = true;
    window.game.showingExitPitstop = true;
    window.game.homeclicked = true;
    const gametag = document.getElementById("Cocos2dGameContainer");

    let containerDiv = document.getElementById("popup-exit-cont-container");
    containerDiv && containerDiv.remove();

    const contContainer = document.createElement("div");
    contContainer.id = "popup-exit-cont-container";


    let assetsPath = {

      base: "/resume/base_resume.png",
      resume: "/resume/button.png",
      home: "/resume/button.png",
      description: SPGameTranslate("description")

    };

    //Prerna : if splashserve popUp to be shown , assets will change , css need to be changed too for positioning and style
    // to change css , do the changes in scss and convert it to css using script.
    if (this.isSplashVerse) {
      assetsPath = {

        base: "/resume/exit-popup/splash-verse/base_resume.png",
        resume: "/resume/exit-popup/splash-verse/resume_button.png",
        home: "/resume/exit-popup/splash-verse/home_button.png",
        description: SPGameTranslate("spalshverseDescription")

      };
      if (contContainer != null)
        contContainer.classList.add("resume-splash-verse");

    }


    const container = document.createElement("div");
    container.id = "popup-container";

    const heading = document.createElement("h1");
    heading.innerHTML = SPGameTranslate("areYouSureYouWantToExit");
    const para = document.createElement("p");
    para.innerHTML = assetsPath.description;
    let resolutionType = window.devicePixelRatio == 1 ? "non-retina" : "retina";
    if (typeof (window.resolutionType) != "undefined") {
      resolutionType = window.resolutionType;
    }
    const folder = resolutionType;
    const pathSuffix = window.GAMES_IN_APP ? "/res/" : "/";
    const basePath = window.GAMES_IN_APP ? "dist/cocos-game-app-dist/common" : "res/";


    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.classList.add("buttonsWrapper");
    var yesButton = document.createElement("div");
    yesButton.style.backgroundImage = "url(" + asset_path(basePath + pathSuffix + folder + assetsPath.home) + ")";
    var noButton = document.createElement("div");
    noButton.style.backgroundImage = "url(" + asset_path(basePath + pathSuffix + folder + assetsPath.resume) + ")";

    //yes button
    const homeText = document.createElement("p");
    homeText.classList.add("btnText");
    homeText.innerHTML = window.SPGameTranslate("yesButtonText");
    yesButton.classList.add("box");
    yesButton.classList.add("boxHome");
    yesButton.id = "home-btn-text";
    yesButton.appendChild(homeText);

    //no button
    const resumeText = document.createElement("p");
    resumeText.classList.add("btnText");
    resumeText.innerHTML = window.SPGameTranslate("noButtonText");
    noButton.classList.add("box");
    noButton.classList.add("boxResume");
    noButton.id = "resume-btn-text";
    noButton.appendChild(resumeText);


    const popimage = document.createElement("img");
    popimage.id = "popup-base-img";
    popimage.src = asset_path(basePath + pathSuffix + folder + assetsPath.base);

    gametag.appendChild(contContainer);

    contContainer.appendChild(container);
    container.appendChild(popimage);
    container.appendChild(heading);
    // container.appendChild(para);
    container.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(yesButton);
    buttonsWrapper.appendChild(noButton);

    //pausing game cocos
    // window.game.showingExitPitstop = true;
    window.game.pauseGame();

    window.game.smGameInstance && window.game.smGameInstance.questionTimer && window.game.smGameInstance.questionTimer.pauseTimer();
    $("#resume-btn-text").on(SPEffects.tap(), () => {
      window.game.showingExitPitstop = false;
      $("#popup-exit-cont-container").remove();
      window.game.smGameInstance && window.game.smGameInstance.questionTimer && window.game.smGameInstance.questionTimer.resumeTimer();
      noButtonCallback();
    });

    $("#home-btn-text").on(SPEffects.tap(), () => {
      window.game.showingExitPitstop = false;
      $("#popup-exit-cont-container").remove();
      yesButtonCallback();
    });
  };
})(window);
