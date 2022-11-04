const CATEGORY = {
  BG_MUSIC: 0,
  VO: 1,
  SFX: 2
};
const AUDIO_STATE = {
  "-1": "ERROR",
  "0": "INITIALIZING",
  "1": "PLAYING",
  "2": "PAUSED"
}
const EVENT_SOUND_HANDLER_RSUME = "sound_handler_resume";
const EVENT_AUDIO_ROUTE_CHANGE = "audio_route_change";

var SoundHandler = window.SoundManagerNew = cc.Class.extend({
  ctor: function () {

    var a1 = arguments[0],
      a2 = arguments[1];
    let sfxVolumeDuringVO = typeof (a1) == 'number' ? a1 : typeof (a2) == 'number' ? a2 : 0.2;
    let overlapping = typeof (a1) == 'boolean' ? a1 : typeof (a2) == 'boolean' ? a2 : false;

    cc.soundHandler.setSfxVolumeDuringVO(sfxVolumeDuringVO);
    cc.soundHandler.setVOOverlapping(overlapping);
    cc.eventManager.addCustomListener(EVENT_SOUND_HANDLER_RSUME, () => {
      cc.soundHandler.resumeContext();
    });
    cc.eventManager.addCustomListener(EVENT_AUDIO_ROUTE_CHANGE, () => {
      cc.soundHandler.audioRouteChanged();
    });

    //Fix: headphone unplug issue on web browsers
    if (typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) {

      if (cc.Audio && cc.Audio._context) {
        let audioCtx = cc.Audio._context;
        audioCtx.onstatechange = function () {
          cc.soundHandler.resumeContext();
        };
      }

    }


  },

  playMusic: function (audioname, loop, volume = 1) {
    this.musicObject = cc.soundHandler.playSound([audioname, loop]);
    return this.musicObject;
  },

  setMusicVolume(volume) {
    if (!this.musicObject) {
      return;
    }
    cc.soundHandler.setVolume(this.musicObject, volume);
  },

  stopMusic: function (releaseData) {
    if (!this.musicObject) {
      return;
    }
    cc.soundHandler.stopSound(this.musicObject);
    this.musicObject = null;
  },

  pauseMusic: function () {
    if (!this.musicObject) {
      return;
    }
    cc.soundHandler.pauseSound(this.musicObject);
  },

  resumeMusic: function () {
    if (!this.musicObject) {
      return;
    }
    cc.soundHandler.resumeSound(this.musicObject);
  },

  isMusicPlaying: function () {
    if (!this.musicObject) {
      return false;
    }
    return cc.soundHandler.isSoundPlaying(this.musicObject);
  },

  pauseEffect: function (audio) {
    cc.soundHandler.pauseSound(audio);
  },

  pauseAllEffects: function () {
    cc.soundHandler.pauseAllSounds();
  },

  resumeEffect: function (audio) {
    cc.soundHandler.resumeEffect(audio);
  },

  resumeAllEffects: function () {
    cc.soundHandler.resumeAllSounds();
  },

  stopEffect: function (audioId, forced = false) {
    if (!audioId) {
      return;
    }
    if (audioId == this.musicObject) {
      this.musicObject = null;
    }
    cc.soundHandler.stopSound(audioId);
  },

  removeFromLoopList(audioId) {

  },

  stopAllEffects: function () {
    this.musicObject = null;
    cc.soundHandler.stopAll();
  },

  end: function () {
    cc.soundHandler.end();
  },

  setMusicFlag(isMusicOn) {
    cc.soundHandler.setSFXVolumeState(!isMusicOn);
  },

  stopAllSFX() {
    cc.soundHandler.stopAllSFX();
  },

  stopAllVO() {
    cc.soundHandler.stopAllVO();
  },

  playSoundArray: function (audioArray, cb, inBetweenDelay) {
    return cc.soundHandler.playSoundArray(audioArray, cb, inBetweenDelay);
  },

  playSound: function () {
    return cc.soundHandler.playSound(arguments);
  },

  playConcatenatedSoundArray: function (soundName, soundArray, loop) {
    return cc.soundHandler.playConcatenatedSoundArray(soundName, soundArray, loop);
  },
});

