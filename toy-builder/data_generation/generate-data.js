const su = require("./utilities");
const path = require("path");
const CSV_PATH = path.join(__dirname,"csv");
const SME_JSON = path.join(__dirname,"json");



su.convertCsvToJson(path.join(CSV_PATH,"data.csv")).then(json=>{

    // console.log(json);
    let dataObj = {};
    // // console.log(json);
    json.forEach(element => {
        let category = element["Category"];

        if(category){
            let categoryObj = dataObj[category] || [];

            let obj = {};
            obj.category = element["Category"];

            obj.name = element["Name"];
            obj.name_vo = element["Name_VO"];
            obj.desp_vo = element["Desp_VO"];
            obj.description = element["Description"];
            categoryObj.push(obj);
            dataObj[category] = categoryObj;
        }
        
    });
    console.log(dataObj)
    return su.writeFile(path.join(SME_JSON,"data.json"),JSON.stringify(dataObj, null,2));

}).catch(err=>{
    console.error(err);
})
