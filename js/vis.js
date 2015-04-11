document.addEventListener("DOMContentLoaded", function() {
  d3.json("../json/ws_od6.json", function(error, json) {
    if (error) return console.warn(error);                                                              
    data = json;                                                                                        
    console.log(data);
    var vis = new Vis('body', data);                                                   
    vis.go();
    vis.expand();
    $("#trans-color").on("click", function() {
      vis.circle_color("blue");  
    });

    $("#trans-move").on("click", function() {
      vis.nodes_move();  
    });
    
    $("#trans-shrink").on("click", function() {
      vis.circle_shrink();  
    });
    
    $("#trans-doit").on("click", function() {
      (function(callback) {
        vis.circle_color("blue");  
        setTimeout( function() {
          vis.nodes_move();
        }, 500);
        setTimeout( function() {
          vis.circle_shrink();
        }, 1000);
      })();
      
      //vis.circle_shrink();  
    });

    $("#trans-reset").on("click", function() {
      vis.clear();  
    });
  });             

  var Vis = function(target, data) {                                                           
    //init                                                                                              
    this.data = d3.nest()                                                                       
      .key(function(d) { return d.Model})
      .entries(data);                                                                                   
    this.target = target;
    this.h = this.data.length *100;
    this.w = 1200;
                                                                                                        
    //abstract out into d3_container                                                                    
    this.Container =                                                                                 
      d3.select(this.target)                                                                      
        .append("svg")                                                                                  
        .attr("class", "vis")                                                                  
        .attr("height", 0);
    this.Nodes = this.Container
      .selectAll("g")
      .data(this.data);
    
  };                                                                                                    

  Vis.prototype =  {                                                                            
    draw_circles: function draw_circles() {
    
      this.Nodes.circles = this.Nodes
        .enter()
        .append("circle")
        .attr("cx", 50)                                                                                 
        .attr("cy",function(d, i) {return i * 100 + 50})                                                
        .attr("r", 40)        
        .attr("class", "node")                                                                          
        .attr("id", function(d) { return d.key})                                                        
        .style("fill", "red")
    },               
    write_text: function write_text() {
      this.Nodes.text = this.Nodes
        .enter()
        .append("text")
        .text( function(d, i) { return d.key })
        .attr("x", 50)                                                                                 
        .attr("y",function(d, i) {return i * 100 + 100})                                                
        .attr("fill", "black")
        .attr("class", "node")                                                                          

    },
    circle_color: function circle_color(color) {
      if (color.length == 0 || color == null) { color = "blue"}
      console.log('color: ', color);
      console.log('style: ', this.Nodes.circles.style("fill"));
      console.log('circles are: ', this.Nodescircles);
      console.log('Nodes are: ', this.Nodes);
      _this = this;
      this.Nodes.circles
        .transition()
        .style("fill", function(){ return "rgb(255, 0, 0)" == _this.Nodes.circles.style("fill") ? color : "red"})
      return true;
    },
    circle_shrink: function circle_shrink() {
      this.Nodes.circles
        .transition()
        .attr("r", this.Nodes.circles.attr("r")/4)
    },
    nodes_move: function nodes_move() {
      var add = this.Nodes.circles.attr("cx") == 50 ? 550 : 50;
      console.log('add: ', add);
      this.Nodes.circles     
        .transition()
        .attr("cx", add)
      this.Nodes.text    
        .transition()
        .attr("x", add)
    },
    go: function go() {                                                                                 
      console.log('go');
      this.draw_circles();
      this.write_text();

    },
    expand: function() {
      this.Container                                                                                 
        .transition()                                                                                   
        .duration(5000)                                                                                 
        .attr("width", this.w).attr("height", this.h);                                                
    },
    collapse: function() {
      this.Container                                                                                 
        .transition()                                                                                   
        .duration(1000)                                                                                 
        .attr("width", this.w).attr("height", 0);                                                
      return
      
    },
    clear: function clear(callback) {                                                                                 
      _this = this;
      var remove = function () { 
        d3.selectAll('.node').remove();
        console.log('removing all nodes...');
      };
      (function(local_callback) { 
        _this.collapse();
        setTimeout(function() {
          local_callback(); 
        }, 1000); 
        setTimeout( function () {
          _this.expand()
          _this.go();
        }, 1000);
      })(remove);
    },
  }
});
