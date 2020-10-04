var drawPlot = function(runners,target,xScale,yScale,margins,graph)
{
    d3.select("#scatter svg")
    .selectAll("circle")
    .data(runners)
    .enter()
    .append("circle")
    .attr("cx",function(runner)
    {
        return xScale(runner.Result)+margins.left
    })
    .attr("cy", function(runner)
    {
        return  yScale(runner.Ratio)+margins.top 
    })
    .attr("r",4)
    .on("mouseenter",function(runner)
    {
        var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top", yPos+"px")
        .style("left",xPos+"px")
        d3.select("#name")
        .text(runner.Name)
        d3.select("#country")
        .text(runner.Nationality)
        d3.select("#body")
        .text("Ht: " + runner.Height + "in Wt: " + runner.Weight + "lbs")
    })
}

var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}

var drawAxes = function(graphDim,margins,xScale,yScale)
{
   var xAxis=d3.axisBottom(xScale)
   d3.select("#scatter svg")
    .append("g")
    .call(xAxis)
    .attr("transform", makeTranslateString(margins.left, graphDim.height+margins.top))
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#scatter svg")
    .append("g")
    .attr("transform", makeTranslateString(margins.left, margins.top))
    .call(yAxis)
}

var drawLabels = function(graph,margins,event)
{
    var title = d3.select("#scatter svg")
   
    title.append("text")
    .text("Body Size of Male Olympic Runners Versus Event Time: " + event)
    .classed("title", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graph.width/2))
    .attr("y",margins.top/2)
    
    var xLabel = d3.select("#scatter svg")
    
    xLabel.append("text")
    .text("Time (s)")
    .classed("label", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graph.width/2))
    .attr("y",graph.height+margins.top+margins.bottom)
    
    var yLabel = d3.select("#scatter svg")
    yLabel.append("text")
    .attr("transform",makeTranslateString(margins.left/2, margins.top+graph.height/2 ) + " rotate(-90)")
    .text("Weight/Height Ratio (lbs/in)")
    .classed("label","true")
    .attr("text-anchor","middle")
}

var initGraph = function(olympians,event)
{
    var runners = olympians.filter(function(runner)
                    {
                        return runner.Event == event
                    })
    
    var screen = {width:1000,height:600}
    var margins = {left:100,right:100,top:50,bottom:50}
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    
    d3.select("#scatter svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var times = runners.map(function(runner)
    {
        if (runner.Event == "100M Men")
            {
                return Number(runner.Result)
            }
    })

    var xScale = d3.scaleLinear()
        .domain([d3.max(times),d3.min(times)])
        .range([0,graph.width])

    var yScale = d3.scaleLinear()
        .domain([0,3])
        .range([graph.height,0])
    
    d3.select("#scatter svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#scatter svg")
    .append("g")
    .attr("id","graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")")
    
    drawPlot(runners,target,xScale,yScale,margins,graph)
    drawAxes(graph,margins,xScale,yScale)
    drawLabels(graph,margins,event)
}

successFCN = function(runners)
{
    console.log(runners)
    d3.select("#one")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"100M Men")
    })
    d3.select("#two")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"110M Hurdles Men")
    })
    d3.select("#three")
    .on("click",function()
    {
        d3.select("#scatter>svg>*")
        .remove()
        initGraph(runners,"200M Men")
    })
    d3.select("#four")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"400M Men")
    })
    d3.select("#five")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"400M Hurdles Men")
    })
    d3.select("#six")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"800M Men")
    })
    d3.select("#seven")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"1500M Men")
    })
    d3.select("#eight")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"3000M Steeplechase Men")
    })
    d3.select("#nine")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"5000M Men")
    })
    d3.select("#ten")
    .on("click",function()
    {
        d3.select("#scatter svg *")
        .remove()
        initGraph(runners,"10000M Men")
    })
}

failFCN = function()
{
    console.log("Data Not Found")
}

olymicPromise = d3.csv("../data/runnerData.csv")
olymicPromise.then(successFCN,failFCN)
