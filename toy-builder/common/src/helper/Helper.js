var CHARACTERS = {
    BUC_BUC: 0,
    ELF_BABA: 1,
    SUPERVISOR: 2,
    OOLZOO: 3,
    LEAFEL: 4
};

var Helper = cc.Layer.extend({

    /*config = {
        type: CHARACTERS.BUC_BUC,
        gameManager: gameManager,
        touchcallback: function,
        confirmButton: true/false,

    }*/
    ctor(config) {
        this._super();
        this._voCounter = 0;
        this.gameManager = config.gameManager;
        if (!this.gameManager) {
            //console.log("GameManager not found");
        }

        this.soundManager = this.gameManager.soundManager || cc.soundHandler;
        this.type = config.type;
        this.overlay = cc.LayerColor.create(cc.color(0, 0, 0, 255 * 0.86));
        this.overlay.setVisible(false);
        this.addChild(this.overlay);
        this._touchCallback = config.touchCallback;
        this.offset = 0; //for ok button on small device
        let func = (character) => {
            this.soundManager.playSound(commonRes.click_sound);
            this.handSprite.setVisible(false);
            if (this._isVoPlaying) {
                return;
            }
            this.gameManager.addProblemEvent({
                "object": "instructer"
            }, "click");
            this._touchCallback && this._touchCallback(this);
        };
        this.character = null;
        switch (this.type) {
            case CHARACTERS.BUC_BUC: {
                this.character = new BucBucHelper(func);
            }
            break;
        case CHARACTERS.ELF_BABA: {
            this.character = new ElfBabaHelper(func);
        }
        break;
        case CHARACTERS.SUPERVISOR: {
            this.character = new SupervisorHelper(func);
        }
        break;
        case CHARACTERS.OOLZOO: {
            this.character = new OolzooHelper(func);
        }
        break;
        case CHARACTERS.LEAFEL: {
            this.character = new LeafelHelper(func);
        }
        break;
        }
        this.wSize = cc.director.getWinSize();
        this.vOrigin = cc.director.getVisibleOrigin();
        this.base = cc.Node.create();
        this.base.setAnchorPoint(cc.p(0, 0));
        this.base.setContentSize(cc.size(this.wSize.width + this.character.width * 2, 200));
        this.base.setPosition(this.vOrigin);
        this.addChild(this.base);

        this.hud = cc.Node.create();
        this.hud.setAnchorPoint(cc.p(0, 0));
        this.hud.setPosition(this.vOrigin);
        this.base.addChild(this.hud);
        this.hud.setContentSize(cc.size(this.character.width, this.character.height));
        this.hud.addChild(this.character);

        // this.overlayShadow = cc.Sprite.create(commonRes.overlay_shadow_helper_png);
        // this.overlayShadow.setAnchorPoint(cc.p(0, 0));
        // this.overlayShadow.setPosition(this.vOrigin);
        // this.overlayShadow.setVisible(false);
        // this.hud.addChild(this.overlayShadow);



        this.character.setAnimation(0, "idle", true);
        this.character.update(0);
        this.hideCharacter();

        this.handSprite = new HandGesture();
        this.addChild(this.handSprite, 1);
        this.handSprite.setRotation(-45);

        if (!config.confirmButton) {
            return;
        }
        this.base.width = this.wSize.width;
        this.base.setContentSize(cc.size(this.wSize.width, this.base.height));
        let buttonBack = cc.Sprite.create(commonRes.right_block_helper_png);
        buttonBack.setAnchorPoint(cc.p(1, 0));
        buttonBack.setPosition(cc.p(this.base.width, 0));
        this.base.addChild(buttonBack);
        this.confirmButton = new ccui.Button(getSpriteNameForButton(commonRes.active_bttn_helper_png), getSpriteNameForButton(commonRes.active_bttn_helper_png), getSpriteNameForButton(commonRes.inactive_bttn_helper_png), ccui.Widget.PLIST_TEXTURE);
        this.offset = this.gameManager.getIsSmallDevice() ? this.confirmButton.getBoundingBox().width / 9 : 0;
        //this.confirmButton.setAnchorPoint(cc.p(1, 0))
        this.confirmButton.setPosition(cc.p(buttonBack.width - this.confirmButton.width * 0.5 - this.offset, this.confirmButton.height * 0.5 + this.offset));
        //this.hideButton();
        buttonBack.addChild(this.confirmButton);
        this.confirmButton.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED: {
                    this.gameManager.addProblemEvent({
                        "object": "OK button"
                    }, "click");
                    this._confirmCallback && this._confirmCallback();
                    this.confirmButton.setScale(1);
                }
                break;
            case ccui.Widget.TOUCH_BEGAN: {
                this.confirmButton.setScale(0.9);
            }
            break;
            case ccui.Widget.TOUCH_CANCELED: {
                this.confirmButton.setScale(1);
            }
            break;
            default:
                break;
            }
        }, this);
        // let label = new ccui.Text("OK", getFontName(commonFonts.kgPrimary), 72);
        // label.enableOutline(cc.color(118, 40, 16, 255), 6);
        // label.setPosition(cc.p(this.confirmButton.width * 0.5, this.confirmButton.height * 0.5));
        // this.confirmButton.addChild(label);

    },
    setIdleAnimation() {
        //this function is to be implemented only in case of manual level switching
        this.character.setAnimation(0, "idle", true);

    },
    setSpeakAnimation() {
        this.character.setAnimation(0, "talk", true);
    },
    onEnter() {
        this._super();
    },

    getConfirmButton() {
        return this.confirmButton;
    },

    setConfirmButtonEnabled(isEnable) {
        if (this.confirmButton) {
            this.confirmButton.setEnabled(isEnable);
        }
    },
    showButtonHelp(showOverlay = false) {
        if (!this.confirmButton) {
            return;
        }
        this.overlay.setVisible(showOverlay);
        this.handSprite.setVisible(true);
        //this.setConfirmButtonEnabled(true);
        this.handSprite.setScaleX(-1);
        this.handSprite.setRotation(45);
        let node = this.confirmButton.parent;
        this.handSprite.runClickAnimation(cc.pAdd(this.confirmButton.parent.getPosition(),
            cc.pAdd(this.vOrigin, cc.p(-40 - node.width * (node.getAnchorPoint().x - 0.5), -node.height * (node.getAnchorPoint().y - 0.5)))));
    },
    hideButtonHelp() {
        this.overlay.setVisible(false);
        this.handSprite.setVisible(false);
        //this.setConfirmButtonEnabled(true);
    },

    showHelp(showOverlay = true) {
        this.overlay.setVisible(showOverlay);
        this.handSprite.setVisible(true);
        this.handSprite.setScaleX(1);
        this.handSprite.setRotation(-45);
        //this.setConfirmButtonEnabled(false);
        this.handSprite.runClickAnimation(cc.pAdd(this.character.getPosition(), cc.pAdd(this.vOrigin, cc.p(80, 0))));
    },
    hideHelp() {
        this.overlay.setVisible(false);
        this.handSprite.setVisible(false);
        //this.setConfirmButtonEnabled(true);
    },
    setTouchCallback(callback) {
        this._touchCallback = callback;
    },
    setConfirmButtonCallback(callback) {
        this._confirmCallback = callback;

    },
    stopVoInstruction() {
        if (this.soundId) {
            this.soundManager.stopSound(this.soundId);
        }
    },
    playVOInstruction(vo, cb, inBetweenDelay) {
        this._isVoPlaying = true;
        this.hud.stopAllActions();
        let speed = 3;
        let t = (1 - this.hud.getScale()) / speed;
        //this.overlayShadow.setVisible(true);
        //this.character.runAction(cc.moveTo(t, cc.pAdd(this.character._currPosition, cc.p(20, 20))));
        this._voCounter++;
        //this.hud.runAction(cc.sequence(cc.callFunc(()=> {
        //this.character.setMix('idle','talk',2);
        this.character.setAnimation(0, "talk", true);
        let tempFunc = this.soundManager[typeof (vo) == 'string' ? "playSound" : "playSoundArray"];
        //tempFunc = this.soundManager.playSound;
        this.soundId = tempFunc(vo, () => {
            this._voCounter--;
            if (this._voCounter != 0) {
                cb && cb();
                return;
            }
            this.soundId = null;
            this._isVoPlaying = false;
            //this.character.setMix('talk','idle',2);
            this.character.setAnimation(0, "idle", true);
            let t = (this.hud.getScale() - 1) / speed;
            if (t < 0) {
                t == 0;
            }
            //this.overlayShadow.setVisible(false);
            this.character.runAction(cc.moveTo(t, this.character._currPosition));
            cb && cb();
        }, inBetweenDelay);
        // }, this)));

    },
    hideCharacter(shouldAnimate, cb) {
        let pos = cc.p(-this.hud.width, -this.hud.height);
        if (!shouldAnimate) {
            this.hud.setPosition(pos);
            cb && cb();
            return;
        }
        this.hud.runAction(cc.sequence(cc.moveTo(0.5, pos),
            cc.callFunc(function () {
                cb && cb();
            }, this)));
    },
    showCharacter(shouldAnimate, cb) {
        let pos = this.vOrigin;
        if (!shouldAnimate) {
            this.hud.setPosition(pos);
            cb && cb();
            return;
        }
        this.hud.runAction(cc.sequence(cc.moveTo(0.5, pos),
            cc.callFunc(function () {
                cb && cb();
            }, this)));
    },
    hideButton(shouldAnimate, cb) {
        if (!this.confirmButton) {
            this.base.setContentSize(cc.size(this.wSize.width + this.character.width * 2, this.base.height));
            cb && cb();
            return;
        }
        let pos = cc.p(this.confirmButton.parent.width * 0.5 - this.offset, -this.confirmButton.parent.height * 0.5 + this.offset);
        if (!shouldAnimate) {
            this.confirmButton.setPosition(pos);
            this.confirmButton.setVisible(false);
            cb && cb();
            return;
        }
        this.confirmButton.runAction(cc.sequence(cc.moveTo(0.5, pos), cc.callFunc(function () {
            this.confirmButton.setVisible(false);
            cb && cb();
        }, this)));
    },
    showButton(shouldAnimate, cb) {
        if (!this.confirmButton) {
            cb && cb();
            return;
        }
        let pos = cc.p(this.confirmButton.parent.width * 0.5 - this.offset, this.confirmButton.parent.height * 0.5 + this.offset);
        this.confirmButton.setVisible(true);
        if (!shouldAnimate) {
            this.confirmButton.setPosition(pos);
            cb && cb();
            return;
        }
        this.confirmButton.runAction(cc.sequence(cc.moveTo(0.5, pos),
            cc.callFunc(function () {
                cb && cb();
            }, this)));

    }
});
var Character = sp.SkeletonAnimation.extend({

    ctor: function (type, tcb, json, atlas, scale = 1) {
        this._super(json, atlas, getNonRetinaValue(scale));
        this.type = type;
        this.update(0);
        let box = this.getBoundingBox();
        this.width = box.width;
        this.height = box.height;
        this._touchCallback = tcb;
        this.setAnchorPoint(cc.p(0, 0));
        this._currPosition = cc.p(this.width * 0.17, this.height * 0.24);
        //this.setRotation(30);
    },
    onEnter() {
        this._super();
        this.setPosition(this._currPosition);
        this.registerTouches();
    },
    onExit() {
        this.removeTouches();
        this._super();
    },
    registerTouches() {
        if (this.listener) {
            this.removeTouches();
        }
        this.listener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);
    },
    removeTouches() {
        if (this.listener) {
            cc.eventManager.removeListener(this._touchListener);
            this.listener = null;
        }
    },
    onTouchBegan(touch, event) {
        var target = event.getCurrentTarget();
        var box = target.getBoundingBox();
        var location = touch.getLocation();
        location = target.getParent().convertToNodeSpace(location);

        if (cc.rectContainsPoint(box, location)) {
            target._touchCallback && target._touchCallback(target);
        }
    }

});

