var SpineUtils = sp.SkeletonAnimation.extend({

  ctor: function (json, atlas, scale = 1) {
    this._super(json, atlas, scale);
    this.attachmentArray = [];
    this.scheduleUpdate();
  },

  update: function (dt) {
    if (!cc.sys.isNative)
      this._super(dt);
    this.updateAttachment();
  },

  addAttachmentNode: function (node, attachmentName, scale = cc.p(1, 1), option = null) {
    this.attachmentArray.push({
      _node: node,
      _name: attachmentName,
      _scale: scale,
      _option: option,
    });
  },

  updateAttachmentNode: function (node, attachmentName, scale = cc.p(1, 1)) {
    this.attachmentArray[0]._scale = scale;
  },

  updateAttachment: function () {

    for (var z = 0; z < this.attachmentArray.length; z++) {
      var attachmentNode = this.attachmentArray[z];
      var node = attachmentNode._node;
      if (node) {
        var attachmentName = attachmentNode._name;
        var slotName = attachmentNode._option ? (attachmentNode._option.slotName ? attachmentNode._option.slotName : attachmentName) : attachmentName;
        var boneName = attachmentNode._option ? (attachmentNode._option.boneName ? attachmentNode._option.boneName : attachmentName) : attachmentName;
        var attachment = this.getAttachment(slotName, attachmentName);
        if (attachment) {
          if (!cc.sys.isNative)
            this.updateRegionAttachmentSlot(attachment, boneName);

          var size = node.getContentSize();
          var scale = attachmentNode._scale;
          var leftOffset = 0, rightOffset = 0;;
          if (cc.sys.isNative && this.getScaleX() < 0) {
            leftOffset = getFontSize(50);
          }
          if (attachmentNode._option && attachmentNode._option.offset) {
            leftOffset = attachmentNode._option.offset.x;
            rightOffset = attachmentNode._option.offset.y;
          }
          node.setPosition(cc.p(attachment.myPosX + leftOffset, attachment.myPosY + rightOffset));
          node.setRotation(attachment.myRotation);
          if (!node.scaleUpdateFlag) {
            node.setScaleX(attachment.myWidth / size.width * scale.x);
            node.setScaleY(attachment.myHeight / size.height * scale.y);
          }
        }
      }
    }
  },

  updateRegionAttachmentSlot: function (attachment, boneName) {
    var points = [];
    var vertices = spine.Utils.setArraySize(new Array(), 8, 0);
    var bone = this.findBone(boneName);
    attachment.computeWorldVertices(bone, vertices, 0, 2);
    var VERTEX = spine.RegionAttachment;
    points.length = 0;
    points.push(cc.p(vertices[VERTEX.OX1], vertices[VERTEX.OY1])); //BOTTOM LEFT
    points.push(cc.p(vertices[VERTEX.OX2], vertices[VERTEX.OY2])); //UPPER LEFT
    points.push(cc.p(vertices[VERTEX.OX3], vertices[VERTEX.OY3])); //UPPER RIGHT
    points.push(cc.p(vertices[VERTEX.OX4], vertices[VERTEX.OY4])); //BOTTOM RIGHT

    attachment.myRotation = Math.atan((points[0].x - points[1].x) / (points[0].y - points[1].y)) * (180 / Math.PI);
    attachment.myWidth = Math.abs(points[0].x - points[2].x);
    attachment.myHeight = Math.abs(points[0].y - points[2].y);
    attachment.myPosX = points[0].x; //BOTTOM LEFT X
    attachment.myPosY = points[0].y; //BOTTOM LEFT Y
    attachment.myPosX += attachment.myWidth / 2;
    attachment.myPosY += attachment.myHeight / 2;
  },

  fadeOutSpine: function (duration, cb, _opacity) {
    let dt = 10;
    let opacity = (((_opacity == 0) || _opacity) ? (_opacity / 255) : 1) / dt;
    let count = dt;
    if (duration == 0) {
      for (let index = 0; index < this._skeleton.slots.length; index++) {
        let slot = this._skeleton.slots[index];
        if (slot) {
          slot.color.a = (opacity * count);
        }
      }
      cb && cb();
    } else {
      let delay = duration / dt;
      let tag = 10000;
      let action = cc.repeatForever(cc.sequence(
        cc.delayTime(delay),
        cc.callFunc(() => {
          for (let index = 0; index < this._skeleton.slots.length; index++) {
            let slot = this._skeleton.slots[index];
            if (slot && (slot.color.a >= (opacity * count))) {
              slot.color.a = (opacity * count);
            }
          }
          count--;
          if (count < 0) {
            this.stopActionByTag(tag);
            cb && cb();
          }
        })
      ));
      action.setTag(tag);
      this.runAction(action);
    }
  }
});