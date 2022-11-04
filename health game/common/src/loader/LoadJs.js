var LoadJs = function (path) {
  cc.loader.loadJson(path, function (error, data) {
    if (error) {
      // console.log("there is error loading project.json file");
    } else {
      var jsList = data.jsList;
      for (var ji = 0; ji < jsList.length; ji++) {
        var path = jsList[ji];
        // var pathArray = path.split("/");
        // if(pathArray[0] == "src"){
        //   pathArray[0] = "build"
        // }
        // path = "";
        // path += pathArray[0];
        // for(let i=1 ;i<pathArray.length;i++){
        //   path += "/" + pathArray[i];
        // }
        var js = directoryPath + "" + path;
        require(js);
      }
    }
  });
};