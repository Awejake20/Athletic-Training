var timeConvert = function(string)
{
    var timeArray = string.split(":")
    var mins = Number(timeArray[0])
    var secs = Number(timeArray[1])
    return mins*60 + secs
}

var drawLabels_Box = function(graph,margins,info)
{
    var title = d3.select("#box svg")
   
    title.append("text")
    .text(info + " of Olympic Runners versus Event")
    .classed("title", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graph.width/2))
    .attr("y",margins.top/2)
    
    var xLabel = d3.select("#box svg")
    
    xLabel.append("text")
    .text("Event")
    .classed("label", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graph.width/2))
    .attr("y",graph.height+margins.top+margins.bottom)
    
    var yLabel = d3.select("#box svg")
    yLabel.append("text")
    .attr("transform",makeTranslateString(margins.left/2, margins.top+graph.height/2 ) + " rotate(-90)")
    .text(info)
    .classed("label","true")
    .attr("text-anchor","middle")
}

var drawAxes_Box = function(graph,margins,xScale,yScale)
{
    var xAxis=d3.axisBottom(xScale)
    d3.select("#box svg")
    .append("g")
    .call(xAxis)
    .attr("transform", makeTranslateString(margins.left, graph.height+margins.top))
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#box svg")
    .append("g")
    .attr("transform", makeTranslateString(margins.left, margins.top))
    .call(yAxis)
}

var drawBox = function(olympians,target,xScale,yScale,margins,graph,info,lineScale)
{
    var runners_100 = olympians.filter(function(runner)
                {
                    return runner.Event == "100M"
                })
    var runners_110h = olympians.filter(function(runner)
                {
                    return runner.Event == "110M Hurdles"
                })
    var runners_200 = olympians.filter(function(runner)
                {
                    return runner.Event == "200M"
                })
    var runners_400 = olympians.filter(function(runner)
                {
                    return runner.Event == "400M"
                })
    var runners_400h = olympians.filter(function(runner)
                {
                    return runner.Event == "400M Hurdles"
                })
    var runners_800 = olympians.filter(function(runner)
                {
                    return runner.Event == "800M"
                })
    var runners_1500 = olympians.filter(function(runner)
                {
                    return runner.Event == "1500M"
                })
    var runners_3000 = olympians.filter(function(runner)
                {
                    return runner.Event == "3000M Steeplechase"
                })
    var runners_5000 = olympians.filter(function(runner)
                {
                    return runner.Event == "5000M"
                })
    var runners_10000 = olympians.filter(function(runner)
                {
                    return runner.Event == "10000M"
                })
    var runnersEvents = [runners_100,runners_110h,runners_200,runners_400,runners_400h,runners_800,runners_1500,runners_3000,runners_5000,runners_10000]
    
    target.selectAll("rect")
    .data(runnersEvents)
    .enter()
    .append("rect")
    .attr("x",function(event)
    {
        return xScale(event[0].Event)
    })
    .attr("y",function(event)
    {
        var data = event.map(function(runner)
        {
            if (info == "Height")
                {return Number(runner.Height)}
            else if (info == "Weight")
                {return Number(runner.Weight)} 
            else if (info == "Ratio")
                {return Number(runner.Ratio)}
        })
        return yScale(d3.mean(data)+d3.deviation(data))
    })
    .attr("width",xScale.bandwidth)
    .attr("fill","#da7655")
    .attr("height",function(event)
    {
        var data = event.map(function(runner)
        {
            if (info == "Height")
                {return Number(runner.Height)}
            else if (info == "Weight")
                {return Number(runner.Weight)} 
            else if (info == "Ratio")
                {return Number(runner.Ratio)}
        })
        
        return -yScale(d3.mean(data)+d3.deviation(data))+yScale(d3.mean(data)-d3.deviation(data))
    })
    
    target.selectAll("line")
    .data(runnersEvents)
    .enter()
    .append("line")
    .attr("x1",function(event)
    {
        return lineScale(event[0].Event)
    })
    .attr("x2",function(event)
    {
        return lineScale(event[0].Event)
    })
    .attr("y1",function(event)
    {
        var data = event.map(function(runner)
        {
            if (info == "Height")
                {return Number(runner.Height)}
            else if (info == "Weight")
                {return Number(runner.Weight)} 
            else if (info == "Ratio")
                {return Number(runner.Ratio)}
        })
        
        return yScale(d3.max(data))
    })
    .attr("y2",function(event)
    {
        var data = event.map(function(runner)
        {
            if (info == "Height")
                {return Number(runner.Height)}
            else if (info == "Weight")
                {return Number(runner.Weight)} 
            else if (info == "Ratio")
                {return Number(runner.Ratio)}
        })
        
        return yScale(d3.min(data))
    })
    .attr("stroke","#da7655")
    .attr("stroke-width",2)
    
}

