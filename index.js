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


var role = [],
    head = [],
    word =[];

readFile('./text03.txt', 'utf8')
    .then(function(content){
        console.log(parseSentence(content).length);
        return parseSentence(content);
    })
    .then(function(sentences){
        return sentences.map(function(sen,index){
                return new Promise(function(resolve, reject){
                    nlp.depparser(sen, function(data){
                        return resolve({
                            result: JSON.parse(data),
                            index: index
                        });
                    })
                });
            })
    })
    .then(function(sentences){
        sentences.reduce(function(prev,curr){
            prev
                .then(function(result){
                    role[result.index] = result.result['0'].role;
                    head[result.index] = result.result['0'].head;
                    word[result.index] = result.result['0'].word;
                })
                .then(function(){
                    setTimeout(function(){
                        return new Promise(function(resolve, reject){
                            nlp.depparser(sen, function(data){
                                return resolve({
                                    result: JSON.parse(data),
                                    index: index
                                });
                            })
                        }); 
                    }, 2000);
                })
        }, new Promise(function(resolve, reject){
                nlp.depparser(sentences[0], function(data){
                    return resolve({
                        result: JSON.parse(data),
                        index: index
                    });
                })
            }))
    })

    .each(function(result,index){
        console.log(index)
        role[result.index] = result.result['0'].role;
        head[result.index] = result.result['0'].head;
        word[result.index] = result.result['0'].word;
    })
    .then(function(){
        Promise.all(
            [
            writeFile('./output/role.json',JSON.stringify(role)),
            writeFile('./output/head.json',JSON.stringify(head)),
            writeFile('./output/word.json',JSON.stringify(word))
            ]
            )
        .then(function(data){
            console.log(typeof data);
        })
    })
    .catch(function(err){
        console.log(err);
    })