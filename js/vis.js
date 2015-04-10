document.addEventListener("DOMContentLoaded", function() {
  d3.json("../json/ws_od6.json", function(error, json) {
    if (error) return console.warn(error);                                                              
    data = json;                                                                                        
    console.log(data);
    var vis = new Vis('body', data);                                                   
    vis.go();
    vis.expand();
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
    
      this.circles = this.Nodes
        .enter()
        .append("circle")
        .transition()
        .duration(1000)                                                                                 
        .attr("cx", 50)                                                                                 
        .attr("cy",function(d, i) {return i * 100 + 50})                                                
        .attr("r", 40)        
        .attr("class", "node")                                                                          
        .attr("id", function(d) { return d.key})                                                        
    },               
    write_text: function write_text() {
      this.text = this.Nodes
        .enter()
        .append("text")
        .text( function(d, i) { return d.key })
        .attr("x", 50)                                                                                 
        .attr("y",function(d, i) {return i * 100 + 100})                                                
        .attr("fill", "black")

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
    }
  }
});
