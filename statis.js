// by nhj 2016-3-22
// 统计 依存分析的结果
//  + 计算每种语法结构的数量
//  + 计算每种语法结构的数量与
//      + 句数
//      + 词数
//      + 字数
//      的比例


'use strict';
// const types = ["ROOT", "SBJ", "OBJ", "PU", "TMP", "LOC", "MNR", "POBJ", "PMOD", "NMOD", "VMOD", "VRD", "DEG", "DEV", "LC", "M", "AMOD", "PRN", "VC", "COOR", "CS", "PMOD", "DEC"];
const fs = require("fs");

var filelist = fs.readdirSync('./article');
var resultAll = [];

filelist.map(function (file) {
    let filename = './output/' + file.split('.')[0] + '-role.json';
    console.log(filename);

    let data = require(filename); // return an array

    let numSentence = data.length;

    data = [].concat.apply([],data);

    let numWord = data.length;

    let numChar = data.join('').length;


    let result = {
        numChar: numChar,
        numWord: numWord,
        numSentence: numSentence
    };

    for (let i = 0; i<data.length; i++){
        result[data[i]] = result[data[i]] || 0;
        result[data[i]]++;
    }

    // console.log(result);

    resultAll.push({
        name: file.split('.')[0],
        result: result
    })

})


console.log(resultAll);
fs.writeFile('statis.json',JSON.stringify(resultAll));


