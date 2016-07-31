// see: http://bl.ocks.org/ameyms/9184728
var D3WRAP = { REVISION: '1' };

// Bar Chart Object
D3WRAP.SimpleBarChart = function(container, dataset, params) {
	this.container = container;
	this.dataset = dataset;
	this.params = params;
	var self = this;
	var colorGenerator = d3.scale.category20();
	// Provide parameter defaults if they are missing
	this.barConfig = {
		width : params.width || 800,
		height : params.height ||320,
		leftMargin : params.leftMargin || 30,
		topMargin : params.topMargin || 20,
		yScale : params.yScale || 6.0,
		xScale : params.xScale || 50.0,
		barWidth : params.barWidth || 40.0,
		chartWidth: params.chartWidth || 700,
		chartHeight : params.chartHeight || 250
	}

	// Function to adjust scales
	this.adjustScales = function() {
		self.yScale = d3.scale.linear()
			.domain([0, d3.max(self.dataset, function(d){return d.v;})])
			.range([self.barConfig.chartHeight, 0])
			;
		self.xScale = d3.scale.linear()
			.domain([0, self.dataset.length])
			.range([0, self.barConfig.chartWidth])
			;
	}
	
	// Select the DOM element into which we will insert the chart
	this.c1 = d3.select(container);
	// Append an SVG to the DOM element with an offset from the upper left corner
	this.svg1 = this.c1.append("svg")
		.attr("width", this.barConfig.width)
		.attr("height", this.barConfig.height)
		.append("g")
		.attr("transform", "translate(" + this.barConfig.leftMargin + "," + this.barConfig.topMargin + ")")
		;
	
	this.adjustScales();
	
	// Create axes and append to SVG
	this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
	this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");
	if(dataset.length>0){
	this.svg1.append("g").attr("class", "xaxis axis")
		.attr("transform", "translate(0," + this.barConfig.chartHeight + ")")
		.call(this.xAxis)
		;
	this.svg1.append("g").attr("class", "yaxis axis").call(this.yAxis);
	}
	
	
	
	// Creation of DOM elements in SVG from initial data
	this.svg1.selectAll("rect")
		.data(this.dataset,function(d){return d.key;})
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d,i){return self.xScale(i);})
		.attr("y", function(d,i){return self.yScale(d.v);})
		.attr("width", function(d,i){return self.barConfig.chartWidth/self.dataset.length-4;})
		.attr("height", function(d,i) {return self.barConfig.chartHeight-self.yScale(d.v);})
		.attr("fill", function(d,i){return colorGenerator(Math.round(d.v));})
		;
	this.svg1.selectAll("text.btext")
		.data(this.dataset,function(d){return d.key;})
		.enter().append("text")
		.attr("class", "btext")
		.attr("x", function(d,i){return self.xScale(i)+5;})
		.attr("y", function(d,i){return self.yScale(d.v)+15;})
		.text(function(d,i){return d.key;})
		;

	// Update function
	this.update = function(dataset) {
		self.dataset = dataset;
		// recompute the scales
		self.adjustScales();
		// adjust the axes
		this.svg1.append("g").attr("class", "xaxis axis")
		.attr("transform", "translate(0," + this.barConfig.chartHeight + ")")
		.call(this.xAxis)
		;
	    this.svg1.append("g").attr("class", "yaxis axis").call(this.yAxis);
		self.xAxis = d3.svg.axis().scale(self.xScale).orient("bottom");
		self.yAxis = d3.svg.axis().scale(self.yScale).orient("left");
		self.svg1.selectAll("g.xaxis.axis").transition().duration(500).call(self.xAxis);
		self.svg1.selectAll("g.yaxis.axis").transition().duration(500).call(self.yAxis);
		// Bind the new dataset
		var dataJoin = self.svg1.selectAll("rect")
			.data(self.dataset,function(d){return d.key;});
		var textJoin = self.svg1.selectAll("text.btext")
			.data(self.dataset,function(d){return d.key;});
		// The "enter" set consists of new data in the data array
		// The bar is initially set with zero height so it can transition later
		dataJoin.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d,i){return self.xScale(i);})
			.attr("y", function(d,i){return self.barConfig.chartHeight;})
			.attr("width", function(d,i){return self.barConfig.chartWidth/self.dataset.length-4;})
			.attr("height", function(d,i) {return 0;})
			.attr("fill", function(d,i){return colorGenerator(Math.round(d.v));})
			;
		textJoin.enter().append("text")
			.attr("class", "btext")
			.attr("x", function(d,i){return self.xScale(i)+5;})
			.attr("y", function(d,i){return self.barConfig.chartHeight+15;})
			.text(function(d,i){return d.key;})
			;
		// The "update" set now includes the "enter" set
		// A transition is applied to smootly change the data
		dataJoin.transition().duration(500)
			.attr("x", function(d,i){return self.xScale(i);})
			.attr("y", function(d,i){return self.yScale(d.v);})
			.attr("width", function(d,i){return self.barConfig.chartWidth/self.dataset.length-4;})
			.attr("height", function(d,i) {return self.barConfig.chartHeight-self.yScale(d.v);})
			;
		textJoin.transition().duration(500)
			.attr("class", "btext")
			.attr("x", function(d,i){return self.xScale(i)+5;})
			.attr("y", function(d,i){return self.yScale(d.v)+15;})
			.text(function(d,i){return d.key;})
			;
		// The "exit" set is transitioned to zero height and removed
		dataJoin.exit().transition().duration(500)
			.attr("y", function(d,i){return self.barConfig.chartHeight;})
			.attr("height", function(d,i) {return 0;})
			.remove()
			;
		textJoin.exit().transition().duration(500)
			.attr("y", function(d,i){return self.barConfig.chartHeight+15;})
			.remove();
			;
	}
	
}
D3WRAP.SimpleBarChart.prototype = Object.create(Object.prototype);
D3WRAP.SimpleBarChart.prototype.constructor = D3WRAP.SimpleBarChart;


D3WRAP.NeedleGauge = function(container, params) {
	this.container = container;
	this.params = params;
	this.el = d3.select(container);
}
D3WRAP.NeedleGauge.prototype = Object.create(Object.prototype);
D3WRAP.NeedleGauge.prototype.constructor = D3WRAP.NeedleGauge;
D3WRAP.NeedleGauge.prototype.setvalue = function (value) {
	this.value = value;
}