// by nhj 2016-3-18
// 为文本做依存分析
// 调用 bosonNLP 服务


'use strict';

const bosonnlp = require('@anren/bosonnlp');
const API_KEY = "UIA0lZdj.4868.Y8nLWTjf950C";
const nlp = new bosonnlp.BosonNLP(API_KEY);
const Promise = require('bluebird');
const readFile = Promise.promisify(require("fs").readFile);
const writeFile = Promise.promisify(require("fs").writeFile);
const readDir = Promise.promisify(require("fs").readdir);
const fs = require("fs");
// var depparser = Promise.promisify(nlp.depparser, {context: nlp});

// 分句
var regEndMark = /[\u3002|\uff1f|\uff01|\u300b|\u2026|\n]/g; //。！？……
var regChiChar = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;

function parseSentence(content) {
    var sen = content.split(regEndMark);

    return sen.filter(function(item){
        return item && item.trim().match(regChiChar);
    });
}

// var filelist = fs.readdirSync('./article');
// console.log(filelist);

readDir('./people')
    .then(function(files){
        return files.reduce(function(prev,curr){
            return prev
                .then(function(){
                    return bosonParse(curr);
                });
        }, Promise.resolve(''));
    })
    .catch(function(err){
        throw err;
    });

// bosonParse('text01.txt');

function bosonParse(filename){

    var role = [],
        head = [],
        word =[];


    return readFile('./people/' + filename, 'utf8')
    .then(function(content){
        console.log(parseSentence(content).length);
        return parseSentence(content);
    })
    .then(function(sentences){
        return sentences.reduce(function(prev,curr,index){
            return prev
                .then(function(){
                    // console.log(curr);
                    return new Promise(function(resolve, reject){
                        nlp.depparser(curr, function(data){
                            return resolve(JSON.parse(data));
                        });
                    }); 
                })
                .then(function(result){
                    console.log(index);
                    console.log(result[0].role);
                    role.push(result[0].role);
                    head.push(result[0].head);
                    word.push(result[0].word);
                });
        }, Promise.resolve(''));
    })
    .then(function(){
        console.log(role);
        return Promise.all(
            [
            writeFile('./output/' + filename.split('.')[0] + '-role.json',JSON.stringify(role)),
            writeFile('./output/' + filename.split('.')[0] + '-head.json',JSON.stringify(head)),
            writeFile('./output/' + filename.split('.')[0] + '-word.json',JSON.stringify(word))
            ]
            )
        .then(function(data){
            console.log(typeof data);
        });
    })
    .catch(function(err){
        console.log(err);
    });
}