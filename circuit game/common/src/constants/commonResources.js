(function (window) {
  var commonLoaderRes = {
    Loader_Horse_Sheet_png: "../common/res/retina/loader/horse-running-loader.png",
    Loader_Bar_png: "../common/res/retina/loader/loader-fill-empty-bar.png",
    Loader_Bar_Glow_png: "../common/res/retina/loader/loader-fill-empty-bar-glow.png",
    Play_Button_png: "../common/res/retina/loader/play_button.png",
    click_sound_loader: "../common/res/sounds/mp3/click_main.mp3"
  };

  var commonRes = {

    //Helper resources
    "elf_baba_helper_json": "../common/res/retina/helper/elf_baba/baba.json",
    "elf_baba_helper_atlas": "../common/res/retina/helper/elf_baba/baba.atlas",
    "elf_baba_helper_png": "../common/res/retina/helper/elf_baba/baba.png",

    //Helper resources
    "bub_buc_helper_json": "../common/res/retina/helper/buc_buc/letter_char.json",
    "bub_buc_helper_atlas": "../common/res/retina/helper/buc_buc/letter_char.atlas",
    "bub_buc_helper_png": "../common/res/retina/helper/buc_buc/letter_char.png",

    //Helper resources
    "supervisor_helper_json": "../common/res/retina/helper/supervisor/supervisor.json",
    "supervisor_helper_atlas": "../common/res/retina/helper/supervisor/supervisor.atlas",
    "supervisor_helper_png": "../common/res/retina/helper/supervisor/supervisor.png",

    //Helper common resources

    // "active_bttn_helper_png" : "../common/res/retina/helper/base/okbtn_active.png",
    // "inactive_bttn_helper_png" : "../common/res/retina/helper/base/okbtn_inactive.png",
    // "pressed_bttn_helper_png" : "../common/res/retina/helper/base/okbtn_pressed.png",
    // "overlay_shadow_helper_png" : "../common/res/retina/helper/base/overlay_shadow.png",
    // "right_block_helper_png" : "../common/res/retina/helper/base/right_block.png",

    Progress_Container_png: "../common/res/retina/progress-bar/progress-container.png",
    // Progress_Undo_Button_png: "../common/res/retina/progress-bar/undo-button.png",
    // Progress_Replay_Button_png: "../common/res/retina/progress-bar/replay-button.png",
    // Progress_Music_On_Button_png: "../common/res/retina/progress-bar/music-on-button.png",
    // Progress_Music_Off_Button_png: "../common/res/retina/progress-bar/music-off-button.png",
    // Progress_Wrong_Button_png: "../common/res/retina/progress-bar/wrong-button.png",
    Progress_Filled_Bar_png: "../common/res/retina/progress-bar/filled-bar.png",
    //Progress_Empty_Bar_png: "../common/res/retina/progress-bar/empty-bar.png",
    // Progress_Star_Pannel_png: "../common/res/retina/progress-bar/star-panel.png",
    // Progress_Star_png: "../common/res/retina/progress-bar/star.png",
    // Progress_Empty_Star_png: "../common/res/retina/progress-bar/empty-star.png",
    // Progress_Coin_png: "../common/res/retina/progress-bar/game-coin.png",
    // Progress_Empty_Coin_png: "../common/res/retina/progress-bar/empty-game-coin.png",



    // PitStop_Base_png: "../common/res/retina/pit-stop/base.png",
    // PitStop_Next_Button_png: "../common/res/retina/pit-stop/next-button.png",
    // PitStop_Replay_Button_png: "../common/res/retina/pit-stop/replay-button.png",
    // PitStop_Exit_Button_png: "../common/res/retina/pit-stop/exit-button.png",
    // PitStop_Big_Star_png: "../common/res/retina/pit-stop/star.png",
    // PitStop_Small_Star_png: "../common/res/retina/pit-stop/star-small.png",

    PitStop_Stars_plist: "../common/res/retina/pit-stop/stars.plist",
    PitStop_Stars_Sheet_png: "../common/res/retina/pit-stop/stars.png",


    // "pitstop-c3-empty-star-png": "../common/res/retina/pit-stop/pitstop-c3/empty-star.png",

    // "pitstop-c3-filled-box-png": "../common/res/retina/pit-stop/pitstop-c3/filled-box.png",
    // "pitstop-c3-filled-progress-png": "../common/res/retina/pit-stop/pitstop-c3/filled-progress.png",
    // "pitstop-c3-empty-box-png": "../common/res/retina/pit-stop/pitstop-c3/empty-box.png",
    // "pitstop-c3-empty-progress-png": "../common/res/retina/pit-stop/pitstop-c3/empty-progress.png",
    // "pitstop-c3-gift-icon-png": "../common/res/retina/pit-stop/pitstop-c3/gift-icon.png",

    // "pitstop-c3-popup-card-png": "../common/res/retina/pit-stop/pitstop-c3/pop-up-card.png",
    // "pitstop-c3-popup-card-2-png": "../common/res/retina/pit-stop/pitstop-c3/pop-up-card-2.png",
    // "pitstop-c3-next-button-png": "../common/res/retina/pit-stop/pitstop-c3/next-button.png",
    // "pitstop-c3-arrow-icon-png": "../common/res/retina/pit-stop/pitstop-c3/arrow-icon.png",
    // "pitstop-c3-exit-button-png": "../common/res/retina/pit-stop/pitstop-c3/exit-button.png",


    "good-job-spine-json": "../common/res/retina/pit-stop/pitstop-c3/spine-minor/assets/en/goodjob-layers.json",
    "good-job-spine-atlas": "../common/res/retina/pit-stop/pitstop-c3/spine-minor/assets/en/goodjob-layers.atlas",
    "good-job-spine-png": "../common/res/retina/pit-stop/pitstop-c3/spine-minor/assets/en/goodjob-layers.png",

    // "good-job-spine-spanish-json": "../common/res/retina/pit-stop/pitstop-c3/spine-minor/spanish/spanish_goodjob-layers.json",
    // "good-job-spine-spanish-atlas": "../common/res/retina/pit-stop/pitstop-c3/spine-minor/spanish/spanish_goodjob-layers.atlas",
    // "good-job-spine-spanish-png": "../common/res/retina/pit-stop/pitstop-c3/spine-minor/spanish/spanish_goodjob-layers.png",

    "pitstop-c3-next-button-overlay-png-large": "../common/res/retina/pit-stop/pitstop-c3/auto-next/next-button-overlay-large.png",
    "pitstop-c3-next-button-overlay-png": "../common/res/retina/pit-stop/pitstop-c3/auto-next/next-button-overlay.png",

    // // //added for splashServe small devices

    // "pitstop-c3-popup-card-png-dark-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/pop-up-card-dark-blue.png",
    // "pitstop-c3-popup-card-2-png-dark-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/pop-up-card-2-dark-blue.png",
    // "pitstop-c3-next-button-png-white": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-white.png",
    // "pitstop-c3-next-button-png-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-blue.png",
    // "pitstop-c3-next-button-png-large-white": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-large-white.png",
    // "pitstop-c3-next-button-png-large-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-large-blue.png",
    // "pitstop-c3-empty-star-dark-blue-png": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/empty-star-dark-blue.png",
    // "pitstop-c3-next-button-overlay-png-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/overlay-blue.png",
    // "pitstop-c3-replay-icon-png-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/replay-icon-blue.png",
    // "pitstop-c3-exit-button-png-dark-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/exit-button-dark-blue.png",
    //plist for CTA buttons
    // "pitstop-c3-cta-buttons-plist" : "../common/res/retina/pit-stop/pitstop-c3/cta-buttons.plist",
    // "pitstop-c3-cta-buttons-png" : "../common/res/retina/pit-stop/pitstop-c3/cta-buttons.png",


    // "pitstop-background-star-png": "../common/res/retina/pit-stop/pitstop-c3/background-star.png",

    // "pitstop-c3-next-button-large-png": "../common/res/retina/pit-stop/pitstop-c3/next-button-large.png",
    // "pitstop-c3-replay-icon-png": "../common/res/retina/pit-stop/pitstop-c3/replay-icon.png",
    "pitstop-c3-starSheet-png": "../common/res/retina/pit-stop/pitstop-c3/stars/pitstop-stars.png",
    "pitstop-c3-starSheet-plist": "../common/res/retina/pit-stop/pitstop-c3/stars/pitstop-stars.plist",



    // CrossPopUp_Container_png: "../common/res/retina/progress-bar/popup-container.png",
    // CrossPopUp_Yes_Button_png: "../common/res/retina/progress-bar/popup-yes-button.png",
    // CrossPopUp_No_Button_png: "../common/res/retina/progress-bar/popup-no-button.png",
    // CrossPopUp_Button_png: "../common/res/retina/progress-bar/pop-up-button.png",

    // SplashVerse_CrossPopUp_Container_png: "../common/res/retina/progress-bar/splash-verse/popup-container.png",
    // SplashVerse_CrossPopUp_Yes_Button_png: "../common/res/retina/progress-bar/splash-verse/popup-yes-button.png",
    // SplashVerse_CrossPopUp_No_Button_png: "../common/res/retina/progress-bar/splash-verse/popup-no-button.png",

    Hand_Gesture_plist: "../common/res/retina/hand-gesture/hand-gestures.plist",
    Hand_Gesture_png: "../common/res/retina/hand-gesture/hand-gestures.png",

    "common-cocos-assets-1-png": "../common/res/retina/common-cocos-assets-1.png",
    "common-cocos-assets-1-plist": "../common/res/retina/common-cocos-assets-1.plist",
    "common-cocos-assets-2-png": "../common/res/retina/common-cocos-assets-2.png",
    "common-cocos-assets-2-plist": "../common/res/retina/common-cocos-assets-2.plist",
    "splash-verse-sheet-png": "../common/res/retina/splash-verse/splash-verse-sheet.png",
    "splash-verse-sheet-plist": "../common/res/retina/splash-verse/splash-verse-sheet.plist",


    //sounds
    levelCompleteBed: "../common/res/sounds/mp3/pitstop/level-complete-bed.mp3",
    crown1: "../common/res/sounds/mp3/pitstop/level-complete-crown-1.mp3",
    crown2: "../common/res/sounds/mp3/pitstop/level-complete-crown-2.mp3",
    trail: "../common/res/sounds/mp3/pitstop/trail.mp3",
    goodJobArrival: "../common/res/sounds/mp3/pitstop/good-job-arrival.mp3",
    goodJobDeparture: "../common/res/sounds/mp3/pitstop/good-job-departure.mp3",
    click_sound: "../common/res/sounds/mp3/click_main.mp3",

  };

  var commonResSpriteFrames = {


    //Helper common resources

    "active_bttn_helper_png": "../common/res/retina/helper/base/okbtn_active.png",
    "inactive_bttn_helper_png": "../common/res/retina/helper/base/okbtn_inactive.png",
    "pressed_bttn_helper_png": "../common/res/retina/helper/base/okbtn_pressed.png",
    "overlay_shadow_helper_png": "../common/res/retina/helper/base/overlay_shadow.png",
    "right_block_helper_png": "../common/res/retina/helper/base/right_block.png",

    //Progress_Container_png: "../common/res/retina/progress-bar/progress-container.png",
    Progress_Undo_Button_png: "../common/res/retina/progress-bar/undo-button.png",
    Progress_Replay_Button_png: "../common/res/retina/progress-bar/replay-button.png",
    Progress_Music_On_Button_png: "../common/res/retina/progress-bar/music-on-button.png",
    Progress_Music_Off_Button_png: "../common/res/retina/progress-bar/music-off-button.png",
    Progress_Wrong_Button_png: "../common/res/retina/progress-bar/wrong-button.png",
    //Progress_Filled_Bar_png: "../common/res/retina/progress-bar/filled-bar.png",
    Progress_Empty_Bar_png: "../common/res/retina/progress-bar/empty-bar.png",
    Progress_Star_Pannel_png: "../common/res/retina/progress-bar/star-panel.png",
    Progress_Star_png: "../common/res/retina/progress-bar/star.png",
    Progress_Empty_Star_png: "../common/res/retina/progress-bar/empty-star.png",
    Progress_Coin_png: "../common/res/retina/progress-bar/game-coin.png",
    Progress_Empty_Coin_png: "../common/res/retina/progress-bar/empty-game-coin.png",



    // PitStop_Base_png: "../common/res/retina/pit-stop/base.png",
    // PitStop_Next_Button_png: "../common/res/retina/pit-stop/next-button.png",
    // PitStop_Replay_Button_png: "../common/res/retina/pit-stop/replay-button.png",
    // PitStop_Exit_Button_png: "../common/res/retina/pit-stop/exit-button.png",
    // PitStop_Big_Star_png: "../common/res/retina/pit-stop/star.png",
    // PitStop_Small_Star_png: "../common/res/retina/pit-stop/star-small.png",



    "pitstop-c3-empty-star-png": "../common/res/retina/pit-stop/pitstop-c3/empty-star.png",

    "pitstop-c3-filled-box-png": "../common/res/retina/pit-stop/pitstop-c3/filled-box.png",
    "pitstop-c3-filled-progress-png": "../common/res/retina/pit-stop/pitstop-c3/filled-progress.png",
    "pitstop-c3-empty-box-png": "../common/res/retina/pit-stop/pitstop-c3/empty-box.png",
    "pitstop-c3-empty-progress-png": "../common/res/retina/pit-stop/pitstop-c3/empty-progress.png",
    "pitstop-c3-gift-icon-png": "../common/res/retina/pit-stop/pitstop-c3/gift-icon.png",

    "pitstop-c3-popup-card-png": "../common/res/retina/pit-stop/pitstop-c3/pop-up-card.png",
    "pitstop-c3-popup-card-2-png": "../common/res/retina/pit-stop/pitstop-c3/pop-up-card-2.png",
    "pitstop-c3-next-button-png": "../common/res/retina/pit-stop/pitstop-c3/next-button.png",
    "pitstop-c3-arrow-icon-png": "../common/res/retina/pit-stop/pitstop-c3/arrow-icon.png",
    "pitstop-c3-exit-button-png": "../common/res/retina/pit-stop/pitstop-c3/exit-button.png",

    "pitstop-background-star-png": "../common/res/retina/pit-stop/pitstop-c3/background-star.png",

    "pitstop-c3-next-button-png-large": "../common/res/retina/pit-stop/pitstop-c3/next-button-large.png",
    "pitstop-c3-replay-icon-png": "../common/res/retina/pit-stop/pitstop-c3/replay-icon.png",


    // "pitstop-c3-next-button-png-white": "../common/res/retina/pit-stop/pitstop-c3/next-button-white.png",
    // "pitstop-c3-next-button-png-blue": "../common/res/retina/pit-stop/pitstop-c3/next-button-blue.png",
    // "pitstop-c3-next-button-png-large-white": "../common/res/retina/pit-stop/pitstop-c3/next-button-large-white.png",
    // "pitstop-c3-next-button-png-large-blue": "../common/res/retina/pit-stop/pitstop-c3/next-button-large-blue.png",
    // "pitstop-c3-empty-star-dark-blue-png": "../common/res/retina/pit-stop/pitstop-c3/empty-star-dark-blue.png",
    // "pitstop-c3-next-button-overlay-png-blue": "../common/res/retina/pit-stop/pitstop-c3/overlay-blue.png",
    // "pitstop-c3-replay-icon-png-blue": "../common/res/retina/pit-stop/pitstop-c3/replay-icon-blue.png",


    CrossPopUp_Container_png: "../common/res/retina/progress-bar/popup-container.png",
    CrossPopUp_Yes_Button_png: "../common/res/retina/progress-bar/popup-yes-button.png",
    CrossPopUp_No_Button_png: "../common/res/retina/progress-bar/popup-no-button.png",
    CrossPopUp_Button_png: "../common/res/retina/progress-bar/pop-up-button.png",

    // "pitstop-c3-next-button-overlay-png-large": "../common/res/retina/pit-stop/pitstop-c3/next-button-overlay-large.png",
    // "pitstop-c3-next-button-overlay-png": "../common/res/retina/pit-stop/pitstop-c3/next-button-overlay.png",

    // //added for splashServe small devices

    "pitstop-c3-popup-card-png-dark-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/pop-up-card-dark-blue.png",
    "pitstop-c3-popup-card-2-png-dark-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/pop-up-card-2-dark-blue.png",
    "pitstop-c3-next-button-png-white": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-white.png",
    "pitstop-c3-next-button-png-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-blue.png",
    "pitstop-c3-next-button-png-large-white": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-large-white.png",
    "pitstop-c3-next-button-png-large-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/next-button-large-blue.png",
    "pitstop-c3-empty-star-dark-blue-png": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/empty-star-dark-blue.png",
    "pitstop-c3-next-button-overlay-png-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/overlay-blue.png",
    "pitstop-c3-replay-icon-png-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/replay-icon-blue.png",
    "pitstop-c3-exit-button-png-dark-blue": "../common/res/retina/pit-stop/pitstop-c3/splash-verse/exit-button-dark-blue.png",



    SplashVerse_CrossPopUp_Container_png: "../common/res/retina/progress-bar/splash-verse/popup-container.png",
    SplashVerse_CrossPopUp_Yes_Button_png: "../common/res/retina/progress-bar/splash-verse/popup-yes-button.png",
    SplashVerse_CrossPopUp_No_Button_png: "../common/res/retina/progress-bar/splash-verse/popup-no-button.png",

  };

  var commonResPngPlistMap = {
    __plistData__: [
      {
        Hand_Gesture_plist: "../common/res/retina/hand-gesture/hand-gestures.plist",
        Hand_Gesture_png: "../common/res/retina/hand-gesture/hand-gestures.png"
      }, {
        PitStop_Stars_plist: "../common/res/retina/pit-stop/stars.plist",
        PitStop_Stars_Sheet_png: "../common/res/retina/pit-stop/stars.png",
      }, {
        "pitstop-c3-starSheet-png": "../common/res/retina/pit-stop/pitstop-c3/stars/pitstop-stars.png",
        "pitstop-c3-starSheet-plist": "../common/res/retina/pit-stop/pitstop-c3/stars/pitstop-stars.plist",
      },
      // {
      //   "pitstop-c3-cta-buttons-plist": "../common/res/retina/pit-stop/pitstop-c3/cta-buttons.plist",
      //   "pitstop-c3-cta-buttons-png": "../common/res/retina/pit-stop/pitstop-c3/cta-buttons.png",
      // },
      {
        "common-cocos-assets-1-png": "../common/res/retina/common-cocos-assets-1.png",
        "common-cocos-assets-1-plist": "../common/res/retina/common-cocos-assets-1.plist",
      },
      {
        "common-cocos-assets-2-png": "../common/res/retina/common-cocos-assets-2.png",
        "common-cocos-assets-2-plist": "../common/res/retina/common-cocos-assets-2.plist",
      },
      {
        "splash-verse-sheet-png": "../common/res/retina/splash-verse-sheet.png",
        "splash-verse-sheet-plist": "../common/res/retina/splash-verse-sheet.plist",
      }

    ]
  };

  var commonFonts = {
    fredoka_one_regular_ttf: { type: "font", name: "fredoka_one_regular", srcs: ["fredoka-one-regular.ttf", "fredoka-one-regular.woff", "fredoka-one-regular.woff2"] },
    roboto_black_ttf: { type: "font", name: "roboto-black", srcs: ["roboto-black.ttf", "roboto-black.woff", "roboto-black.woff2"] },
    roboto_bold_ttf: { type: "font", name: "roboto-bold", srcs: ["roboto_bold.ttf", "roboto_bold.woff", "roboto_bold.woff2"] },

    quicksand_bold_ttf: { type: "font", name: "quick_sand_bold", srcs: ["quick-sand-bold.ttf", "quick-sand-bold.woff", "quick-sand-bold.woff2"] },
    quicksand_medium_ttf: { type: "font", name: "quick_sand_med", srcs: ["quick-sand-medium.ttf", "quick-sand-medium.woff", "quick-sand-medium.woff2"] },
    quicksand_regular_ttf: { type: "font", name: "quick_sand_reg", srcs: ["quick-sand-regular.ttf", "quick-sand-regular.woff", "quick-sand-regular.woff2"] },

    noteworthy_bold_ttf: { type: "font", name: "noteworthy_bold", srcs: ["noteworthy-bold.ttf", "noteworthy-bold.woff", "noteworthy-bold.woff2"] },

    schoolbellregular_ttf: { type: "font", name: "schoolbellregular", srcs: ["schoolbell-regul.ttf", "schoolbell-regul.woff", "schoolbell-regul.woff2"] },
    arial_ttf: { type: "font", name: "arial", srcs: ["Arial.ttf", "Arial.woff", "Arial.woff2"] },
    openSans_Bold_ttf: { type: "font", name: "openSans-Bold", srcs: ["open-sans-bold.ttf", "open-sans-bold.woff", "open-sans-bold.woff2"] },
    mysteryQuest_ttf: { type: "font", name: "MysteryQuest", srcs: ["mystery-quest.ttf", "mystery-quest.woff", "mystery-quest.woff2"] },
    openSans_ttf: { type: "font", name: "openSans", srcs: ["opensans-light-webfont.ttf", "opensans-light-webfont.woff", "opensans-light-webfont.woff2"] },
    open_sanssemibold_ttf: { type: "font", name: "open_sanssemibold", srcs: ["opensans-semibold-webfont.ttf", "opensans-semibold-webfont.woff", "opensans-semibold-webfont.woff2"] },
    archivoBlack_ttf: { type: "font", name: "archivoBlack", srcs: ["archivo-black-regular.ttf", "archivo-black-regular.woff", "archivo-black-regular.woff2"] },
    kgPrimary: { type: "font", name: "kgPrimary", srcs: ["kg-primary.ttf", "kg-primary.woff", "kg-primary.woff2"] },
    graphie_semibold_ttf: { type: "font", name: "graphie_semibold", srcs: ["graphie-semiBold.ttf", "graphie-semiBold.woff", "graphie-semiBold.woff2"] },
    graphie_regular_ttf: {type: "font", name: "graphie_regular", srcs: ["graphie-regular.ttf", "graphie-regular.woff", "graphie-regular.woff2"] },
    bookBagRegular: {type: "font",name: "bookBagRegular",srcs: ["bookbag-new.ttf", "bookbag-new.woff", "bookbag-new.woff2"]
    }
  };

  function getDataInObject(resourceObj, objToPlace) {
    for (var key in objToPlace) {
      if (key == '__plistData__') {
        for (var i in objToPlace['__plistData__']) {
          var resData = objToPlace['__plistData__'][i];
          for (var resDataKey in resData) {
            resourceObj[resDataKey] = resData[resDataKey];
          }
        }
      } else {
        resourceObj[key] = objToPlace[key];
      }
    }
    return resourceObj;
  }

  function getLevelClustersFor(level, index, levelClusterMap) {
    var levelClusters;
    if (typeof (GameData) != 'undefined' && typeof (GameData.game_data) != 'undefined') {
      var levelData = GameData.game_data[index];
      if (levelData && levelData.__CLUSTERS_TO_LOAD__) {
        levelClusters = levelData.__CLUSTERS_TO_LOAD__;
      }
    }

    var correctedLevel = level - 1;
    if (!levelClusters && typeof (levelClusterMap) != 'undefined' && levelClusterMap[correctedLevel]) {
      levelClusters = levelClusterMap[correctedLevel];
    }

    return levelClusters;
  }

  function getLevelResources(levelArr, resourceCluster, levelClusterMap) {
    var resourceObj = {};
    if (!resourceCluster || !levelClusterMap) {
      resourceObj = res;
    } else {
      resourceObj = getDataInObject(resourceObj, resourceCluster.common);

      if (typeof (levelArr) == 'undefined') {
        if (levelClusterMap) {
          levelArr = Object.keys(levelClusterMap);
        }
      } else {
        if (!Array.isArray(levelArr)) {
          levelArr = [levelArr];
        }
      }

      if (levelArr) {
        levelArr.forEach(function (level, index) {
          var levelClusters = getLevelClustersFor(level, index, levelClusterMap);
          if (levelClusters) {
            levelClusters.forEach(function (clusterIndex) {
              if (resourceCluster.clusters && resourceCluster.clusters[clusterIndex]) {
                resourceObj = getDataInObject(resourceObj, resourceCluster.clusters[clusterIndex]);
              }
            });
          }
        });
      } else {
        if (levelClusterMap) {
          for (var levelKey in levelClusterMap) {
            var levelClusters = levelClusterMap[level];
            levelClusters.forEach(function (clusterIndex) {
              if (resourceCluster.clusters && resourceCluster.clusters[clusterIndex]) {
                resourceObj = getDataInObject(resourceObj, resourceCluster.clusters[clusterIndex])
              }
            });
          }
        } else {
          resourceObj = res;
        }
      }
    }

    return resourceObj;
  }

  function addInPlistPngMap(objToPlace, plistPngMap) {

    var resData = objToPlace['__plistData__'];
    if (resData) {
      resData.forEach(function (resObj, index) {
        var plistKey, pngKey;
        var resObjKeys = Object.keys(resObj);

        if ((/(.plist)$/).test(resData[index][resObjKeys[0]])) {
          plistKey = resObjKeys[0];
          pngKey = resObjKeys[1];
        } else {
          plistKey = resObjKeys[1];
          pngKey = resObjKeys[0];
        }
        if (plistKey && pngKey) {
          plistPngMap[plistKey] = pngKey;
        }
      });
    }
  }

  function getPlistPngMap(levelArr, resourceCluster, levelClusterMap) {
    var plistPngMap = {};
    addInPlistPngMap(commonResPngPlistMap, plistPngMap);
    addInPlistPngMap(resourceCluster.common, plistPngMap);

    if (typeof (levelArr) != 'undefined') {
      levelArr.forEach(function (level, index) {
        var levelClusters = getLevelClustersFor(level, index, levelClusterMap);
        if (levelClusters) {
          levelClusters.forEach(function (clusterIndex) {
            if (resourceCluster.clusters && resourceCluster.clusters[clusterIndex]) {
              addInPlistPngMap(resourceCluster.clusters[clusterIndex], plistPngMap);
            }
          });
        }
      });
    }

    return plistPngMap;
  }

  window.commonLoaderRes = commonLoaderRes;
  window.commonRes = commonRes;
  window.commonFonts = commonFonts;
  window.commonResSpriteFrames = commonResSpriteFrames;
  window.getLevelResources = getLevelResources;
  window.getPlistPngMap = getPlistPngMap;
  window.getDataInObject = getDataInObject;
})(this);
