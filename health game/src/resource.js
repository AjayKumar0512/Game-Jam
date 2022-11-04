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

(function (window) {
  window.resourceCluster = {
    common: {
      //spritesheet/plists
      __plistData__: [
        {
          top_bar_plist: "res/retina/top_bar/top_bar.plist",
          top_bar_png: "res/retina/top_bar/top_bar.png",
        },
        {
          mode_selection_plist: "res/retina/mode_selection/mode_selection.plist",
          mode_selection_png: "res/retina/mode_selection/mode_selection.png",
        },
      ],
      //top bar
      ui_bar: "res/retina/top_bar/ui_bar.png",
      //mode selection
      modebg: "res/retina/ipad/modebg.png",
      modebg_small: "res/retina/small-device/modebg.png",
      //drawing
      whiteDot: "res/retina/game_play/build/white_dot.png",

      //BUILD mode backgrounds
      BUILD1: "res/retina/ipad/BUILD1.png",
      BUILD2: "res/retina/ipad/BUILD2.png",
      BUILD3: "res/retina/ipad/BUILD3.png",
      BUILD4: "res/retina/ipad/BUILD4.png",
      BUILD5: "res/retina/ipad/BUILD5.png",
      BUILD6: "res/retina/ipad/BUILD6.png",
      BUILD7: "res/retina/ipad/BUILD7.png",
      BUILD8: "res/retina/ipad/BUILD8.png",
      BUILD9: "res/retina/ipad/BUILD9.png",
      next: "res/retina/game_play/build/next.png",
      hand: "res/retina/game_play/build/hand.png",
      socket: "res/retina/game_play/build/socket.png",

      //stage 1
      body1: "res/retina/game_play/build/stage/body1.png",
      body2: "res/retina/game_play/build/stage/body2.png",
      body3: "res/retina/game_play/build/stage/body3.png",
      body4: "res/retina/game_play/build/stage/body4.png",

      //stage 2
      color1: "res/retina/game_play/build/stage/color1.png",
      color2: "res/retina/game_play/build/stage/color2.png",
      color3: "res/retina/game_play/build/stage/color3.png",
      color4: "res/retina/game_play/build/stage/color4.png",
      color5: "res/retina/game_play/build/stage/color5.png",
      color6: "res/retina/game_play/build/stage/color6.png",

      //stage 3
      engine1: "res/retina/game_play/build/stage/engine1.png",
      engine2: "res/retina/game_play/build/stage/engine2.png",
      engine3: "res/retina/game_play/build/stage/engine3.png",
      engine4: "res/retina/game_play/build/stage/engine4.png",

      //stage 4
      silencer1: "res/retina/game_play/build/stage/silencer1.png",
      silencer2: "res/retina/game_play/build/stage/silencer2.png",
      silencer3: "res/retina/game_play/build/stage/silencer3.png",
      silencer4: "res/retina/game_play/build/stage/silencer4.png",

      //stage 5
      tyre1: "res/retina/game_play/build/stage/tyre1.png",
      tyre2: "res/retina/game_play/build/stage/tyre2.png",
      tyre3: "res/retina/game_play/build/stage/tyre3.png",
      tyre4: "res/retina/game_play/build/stage/tyre4.png",

      //stage 6
      gun1: "res/retina/game_play/build/stage/gun1.png",
      gun2: "res/retina/game_play/build/stage/gun2.png",
      gun3: "res/retina/game_play/build/stage/gun3.png",
      gun4: "res/retina/game_play/build/stage/gun4.png",

      //stage 7
      drill: "res/retina/game_play/build/stage/drill.png",

      //stage 8
      hat1: "res/retina/game_play/build/stage/hat1.png",
      hat2: "res/retina/game_play/build/stage/hat2.png",
      hat3: "res/retina/game_play/build/stage/hat3.png",
      hat4: "res/retina/game_play/build/stage/hat4.png",

      //stage 9
      sticker1: "res/retina/game_play/build/stage/sticker1.png",
      sticker2: "res/retina/game_play/build/stage/sticker2.png",
      sticker3: "res/retina/game_play/build/stage/sticker3.png",
      sticker4: "res/retina/game_play/build/stage/sticker4.png",
      //garrage
      BUILD10: "res/retina/ipad/BUILD10.png",
      gas: "res/retina/game_play/garrage/gas.png",
      jump: "res/retina/game_play/garrage/jump.png",


      //
    },
  };

  window.levelClusterMap = {};

  window.res = {
    //top bar related
    cross: "res/retina/top_bar/cross_button.png",
    back: "res/retina/top_bar/back_button.png",
    music_button: "res/retina/top_bar/music_button.png",
    nomusic_button: "res/retina/top_bar/nomusic_button.png",

    //mode selection
    mode: "res/retina/mode_selection/normal.png",
    mode_selected: "res/retina/mode_selection/selected.png",
    title: "res/retina/mode_selection/title_heading.png",
    title_selected: "res/retina/mode_selection/selected_nametag.png",
    freeplay_thumbnail: "res/retina/mode_selection/free_play.png",
    followplay_thumbnail: "res/retina/mode_selection/follow_play.png",
  };
})(this);

if (window.SMCocosGame) {
  window.SMCocosGame.customiseGame = function () {
    window.commonRes = {
      Hand_Gesture_plist: "../common/res/retina/hand-gesture/hand-gestures.plist",
      Hand_Gesture_png: "../common/res/retina/hand-gesture/hand-gestures.png",
    };

    var commonResPngPlistMap = {
      __plistData__: [
        {
        }
      ]
    };
    window.commonFonts = {
      graphie_semibold_ttf: { type: "font", name: "graphie_semibold", srcs: ["graphie-semiBold.ttf", "graphie-semiBold.woff", "graphie-semiBold.woff2"] },
      bookBagRegular: { type: "font", name: "bookBagRegular", srcs: ["bookbag-new.ttf", "bookbag-new.woff", "bookbag-new.woff2"] }
    };

    window.commonResSpriteFrames = {

      CrossPopUp_Container_png: "../common/res/retina/progress-bar/popup-container.png",
      CrossPopUp_Yes_Button_png: "../common/res/retina/progress-bar/popup-yes-button.png",
      CrossPopUp_No_Button_png: "../common/res/retina/progress-bar/popup-no-button.png",
      CrossPopUp_Button_png: "../common/res/retina/progress-bar/pop-up-button.png",

      SplashVerse_CrossPopUp_Container_png: "../common/res/retina/progress-bar/splash-verse/popup-container.png",
      SplashVerse_CrossPopUp_Yes_Button_png: "../common/res/retina/progress-bar/splash-verse/popup-yes-button.png",
      SplashVerse_CrossPopUp_No_Button_png: "../common/res/retina/progress-bar/splash-verse/popup-no-button.png",

    };
  }

}