SoundHandler.prototype.playEffect = SoundHandler.prototype.playSound;
SoundHandler.prototype.stopSound = SoundHandler.prototype.stopEffect;


var SoundHandlerBase = cc.Class.extend({
  ctor() {
    this._effectsVol = this._currentEffectsVol = 1;
    this._audioList = [];
    this._voCounter = 0;
    this._overlapping = false;
    this.ignoreVolumeControl = false;
  },
  isIE11() {
    return false;
  },
  resumeContext() {

  },
  audioRouteChanged() {

  },
  setSfxVolumeDuringVO(volume) {
    this._effectsVol = volume;
  },
  setVOOverlapping(overlapping) {
    this._overlapping = overlapping;
  },
  getSfxVolumeDuringVO() {
    return this._effectsVol;
  },

  _voStarted() {
    this._voCounter++;
  },
  _voEnded() {
    if (this._voCounter == 0) {
      //console.log("VOENDED CALLED WRONGLY. PLEASE CHECK");
      return;
    }
    this._voCounter--;
  },
  playSound(args) {
    if (this._soundHandlerEnd) {
      return null;
    }
    var obj = {};
    var audioname = args[0];
    var cb = undefined,
      loop = false;
    var a1 = args[1],
      a2 = args[2];

    if (typeof (a1) != 'undefined' && typeof (a2) != 'undefined') {
      cb = a1;
      loop = a2;
    } else if (typeof (a1) == 'undefined' && typeof (a2) != 'undefined') {
      loop = a2;
    } else if (typeof (a1) != 'undefined' && typeof (a1) == 'boolean') {
      loop = a1;
    } else if (typeof (a1) != 'undefined' && typeof (a1) == 'function') {
      cb = a1;
    }
    obj.cb = cb;
    obj.loop = loop;
    obj.audioname = audioname;
    //console.log("audioname ",audioname);
    if (audioname) {
      let isVoCategory = audioname.indexOf("voice-overs") != -1 || audioname.indexOf("common-platform-assets") != -1;
      obj.category = isVoCategory ? CATEGORY.VO : audioname.indexOf("sfx") != -1 ? CATEGORY.SFX : CATEGORY.BG_MUSIC;
    }
    if (this._overlapping) {
      return obj;
    }
    if (obj.category == CATEGORY.VO) {
      this.stopAllVO();
    }
    return obj;
  },
  playSoundArray(audioArray, cb, inBetweenDelay) {
    //debugger;
    if (this._soundHandlerEnd || !audioArray || audioArray.length <= 0) {
      //console.log("SoundHandler: Empty AudioArray");
      cb && cb();
      return null;
    }
    //console.log("playSoundArray",audioArray);
    var obj = {};
    obj.type = "array";
    obj.cb = cb;
    var array = [];
    audioArray.forEach(audioFileName => {
      array.push({
        audioName: audioFileName,
        played: false
      });
    });
    var playNextCb = (parent) => {
      if (parent && parent.complete) {
        return;
      }
      var audio = array.find(element => !element.played);
      if (audio) {
        audio.played = true;
        let audioObj = cc.soundHandler.playSound([audio.audioName, (o) => {
          if (o && o.complete) {
            return;
          }
          if (!inBetweenDelay || !array.find(e => !e.played)) {
            playNextCb(o);
            return;
          }
          setTimeout(() => {
            if (o && o.complete) {
              return;
            }
            playNextCb(o);
          }, inBetweenDelay * 1000);
        }]);
        //console.log("audioObj",audioObj);
        if (!audioObj) {
          //console.log("audio",audio);
          //console.log("Not able to play sound: "+audio.audioName);
          return;
        }
        //console.log("obj",obj);
        audioObj.array = obj;
        obj.audio = audioObj;

      } else {
        cb && cb();
      }
    };
    playNextCb(obj);
    return obj;
  },
  stopSound(obj, nocallback) {
    if (obj.type && obj.type === 'array') {
      obj.complete = true;
      this.stopSound(obj.audio, true);
      obj.cb && obj.cb();
      obj.cb = null;
    }
  },
  stopAll() {
    this._currentEffectsVol = 1;
    var arr = this._audioList.map(function (obj) {
      return obj;
    });
    this._audioList.splice(0, this._audioList.length);
    //setTimeout(() => {
    arr.forEach((obj) => {
      this.stopSound(obj);
    });
    arr.splice(0, arr.length);
    //}, 0);
  },
  setEffectsVolume(volume) {
    this._currentEffectsVol = volume;
  },
  stopAllSFX() {
    var arr = this._audioList.filter(function (obj) {
      return obj.category == CATEGORY.SFX;
    });

    arr.forEach((obj) => {
      this.stopSound(obj);
    });
    arr.splice(0, arr.length);
  },
  stopAllVO() {
    var arr = this._audioList.filter(function (obj) {
      return obj.category == CATEGORY.VO;
    });
    arr.forEach((obj) => {
      this.stopSound(obj.array ? obj.array : obj);
    });
    arr.splice(0, arr.length);
  },
  setSFXVolumeState(nosfx) {
    this.isNoSFX = nosfx;
    this._currentEffectsVol = nosfx ? 0 : this._voCounter > 0 ? this._effectsVol : 1.0;
    this._audioList.forEach((obj) => {
      if (obj.category != CATEGORY.VO) {
        this.setVolume(obj, this._currentEffectsVol);
      }
    });
  },

  pauseAllSounds: function () {
    // if(this._pauseAll){
    //   return;
    // }
    // this._pauseAll = true;
    // this._audioList.forEach(obj => {
    //   this.pauseSound(obj);
    // });
  },
  resumeAllSounds: function () {
    // if(!this._pauseAll){
    //   return;
    // }
    // this._audioList.forEach((obj) => {
    //   this.resumeSound(obj);
    // });
    // this._pauseAll = false;
  },
  setVolume(audio, volume) {

  },

  pauseSound: function (audio) {

  },

  resumeSound: function (audio) {

  },

  isSoundPlaying: function (audio) {
    return false;
  },
  resumeEffect: function (audio) {

  },
  end() {
    this._soundHandlerEnd = true;
  },
  uncacheAll() {
    //console.log("Soundhandler: uncache called");
  }
});

