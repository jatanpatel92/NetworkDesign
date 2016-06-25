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
	var randomPathDesign = [0,1,2,3,4,5,6,7,8,9];
	var digits = randomPathDesign.concat(randomPathDesign);
	digits = digits.concat(randomPathDesign);
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