var initBox = function(runners,info)
{   
    var screen = {width:650,height:400}
    var margins = {left:50,right:50,top:50,bottom:50}
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    
    d3.select("#box svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var xScale = d3.scaleBand()
        .domain(["100M","110M Hurdles","200M","400M","400M Hurdles","800M","1500M","3000M Steeplechase","5000M","10000M"])
        .range([0,graph.width])
        .padding(0.3)

    if (info == "Height")
        {yScale = d3.scaleLinear()
                    .domain([0,84])
                    .range([graph.height,0])}
    else if (info == "Weight")
            {yScale == d3.scaleLinear()
                        .domain([0,220])
                        .range([graph.height,0])}
    else if (info == "Ratio")
            {yScale = d3.scaleLinear()
                        .domain([0,3])
                        .range([graph.height,0])}
    
    var lineScale = d3.scalePoint()
        .domain(["100M","110M Hurdles","200M","400M","400M Hurdles","800M","1500M","3000M Steeplechase","5000M","10000M"])
        .range([0,graph.width])
        .padding(0.65)
    
    d3.select("#box svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#box svg")
    .append("g")
    .attr("id","graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")")
    
    drawBox(runners,target,xScale,yScale,margins,graph,info,lineScale)
    drawAxes_Box(graph,margins,xScale,yScale)
    drawLabels_Box(graph,margins,info)
}

var drawLabels_Bar = function(graph,margins,info)
{
    var title = d3.select("#bar svg")
   
    title.append("text")
    .text(info + " of Olympic Runners versus Event")
    .classed("title", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graph.width/2))
    .attr("y",margins.top/2)
    
    var xLabel = d3.select("#bar svg")
    
    xLabel.append("text")
    .text("Event")
    .classed("label", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graph.width/2))
    .attr("y",graph.height+margins.top+margins.bottom)
    
    var yLabel = d3.select("#bar svg")
    yLabel.append("text")
    .attr("transform",makeTranslateString(margins.left/2, margins.top+graph.height/2 ) + " rotate(-90)")
    .text("Mean " + info)
    .classed("label","true")
    .attr("text-anchor","middle")
}

var drawAxes_Bar = function(graph,margins,xScale,yScale)
{
    var xAxis=d3.axisBottom(xScale)
    d3.select("#bar svg")
    .append("g")
    .call(xAxis)
    .attr("transform", makeTranslateString(margins.left, graph.height+margins.top))
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("#bar svg")
    .append("g")
    .attr("transform", makeTranslateString(margins.left, margins.top))
    .call(yAxis)
}

var drawBars = function(olympians,target,xScale,yScale,margins,graph,info)
{
    var runners_100 = olympians.filter(function(runner)
                {
                    return runner.Event == "100M"
                })
    var runners_110h = olympians.filter(function(runner)
                {
                    return runner.Event == "110M Hurdles"
                })
    var runners_200 = olympians.filter(function(runner)
                {
                    return runner.Event == "200M"
                })
    var runners_400 = olympians.filter(function(runner)
                {
                    return runner.Event == "400M"
                })
    var runners_400h = olympians.filter(function(runner)
                {
                    return runner.Event == "400M Hurdles"
                })
    var runners_800 = olympians.filter(function(runner)
                {
                    return runner.Event == "800M"
                })
    var runners_1500 = olympians.filter(function(runner)
                {
                    return runner.Event == "1500M"
                })
    var runners_3000 = olympians.filter(function(runner)
                {
                    return runner.Event == "3000M Steeplechase"
                })
    var runners_5000 = olympians.filter(function(runner)
                {
                    return runner.Event == "5000M"
                })
    var runners_10000 = olympians.filter(function(runner)
                {
                    return runner.Event == "10000M"
                })
    var runnersEvents = [runners_100,runners_110h,runners_200,runners_400,runners_400h,runners_800,runners_1500,runners_3000,runners_5000,runners_10000]
    
    
    
    target.selectAll("rect")
    .data(runnersEvents)
    .enter()
    .append("rect")
    .attr("x",function(event)
    {
        return xScale(event[0].Event)
    })
    .attr("y",function(event)
    {
        var data = event.map(function(runner)
        {
            if (info == "Height")
                {return Number(runner.Height)}
            else if (info == "Weight")
                {return Number(runner.Weight)} 
            else if (info == "Ratio")
                {return Number(runner.Ratio)}
        })
        
        return yScale(d3.mean(data))
    })
    .attr("width",xScale.bandwidth)
    .attr("fill","#da7655")
    .attr("height",function(event)
    {
        var data = event.map(function(runner)
        {
            if (info == "Height")
                {return Number(runner.Height)}
            else if (info == "Weight")
                {return Number(runner.Weight)} 
            else if (info == "Ratio")
                {return Number(runner.Ratio)}
        })
        
        console.log(data)
        return graph.height - yScale(d3.mean(data))
    })
    
}

