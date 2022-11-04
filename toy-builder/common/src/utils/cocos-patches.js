(function (window) {

  if (window.GAMES_IN_APP && window.BUILD) {
    // this patch is for sound issue in omni app in case of background foreground//
    var _windowTimeIntervalId = 0;
    var _windowTimeFunHash = {};
    var WindowTimeFun = cc.Class.extend({
      _code: null,
      _intervalId: 0,
      ctor: function (code) {
        this._intervalId = _windowTimeIntervalId++;
        this._code = code;
      },
      fun: function () {
        if (!this._code) return;
        var code = this._code;
        if (typeof code == "string") {
          Function(code)();
        } else if (typeof code == "function") {
          code.apply(null, this._args);
        }
      }
    });
    var clearInterval = function (intervalId) {
      var target = _windowTimeFunHash[intervalId];
      if (target) {
        cc.director.getScheduler().unschedule(target._intervalId + "", target);
        delete _windowTimeFunHash[intervalId];
      }
    };
    var clearTimeout = clearInterval;

    function setTimeout(code, delay) {
      var target = new WindowTimeFun(code);
      if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
      var original = target.fun;
      target.fun = function () {
        original.apply(this, arguments);
        clearTimeout(target._intervalId);
      }
      cc.director.getScheduler().schedule(target.fun, target, delay / 1000, 0, 0, false, target._intervalId + "");
      _windowTimeFunHash[target._intervalId] = target;
      return target._intervalId;
    };
  }

  function getCDNPath(texturePath) {
    var distIndex = texturePath.indexOf('/assets/dist/');
    if (distIndex > 0) {
      texturePath = asset_path(texturePath.substr(distIndex + 8));
    }
    return texturePath;
  }

  if (typeof (window.sp) != 'undefined' && typeof (sp._atlasLoader) != 'undefined') {
    sp._atlasLoader.load = function (line) {
      var texturePath = cc.path.join(cc.path.dirname(this.spAtlasFile), line);
      texturePath = getCDNPath(texturePath);
      var texture = cc.textureCache.addImage(texturePath);
      var tex = new sp.SkeletonTexture({
        width: texture.getPixelsWide(),
        height: texture.getPixelsHigh()
      });
      tex.setRealTexture(texture);
      return tex;
    };
  }
  cc.EGLView.prototype._orientationChange = (() => {
    cc.view._orientationChanging = true;
    setTimeout(function () {
      cc.view._orientationChanging = false;
      cc.view._resizeEvent();
    }, 300);
  });


  ccui.Text = cc.LabelTTF;

  cc.LabelTTF.prototype.setColor = cc.LabelTTF.prototype.setTextColor = function (fillColor) {
    this.setFontFillColor(fillColor);
  }

  cc.LabelTTF.prototype.getTextAreaSize = function () {
    return this.getDimensions();
  }
  
  cc.LabelTTF.prototype.setFontFillColor = function (fillColor) {
    var locTextFillColor = this._textFillColor;
    if (locTextFillColor.r !== fillColor.r || locTextFillColor.g !== fillColor.g || locTextFillColor.b !== fillColor.b) {
      locTextFillColor.r = fillColor.r;
      locTextFillColor.g = fillColor.g;
      locTextFillColor.b = fillColor.b;
      this._renderCmd._setColorsString();
      this._needUpdateTexture = true;

      if (isAarch64Device()) {
        this._renderCmd._setColorsString();
        this._renderCmd._updateTexture();
      }
      //force update as color was not getting updated once set after label creation
      this._setUpdateTextureDirty();
      this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
  }

  cc.LabelTTF.prototype.setTextAreaSize = function (size) {
    this.setDimensions(size);
  }

  cc.LabelTTF.prototype.setTextVerticalAlignment = function (verticalAlignment) {
    this.setVerticalAlignment(verticalAlignment);
  }

  cc.LabelTTF.prototype.setTextHorizontalAlignment = function (alignment) {
    this.setHorizontalAlignment(alignment);
  }

  cc.LabelTTF.prototype.enableOutline = function (strokeColor, strokeSize) {
    this.enableStroke(strokeColor, strokeSize);
  }

  cc.LabelTTF.prototype.ctor = function (text, fontName, fontSize, strokeColor = cc.color(255, 255, 255, 255), strokeSize = 0, dimensions, hAlignment, vAlignment) {
    cc.Sprite.prototype.ctor.call(this);

    this._dimensions = cc.size(0, 0);
    this._hAlignment = cc.TEXT_ALIGNMENT_LEFT;
    this._vAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    this._opacityModifyRGB = false;
    this._fontName = "Arial";

    this._shadowEnabled = false;
    this._shadowOffset = cc.p(0, 0);
    this._shadowOpacity = 0;
    this._shadowBlur = 0;

    this._strokeColor = strokeColor;
    if (strokeSize > 0) {
      this._strokeSize = strokeSize;
      this._strokeEnabled = true;
    } else {
      this._strokeEnabled = false;
      this._strokeSize = 0;
    }

    this._textFillColor = cc.color(255, 255, 255, 255);
    this._strokeShadowOffsetX = 0;
    this._strokeShadowOffsetY = 0;
    this._needUpdateTexture = false;

    this._lineWidths = [];
    this._renderCmd._setColorsString();
    this._textureLoaded = true;

    if (fontName && fontName instanceof cc.FontDefinition) {
      this.initWithStringAndTextDefinition(text, fontName);
    } else {
      cc.LabelTTF.prototype.initWithString.call(this, text, fontName, fontSize, dimensions, hAlignment, vAlignment);
    }
  }

  cc.LabelTTF.prototype.setString = function (text) {
    text = String(text);
    if (this._originalText !== text) {
      this._originalText = text + "";

      this._updateString();
      // fix for https://studypad.atlassian.net/browse/CQ-5533
      if (isAarch64Device()) {
        this._renderCmd._setColorsString();
        this._renderCmd._updateTexture();
      }
      // Force update
      this._setUpdateTextureDirty();
      this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
  }

  cc.LabelTTF.prototype.setDimensions = function (dim, height) {
    var width;
    if (height === undefined) {
      width = dim.width;
      height = dim.height;
    } else
      width = dim;

    if (width !== this._dimensions.width || height !== this._dimensions.height) {
      this._dimensions.width = width;
      this._dimensions.height = height;
      this._updateString();

      if (isAarch64Device()) {
        this._renderCmd._setColorsString();
        this._renderCmd._updateTexture();
      }

      // Force update
      this._setUpdateTextureDirty();
      // this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
  }

  cc.LabelTTF.prototype.setFontSize = function (fontSize) {
    if (this._fontSize !== fontSize) {
      this._fontSize = fontSize;
      this._renderCmd._setFontStyle(this._fontName, this._fontSize, this._fontStyle, this._fontWeight);

      if (isAarch64Device()) {
        this._renderCmd._setColorsString();
        this._renderCmd._updateTexture();
      }

      // Force update
      this._setUpdateTextureDirty();
      // this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
  }

  if (window.GAMES_ON_WEB) {
    cc.loader.getXMLHttpRequest = function () {
      var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
      try {
        xhr.timeout = cc._xhrTimeout;
      } catch (err) {}

      if (xhr.ontimeout === undefined) {
        xhr._timeoutId = -1;
      }
      return xhr;
    }

    cc._tmp.WebGLTextureCache = function () {
      var _p = cc.textureCache;
      _p.handleLoadedTexture = function (url, img) {
        var locTexs = this._textures,
          tex, ext;
        //remove judge(webgl)
        if (!cc.game._rendererInitialized) {
          locTexs = this._loadedTexturesBefore;
        }
        tex = locTexs[url];
        if (!tex) {
          tex = locTexs[url] = new cc.Texture2D();
          tex.url = url;
        }
        tex.initWithElement(img);
        ext = cc.path.extname(url);
        if (ext === ".png") {
          tex.handleLoadedTexture(true);
        } else {
          tex.handleLoadedTexture();
        }
        return tex;
      };

      _p.addImage = function (url, cb, target) {
        cc.assert(url, cc._LogInfos.Texture2D_addImage_2);
        url = getCDNPath(url);

        var locTexs = this._textures;
        //remove judge(webgl)
        if (!cc.game._rendererInitialized) {
          locTexs = this._loadedTexturesBefore;
        }
        var tex = locTexs[url] || locTexs[cc.loader._getAliase(url)];
        if (tex) {
          if (tex.isLoaded()) {
            cb && cb.call(target, tex);
            return tex;
          } else {
            tex.addEventListener("load", function () {
              cb && cb.call(target, tex);
            }, target);
            return tex;
          }
        }

        tex = locTexs[url] = new cc.Texture2D();
        tex.url = url;
        var basePath = cc.loader.getBasePath ? cc.loader.getBasePath() : cc.loader.resPath;
        cc.loader.loadImg(cc.path.join(basePath || "", url), function (err, img) {
          if (err)
            return cb && cb.call(target, err);

          var texResult = cc.textureCache.handleLoadedTexture(url, img);
          cb && cb.call(target, texResult);
        });

        return tex;
      };

      _p.addImageAsync = _p.addImage;
      _p = null;
    };
  }

  if (!cc.sys.isNative) {
    //Patch To GreyScale Spines
    if (sp.SkeletonAnimation) {
      sp.SkeletonAnimation.prototype.setBrightState = function (state) {
        this._brightState = state;
        this._renderCmd.setBrightState(state);
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.contentDirty);
      }
    }

    if (sp.Skeleton.WebGLRenderCmd) {
      sp.Skeleton.WebGLRenderCmd.prototype.setBrightState = function (state) {
        if (state === ccui.Scale9Sprite.state.NORMAL) {
          this.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR));
        } else if (state === ccui.Scale9Sprite.state.GRAY) {
          this.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY));
        }
      }
    }

    if (sp.Skeleton.CanvasRenderCmd) {
      sp.Skeleton.CanvasRenderCmd.prototype.setBrightState = function (state) {
        if (this._brightState === state) return;
        this._brightState = state;
        var loaded = function (sprite, texture, attachment) {
          var rendererObject = attachment.region;
          var rect = new cc.Rect(rendererObject.x, rendererObject.y, rendererObject.width, rendererObject.height);
          sprite.initWithTexture(texture, rect, rendererObject.rotate, false);
          sprite._rect.width = attachment.width;
          sprite._rect.height = attachment.height;
          sprite.setContentSize(attachment.width, attachment.height);
          sprite.setRotation(-attachment.rotation);
          sprite.setScale(rendererObject.width / rendererObject.originalWidth * attachment.scaleX,
            rendererObject.height / rendererObject.originalHeight * attachment.scaleY);
        }

        var node = this._node,
          i, n, slot, slotNode;
        var locSkeleton = node._skeleton,
          drawOrder = locSkeleton.drawOrder;
        for (i = 0, n = drawOrder.length; i < n; i++) {
          slot = drawOrder[i];
          attachment = slot.attachment;
          slotNode = slot._slotNode;
          if (slot.currentSprite && attachment) {
            var rendererObject = attachment.region;
            var texture = rendererObject.texture.getRealTexture();
            if (state === ccui.Scale9Sprite.state.GRAY) {
              texture = texture._generateGrayTexture();
            }
            if (texture.isLoaded()) {
              loaded(slot.currentSprite, texture, attachment);
            } else {
              texture.addEventListener('load', function () {
                loaded(slot.currentSprite, texture, attachment);
              }, this);
            }
            slotNode._renderCmd._dirtyFlag = slot.currentSprite._renderCmd._dirtyFlag = 0;
          }
        }
      }
    }
  }

  //when using RichText we are not able to get the height of text.
  //this patch helps us to get the height of Rich text node.
  if (ccui.RichText) {
    ccui.RichText.prototype.formatRenderers = function () {
      var newContentSizeHeight = 0,
        locRenderersContainer = this._elementRenderersContainer;
      var locElementRenders = this._elementRenders;
      var i, j, row, nextPosX, l;
      var lineHeight, offsetX;
      if (this._ignoreSize) {
        var newContentSizeWidth = 0;
        row = locElementRenders[0];
        nextPosX = 0;

        for (j = 0; j < row.length; j++) {
          l = row[j];
          l.setAnchorPoint(cc.p(0, 0));
          l.setPosition(nextPosX, 0);
          locRenderersContainer.addChild(l, 1, j);

          lineHeight = l.getLineHeight ? l.getLineHeight() : newContentSizeHeight;

          var iSize = l.getContentSize();
          newContentSizeWidth += iSize.width;
          newContentSizeHeight = Math.max(Math.min(newContentSizeHeight, lineHeight), iSize.height);
          nextPosX += iSize.width;
        }

        //Text flow horizontal alignment:
        if (this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT) {
          offsetX = 0;
          if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
            offsetX = this._contentSize.width - nextPosX;
          else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
            offsetX = (this._contentSize.width - nextPosX) / 2;

          for (j = 0; j < row.length; j++)
            row[j].x += offsetX;
        }

        locRenderersContainer.setContentSize(newContentSizeWidth, newContentSizeHeight);
      } else {
        var maxHeights = [];
        for (i = 0; i < locElementRenders.length; i++) {
          row = locElementRenders[i];
          var maxHeight = 0;
          for (j = 0; j < row.length; j++) {
            l = row[j];
            lineHeight = l.getLineHeight ? l.getLineHeight() : l.getContentSize().height;
            maxHeight = Math.max(Math.min(l.getContentSize().height, lineHeight), maxHeight);
          }
          maxHeights[i] = maxHeight;
          newContentSizeHeight += maxHeights[i];
        }

        this._customSize.height = newContentSizeHeight;
        var nextPosY = this._customSize.height;

        for (i = 0; i < locElementRenders.length; i++) {
          row = locElementRenders[i];
          nextPosX = 0;
          nextPosY -= (maxHeights[i] + this._verticalSpace);

          for (j = 0; j < row.length; j++) {
            l = row[j];
            l.setAnchorPoint(cc.p(0, 0));
            l.setPosition(cc.p(nextPosX, nextPosY));
            locRenderersContainer.addChild(l, 1);
            nextPosX += l.getContentSize().width;
          }
          //Text flow alignment(s)
          if (this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT || this._textVerticalAlignment !== cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
            offsetX = 0;
            if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
              offsetX = this._contentSize.width - nextPosX;
            else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
              offsetX = (this._contentSize.width - nextPosX) / 2;

            var offsetY = 0;
            if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
              offsetY = this._customSize.height - newContentSizeHeight;
            else if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
              offsetY = (this._customSize.height - newContentSizeHeight) / 2;

            for (j = 0; j < row.length; j++) {
              l = row[j];
              l.x += offsetX;
              l.y -= offsetY;
            }
          }
        }

        locRenderersContainer.setContentSize(this._contentSize);
      }

      var length = locElementRenders.length;
      for (i = 0; i < length; i++) {
        locElementRenders[i].length = 0;
      }
      this._elementRenders.length = 0;

      this.setContentSize(this._ignoreSize ? this.getVirtualRendererSize() : this._customSize);
      this._updateContentSizeWithTextureSize(this._contentSize);

      locRenderersContainer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
    }
  }
})(this);