document.addEventListener("DOMContentLoaded", function() {
  var data;
  var Nodes = function(container, data){
    this.container = container
    this.container_group = container
      .append("g")
      .attr("class", typeof container.category == 'string' ? container.category+" ": "" + "node_parent")
      .attr("width", 1080)
      /*this.text = this.g
      .selectAll("g")
      .data(this.data)
      */
  }

  Nodes.prototype = {
    draw: function draw(container) {
      this.circles = this.model_nodes
        .append("circle")
        .transition()
        .duration(1000)
        .attr("cx", 50)
        .attr("cy",function(d, i) {return i * 100 + 50})
        .attr("r", 40)
        .text(function(d, i) {return d.key})
        .attr("class", function(d) { return d.key})
        .style("fill", container.category == 'products' ? "red": (container.category == 'services' ? "purple" : 'blue'))

    },
    addtext: function addtext() {
      this.text = this.model_nodes
        .append("text")
        .attr("x", 140)
        .attr("y", function(d,i) {return i * 100 + 50})
        .text( function(d, i) { return d.key })
        .attr("class", function(d) { return d.key})
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "black")
    },
    expand_node_subdata: function(container, data) {
      var i = 200;
      var j = 100
      _this = this;
      console.log("draw sub data", data);
      $.each(data, function(k,v) {
        console.log("kv", k, v)
        j+= 50;
        g = container.append("g")
        
        g.append("circle")
          .attr("cx", i)
          .attr("cy",function(d, i) {return i * 100 + j})
          .attr("r", 5)
          .attr("class", "node")
          .text(function(d, i) {return k})
          .attr("fill", "black")

        g.append("text")
          .attr("x", i+50)
          .attr("y",function(d, i) {return i * 100 + j})
          .text( k + ": " + v)
          .attr("class", function(d) { return d.key})
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "black")


      });
    },
    clear: function clear(callback, args) {
      console.log("node clear");
      _this = this;
      
      if (typeof callback == "function") {
        console.log()
        console.log()
        console.log("args",args)
        console.log()
        console.log()
        _this.container.transition().duration(1000).attr("height", 500)
        callback(args);
        return
      }
      (function () {
        //_this.container.transition().duration(1000).remove();
        //_this.circles.transition().duration(1000).remove();
        //_this.text.transition().duration(1000).remove();
        if ( typeof _this.subnodes == 'object') {
          //_this.subnodes.clear();
        }
      })();
    },
    set_data: function set_data(data) {
      this.data = data
    },
    set_model_nodes: function set_model_nodes(){
      console.log("set model node data", this.data)
      console.log("set model container group", this.container_group)
      console.log("set model node this data",this.data);
      this.model_nodes = this.container_group
        .selectAll("g")
        .data(this.data)
      console.log("model nodes", this.model_nodes)
    },
    enter_model_nodes: function enter_model_nodes() {
      this.model_nodes
        .enter()
        .append("g")
        .transition()
        .duration(1000)
        .attr("class", "node")
        .attr("id", function(d) { return d.key})
        .attr("width", 1080)
      //this.container.transition().duration(1000).attr("height", this.data.length * 100)
    },
    update_model_nodes: function update_model_nodes(_this, node_data) {
      _this.set_data([node_data]);
      _this.set_model_nodes();
      _this.exit_model_nodes();
      _this.enter_model_nodes();
      _this.draw(_this.container)
      _this.addtext()
      
    },
    exit_model_nodes: function exit_model_nodes() {
      this.model_nodes.exit().remove();
     
    },
    set_subnodes: function set_subnodes(args) {
      console.log("args",args)
      _this = args[0];
      node_data = args[1];
      subnode_root = args[2];
      console.log("set subnode data", node_data)
      console.log("set subnode this", _this)
      _this.update_model_nodes(_this, node_data);
      _this.subnodes = new Nodes(subnode_root, node_data.values );
      console.log("subnodes",_this.subnodes);
      _this.subnodes.update_model_nodes(_this.subnodes, node_data.values[0]);
      _this.subnodes.expand_node_subdata(_this.subnodes.container,  node_data.values[0])
      _this.container.transition().duration(1000).attr("height", 1000)
      //_this.clear();
      //_this.set_data(node_data);
      //_this.set_model_nodes();
      //_this.addtext();
      console.log("_this data",_this.data);

    },
    click_listener: function click_listener(data) {
      _this = this;
      this.model_nodes.on("click", function(node_data, node_index) {
        //get data for this node

        console.log("onclick this", this);
        console.log("onclick _this", _this);
        console.log("d", node_data);
        console.log("i", node_index);
        console.log('data', data);
        console.log('this html', $(this).html());
        console.log("values", node_data.values);
        args = [_this, node_data, d3.select(this)];

        _this.container.transition().duration(1000).attr("height", 0)
        _this.clear(_this.set_subnodes, args);

      /*CHANGE TO USE TRANSFORM/TRANSLATE
      sub_nodes = d3.select(this)
        .append("svg")
        .attr("x", 150)
        .attr("y", (node_index * 100) + 50)
        .attr("class", node_data.key)
        .attr("height", 200)
        .attr("width", 800);

      sub_graph
        .append("rect")
        .attr("y", function (d, i) { return (node_index * 100) + 50})
        .attr("x", 100)
        .attr("width", 100)
        .attr("height", 100)
        .attr("class", function(d) { return d.Categories})
        .style("fill", function(d) { return d.Model == 'Markets' ? "green": "blue"})

      
      sub_graph
        .append("text")
        .attr("y", function (d, i) { return (node_index * 100) + 100})
        .attr("x", 100)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text(function(d) { return d.Description})


        /*console.log('subdata', sub_data);
        sub_nodes = d3.select(this).selectAll("rectangle")
          .data(data[$(this).html()]);
        console.log('sub_nodes', sub_nodes);
        */

      });
    }
  }

  /*HELPERS*/
  function keyMatch(element) {
    element
  }
  
  var CategoryVis = function(category,data) {
    //init
    this.category = category;
    this.data = data;

    //abstract outto allow for variation in modelling
    this.nestModelCat = d3.nest()
      .key(function(d) { return d.Model})
      //.key(function(d) { return d.Categories})
      .entries(this.data);
    this.w = this.nestModelCat.length;
    this.h = this.w;

    //abstract out into d3_container
    this.catContainer = 
      d3.select("#"+this.category)
        .append("svg")
        .attr("class", this.category)
        .attr("width", 1080)
    console.log("cat container", this.catContainer);
    this.nodes = new Nodes(this.catContainer, this.nestModelCat); 
  };
  
  CategoryVis.prototype =  {
    go: function go() {
      this.catContainer
        .transition()
        .duration(1000)
        .attr("width", 1200).attr("height", this.h*110);  
    },
    nest_Categories: function(args){
      
    },

    update: function update(data) {

      this.nodes.set_data(data)
      this.nodes.set_model_nodes()
      this.nodes.enter_model_nodes()
      this.nodes.draw(this)
      this.nodes.addtext()
      this.nodes.click_listener(this.nestModelCat)


      //this.nodes.container_group.exit().remove()
    },
    remove: function remove() {
      _this = this;
      (function() {
        _this.catContainer.transition().duration(1000).attr("height", 0);
      })();
      //this.nodes.model_nodes.circles.remove()
      //this.nodes.model_nodes.text.remove()
      this.nodes.clear()
    },
    click: function click() {
      
    }
  }
  
  /*MAIN*/
  var listener = function(vis) {
    $("body").on("click", "h1."+vis.category, function() {
      if ($(this).attr("clicked") == "true" ) {
        vis.remove();
        $(this).attr("clicked", "false");
        return; 
      }

      $(this).attr("clicked", "true");
      (function() {vis.go()})(vis.update(vis.nestModelCat));
      console.log(vis);
    });
  }

  d3.json("../json/ws_od6.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;
    var services = new CategoryVis('services', data);
    listener(services);

  });

  d3.json("../json/ws_o5kcph8.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;
    var products = new CategoryVis('products', data);
    listener(products);
  });

  //services.doit();
  //var products = new CategoryVis('products', "../json/ws_o5kcph8.json");
  

  /*$("body").on("click", ".services", function() {
    d3.json("../json/ws_od6.json", function(error, json) {
      if (error) return console.warn(error);
      data = json;
      //visualizeit('services', data);
      //alert(data.length);
    });
  //});
  */

  /*$("body").on("click", ".products", function() {
    d3.json("../json/ws_o5kcph8.json", function(error, json) {
      if (error) return console.warn(error);
      data = json;
      visualizeit('products', data);
      //alert(data.length);
    });
  });*/


  /*var visualizeit = function(category, data) {
    //nest into category, then model, like SQL group by
    var nest = d3.nest()
      .key(function(d) { return d.Model; })
      .key(function(d) { return d.Categories})
      .entries(data);
    console.log(category);
    var cat = d3.select("#"+category);
    console.log(cat);

    d3.select("#"+category).selectAll("h2")
      .data(nest).enter().append("h2");
    d3.selectAll("#"+category+" h2")
      .text(function(d, i) {return d.key});

  }*/
});