var SoundHandlerNative = SoundHandlerBase.extend({
  ctor() {
    this._super();
  },
  playSound(args) {
    var obj = this._super(args);
    if (!obj) {
      return null;
    }
    var audioList = this._audioList;
    if (!audioList) {
      audioList = this._audioList = [];
    }
    if (!obj.audioname) {
      //console.log("SoundManager: no audio file passed");
      obj.cb && obj.cb();
      return obj;
    }

    let vol = this._currentEffectsVol;
    if (this.isNoSFX && obj.category != CATEGORY.VO) {
      vol = 0;
    }
    let audio = jsb.AudioEngine.play2d(obj.audioname, obj.loop, vol);

    if (audio == null) {
      obj.cb && obj.cb();
      return null;
    }
    obj.audio = audio;
    audioList.push(obj);
    if (obj.category == CATEGORY.VO) {
      cc.soundHandler._voStarted();
      cc.soundHandler.setEffectsVolume(this.isNoSFX ? 0 : this._effectsVol);
      cc.soundHandler.setVolume(obj, 1.0);
    }

    obj.callback = function (id, filePath) {

      if (this.category == CATEGORY.VO) {
        cc.soundHandler._voEnded();
      }
      if (this.category == CATEGORY.VO && !cc.soundHandler.isNoSFX) {
        cc.soundHandler.setEffectsVolume(1);
      }
      var index = audioList.indexOf(this);
      if (index !== -1) {
        audioList.splice(index, 1);
      }
      if (!(this.array && this.array.complete)) {
        this.cb && this.cb();
      }
      this.cb = null;

    }.bind(obj);
    jsb.AudioEngine.setFinishCallback(obj.audio, obj.callback);
    return obj;
  },
  stopSound(obj, nocallback) {
    if (!obj) {
      return;
    }
    this._super(obj, nocallback);
    if (obj.type && obj.type == 'array') {
      return;
    }

    let state = jsb.AudioEngine.getState(obj.audio);

    // console.log("obj.audio    "+obj.audioname);    
    // console.log("audio state    "+AUDIO_STATE[""+state]);
    if (state == 1 || state == 2) {
      setTimeout(() => {
        jsb.AudioEngine.stop(obj.audio);
      }, 0);
    }
    if (obj.array && obj.array.complete) {
      return;
    }
    if (!nocallback) {
      obj.callback && obj.callback();
      obj.callback = null;
    }
  },
  setEffectsVolume(volume) {
    this._super(volume);

    this._audioList.forEach(function (obj) {
      this.setVolume(obj, volume);
    }.bind(this));

  },
  uncacheAll() {
    this._super();
    setTimeout(() => {
      //console.log("SoundhandlerNative: uncacheAll after timeout");
      jsb.AudioEngine.uncacheAll();
    }, 0);
  },
  stopAll() {
    this._super();
  },
  setVolume(obj, volume) {
    this._super(obj, volume);
    jsb.AudioEngine.setVolume(obj.audio, volume);
  },

  pauseSound: function (obj) {
    this._super(obj);
    jsb.AudioEngine.pause(obj.audio);
  },

  resumeSound: function (obj) {
    this._super(obj);
    jsb.AudioEngine.resume(obj.audio);
  },

  isSoundPlaying: function (obj) {
    this._super(obj);
    let state = jsb.AudioEngine.getState(obj.audio);
    return state == 1;
  },
  end() {
    this._super();
    this.stopAll();
  }

});

