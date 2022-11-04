class CategorySelector {
    constructor(gamePlay) {
        this.gameManager = gamePlay.gameManager;
        this.gamePlay = gamePlay;
        this.data = this.gamePlay.data;
        this.m_visibleSize = this.gamePlay.m_visibleSize;
        this.actionCount = 0;
    }
    addBottomCategories() {
        //getting bottom assets
        this.assets = [];
        this.assets = this.data.stages[this.gamePlay.buildStage].assets;
        this.categories = [];
        this.categoryPos = [];
        this.totalTools = this.assets.length;
        var y = -this.m_visibleSize.height * 0.3906;
        var x = 0
        var dummy = cc.Sprite.create(res[this.assets[0]]);
        //dummy.setScale(0.5);
        var gap = 100;
        //based on totaltiles getting initial x position of tile
        x -= this.totalTools / 2 * (dummy.getBoundingBox().width + gap) - dummy.getBoundingBox().width / 2;
        for (var i = 0; i < this.assets.length; i++) {
            var category = cc.Sprite.create(res[this.assets[i]]);
            // category.setScale(0.5);
            this.gamePlay.addChild(category);
            category.setPosition(x, y);
            x += category.getBoundingBox().width + gap;
            this.categories.push(category);
            this.categoryPos.push(category.getPosition());
            category.setOpacity(0);
            category.runAction(cc.fadeIn(0.2));

        }
        this.oscilateCategories();
    }
    removeCategories() {
        if (this.categories.length > 0) {
            for (var i = 0; i < this.categories.length; i++)
                this.categories[i].removeFromParent();
            this.categories = [];
        }
    }
    fadeOutCategories() {
        for (var i = 0; i < this.categories.length; i++) {
            this.categories[i].runAction(cc.sequence(cc.fadeOut(0.2),
                cc.callFunc(() => { this.removeCategories(); }))
            );
        }
    }
    oscilateCategories() {
        if (this.gamePlay.buildStage != GameConstants.BUILDCATEGORY.COLOR) {
            this.actionCount = 0;
            this.actions = [];
            for (var i = 0; i < this.categories.length; i++) {
                if (i != this.gamePlay.selectedCategory && i != this.gamePlay.finalCategory &&
                    i != this.gamePlay.tyre1Category && i != this.gamePlay.tyre2Category) {
                    var pos = this.categories[i].getPosition();
                    this.actions[i] = this.categories[i].runAction(cc.sequence(cc.moveTo(0.2, cc.p(pos.x, pos.y + 25)),
                        cc.moveTo(0.4, cc.p(pos.x, pos.y - 50)),
                        cc.moveTo(0.2, cc.p(pos.x, pos.y)),
                        cc.callFunc(() => {
                            this.actionCount++;
                            if (this.actionCount >= this.categories.length)
                                this.oscilateCategories();
                        })));
                }
                else {
                    this.actionCount++;
                    if (this.actionCount >= this.categories.length)
                        this.oscilateCategories();
                }
            }
        }
    }
}