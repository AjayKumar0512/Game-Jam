var GamePlayLayer = cc.Layer.extend({
  ctor: function (data, gameManager) {
    this._super();
    this.gameManager = gameManager;
    this.isSafariBrowseer = isSafariBrowser();
    this.contentScalefactor = 0.5;
    if (this.gameManager.isRetinaDevice)
      this.contentScalefactor = 1;
    window.gamePlay = this;
    this.basicIphoneRes = cc.rect(0, 0, 2436, 1125);
    this.basicIpadRes = cc.rect(0, 0, 2048, 1536);
    this.startSubLevel(data);
  },
  onEnter: function () {
    this._super();
    this.setContentSize(
      cc.size(this.m_visibleSize.width, this.m_visibleSize.height)
    );
    this.addTouchListener();
    this.hintManager = new HintManager(this);
    this.scheduleUpdate();
    this.addComponents();
  },
  update(deltaTime) {
    this.runningTime += deltaTime;
    this.hintManager.update(deltaTime);
    if (!this.isBuildMode) {
      if (this.gasPressed) {
        if (this.gasSpeed < 5000)
          this.gasSpeed += 10;
        else
          this.gasSpeed = 5000;
      }
      else {
        if (this.gasSpeed > 0)
          this.gasSpeed -= 30;
        else
          this.gasSpeed = 0;
      }
      this.background.speed = this.gasSpeed;
      if (this.Vehicleparts.length > 0) {
        //based on gas speed rotating tyres
        for (var i = GameConstants.GARRAGECATEGORY.TYRE; i <= GameConstants.GARRAGECATEGORY.TYRE + 1; i++) {
          var rotation = this.Vehicleparts[i].getRotation();
          rotation += 0.003 * this.gasSpeed;
          this.Vehicleparts[i].setRotation(rotation);
        }
      }

    }
    else {
      if (this.buildStage != GameConstants.BUILDCATEGORY.COLOR &&
        this.buildStage != GameConstants.BUILDCATEGORY.DRILL) {
        if (this.buildStage == GameConstants.BUILDCATEGORY.TYRE) {
          if (this.tyre1Category != -1 && this.sockets[this.buildStage].isVisible())
            this.sockets[this.buildStage].setVisible(false);
          else if (this.tyre1Category == -1 && !this.sockets[this.buildStage].isVisible())
            this.sockets[this.buildStage].setVisible(true);

          if (this.tyre2Category != -1 && this.tyre2Socket.isVisible())
            this.tyre2Socket.setVisible(false);
          else if (this.tyre2Category == -1 && !this.tyre2Socket.isVisible())
            this.tyre2Socket.setVisible(true);
        }
        else {
          if (this.finalCategory != -1 && this.sockets[this.buildStage].isVisible())
            this.sockets[this.buildStage].setVisible(false);
          else if (this.finalCategory == -1 && !this.sockets[this.buildStage].isVisible())
            this.sockets[this.buildStage].setVisible(true);
        }
      }

      if (this.buildStage == GameConstants.BUILDCATEGORY.TYRE) {
        if (this.tyre1Category == -1) {
          if (!this.tyre1Action || this.tyre1Action._elapsed >= this.tyre1Action._duration) {
            this.tyre1Action = this.sockets[this.buildStage].runAction(cc.sequence(
              cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
            ));
          }
        }
        if (this.tyre2Category == -1) {
          if (!this.tyre2Action || this.tyre2Action._elapsed >= this.tyre2Action._duration) {
            this.tyre2Action = this.tyre2Socket.runAction(cc.sequence(
              cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
            ));
          }
        }
      }
      else {
        if (this.finalCategory == -1) {
          if (!this.socketAction || this.socketAction._elapsed >= this.socketAction._duration) {
            this.socketAction = this.sockets[this.buildStage].runAction(cc.sequence(
              cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
            ));
          }
        }
      }

    }
  },
  startSubLevel(data) {
    this.m_visibleSize = cc.director.getVisibleSize();
    this.data = data;
    this.isBuildMode = false;
    this.touchAllowed = true;
    this.gasPressed = false;
    this.selectedCategory = -1;
    this.finalCategory = -1;
    this.tyre1Category = -1;
    this.tyre2Category = -1;
    this.selectedCategories = [];
    this.colorIndex = 0;
    this.gasSpeed = 0;
    this.gasID = 0;
    this.colors = [];
    this.getColors();
    this._lastLocation = null;
    this.assignGamePlayReference();
    if (this.data.level_name == GameConstants.LEVELNAME.BUILD)
      this.isBuildMode = true;
    if (this.hintManager != null) {
      this.hintManager.runningTime = 0;
      this.hintManager.inActivityTime = 0;
    }
    this.buildStage = 0;
    this.bottomPanel = new CategorySelector(this);
    if (this.isBuildMode)
      this.addSockets();
  },
  getColors() {
    this.colors = [cc.color(0, 255, 255), cc.color(244, 134, 34), cc.color(255, 255, 0), cc.color(135, 206, 235), cc.color(120, 81, 169), cc.color(159, 211, 191)];
  },
  resetGamePlaylayer() {
    this.removeAllChildren();
  },
  //based on the song sequence it plays the corresponding tools by getting time info from data.json
  addTouchListener() {
    cc.eventManager.addListener(
      {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onTouchBegan,
        onTouchMoved: this.onTouchMoved,
        onTouchEnded: this.onTouchEnded,
        onTouchCancelled: this.onTouchEnded,
      },
      this
    );
  },

  checkForCorrectRelease(touch) {
    var pos = this.data.stages[this.buildStage].position;
    var index = this.bodyIndex * 2;
    var reqPos = cc.p(pos[index], pos[index + 1]);
    var releasedLoc = this.convertToNodeSpace(touch.getLocation());
    var distance = Math.abs(cc.pDistance(releasedLoc, reqPos));
    if (distance <= 200 && this.finalCategory == -1)
      this.setCategory(reqPos);
    else if (distance <= 200 && this.finalCategory != -1) {
      this.setNewCategory(reqPos);
      //means some other asset already placed,so we need to replace with
      //latest one and old one need to reset
      this.resetOldAsset(this.bottomPanel.categoryPos[this.finalCategory]);
    }
    else
      this.resetcategory(this.bottomPanel.categoryPos[this.selectedCategory]);
  },
  setNewCategory(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos))
    );

    if (this.buildStage == GameConstants.BUILDCATEGORY.BODY) {
      this.next.setVisible(true);
      this.bodyPath = this.bottomPanel.assets[this.selectedCategory];
      this.bodyIndex = this.selectedCategory;
    }
  },
  setCategory(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.selectedCategory = -1;
      }))
    );
    this.finalCategory = this.selectedCategory;
    if (this.buildStage == GameConstants.BUILDCATEGORY.BODY) {
      this.next.setVisible(true);
      this.bodyPath = this.bottomPanel.assets[this.selectedCategory];
      this.bodyIndex = this.selectedCategory;
    }
  },
  resetcategory(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.3, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.selectedCategory = -1;
        if (this.buildStage == GameConstants.BUILDCATEGORY.DRILL)
          this.bottomPanel.oscilateCategories();
      }))
    );

  },
  resetOldAsset(pos) {
    this.bottomPanel.categories[this.finalCategory].runAction(cc.sequence(
      cc.moveTo(0.3, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.finalCategory = this.selectedCategory;
        this.selectedCategory = -1;
      }))
    );

  },
  onTouchMoved(touch, event) {
    var self = event.getCurrentTarget();
    if (self.isBuildMode) {
      if (self.buildStage == GameConstants.BUILDCATEGORY.COLOR) {
        var box = self.selectedCategories[0].getBoundingBox();
        var bodyLoc = self.convertToNodeSpace(touch.getLocation());
        if (cc.rectContainsPoint(box, bodyLoc)) {
          var loc = self.clipper.convertToNodeSpace(touch.getLocation());
          var reqloc = cc.p(loc.x + box.width / 2, loc.y + box.height / 2);
          self.drawInLocation(reqloc);
        }
      }
      else {
        var Location = self.convertToNodeSpace(touch.getLocation());
        if (self.finalCategory != -1 && self.selectedCategory != -1 ||
          (self.buildStage == GameConstants.BUILDCATEGORY.TYRE &&
            (self.tyre1Category != -1 || self.tyre2Category != -1)))
          self.checkForBlinking(touch);
        if (self.selectedCategory != -1)
          self.bottomPanel.categories[self.selectedCategory].setPosition(Location);
      }
    }
  },
  checkForBlinking(touch) {
    if (this.buildStage == GameConstants.BUILDCATEGORY.TYRE) {
      var pos = this.data.stages[this.buildStage].position;
      var index = this.bodyIndex * 4;
      var reqPos1 = cc.p(pos[index], pos[index + 1]);
      var reqPos2 = cc.p(pos[index + 2], pos[index + 3]);
      var currentPos = this.convertToNodeSpace(touch.getLocation());
      var distance1 = Math.abs(cc.pDistance(reqPos1, currentPos));
      var distance2 = Math.abs(cc.pDistance(reqPos2, currentPos));
      if (distance1 <= 200 && this.tyre1Category != -1) {
        //now we need to make the old asset to blink
        if (!this.blinkAction || this.blinkAction._elapsed >= this.blinkAction._duration) {
          this.blinkAction = this.bottomPanel.categories[this.tyre1Category].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
          ));
        }
      }
      else if (distance2 <= 200 && this.tyre2Category != -1) {
        //now we need to make the old asset to blink
        if (!this.blinkAction || this.blinkAction._elapsed >= this.blinkAction._duration) {
          this.blinkAction = this.bottomPanel.categories[this.tyre2Category].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
          ));
        }
      }
    }
    else if (this.buildStage == GameConstants.BUILDCATEGORY.STICKER) {
      var loc = this.convertToNodeSpace(touch.getLocation());
      var body = this.selectedCategories[0].getBoundingBox();//first tool is the body we need to attach
      if (cc.rectContainsPoint(body, loc)) {
        //now we need to make the old asset to blink
        if (!this.blinkAction || this.blinkAction._elapsed >= this.blinkAction._duration) {
          this.blinkAction = this.bottomPanel.categories[this.finalCategory].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
          ));
        }
      }
    }
    else {
      var pos = this.data.stages[this.buildStage].position;
      var index = this.bodyIndex * 2;
      var reqPos = cc.p(pos[index + 0], pos[index + 1]);
      var currentPos = this.convertToNodeSpace(touch.getLocation());
      var distance = Math.abs(cc.pDistance(reqPos, currentPos));
      if (distance <= 200) {
        //now we need to make the old asset to blink
        if (!this.blinkAction || this.blinkAction._elapsed >= this.blinkAction._duration) {
          this.blinkAction = this.bottomPanel.categories[this.finalCategory].runAction(cc.sequence(
            cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1),
          ));
        }
      }
    }
  },
  assignGamePlayReference() {
    window.gameManager.spritePool.assignGamePlayReference(this);
  },
  drawInLocation(location) {
    var distance = cc.pDistance(location, this._lastLocation);
    if (distance > 1) {
      var locLastLocation = this._lastLocation;
      this.renderText.begin();
      this._brushs = [];
      var width = Number(GameConstants.WHITEDOTWIDTH.RETINA) * this.contentScalefactor;
      for (var i = 0; i < distance; i += width / 2) {
        var diffX = locLastLocation.x - location.x;
        var diffY = locLastLocation.y - location.y;
        var delta = i / distance;
        var sprite = window.gameManager.spritePool.getResourceWhiteSprite(
          res.whiteDot
        );

        sprite.attr({
          x: location.x + diffX * delta,
          y: location.y + diffY * delta,
          rotation: Math.random() * 360,
          color: this.colors[this.colorIndex],
          scale: 5,
          opacity: 30,
        });
        this._brushs.push(sprite);
      }
      for (var i = 0; i < distance; i++) {
        if (this._brushs[i] != undefined) this._brushs[i].visit();
      }
      this.renderText.end();
    }
    this._lastLocation = location;
  },
  onTouchBegan(touch, event) {

    var self = event.getCurrentTarget();
    if (self.isBuildMode) {
      var next = self.next.getBoundingBox();
      var Location = self.convertToNodeSpace(touch.getLocation());
      if (
        cc.rectContainsPoint(next, Location) && self.touchAllowed) {
        self.nextArrowClicked();
      }
      if (self.buildStage == GameConstants.BUILDCATEGORY.COLOR) {
        var body = self.selectedCategories[0].getBoundingBox();
        if (cc.rectContainsPoint(body, Location)) {
          var loc = self.clipper.convertToNodeSpace(touch.getLocation());
          self._lastLocation = cc.p(loc.x + body.width / 2, loc.y + body.height / 2);
          return true;
        }
      }
      if (self.buildStage == GameConstants.BUILDCATEGORY.STICKER && self.finalCategory != -1) {
        for (var i = 0; i < self.bottomPanel.categories.length; i++) {
          var box = self.bottomPanel.categories[i].getBoundingBox();
          var clipLoc = self.clipper.convertToNodeSpace(touch.getLocation());
          if (
            cc.rectContainsPoint(box, clipLoc) && self.touchAllowed) {
            self.touchAllowed = false;
            self.selectedCategory = i;
            self.bottomPanel.categories[self.selectedCategory].removeFromParent();
            self.addChild(self.bottomPanel.categories[self.selectedCategory]);
            self.bottomPanel.categories[self.selectedCategory].setPosition(Location);
            if (self.finalCategory == self.selectedCategory)
              self.finalCategory = -1;
            self.bottomPanel.categories[self.selectedCategory].
              stopAction(self.bottomPanel.actions[self.selectedCategory]);
            self.bottomPanel.actionCount++;
            return true;
          }
        }
      }
      for (var i = 0; i < self.bottomPanel.categories.length; i++) {
        var box = self.bottomPanel.categories[i].getBoundingBox();
        if (cc.rectContainsPoint(box, Location) && self.touchAllowed) {
          self.bottomPanel.categories[i].setLocalZOrder(5);
          if (self.buildStage == GameConstants.BUILDCATEGORY.COLOR) {
            self.colorIndex = i;
            return false;
          }
          else {
            self.touchAllowed = false;
            self.selectedCategory = i;
            if (self.finalCategory == self.selectedCategory)
              self.finalCategory = -1;
            if (self.buildStage == GameConstants.BUILDCATEGORY.TYRE) {
              if (self.tyre1Category == self.selectedCategory)
                self.tyre1Category = -1;
              if (self.tyre2Category == self.selectedCategory)
                self.tyre2Category = -1;
            }
            if (self.buildStage == GameConstants.BUILDCATEGORY.BODY && self.finalCategory == -1)
              self.next.setVisible(false);
            self.bottomPanel.categories[self.selectedCategory].
              stopAction(self.bottomPanel.actions[self.selectedCategory]);
            self.bottomPanel.actionCount++;
            return true;
          }
        }
      }

    }
    else {
      var gas = self.gas.getBoundingBox();
      var jump = self.jump.getBoundingBox();
      var Location = self.convertToNodeSpace(touch.getLocation());
      if (
        cc.rectContainsPoint(gas, Location) && self.touchAllowed) {
        self.gasID = touch.__instanceId;
        self.gasButtonPressed();
      }
      else if (
        cc.rectContainsPoint(jump, Location) && self.touchAllowed) {
        self.jumpButtonClicked();
      }
    }
    return true;
  },
  poolThresholdReached() {
    this.renderText.end();
    this.renderText.begin();
  },
  onTouchEnded(touch, event) {
    var self = event.getCurrentTarget();
    if (!self.isBuildMode) {
      if (
        self.gasID == touch.__instanceId && self.gasPressed)
        self.gasPressed = false;
    }
    else {
      if (self.blinkAction)
        self.blinkAction = null;
      if (self.buildStage == GameConstants.BUILDCATEGORY.COLOR)
        window.gameManager.spritePool.flushAllWhiteSprites();
      if (self.selectedCategory != -1) {
        //to check whether it is properly released or not
        //and setting its position
        if (self.buildStage == GameConstants.BUILDCATEGORY.STICKER)
          self.checkAndAttachSticker(touch);
        else if (self.buildStage == GameConstants.BUILDCATEGORY.TYRE)
          self.checkForTyreRelease(touch);
        else
          self.checkForCorrectRelease(touch);
      }
    }
  },
  checkForTyreRelease(touch) {
    //for tyres user can place two assets
    var pos = this.data.stages[this.buildStage].position;
    var index = this.bodyIndex * 4;
    var reqPos1 = cc.p(pos[index + 0], pos[index + 1]);
    var reqPos2 = cc.p(pos[index + 2], pos[index + 3]);
    var releasedLoc = this.convertToNodeSpace(touch.getLocation());
    var distance1 = Math.abs(cc.pDistance(releasedLoc, reqPos1));
    var distance2 = Math.abs(cc.pDistance(releasedLoc, reqPos2));
    if (distance1 <= 200 && this.tyre1Category == -1) {
      this.setTyre1(reqPos1);
    }
    else if (distance1 <= 200 && this.tyre1Category != -1) {
      //means some other asset already placed,so we need to replace with
      //latest one and old one need to reset
      this.setNewTyre1(reqPos1);
      this.resetTyre1Asset(this.bottomPanel.categoryPos[this.tyre1Category]);

    }
    else if (distance2 <= 200 && this.tyre2Category == -1) {
      this.setTyre2(reqPos2);

    }
    else if (distance2 <= 200 && this.tyre2Category != -1) {
      //means some other asset already placed,so we need to replace with
      //latest one and old one need to reset
      this.setNewTyre2(reqPos2);
      this.resetTyre2Asset(this.bottomPanel.categoryPos[this.tyre2Category]);


    }
    else
      this.resetcategory(this.bottomPanel.categoryPos[this.selectedCategory]);
  },
  resetTyre1Asset(pos) {
    this.bottomPanel.categories[this.tyre1Category].setLocalZOrder(0);
    this.bottomPanel.categories[this.tyre1Category].runAction(cc.sequence(
      cc.moveTo(0.3, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.tyre1Category = this.selectedCategory;
        this.selectedCategory = -1;
      }))
    );
  },
  resetTyre2Asset(pos) {
    this.bottomPanel.categories[this.tyre2Category].setLocalZOrder(0);
    this.bottomPanel.categories[this.tyre2Category].runAction(cc.sequence(
      cc.moveTo(0.3, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.tyre2Category = this.selectedCategory;
        this.selectedCategory = -1;
      }))
    );
  },
  setNewTyre1(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos))
    );
  },
  setTyre1(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.selectedCategory = -1;
      }))
    );
    this.tyre1Category = this.selectedCategory;
  },
  setTyre2(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos),
      cc.callFunc(() => {
        this.touchAllowed = true;
        this.selectedCategory = -1;
      }))
    );
    this.tyre2Category = this.selectedCategory;
  },
  setNewTyre2(pos) {
    this.bottomPanel.categories[this.selectedCategory].setLocalZOrder(0);
    this.bottomPanel.categories[this.selectedCategory].runAction(cc.sequence(
      cc.moveTo(0.1, pos))
    );
  },
  addClipper() {
    this.clipper = new cc.ClippingNode();
    this.clipper.setContentSize(this.selectedCategories[0].getBoundingBox());
    this.clipper.setPosition(this.selectedCategories[0].getPosition());
    this.clipper.setAlphaThreshold(0.9);
    this.addChild(this.clipper);
    let mask = new cc.Sprite(res[this.bodyPath]);
    mask.setScaleX(this.clipper.width / mask.width);
    mask.setScaleY(this.clipper.height / mask.height);
    this.clipper.stencil = mask;
  },
  checkAndAttachSticker(touch) {
    var loc = this.convertToNodeSpace(touch.getLocation());
    var body = this.selectedCategories[0].getBoundingBox();//first tool is the body we need to attach
    if (cc.rectContainsPoint(body, loc) && this.finalCategory == -1) {
      if (!this.clipper)
        this.addClipper();
      this.bottomPanel.categories[this.selectedCategory].removeFromParent();
      var stickerLoc = this.clipper.convertToNodeSpace(touch.getLocation());
      this.clipper.addChild(this.bottomPanel.categories[this.selectedCategory]);
      this.bottomPanel.categories[this.selectedCategory].setPosition(stickerLoc);
      this.touchAllowed = true;
      this.finalCategory = this.selectedCategory;
      this.selectedCategory = -1;
    }
    else if (cc.rectContainsPoint(body, loc) && this.finalCategory != -1) {
      //means some other asset already placed,so we need to replace with
      //latest one and old one need to reset
      this.bottomPanel.categories[this.selectedCategory].removeFromParent();
      var stickerLoc = this.clipper.convertToNodeSpace(touch.getLocation());
      this.clipper.addChild(this.bottomPanel.categories[this.selectedCategory]);
      this.bottomPanel.categories[this.selectedCategory].setPosition(stickerLoc);
      this.resetOldSticker();

    }
    else
      this.resetcategory(this.bottomPanel.categoryPos[this.selectedCategory]);
  },
  resetOldSticker() {
    this.bottomPanel.categories[this.finalCategory].removeFromParent();
    this.addChild(this.bottomPanel.categories[this.finalCategory]);
    this.resetOldAsset(this.bottomPanel.categoryPos[this.finalCategory]);
  },
  gasButtonPressed() {
    this.gasPressed = true;
  },
  jumpButtonClicked() {
    this.gasSpeed -= this.gasSpeed / 5;
    if (this.gasSpeed <= 0)
      this.gasSpeed = 0;
    this.background.speed = this.gasSpeed;
    if (!this.jumpAction || this.jumpAction._elapsed >= this.jumpAction._duration && this.vehicle) {
      this.jumpAction = this.vehicle.runAction(cc.sequence(cc.moveBy(0.12, cc.p(0, 100)), cc.moveBy(0.1, cc.p(0, -100))));
    }
  },
  nextArrowClicked() {
    if (this.buildStage == GameConstants.BUILDCATEGORY.BODY)
      this.adjustSocketPos();
    // rechanging the parent from layer to body
    if (this.buildStage == GameConstants.BUILDCATEGORY.TYRE) {
      if (this.tyre1Category != -1) {
        this.bottomPanel.categories[this.tyre1Category].removeFromParent();
        this.selectedCategories[0].addChild(this.bottomPanel.categories[this.tyre1Category]);
        this.bottomPanel.categories[this.tyre1Category].setPosition(
          this.selectedCategories[0].convertToNodeSpace(this.convertToWorldSpace(this.bottomPanel.categories[this.tyre1Category].getPosition())
          ));
      }
      if (this.tyre2Category != -1) {
        this.bottomPanel.categories[this.tyre2Category].removeFromParent();
        this.selectedCategories[0].addChild(this.bottomPanel.categories[this.tyre2Category]);
        this.bottomPanel.categories[this.tyre2Category].setPosition(
          this.selectedCategories[0].convertToNodeSpace(this.convertToWorldSpace(this.bottomPanel.categories[this.tyre2Category].getPosition())
          ));
      }
    }
    else {
      if (this.finalCategory != -1 && this.buildStage != GameConstants.BUILDCATEGORY.BODY) {
        this.bottomPanel.categories[this.finalCategory].removeFromParent();
        this.selectedCategories[0].addChild(this.bottomPanel.categories[this.finalCategory]);
        this.bottomPanel.categories[this.finalCategory].setPosition(
          this.selectedCategories[0].convertToNodeSpace(this.convertToWorldSpace(this.bottomPanel.categories[this.finalCategory].getPosition())
          ));
      }
    }
    this.buildStage++;
    if (this.buildStage >= this.data.stages.length)
      return;
    this.touchAllowed = false;
    if (this.buildStage < this.data.stages.length) {
      var pos = cc.p(-this.buildStage * this.m_visibleSize.width, this.background.y);
      this.next.setVisible(false);
      //fading out categories
      if (this.finalCategory != -1 && (this.buildStage - 1) != GameConstants.BUILDCATEGORY.TYRE) {
        this.selectedCategories.push(this.bottomPanel.categories[this.finalCategory]);
        this.bottomPanel.categories.splice(this.finalCategory, 1);
        this.finalCategory = -1;
      }
      else if ((this.buildStage - 1) == GameConstants.BUILDCATEGORY.TYRE) {
        if (this.tyre1Category != -1) {
          this.selectedCategories.push(this.bottomPanel.categories[this.tyre1Category]);
        }

        if (this.tyre2Category != -1) {
          this.selectedCategories.push(this.bottomPanel.categories[this.tyre2Category]);
        }
        if (this.tyre1Category != -1) {
          this.bottomPanel.categories.splice(this.tyre1Category, 1);
          if (this.tyre2Category != -1) {
            if (this.tyre2Category > this.tyre1Category)
              this.tyre2Category--;
            this.bottomPanel.categories.splice(this.tyre2Category, 1);
            this.tyre2Category = -1;
          }
          this.tyre1Category = -1;
        }

        if (this.tyre2Category != -1) {
          this.bottomPanel.categories.splice(this.tyre2Category, 1);
          this.tyre2Category = -1;
        }
      }
      this.bottomPanel.fadeOutCategories();
      this.background.runAction(cc.sequence(cc.moveTo(0.2, pos),
        cc.callFunc(() => {
          this.touchAllowed = true;
          this.bottomPanel.addBottomCategories();
          if (this.buildStage != this.data.stages.length - 1)
            this.next.setVisible(true);
          this.sockets[this.buildStage - 1].setVisible(false);
          this.tyre2Socket.setVisible(false);
          if (this.buildStage != GameConstants.BUILDCATEGORY.COLOR &&
            this.buildStage != GameConstants.BUILDCATEGORY.DRILL)
            this.sockets[this.buildStage].setVisible(true);
          if (this.buildStage == GameConstants.BUILDCATEGORY.TYRE)
            this.tyre2Socket.setVisible(true);
        })
      )
      );
    }
    if (this.buildStage - 1 == GameConstants.BUILDCATEGORY.BODY) {
      this.renderText = this.getRenderTexture();

    }

    //end case
    if (this.buildStage == this.data.stages.length - 1)
      this.next.setVisible(false);
  },
  adjustSocketPos() {
    for (var i = 0; i < this.data.stages.length; i++) {
      var pos = this.data.stages[i].position;
      var index = this.bodyIndex * 2;
      if (i == GameConstants.BUILDCATEGORY.TYRE)
        index *= 2;
      this.sockets[i].setPosition(pos[index + 0], pos[index + 1]);
      if (i == GameConstants.BUILDCATEGORY.TYRE)
        this.tyre2Socket.setPosition(pos[index + 2], pos[index + 3]);
    }
  },
  addSockets() {
    this.sockets = [];
    if (!this.bodyIndex)
      this.bodyIndex = 0;
    for (var i = 0; i < this.data.stages.length; i++) {
      var pos = this.data.stages[i].position;
      var index = this.bodyIndex * 2;
      if (i == GameConstants.BUILDCATEGORY.TYRE)
        index *= 2;
      var socket = cc.Sprite.create(res.socket);
      socket.setPosition(cc.p(pos[index + 0], pos[index + 1]));
      this.addChild(socket, 1);
      socket.setVisible(false);
      this.sockets.push(socket);
      if (i == GameConstants.BUILDCATEGORY.TYRE) {
        this.tyre2Socket = cc.Sprite.create(res.socket);
        this.tyre2Socket.setPosition(cc.p(pos[2], pos[3]));
        this.addChild(this.tyre2Socket, 1);
        this.tyre2Socket.setVisible(false);
      }
    }
    this.sockets[0].setVisible(true);
  },
  getRenderTexture() {
    if (!this.clipper)
      this.addClipper();
    let body = this.clipper.getBoundingBox();
    let winSizePixels = cc.director.getWinSizeInPixels();
    let renderTexture = cc.RenderTexture.create(body.width, body.height);
    renderTexture.setVirtualViewport(
      cc.p(0, 0),
      cc.rect(0, 0, this.m_visibleSize.width, this.m_visibleSize.height),
      cc.rect(0, 0, winSizePixels.width, winSizePixels.height)
    );
    renderTexture.setAutoDraw(false);
    this.clipper.addChild(renderTexture);
    return renderTexture;
  },
  addComponents() {
    if (this.isBuildMode)
      this.addBuildModebackground();
    else
      this.addGarrageBackground();
  },
  addBuildModebackground() {
    //for build mode appending multi backgrounds and then changing them one by one with 
    //right arrow  given below
    var bgName = this.data.stages[0].BG;
    this.background = cc.Sprite.create(res.modebg);
    this.background.setScaleX(this.m_visibleSize.width / this.background.width);
    this.background.setScaleY(
      this.m_visibleSize.height / this.background.height
    );
    this.addChild(this.background);
    for (var i = 0; i < this.data.stages.length; i++) {
      var bgName = this.data.stages[i].BG;
      if (this.gameManager.getIsSmallDevice())
        bgName += "_small";
      var bg = cc.Sprite.create(res[bgName]);
      bg.setScaleX(this.m_visibleSize.width / bg.width);
      bg.setScaleY(
        this.m_visibleSize.height / bg.height
      );
      bg.setAnchorPoint(0, 0);
      bg.setPosition(i * this.m_visibleSize.width, 0);
      this.background.addChild(bg);
    }

    //add robotic hand
    this.roboHand = cc.Sprite.create(res.hand);
    this.addChild(this.roboHand);
    this.roboHand.setScale(2);
    this.roboHand.setPosition(0, this.m_visibleSize.height / 2 - this.roboHand.height);
    //add arrow
    this.addNextArrow();

    //to add categories
    this.bottomPanel.addBottomCategories();
  },
  addNextArrow() {
    this.next = cc.Sprite.create(res.next);
    this.addChild(this.next, 1);
    this.next.setPosition(this.m_visibleSize.width / 2 - this.m_visibleSize.width * 0.1464, 0);
    this.next.setVisible(false);
  },
  addGarrageBackground() {
    var bgName = res.BUILD10;
    this.background = new ScrollingBg(bgName, this.m_visibleSize.width);
    this.addChild(this.background);
    this.background.y -= (this.m_visibleSize.height - this.background.height) / 2;
    //to add gas button
    this.addgasButton();
    //to add jump button
    this.addJumpbutton();
    this.label = new cc.LabelTTF(
      "test",
      getFontName(commonFonts.bookBagRegular),
      getFontSize(50)
    );

    this.label.setColor(cc.color(0, 107, 138));
    this.label.setPosition(0, 500);
    this.addChild(this.label);

    //to place the stored/created vehicle
    this.addVehicle();
  },
  addVehicle() {
    this.bodyType = 0;
    this.Vehicleparts = [];
    //to get body
    this.vehicle = cc.Sprite.create(res.body1);
    this.addChild(this.vehicle);
    this.vehicle.setPosition(80, 100);
    for (var i = 0; i < this.data.stages.length; i++) {
      var sprite = cc.Sprite.create(res[this.data.stages[i].assets[0]]);
      var pos = this.data.stages[i].position;
      var spritePos = this.vehicle.convertToNodeSpace(this.convertToWorldSpace(cc.p(pos[0], pos[1])));
      sprite.setPosition(spritePos);
      this.vehicle.addChild(sprite);
      this.Vehicleparts.push(sprite);
      if (i == GameConstants.GARRAGECATEGORY.TYRE) {
        var sprite = cc.Sprite.create(res[this.data.stages[i].assets[0]]);
        var pos = this.data.stages[i].position;
        var spritePos = this.vehicle.convertToNodeSpace(this.convertToWorldSpace(cc.p(pos[2], pos[3])));
        sprite.setPosition(spritePos);
        this.vehicle.addChild(sprite);
        this.Vehicleparts.push(sprite);
      }
    }
    this.vehicle.setPosition(0, 150);
    this.vehicle.setColor(this.colors[0]);
  },
  addgasButton() {
    this.gas = cc.Sprite.create(res.gas);
    this.addChild(this.gas, 1);
    this.gas.setScale(2);
    this.gas.setPosition(this.m_visibleSize.width / 2 - this.m_visibleSize.width * 0.1464,
      -this.m_visibleSize.height / 2 + this.m_visibleSize.height * 0.1953);
  },
  addJumpbutton() {
    this.jump = cc.Sprite.create(res.jump);
    this.addChild(this.jump, 1);
    this.jump.setScale(2);
    this.jump.setPosition(-this.m_visibleSize.width / 2 + this.m_visibleSize.width * 0.1464,
      -this.m_visibleSize.height / 2 + this.m_visibleSize.height * 0.1953);
  },
});
