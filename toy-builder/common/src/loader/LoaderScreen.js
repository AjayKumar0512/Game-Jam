/**
 * <p>cc.LoaderScene is a scene that you can load it when you loading files</p>
 * <p>cc.LoaderScene can present thedownload progress </p>
 * @class
 * @extends cc.Scene
 * @example
 * var lc = new LoaderSceen();
 */
LoaderScreen = cc.Scene.extend({
    _interval: null,
    _logo: null,
    _className: "LoaderScreen",
    cb: null,
    target: null,

    /**
     * Contructor of cc.LoaderScene
     * @returns {boolean}
     */
    init: function () {
        // console.log("LoaderScreen init");
        var self = this;

        // bg
        this._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        this.addChild(this._bgLayer, 0);
        this._bgLayer.ignoreAnchorPointForPosition(true);

        this.logoWidth = 125;
        this.logoHeight = 115;
        this.col = 7;
        this.row = 3;
        this.counter = 0;

        this.progressWidth = 598;
        this.progressHeight = 44;

        this.progressCurrentPercent = 0;
        this.progressToPrecent = 0;

        let progressBarSprite = new cc.Sprite(commonLoaderRes.Loader_Bar_png);
        self.progressWidth = progressBarSprite.width;
        self.progressHeight = progressBarSprite.height * 0.5;
        self._initProgressLoader(cc.visibleRect.center);

        let horseSprite = new cc.Sprite(commonLoaderRes.Loader_Horse_Sheet_png);
        self.logoWidth = horseSprite.width / self.col;
        self.logoHeight = horseSprite.height / self.row;
        self._initLoadingAnimation(cc.visibleRect.center);

        return true;
    },

    _initLoadingAnimation: function (centerPos) {
        this._logo = new cc.Sprite(commonLoaderRes.Loader_Horse_Sheet_png, cc.rect(0, 0, this.logoWidth, this.logoHeight));
        this._logo.setAnchorPoint(cc.p(0.5, 0));
        this._logo.setPosition(centerPos);
        this._bgLayer.addChild(this._logo, 10);
    },

    _updateSpriteAnimation: function (dt) {
        if (this._logo) {
            if (this.counter < this.col) {
                this._logo.setTextureRect(cc.rect((this.counter % this.col) * this.logoWidth, 0, this.logoWidth, this.logoHeight));
            }
            else if (this.counter < this.col * 2) {
                this._logo.setTextureRect(cc.rect((this.counter % this.col) * this.logoWidth, this.logoHeight, this.logoWidth, this.logoHeight));
            }
            else if (this.counter < this.col * 3) {
                this._logo.setTextureRect(cc.rect((this.counter % this.col) * this.logoWidth, this.logoHeight * 2, this.logoWidth, this.logoHeight));
            }
            this.counter++;
            if (this.counter >= this.col * this.row) {
                this.counter = 0;
            }
        }
    },

    _initProgressLoader: function (centerPos) {

        this._progressBarContainer = new cc.Sprite(commonLoaderRes.Loader_Bar_png, cc.rect(0, this.progressHeight, this.progressWidth, this.progressHeight));
        this._progressBarContainer.setAnchorPoint(cc.p(0, 1));
        this._progressBarContainer.setPosition(cc.p(centerPos.x - this.progressWidth * 0.5, centerPos.y));
        this._bgLayer.addChild(this._progressBarContainer);

        this._progressBar = new cc.Sprite(commonLoaderRes.Loader_Bar_png, cc.rect(0, 0, 0, this.progressHeight));
        this._progressBar.setAnchorPoint(this._progressBarContainer.getAnchorPoint());
        this._progressBar.setPosition(this._progressBarContainer.getPosition());
        this._bgLayer.addChild(this._progressBar, 10);

        this._progressBarGlow = new cc.Sprite(commonLoaderRes.Loader_Bar_Glow_png);
        this._progressBarGlow.setAnchorPoint(this._progressBarContainer.getAnchorPoint());
        this._progressBarGlow.setPosition(this._progressBarContainer.getPosition());
        this._progressBarGlow.setVisible(false);
        this._bgLayer.addChild(this._progressBarGlow, 12);
    },

    _updateProgressBar: function (percent) {
        if (this._progressBar) {
            var width = this.progressWidth * percent / 100;
            if (percent >= 1 && percent <= 99)
                this._progressBarGlow.setVisible(true);
            else
                this._progressBarGlow.setVisible(false);

            this._progressBar.setTextureRect(cc.rect(0, 0, width, this.progressHeight));
            var _progressBarBounds = this._progressBar.getBoundingBox();
            var _progressBarGlowBounds = this._progressBarGlow.getBoundingBox();
            this._progressBarGlow.setPosition(cc.p(this._progressBar.x + _progressBarBounds.width - _progressBarGlowBounds.width / 2, this._progressBarGlow.y))
            _progressBarBounds = null;
            _progressBarGlowBounds = null;
        }
    },

    update: function (dt) {
        if (this.progressToPrecent > this.progressCurrentPercent) {
            this.progressCurrentPercent++;
            this._updateProgressBar(this.progressCurrentPercent);
        } else if (this.progressToPrecent == 100) {
            this._updateProgressBar(this.progressCurrentPercent);
            this.unscheduleUpdate();
            var callFun = cc.callFunc(() => {
                try{
                  if( window.GAMES_ON_WEB && 
                      window.top.SPWidget && 
                      typeof(window.top.SPWidget.playableStartedHandler) == 'function') {
                    window.top.SPWidget.playableStartedHandler(window.GameData && GameData.event_properties);
                  }
                } catch(err){}

                if ((((typeof (window.GAMES_ON_WEB) != 'undefined' && window.GAMES_ON_WEB) || (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment)) && isPlayButtonRequired())) {
                    this._hideHorseLoader();
                    this._createPlayButton();
                } else {
                    this._loadNextScreen();
                }
            });
            this.runAction(cc.sequence(cc.delayTime(0.2), callFun));
        }
    },

    _hideHorseLoader: function () {
        this._progressBar.setVisible(false);
        this._progressBarGlow.setVisible(false);
        this._progressBarContainer.setVisible(false);
        this._logo.setVisible(false);
    },

    _createPlayButton: function () {
        let playButton = new cc.MenuItemSprite(new cc.Sprite(commonLoaderRes.Play_Button_png),
            new cc.Sprite(commonLoaderRes.Play_Button_png), new cc.Sprite(commonLoaderRes.Play_Button_png), function () {
                cc.audioEngine.playEffect(commonLoaderRes.click_sound_loader);
                this._loadNextScreen();
            }.bind(this));

        playButton.setScale(0.5);
        let menu = cc.Menu.create(playButton);
        this.addChild(menu, 10);
        menu.setPosition(cc.visibleRect.center);
    },

    _loadNextScreen: function () {
        // console.log("LoaderScreen loadNextScreen");
        if (this.cb)
            this.cb.call(this.target);
    },

    /**
     * custom onEnter
     */
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.scheduleUpdate();
        this.schedule(this._startLoading, 0.2);
        this.schedule(this._updateSpriteAnimation, 0.03);
        this._resetCanvasFocus();
    },
    /**
     * custom onExit
     */
    onExit: function () {
        this.removeAllChildren(true);
        cc.Node.prototype.onExit.call(this);
    },
    _resetCanvasFocus: function () {
        cc && cc._canvas && cc._canvas.focus();
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if (cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        if(res) {
            cc.loader.load(res,
                function (result, count, loadedCount) {
                    var percent = (loadedCount / count * 100) | 0;
                    self.progressToPrecent = Math.min(percent, 100);
                }, function () {
                    self.progressToPrecent = 100;
                });
        }
    },

});