var initBar = function(runners,info)
{   
    var screen = {width:650,height:400}
    var margins = {left:50,right:50,top:50,bottom:50}
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    
    d3.select("#bar svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var xScale = d3.scaleBand()
        .domain(["100M","110M Hurdles","200M","400M","400M Hurdles","800M","1500M","3000M Steeplechase","5000M","10000M"])
        .range([0,graph.width])
        .padding(0.3)

    if (info == "Height")
        {yScale = d3.scaleLinear()
                    .domain([0,84])
                    .range([graph.height,0])}
    else if (info == "Weight")
            {yScale = d3.scaleLinear()
                        .domain([0,220])
                        .range([graph.height,0])}
    else if (info == "Ratio")
            {yScale = d3.scaleLinear()
                        .domain([0,3])
                        .range([graph.height,0])}
    
    d3.select("#bar svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("#bar svg")
    .append("g")
    .attr("id","graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")")
    
    drawBars(runners,target,xScale,yScale,margins,graph,info)
    drawAxes_Bar(graph,margins,xScale,yScale)
    drawLabels_Bar(graph,margins,info)
}

var drawPlot = function(runners,target,xScale,yScale,margins,graph,event)
{
    d3.select("#scatter svg")
    .selectAll("circle")
    .data(runners)
    .enter()
    .append("circle")
    .attr("cx",function(runner)
    {
        if (event == "100M" || 
           event == "110M Hurdles" ||
           event == "200M" ||
           event == "400M" ||
           event == "400M Hurdles")    
            {return xScale(runner.Result)+margins.left}
        else
            {return xScale(timeConvert(runner.Result))+ margins.left}
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
    .on("mouseleave",function()
    {
       d3.select("#tooltip")
        .classed("hidden",true)
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
    .text("Body Size of Olympic Runners Versus Event Time: " + event)
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
    .attr("y",graph.height+margins.top+margins.bottom/2)
    
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
    
    var screen = {width:650,height:400}
    var margins = {left:100,right:100,top:50,bottom:100}
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
        if (event == "100M" || 
           event == "110M Hurdles" ||
           event == "200M" ||
           event == "400M" ||
           event == "400M Hurdles")    
            {return Number(runner.Result)}
        else
            {return timeConvert(runner.Result)}
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
    
    drawPlot(runners,target,xScale,yScale,margins,graph,event)
    drawAxes(graph,margins,xScale,yScale)
    drawLabels(graph,margins,event)
}

successFCN = function(runners)
{
    console.log(runners)
    initGraph(runners,"100M")
    d3.select("#one")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"100M")
    })
    d3.select("#two")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"110M Hurdles")
    })
    d3.select("#three")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"200M")
    })
    d3.select("#four")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"400M")
    })
    d3.select("#five")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"400M Hurdles")
    })
    d3.select("#six")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"800M")
    })
    d3.select("#seven")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"1500M")
    })
    d3.select("#eight")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"3000M Steeplechase")
    })
    d3.select("#nine")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"5000M")
    })
    d3.select("#ten")
    .on("click",function()
    {
        d3.selectAll("#scatter svg *")
        .remove()
        initGraph(runners,"10000M")
    })
    initBar(runners,"Ratio")
    initBox(runners,"Ratio")
    d3.select("#height")
    .on("click",function()
    {
        d3.selectAll("#bar svg *")
        .remove()
        d3.selectAll("#box svg *")
        .remove()
        initBar(runners,"Height")
        initBox(runners,"Height")
    })
    d3.select("#weight")
    .on("click",function()
    {
        d3.selectAll("#bar svg *")
        .remove()
        d3.selectAll("#box svg *")
        .remove()
        initBar(runners,"Weight")
        initBox(runners,"Weight")
    })
    d3.select("#ratio")
    .on("click",function()
    {
        d3.selectAll("#bar svg *")
        .remove()
        d3.selectAll("#box svg *")
        .remove()
        initBar(runners,"Ratio")
        initBox(runners,"Ratio")
    })
    
}

failFCN = function()
{
    console.log("Data Not Found")
}

olymicPromise = d3.csv("../data/runnerData.csv")
olymicPromise.then(successFCN,failFCN)