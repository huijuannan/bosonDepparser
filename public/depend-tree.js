// by nhj
// 2016-3-31
'use strict';
var wordWidth = 60,
    wordHeight = 20;
function levelHeight(level){
    return 2+Math.pow(level, 1.8)*10;
}

window.drawTree = function(svgElement, data){
    var svg = d3.select(svgElement);
    var edges = data;
    for (var i = 0; i<edges.length; i++){
        for (var j = 0; j<edges.length; j++){
            var _list = [];
            edges.forEach(function(e){
                if (under(edges[j], e)){
                    _list.push(e.level);
                }
            });
            edges[j].level = 1+maximum(_list);
        }
    }

    var treeWidth = wordWidth*data.length - wordWidth/3;
    var treeHeight = levelHeight(maximum(data.map(function(e){return e.level;}))) +2*wordHeight;
    for (var i = 0; i<data.length; i++){
        var d = data[i];
        d.bottom = treeHeight - 1.8 * wordHeight;
        d.top = d.bottom - levelHeight(d.level);
        d.left = treeWidth - d.id * wordWidth - 5;
        d.right = treeWidth - d.parent * wordWidth + 5;
        d.mid = (d.right + d.left)/2;
        d.diff = (d.right - d.left)/4;
        d.arrow = d.top + (d.bottom - d.top)*0.25;
    }

    // draw svg
    svg.selectAll('text, path').remove();
    svg.attr('xmlns', 'http://www.w3.org/2000/svg');
    svg.attr('width', treeWidth + 2*wordWidth/3)
        .attr('height', treeHeight + wordHeight/2);

    var defs = svg.append("defs");  
    var arrowMarker = defs.append("marker")  
                        .attr("id","arrow")  
                        .attr("markerUnits","strokeWidth")  
                        .attr("markerWidth","12")  
                        .attr("markerHeight","12")  
                        .attr("viewBox","0 0 12 12")   
                        .attr("refX","6")  
                        .attr("refY","6")  
                        .attr("orient","auto");  
  
    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";  
                          
    arrowMarker.append("path")  
            .attr("d",arrow_path)  
            .attr("fill","#000");  

    var words = svg.selectAll('.word')
                .data(data)
                .enter()
                .append('text')
                .text(function(d){return d.word;})
                .attr('class', function(d){return 'word w' + d.id;})
                .attr('x', function(d){return treeWidth - wordWidth*d.id;})
                .attr('y', function(d){return treeHeight - wordHeight;})
                .attr('text-anchor', 'middle');

    // var tags = svg.selectAll('.tag')
    //                 .data(data)
    //                 .enter()
    //                 .append('text')
    //                 .text(function(d){return d.tag;})
    //                 .attr('class', function(d){return 'tag w' + d.id;})
    //                 .attr('x', function(d){return treeWidth - wordWidth*d.id;})
    //                 .attr('y', treeHeight)
    //                 .attr('opacity',0)
    //                 .attr('text-anchor','middle')
    //                 .attr('font-size','90%');
    var lines = svg.selectAll('.edge')
                    .data(data)
                    .enter()
                    .append('path')
                    .filter(function(d){return d.parent>0;})
                    .attr('marker-end','url(#arrow)')
                    .attr('class',function(d){return "edge w" + d.id + ' w' + d.parent;})
                    .attr('d', function(d){
                        var _d = 'M';
                        _d += d.left + ',' + d.bottom;
                        _d += ' L' + d.left + ',' + d.top + ' L';
                        _d += d.right + "," + d.top + " L";
                        _d += d.right + ',' + d.bottom;
                        return _d;
                    })
                    .attr('fill','none')
                    .attr('stroke','black')
                    .attr('stroke-width','1.5');
    var dependencies = svg.selectAll('.dependency')
                            .data(data)
                            .enter()
                            .append('text')
                            .filter(function(d){return d.parent >0;})
                            .text(function(d){return d.dependency;})
                            .attr('class', function(d){return "dependency w" + d.id + " w" + d.parent;})
                            .attr('x',function(d){return d.mid;})
                            .attr('y', function(d){return d.arrow - 7;})
                            .attr('text-anchor','middle')
                            .attr('font-size','90%');

};

// functions

function maximum(array){
    return Math.max(0, Math.max.apply(null, array));
}

function under(edge1, edge2){
    var mi = edge1.id < edge1.parent ? edge1.id : edge1.parent;
    var ma = edge1.id < edge1.parent ? edge1.parent : edge1.id;
    return edge1.id != edge2.id & edge2.id >= mi & edge2.parent >= mi & edge2.id <= ma & edge2.parent <= ma;
}