/**
 * <p>cc.LoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @param target
 * @returns {cc.LoaderScene|*}
 */

LoaderScreen.preload = function (resources, cb, target) {
    var _cc = cc;
    if (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment) {
        _cc.loaderScene = null;//added this for gamify, to load next level from text editor
    }
    let g_resources = [];
    g_resources.push(commonLoaderRes.Loader_Bar_Glow_png);
    g_resources.push(commonLoaderRes.Loader_Bar_png);
    g_resources.push(commonLoaderRes.Loader_Horse_Sheet_png);

    let func = () => {
        window.GAME_LOADED_AT = (new Date()).toString();
        if (window.GAMES_ON_WEB && window.parent != window) {
            window.parent && window.parent.SPWidget && window.parent.SPWidget.hideWidgetLoader();
        }
        _cc.loaderScene = new LoaderScreen();
        _cc.loaderScene.init();
        _cc.loaderScene.initWithResources(resources, cb, target);
        _cc.director.runScene(_cc.loaderScene);
    };
    cc.loader.load(g_resources,
        function (result, count, loadedCount) {
        }, function () {
            func();
        }
    );
};


LoaderScreen.showLoader = function () {
    var _cc = cc;
    if (typeof (isGamifyDevelopment) != 'undefined' && isGamifyDevelopment) {
        _cc.loaderScene = null;//added this for gamify, to load next level from text editor
    }
    let g_resources = [];
    g_resources.push(commonLoaderRes.Loader_Bar_Glow_png);
    g_resources.push(commonLoaderRes.Loader_Bar_png);
    g_resources.push(commonLoaderRes.Loader_Horse_Sheet_png);

    let func = () => {
        window.GAME_LOADED_AT = (new Date()).toString();
        if (window.GAMES_ON_WEB && window.parent != window) {
            window.parent && window.parent.SPWidget && window.parent.SPWidget.hideWidgetLoader();
        }
        _cc.loaderScene = new LoaderScreen();
        _cc.loaderScene.init();
        _cc.director.runScene(_cc.loaderScene);
    };
    cc.loader.load(g_resources,
        function (result, count, loadedCount) {
        }, function () {
            func();
        }
    );
};

LoaderScreen.startLoader = function (resources, cb) {
    cc.loaderScene.initWithResources(resources, cb);
    cc.loaderScene._startLoading();
};