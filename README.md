# An Application to Network Design

This is a JavaScript, HTML5 and CSS3 enabled website which stimulates network link cost (a) and demand traffic (b) to display results in tabular as well as chart forms.

Requirements:

1) A latest version of web browser like Google Chrome or Mozilla Firefox or Safari
2) A folder structure as follows:
  Project1
  |
    - css
    - js
    - index.html (file)

In order to build and execute the program kindly follow the instructions:

1) Create a new file with name index.html and write the following code inside:
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/vis.min.css"/>
    <link rel="stylesheet" href="css/mystyle.css"/>
    <title>An Application to Network Design - Jatan Patel</title>
    <script src="js/jquery-1.9.1.min.js"></script>
    <script src="js/chart.min.js"></script>
    <script src="js/vis.min.js"></script>
    <script src="js/myscript.js"></script>
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div id="urlHolder" class="col-lg-12 text-center">
          <h1>An Application to Network Design - Jatan Patel (jjp140230)</h1>
        </div>
      </div>
      <div class="row" id="resultHolder">
      </div>
      <div class="row" id="kHolder3">
        <h2>K = 3</h2>
        <div id="k3" style="width:800px; height:800px"></div>
      </div>
      <div class="row" id="kHolder9">
        <h2>K = 9</h2>
        <div id="k9" style="width:800px; height:800px"></div>
      </div>
      <div class="row" id="kHolder15">
        <h2>K = 15</h2>
        <div id="k15" style="width:800px; height:800px"></div>
      </div>
      <div class="row" id="costHolder">
        <h2>Network Cost vs K</h2>
        <canvas id="costChart" width="800" height="600"></canvas>
      </div>
      <div class="row" id="densityHolder">
        <h2>Network Density vs K</h2>
        <canvas id="densityChart" width="800" height="600"></canvas>
      </div>
    </div>
  </body>
</html>

