// This file holds functions for parsing the data 

    //reformat data before saving
function reformatData(data) {
    var numPairs = 10;
    var numRes = 8;
    //list of dictionaries, where each dictionary keeps the data for a single trial
    //Those dictionaries will become  rows in the data table
    var bigData = [];
    for (var i=0; i<numPairs; i++) {
        var data2 = {};
        data2.trial_order = i+1;
        data[0] = JSON.parse(JSON.stringify(data[0]));
        data2.turk_code = data[0]["turk_code"];
        data[2] = JSON.parse(JSON.stringify(data[2]));
        data2.subject_id = JSON.parse(data[2]["responses"])["subject_id"];
        data[i+4] = JSON.parse(JSON.stringify(data[i+4]));
        data2.rt = data[i+4]["rt"];
        var res = JSON.parse(data[i+4]["responses"]);
        var animals = Object.keys(res)[0].split(", ");
        data2.animal_1 = animals[0];
        data2.animal_2 = animals[1];
        for (var j=1; j<=numRes; j++) {
            var key = "";
            if(j <= (numRes/2))
                key = "sim_" + j;
            else
                key = "dif_" + (j-(numRes/2));
            var r = Object.values(res)[j-1];
            r = r.replace(/'/gi, "");
            r = r.replace(/"/gi, "");
            r = r.replace(/;/gi, "");
            r = r.replace(/\//gi, "");
            r = r.replace(/\\/gi, "");
            data2[key] = r;
        }
        data[numPairs + 4] = JSON.parse(JSON.stringify(data[numPairs + 4]));
        var demo1 = JSON.parse(data[numPairs+4]["responses"]);
        data2.age = Object.values(demo1)[0];
        data2.language = Object.values(demo1)[1];
        data2.nationality = Object.values(demo1)[2];
        data2.country = Object.values(demo1)[3];
        data[numPairs + 5] = JSON.parse(JSON.stringify(data[numPairs + 5]));
        var demo2 = JSON.parse(data[numPairs+5]["responses"]);
        data2.gender = Object.values(demo2)[0];
        data2.student = Object.values(demo2)[1];
        data2.education = Object.values(demo2)[2];
        bigData.push(data2);
    }
    return bigData;
}

export function makeQuery(data) {
    data = JSON.parse(JSON.stringify(data));
    console.log("Parsing data");
    data = reformatData(data);
    console.log("done");
    var table = 'zoo_animals_sd';
    var keys = "";
    var keyArr = Object.keys(data[0]);
    for(var i=0; i<keyArr.length; i++) {
        keys = keys.concat(keyArr[i] + ", ");
    }
    keys = "(" + keys.substring(0, keys.length-2) + ")";
    var valuesList = [];
    var x = 0;
    for(var i=0; i<data.length; i++) {
        var dict = data[i];
        valuesList[x] = "";
        var valArray = Object.values(dict);
        for(var j=0; j<valArray.length; j++) {
            valuesList[x] = valuesList[x].concat("'" + valArray[j] + "', ");
        }
        x++;
    }
    var valuesStr = ""
    for (var i=0; i<valuesList.length; i++) {
        var values = valuesList[i];
        values = "(" + values.substring(0, values.length-2) + ")";
        valuesStr = valuesStr + values + ", ";
    }
    valuesStr = valuesStr.substring(0, valuesStr.length-2);
    //console.log("INSERT INTO " + table + keys + " " + "VALUES " + valuesStr + ";");
    return "INSERT INTO " + table + keys + " " + "VALUES " + valuesStr + ";";
}