$(function(){


var width = 700;
var height = 650;

var root = 
{
    "name": "Base",
    "children": [
        {
            "name": "Type A",
            "children": [
                {
                    "name": "Section 1",
                    "children": [
                        {"name": "Child 1"},
                        {"name": "Child 2"},
                        {"name": "Child 3"}
                    ]
                },
                {
                    "name": "Section 2",
                    "children": [
                        {"name": "Child 1"},
                        {"name": "Child 2"},
                        {"name": "Child 3"}
                    ]
                }
            ]
        },
        {
            "name": "Type B",
            "children": [
                {
                    "name": "Section 1",
                    "children": [
                        {"name": "Child 1"},
                        {"name": "Child 2"},
                        {"name": "Child 3"}
                    ]
                },
                {
                    "name": "Section 2",
                    "children": [
                        {"name": "Child 1"},
                        {"name": "Child 2"},
                        {"name": "Child 3"}
                    ]
                }
            ]
        }
    ]
};

var svg = d3.select("#visualization-container").append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(0,0)");
              
var partition = d3.layout.partition()
                    .size([height, width-160]) // The 160 is the extra space for the labels on RHS
                    .value(function(d) { return 1; })
                    .sort(function comparator(a, b) {
                      return d3.ascending(a.i, b.i);
                     });
var nodes = partition.nodes(root);
              
function depth_max_descending(node) {
 var cur=node.depth;
 if(node.children) {
  node.children.forEach(function (n) {
   var c = depth_max_descending(n)
   if(c>cur) { cur=c; }        
  });
 }
 return cur;
}
var depth_max = depth_max_descending(root);

var color = d3.scale.linear()
              .domain([0, depth_max])
              .range(["red", "orange"]);

function fill_descending(node, fn) {
 svg.selectAll("rect.i"+node.i).style("fill", fn);
 if(node.children) {
  node.children.forEach(function (n) {
   fill_descending(n, fn)
  });
 }
}
  
var fill_regular    = function(d) { return ( d.children ? color(d.depth) : color(d.depth-1) ); };    
var fill_highlight  = function(d) { return fill_regular(d)+4; };    
  
svg.selectAll(".node")
    .data(nodes)
  .enter().append("rect")
    .attr("class", "node")
    .attr("class", function(d) { return "i"+d.i; })
    .attr("x", function(d) { return (d.parent && d.parent.i == d.i)? (d.y) : (d.y+1.5); })
    .attr("y", function(d) { return d.x; })
    .attr("width", function(d) { return d.children ? (d.dy-1.5) : (width-d.y-1.5); })
    .attr("height", function(d) { return d.dx-1; })
    .on('mouseover', function(d){
      fill_descending(d, fill_highlight);
    })
    .on('mouseout', function(d){
      fill_descending(d, fill_regular);
    })      
    .style("fill", fill_regular);
    // .call(drag);

svg.selectAll(".label")
    //.filter( function(d) { return d.children?false:true; })
    .data(nodes.filter(function(d) { return d.children?false:true; }))
  .enter().append("text")
    .attr("class", "word")
    .attr("pointer-events", "none")
    .attr("dy", ".35em")
    .attr("transform", function(d) { return "translate(" + ( width -160 ) + "," + (d.x + d.dx / 2) + ")rotate(0)"; })
    .text(function(d) { return d.word; });

})