```

2) Create a new file with name myscript.js inside js folder and write the following code inside:
```
$(document).ready(function(){
	var table = "<table class='table table-striped table-bordered'>";
	table+="<thead>";
		table+="<th>K</th>";
		table+="<th>Network Cost</th>";
		table+="<th>Network Density</th>";
	table+="</thead>";
	table+="<tbody>";
// Total number of nodes
	var N = 30;
	var nodeRawData = [];
	var myUTDid = [2,0,2,1,2,3,1,0,5,7];
	var digits = myUTDid.concat(myUTDid);
	digits = digits.concat(myUTDid);
	var a = new Array(N);
	var b = new Array(N);
	var c = new Array(N);
	var d = new Array(N);
	var previous = new Array(N);
	var visited = new Array(N);
	// 2D array conversion in JavaScript
	for(var i=0; i<N; i++){
		nodeRawData.push({id:i, label:(i+1)});
		a[i] = new Array(N);
		b[i] = new Array(N);
		c[i] = new Array(N);
		for(var j=0;j<N;j++)
			c[i][j] = 0;
	}
	var kVals = [];
	var costArr = [];
	var densityArr = [];
	$("#resultHolder").html("");
	//Running for K=3,4,5,..., 15
	for(var k=3; k<16; k++){
		// For topology graph
		var edgeRawData = [];
		//Generating values of a & b
		for(var i=0; i<N; i++){
			//Generating k random integers
			var jRandoms = [];
			while(jRandoms.length<k){
				var temp = getRandomInt(0, N-1);
				if(!in_array(temp, jRandoms) && temp!=i)
					jRandoms.push(temp);
			}
			for(var j=0; j<N; j++){
				b[i][j] = Math.abs(digits[i]-digits[j]);
				if(in_array(j, jRandoms)){
					a[i][j] = 1;
					edgeRawData.push({from:i, to:j});
				}
				else
					a[i][j] = 300;
			}
		}
		// Dijkstra's Algorithm
		for(var i=0; i<N; i++){
			dijkstrasAlgorithm(i);
		}
		var nodes = new vis.DataSet(nodeRawData);
		var edges = new vis.DataSet(edgeRawData);
		table+="<tr>";
			table+="<td>"+k+"</td>";
			table+="<td>"+networkCost()+"</td>";
			table+="<td>"+networkDensity()+"</td>";
		table+="</tr>";
		kVals.push(k);
		costArr.push(networkCost());
		densityArr.push(networkDensity());

		if(k==3 || k==9 || k==15){
			plotTopology(k);
		}
	}
		table+="</tbody>";
	table+="</table>";
	$("#resultHolder").html(table);

	plotCostChart();
	plotDensityChart();

	function dijkstrasAlgorithm(n){
		var min;
		//initialization
		for(var i=0; i<N; i++){
			d[i] = 1000;
			previous[i] = -1;
			visited[i] = false;
		}
		d[n] = 0;
		for(var p=0; p<N; p++){
			min = -1;
			for(var i=0; i<N; i++)
				if(!visited[i] && (min==-1 || d[i]<d[min]))
					min = i;
			visited[min] = true;
			for(var i=0; i<N; i++){
				if(a[min][i]!=0){
					if(d[min]+a[min][i]<d[i]){
						d[i] = d[min]+a[min][i];
						previous[i] = min;
					}
				}
			}
		}
		for(var i=0;i<N;i++)
			path(i);
	}
	function path(n){
		if(previous[n] != -1){
			c[previous[n]][n] += a[previous[n]][n] * b[previous[n]][n];
			path(previous[n]);
		}
	}
	function networkCost(){
		var cost = 0;
		for(var i=0;i<N;i++)
			for(var j=0;j<N;j++)
				cost+=a[i][j]*b[i][j];
		return cost;
	}
	function networkDensity(){
		var density = 0.0;
		for(var i=0;i<N;i++)
			for(var j=0;j<N;j++){
				if(c[i][j]!=0)
				density+=1;
				//console.log(c[i][j]);
			}
		density = (density/(N*(N-1)));
		return density;
	}
	function in_array(what, where){
		var a=false;
	    for(var i=0;i<where.length;i++){
		    if(what == where[i]){
		    	a=true;
		    	break;
		    }
		}
		return a;
	}
	function getRandomInt (minimum, maximum) {
		return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
	}
	function plotTopology(n){
		var container = document.getElementById('k'+n);
		var data = {
		  nodes: nodes,
		  edges: edges
		};
		var options = {
			edges: {
        color:{inherit:true},
        width: 0.15,
				length: 400,
        smooth: {
          type: 'continuous'
        }
      },
      interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 200
      }
		};
		var network = new vis.Network(container, data, options);
	}
	function plotCostChart(){
		var ctxCost = document.getElementById("costChart").getContext("2d");
		var costData = {
	    labels: kVals,
	    datasets: [
	        {
	            label: "Network Cost",
							fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: costArr,
	        }
	    ]
		};
		var costChart = new Chart(ctxCost).Line(costData, {});
	}
	function plotDensityChart(){
		var ctxDensity = document.getElementById("densityChart").getContext("2d");
		var densityData = {
	    labels: kVals,
	    datasets: [
	        {
	            label: "Network Density",
							fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: densityArr,
	        }
	    ]
		};
		var densityChart = new Chart(ctxDensity).Line(densityData, {});
	}
});

```

3) Create a new file with name mysstyle.css inside css folder and write the following code inside:
```
body{
	text-align: center;
}
#urlHolder{
	padding-top: 5px;
}
#resultHolder{
	text-align: center !important;
}
#vidURL{
	width: 500px;
}
.row{
	margin-top:25px;
}
thead,th{
	text-align: center !important;
}

```

4) Create a new file with name bootstrap.min.css inside css folder and write the code from the link below:

https://raw.githubusercontent.com/jatanpatel92/ViralAnalysis/master/css/bootstrap.min.css

5) Create a new file with name vis.min.css inside css folder and write the code from the link below:

https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.css

6) Create a new file with name vis.min.js inside js folder and write the code from the link below:

https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.js

7) Create a new file with name chart.min.js inside js folder and write the code from the link below:

https://raw.githubusercontent.com/jatanpatel92/ViralAnalysis/master/js/chart.min.js

8) Create a new file with name jquery-1.9.1.min.js inside js folder and write the code from the link below:

https://raw.githubusercontent.com/jatanpatel92/ViralAnalysis/master/js/jquery-1.9.1.min.js

9) Now open index.html with the web browser and explore the results by reloading the page.
