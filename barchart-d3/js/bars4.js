var barChart;
var dataset = [ {"key":"a","v":5},
	{"key":"b","v":10},
	{"key":"c","v":15},
	{"key":"d","v":20},
	{"key":"e","v":25} ];
	
function pageIsLoaded() {
	uiInit();
	d3ProjectInit();
}

function uiInit() {
	// Alter the text underneath the buttons
	document.getElementById("btext0").innerHTML = "Update";
	document.getElementById("btext1").innerHTML = "Random";
	document.getElementById("btext2").innerHTML = "Delete";
	document.getElementById("btext3").innerHTML = "Insert";
	document.getElementById("btext4").innerHTML = "Shift";
	// Register the click event handlers
	var e = document.getElementById("btn0");
	e.addEventListener("click", updateBars, false);
	e.style.cursor = "pointer";
	e = document.getElementById("btn1");
	e.addEventListener("click", randomBars, false);
	e.style.cursor = "pointer";
	e = document.getElementById("btn2");
	e.addEventListener("click", deleteBar, false);
	e.style.cursor = "pointer";
	e = document.getElementById("btn3");
	e.addEventListener("click", addBar, false);
	e.style.cursor = "pointer";
	e = document.getElementById("btn4");
	e.addEventListener("click", shiftBars, false);
	e.style.cursor = "pointer";
}

// project initialization function
function d3ProjectInit() {
	// Build the initial bar chart in the DOM
	barChart = new D3WRAP.SimpleBarChart("#chart1inner", dataset, {});
	dumpDataset();
}

// ----- Functions -----

// Populate the data array with random values  from 5 to 30
function randomBars() {
	var k;
	for (k=0; k<dataset.length; k++) {
		dataset[k].v = Math.random()*25.0 + 5.0;
	}
	dumpDataset();
}

// Update the DOM elements to reflect changes in the data array
function updateBars() {
	barChart.update(dataset);
}

// Delete one data array element at the second position
function deleteBar() {
	dataset.splice(1,1);
	dumpDataset();
}

// Add one random value data element at the 3rd position of the data array
var newIdCtr = 10;
function addBar() {
	var dat ={};
	dat.key = "b" + String(newIdCtr++);
	dat.v = Math.random()*25.0 + 5.0;
	dataset.splice(2,0, dat);
	dumpDataset();
}

//shift values by 1
function shiftBars() {
	dataset.splice(0,1);
	addBar();
	updateBars();
}

// Display dataset on 2nd chart
function dumpDataset()
{
	var e = document.getElementById("chart2");
	e.style.fontFamily='Courier';
	e.style.fontSize='12px';
	e.innerHTML = '';
	for (var i=0; i<dataset.length; i++) {
		var s = JSON.stringify(dataset[i]);
		e.innerHTML += s+'<br/>'
	}
}