var SoundHandlerWeb = SoundHandlerBase.extend({

  ctor: function ctor() {
    this._super();
    var result = false;
    if (typeof window.GAMES_ON_WEB != 'undefined' && window.GAMES_ON_WEB && typeof window.navigator != 'undefined' && typeof window.navigator.userAgent != 'undefined') {
      var userAgentStr = window.navigator.userAgent.toLowerCase();
      if (userAgentStr.indexOf("trident/") != -1) {
        result = true;
      }
    }
    this._isIE_11 = result;
  },
  isIE11: function isIE11() {
    return this._isIE_11;
  },
  playSound(args) {
    var obj = this._super(args);
    if (!obj) {
      return null;
    }
    //uncomment following lines to enjoy music and mute game sounds 
    // obj.cb && obj.cb();
    // return;
    ////

    //console.log("SoundHandler: playsound",obj);
    var audioList = this._audioList;
    if (!audioList) {
      audioList = this._audioList = [];
    }
    let audio = cc.audioEngine.playEffect(obj.audioname, obj.loop);
    if (audio == null) {
      obj.cb && obj.cb();
      return null;
    }
    obj.audio = audio;
    obj.playing = true;
    audioList.push(obj);
    let vol = this._currentEffectsVol;
    if (this.isNoSFX && obj.category != CATEGORY.VO) {
      vol = 0;
    }
    this.setVolume(obj, vol);
    if (obj.category == CATEGORY.VO) {
      cc.soundHandler._voStarted();
      cc.soundHandler.setEffectsVolume(this.isNoSFX ? 0 : this._effectsVol);
      cc.soundHandler.setVolume(obj, 1.0);
    }

    let element = audio._element;
    if (element.addEventListener) {
      element.custom_pause = false;
      audio.getPlaying = () => {
        return !element.custom_pause;
      }
      element.addEventListener("ended", () => {
        element.custom_pause = true;
      });
    }


    obj.callback = function (force) {
      var isPlaying = this.audio.getPlaying();
      if (force || (!isPlaying && !cc.game.isPaused())) {
        if (this.category == CATEGORY.VO) {
          cc.soundHandler._voEnded();
        }
        if (this.audio._element) {
          this.audio._element.playedLength = 0;
        }
        clearInterval(this.interval);
        // cc.soundHandler.ignoreVolumeControl
        // Set this flag true to ignore the changes in volume after playing of a voice over 
        if (this.category == CATEGORY.VO && !cc.soundHandler.isNoSFX && !cc.soundHandler.ignoreVolumeControl) {
          cc.soundHandler.setEffectsVolume(1);
        }
        var index = audioList.indexOf(obj);
        if (index !== -1) {
          audioList.splice(index, 1);
        }
        if (!(this.array && this.array.complete)) {
          this.cb && this.cb();
        }

        this.cb = null;
      }
    }.bind(obj);
    obj.interval = setInterval(obj.callback, 100);

    return obj;
  },
  stopSound(obj, nocallback) {
    if (!obj) {
      return;
    }
    this._super(obj, nocallback);
    if (obj.type && obj.type == 'array') {
      //console.log("ARRAY TYPE FOUND");
      return;
    }
    //console.log("SoundHandler: stopSound",obj);
    cc.audioEngine.stopEffect(obj.audio);
    if (obj.array && obj.array.complete) {
      return;
    }
    if (!nocallback) {
      var isie_11 = this.isIE11();
      obj.callback && obj.callback(isie_11);
      obj.callback = null;
    }
  },
  setEffectsVolume(volume) {
    this._super(volume);
    cc.audioEngine.setEffectsVolume(volume);
  },
  stopAll() {
    this._super();
    cc.audioEngine.stopAllEffects();
  },
  setVolume(obj, volume) {
    this._super(obj, volume);
    obj.audio.setVolume(volume);
  },

  pauseSound: function (obj) {
    this._super(obj);
    // if(obj.audio._element){
    //   obj.currentTime = obj.audio._element.currentTime;
    //   obj.playedLength = obj.audio._element.playedLength;
    // }

    cc.audioEngine.pauseEffect(obj.audio);
  },

  resumeSound: function (obj) {
    this._super(obj);
    // if(obj.audio._element){
    //   obj.audio._element.currentTime = obj.currentTime;
    //   obj.audio._element.playedLength = obj.playedLength;
    // }
    cc.audioEngine.resumeEffect(obj.audio);

  },
  pauseAllSounds: function () {
    cc.audioEngine.pauseAllEffects();
  },
  resumeAllSounds: function () {

    cc.audioEngine.resumeAllEffects();
  },

  isSoundPlaying: function (obj) {
    this._super(obj);
    return obj.audio.getPlaying();
  },
  end() {
    this.stopAll();
    //console.log("SoundHandler END CALLED");
    if (cc.Audio && cc.Audio._context && cc.Audio._context) {
      //console.log("CLOSING PREVIOUS CONTEXT");
      //cc.Audio._context.close();
    }
    cc.eventManager.removeCustomListeners(EVENT_AUDIO_ROUTE_CHANGE);
    cc.eventManager.removeCustomListeners(EVENT_SOUND_HANDLER_RSUME);
    this._super();


  },
  resumeContext(isAudioRouteChanged) {
    // console.log("resumeContext");
    if (cc.Audio && cc.Audio._context) {
      let f = () => {
        let state = cc.Audio._context.state;
        // console.log("Context State = "+state);
        if (state == "suspended" || state == "interrupted") {
          cc.Audio._context.resume().then(() => {
            // console.log("Context RESUMED = " + cc.Audio._context.state);
          });
        }
      }
      if (!isAudioRouteChanged) {
        f();
        return;
      }
      setTimeout(() => {
        f();
      }, 100);
    }
  },
  audioRouteChanged() {
    if (cc.game.isPaused()) {
      return;
    }
    this.resumeContext(true);
  },

  playConcatenatedSoundArray(soundName, soundArray, loop, _sampleRate) {
    let bufferArray = [];
    soundArray.forEach(soundRes => {
      bufferArray.push(this.getBufferFromRes(soundRes));
    });
    let sampleRate = _sampleRate ? _sampleRate : bufferArray[0].sampleRate;
    let noOfChannels = bufferArray[0].numberOfChannels;
    let buffer = this.concatAudio(bufferArray, sampleRate, noOfChannels);
    return this.playConcatedBuffer(soundName, buffer, loop);
  },

  playConcatedBuffer(url, buffer, loop) {
    let that = cc.audioEngine;
    var effectList = that._audioPool[url];
    if (!effectList) {
      effectList = that._audioPool[url] = [];
    }

    for (var i = 0; i < effectList.length; i++) {
      if (!effectList[i].getPlaying()) {
        break;
      }
    }

    var audio;
    if (effectList[i]) {
      audio = effectList[i];
      audio.setVolume(that._effectVolume);
      audio.play(0, loop || false);
      return audio;
    }

    var audio = new cc.Audio();
    audio.setBuffer(buffer);
    audio.setVolume(that._effectVolume);
    audio.play(0, loop || false);
    effectList.push(audio);
    return audio;
  },

  concatAudio(buffers, sampleRate, noOfChannels) {
    let output = cc.Audio._context.createBuffer(
        noOfChannels,
        this.getTotalLength(buffers),
        sampleRate
      ),
      offset = 0;
    buffers.map(buffer => {
      output.getChannelData(0).set(buffer.getChannelData(0), offset);
      offset += buffer.length;
    });
    return output;
  },

  getTotalLength(buffers) {
    return buffers.map(buffer => buffer.length).reduce((a, b) => a + b, 0);
  },

  getBufferFromRes(resName) {
    let audio = cc.loader.getRes(resName);
    return audio._element.buffer;
  },

});

