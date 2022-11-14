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
      oolzoo_json: "res/retina/SpineAnimation/oolzoo/oolzoo.json",
      oolzoo_atlas: "res/retina/SpineAnimation/oolzoo/oolzoo.atlas",
      oolzoo_png: "res/retina/SpineAnimation/oolzoo/oolzoo.png",
      //top bar
      ui_bar: "res/retina/top_bar/ui_bar.png",
      //mode selection
      modebg: "res/retina/ipad/modebg.png",
      modebg_small: "res/retina/small-device/modebg.png",
      bg: "res/retina/ipad/BUILD1.png",
      angry: "res/retina/game_play/bulb.png",
      sad: "res/retina/game_play/switch.png",
      cry: "res/retina/game_play/amplifier.png",
      happy: "res/retina/game_play/battery.png",
      drag: "res/retina/game_play/start.png",
      hey: "res/sounds/mp3/hey.mp3",
      angryy: "res/sounds/mp3/angry.mp3",
      emotion: "res/sounds/mp3/emotion.mp3",
      popup: "res/retina/popup/popup.png",
      popup_back: "res/retina/popup/popup_back.png",
      button1: "res/retina/popup/bttn01.png",
      next_icon: "res/retina/popup/next_icon.png",
      replay_icon: "res/retina/popup/replay_icon.png",
      welldone_poster: "res/retina/popup/welldone.png",
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
