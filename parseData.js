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
        data2.trial_order = i;
        data2.turk_code = data[0]["turk_code"];
        data2.subject_id = data[2]["responses"]["subject_id"];
        var res = data["responses"];
        var animals = Object.keys(res)[0].split();
        data2.animal_1 = animals[0];
        data2.animal_2 = animals[1];
        for (var j=1; j<=numRes; j++) {
            var key = "comp_" + j;
            var r = Object.values(res)[j-1];
            r = r.replace(/'/gi, "");
            r = r.replace(/"/gi, "");
            r = r.replace(/;/gi, "");
            r = r.replace(/\//gi, "");
            data2[key] = r;
        }
        var demo1 = data[numTrials + 4];
        data2.age = Object.values(demo1)[0];
        data2.language = Object.values(demo1)[1];
        data2.nationality = Object.values(demo1)[2];
        data2.country = Object.values(demo1)[3];
        var demo2 = data[numTrials + 5];
        data2.gender = Object.values(demo2)[0];
        data2.student = Object.values(demo2)[1];
        data2.education = Object.values(demo2)[2];
        bigData.append(data2);
    }
    return bigData;
}

export function makeQuery(data) {
    data = JSON.parse(JSON.stringify(data));
    console.log("Parsing data");
    data = reformatData(data);
    console.log("done");
    var table = 'zoo_animals';
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
    console.log(valuesStr);
    //return "INSERT INTO " + table + keys + " " + "VALUES " + valuesStr + ";";
}