var BucBucHelper = Character.extend({
    ctor(touchCallback) {
        this._super(CHARACTERS.BUC_BUC, touchCallback, commonRes.bub_buc_helper_json, commonRes.bub_buc_helper_atlas);
        //this._currPosition = cc.p(this.width * 0.15, this.height * 0.15);
        //this.setPosition(this._currPosition);
    }

});

var ElfBabaHelper = Character.extend({
    ctor(touchCallback) {
        this._super(CHARACTERS.ELF_BABA, touchCallback, commonRes.elf_baba_helper_json, commonRes.elf_baba_helper_atlas);
        this._currPosition = cc.p(this.width * 0.28, this.height * 0.24);
        this.setPosition(this._currPosition);
        //this.setRotation(-30);
    },
    onEnter() {
        this._super();
    }

});
var SupervisorHelper = Character.extend({
    ctor(touchCallback) {
        this._super(CHARACTERS.SUPERVISOR, touchCallback, commonRes.supervisor_helper_json, commonRes.supervisor_helper_atlas);
        this._currPosition = cc.p(this.width * 0.28, this.height * 0.24);
        this.setPosition(this._currPosition);
    },
});

var OolzooHelper = Character.extend({
    ctor(touchCallback) {
        this._super(CHARACTERS.OOLZOO, touchCallback, commonRes.oolzoo_helper_json, commonRes.oolzoo_helper_atlas);
        // this._currPosition = cc.p(this.width * 0.28, this.height * 0.24);
        // this.setPosition(this._currPosition);
    },
});