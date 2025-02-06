function test() {
    // Create AnyChart graph
	anychart.onDocumentReady(function () {
		// Define data
		var data = [
		  ["2003", 1, 0, 0],
		  ["2004", 4, 0, 0],
		  ["2005", 6, 0, 0],
		  ["2006", 9, 1, 0],
		  ["2007", 12, 2, 0],
		  ["2008", 13, 5, 1],
		  ["2009", 15, 6, 1],
		  ["2010", 16, 9, 1],
		  ["2011", 16, 10, 4],
		  ["2012", 0, 11, 0],
		  ["2013", 17, 0, 6],
		  ["2014", 17, 14, 7],
		  ["2015", 17, 14, 10],
		  ["2016", 17, 14, 12],
		  ["2017", 19, 16, 12],
		  ["2018", 20, 17, 14],
		  ["2019", 20, 19, 16],
		  ["2020", 20, 20, 17],
		  ["2021", 20, 20, 20],
		  ["2022", 20, 22, 20]
		];

		// Create a data set
		var dataSet = anychart.data.set(data);

		// Create a line chart
		var chart = anychart.line();

		// Add series to the chart
		chart.line(dataSet.mapAs({ x: 0, value: 1 })).name("Line 1");
		chart.line(dataSet.mapAs({ x: 0, value: 2 })).name("Line 2");
		chart.line(dataSet.mapAs({ x: 0, value: 3 })).name("Line 3");

		// Add legend and title
		chart.legend().enabled(true);
		chart.title("Example height graph");
		chart.xAxis().title('Length')
		chart.yAxis().title('Height (mm)')

		// Set the container where the chart will be drawn
		chart.container("graph");
		chart.fullScreen(true);

		// Draw the chart
		chart.draw();
	});
}