var CustomBMFont = cc.LabelBMFont.extend({
    ctor(text,fontFile){
        this._super(text,fontFile);
        
        
    },
    setColor(color){
        this._color = color;
        var children = this.getChildren();
        for(var i=0;i<children.length;i++){
            children[i].setColor(color);
        }
    },
    getColor(){
        return this._color;
    }
});