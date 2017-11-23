function createSoccerViz() {
  d3.csv("worldcup.csv", function(data) {	
    overallTeamViz(data);
  })

function overallTeamViz(incomingData) {
  d3.select("svg")
    .append("g")	
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform",
       function (d,i) {return "translate(" + (i * 50) + ", 0)"}
       );	
  var teamG = d3.selectAll("g.overallG");	
  teamG
    .append("circle").attr("r", 0)
    .style("fill", "pink")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .transition()
    .delay(function (d,i) {return i * 100})
    .duration(500)
    .attr('r', 40)
    .transition()
    .duration(500)
    .attr('r', 20)
;
  teamG
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 30)
    .style("font-size", "10px")
    .text(function(d) {return d.team;});

  var dataKeys = d3.keys(incomingData[0]).filter(function(el) {
               return el != "team" && el != "region";
       });
  d3.select("#controls").selectAll("button.teams")
              .data(dataKeys).enter() 
              .append("button")
              .on("click", buttonClick) 
              .html(function(d) {return d;}); 
  function buttonClick(datapoint) { 
       var maxValue = d3.max(incomingData, function(d) {
               return parseFloat(d[datapoint]);
       });
  var radiusScale = d3.scaleLinear()
       .domain([ 0, maxValue ]).range([ 2, 20 ]);
  d3.selectAll("g.overallG").select("circle")
              .transition().duration(1000)
               .attr("r", function(d) {
                      return radiusScale(d[datapoint]);
               });
    };
  
  teamG.on("mouseover", highlightRegion);
  function highlightRegion(d, i) {
      var teamColor = d3.rgb('pink')
      d3.selectAll("g.overallG").select("circle")
              .transition().duration(500)
              .style("fill", function(p) {
                    return p.region == d.region ? "red" : "gray";
              });
      d3.select(this).select("text").classed("active", true)
        .attr("y", 10).attr('font-size', '54px');
      d3.selectAll("g.overallG").select("circle").each(function(p,i) {
         p.region == d.region ?
            d3.select(this).classed("active",true) :
            d3.select(this).classed("inactive",false);
        });
      this.parentElement.appendChild(this); 
  }; 

  teamG.on('click', buttonClick2);
  function buttonClick2(datapoint) {
    var maxValue = d3.max(incomingData, function(el) {
        return parseFloat(el[datapoint ]);
    });
    var tenColorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var radiusScale = d3.scaleLinear().domain([0,maxValue]).range([2,20]);
    d3.selectAll("g.overallG").select("circle").transition().duration(1000)
        .style("fill", function(p) {return tenColorScale(p.region)})
  };

  teamG.on("mouseout", unHighlight)
  function unHighlight() {
      d3.selectAll("g.overallG")
        .select("circle")
        .transition().duration(500)
        .style("fill", "pink");
     d3.selectAll("g.overallG").select("circle").attr("class", "");
     d3.selectAll("g.overallG").select("text")
        .classed("highlight", false).attr("y", 30);
  };
  teamG.select("text").style("pointer-events","none");
  

  d3.text("resources/modal.html", function(data) {
    d3.select("body").append("div").attr("id", "modal").html(data);
  }); 
  teamG.on("click", teamClick);
  function teamClick(d) {
      d3.selectAll("td.data").data(d3.values(d))
          .html(function(p) {
              return p
          });
  };  

};
}