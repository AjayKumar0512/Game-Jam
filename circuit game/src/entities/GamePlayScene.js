var GamePlayScene = cc.Scene.extend({
  ctor: function (gameManager) {
    this._super();
    this.gameManager = gameManager;
    this.scoreScreen = null;
    this.m_visibleSize = cc.director.getVisibleSize();
    return true;
  },

  onEnter: function () {
    this._super();
    this.addScoreScreen();
  },

  addScoreScreen: function () {
    this.topBar = new TopBar();
    this.topBar.setPosition(cc.p(0, this.m_visibleSize.height));
    this.addChild(this.topBar, Z_ORDER_SCORE_SCREEN);
    this.topBar.hideBackButton();
  },


});
