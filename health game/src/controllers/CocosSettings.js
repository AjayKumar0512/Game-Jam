var initializeCocosSettings = function () {
  var GameDesignSize = cc.size(2048, 1536);
  cc.view.setDesignResolutionSize(GameDesignSize.width, GameDesignSize.height,
    cc.sys.isMobile ? cc.ResolutionPolicy.FIXED_HEIGHT : cc.ResolutionPolicy.SHOW_ALL);
  cc.director.setContentScaleFactor(getIsRetina() ? 1 : 0.5);
}