if (!cc.sys.isNative && cc.Audio.WebAudio) {
  cc.Audio.WebAudio.prototype.play = function (offset) {
    if (typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) {
      cc.soundHandler.resumeContext();
    }
    // If repeat play, you need to stop before an audio
    if (this._currentSource && !this.paused) {
      this._currentSource.stop(0);
      this.playedLength = 0;
    }
    var audio = this.context["createBufferSource"]();
    audio.buffer = this.buffer;
    audio["connect"](this._volume);
    audio.loop = this._loop;
    offset = offset || this.playedLength;
    this._startTime = this.context.currentTime - offset;
    var duration = this.buffer.duration;
    if (!this._loop) {
      if (audio.start)
        audio.start(0, offset, duration - offset);
      else if (audio["notoGrainOn"])
        audio["noteGrainOn"](0, offset, duration - offset);
      else
        audio["noteOn"](0, offset, duration - offset);
    } else {
      if (audio.start)
        audio.start(0);
      else if (audio["notoGrainOn"])
        audio["noteGrainOn"](0);
      else
        audio["noteOn"](0);
    }

    this._currentSource = audio;

    // If the current audio context time stamp is 0
    // There may be a need to touch events before you can actually start playing audio
    // So here to add a timer to determine whether the real start playing audio, if not, then the incoming touchPlay queue
    if (this.context.currentTime === 0) {
      var self = this;
      clearTimeout(this._currextTimer);
      this._currextTimer = setTimeout(function () {
        if (self.context.currentTime === 0) {
          cc.Audio.touchPlayList.push({
            offset: offset,
            audio: self
          });
        }
      }, 10);
    }
  }

  cc.Audio.touchStart = function () {
    var list = cc.Audio.touchPlayList;
    var item = null;
    while (item = list.pop()) {
      item.audio.loop = !!item.audio.loop;
      item.audio.play(item.offset);
    }
  };
}
cc.soundHandler = cc.sys.isNative ? new SoundHandlerNative() : new SoundHandlerWeb();