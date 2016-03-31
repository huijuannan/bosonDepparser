// by nhj 2016-3-24
// 把依存文法的结果作图



'use strict';

$(function () {

    var types = ["ROOT", "SBJ", "OBJ", "PU", "TMP", "LOC", "MNR", "POBJ", "PMOD", "NMOD", "VMOD", "VRD", "DEG", "DEV", "LC", "M", "AMOD", "PRN", "VC", "COOR", "CS", "DEC"];
    var types_desc = ["核心词", "主语成分", "宾语成分", "标点符号", "时间成分", "位置成分", "方式成分", "介宾成分", "介词修饰", "名词修饰", "动词修饰", "动结式（第二动词为第一动词结果）", "连接词“的”结构", "“地”结构", "位置词结构", "量词结构", "副词修饰", "括号成分", "动词“是”修饰", "并列关系", "从属连词成分", "关系从句“的”"];
    
    $.getJSON('./statis.json',function(data){

        var dataFix = [];
        var peopleSum = {name: '人', result:{}};
        var countPeople = 0;
        // 对所有 people 开头的结果求平均值
        data.forEach(function(item){
            if (item.name[0] === 't'){
                if (item.name.slice(4) === '01'){
                    item.name = '张';
                }else{
                    item.name = '钱';
                }
                dataFix.push(item);
            }else{
                countPeople ++;
                for (var ele in item.result){
                    // console.log(item.result[ele]);
                    if (item.result[ele]){
                        peopleSum.result[ele] = peopleSum.result[ele] || 0;
                        peopleSum.result[ele] += item.result[ele];
                    }
                }
            }
        });

        console.log(peopleSum);
        console.log(dataFix);

        dataFix.push(peopleSum);



        var result = types.map(function (type) {
            return dataFix
                    .map(function(item){
                        return {name: item.name, ratio: (item.result[type]/item.result.numSentence)};
                    })
                    .sort(function(a,b){
                        return a.ratio - b.ratio;
                    });
        });

        for (var i = 0; i<result.length; i++){
            $('body').append('<div class="chart"></div>');
        }

        // console.log(result);

        result.forEach(function(item, index){
            var myChart = echarts.init($('.chart')[index]);
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: types_desc[index],
                    left:'center'
                },
                tooltip:{
                // trigger: 'axis',
                // formatter: function(obj){
                //   // console.log(obj);
                //   var value = obj[0].value;
                //   // console.log(value);
                //   return "「" + value[3] + "」" + value[2];
                // },
                // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                // }
            },
                legend: {
                },
                yAxis:  [
                    {
                        type : 'value'
                    }
                ],
                xAxis:  [
                    {
                        type : 'category',
                        data: item.map(function(i){return i.name})
                    }
                ],
                series: [{
                    name: '',
                    type: 'bar',
                    data: item.map(function(i){return i.ratio}),
                    // label:{normal:{formatter:function(obj){
                    //   return obj.data[3];
                    // },
                      // show: true,
                      // position:'bottom',
                      // textStyle:{fontSize:5}}}
                }]
            };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            });

        });
    });
