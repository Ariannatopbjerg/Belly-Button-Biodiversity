function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(samplenum => samplenum.id == sample);

    // Create a variable that holds the first sample in the array.
    var sampleNum = samplesArray[0];
    console.log(sampleNum);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = sampleNum.otu_ids;
    console.log(ids);
    var labels = sampleNum.otu_labels;
    console.log(labels);
    var values = sampleNum.sample_values;
    console.log(values);

    // Bar Chart

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topOTU = (ids.slice(0, 10)).reverse();
    var yticks = topOTU.map(id => "OTU" + id);
    console.log(`OTU IDS: ${yticks}`);
    var topValues = (values.slice(0, 10)).reverse();
    console.log(topValues);
    var topLabels = labels.slice(0, 10);
    console.log(topLabels);

    // Create the trace for the bar chart. 
    var trace = {
      x: topValues,
      y: yticks,
      text: topLabels,
      type: "bar",
      orientation: "h"

    };
    var barData = [trace];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "linear"
      },
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
      }
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart

    // Create the trace for the bubble chart.
    var trace1 = {
      x: ids,
      y: values,
      mode: "markers",
      marker: {
        size: values,
        color: ids
      },
      text: labels
    };
    var bubbleData = [trace1];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      height: 550,
      width: 1300

    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Gauge Chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Create a variable that holds the first sample in the array.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(result.wfreq);
    console.log(washFreq);

    // Create the trace for the gauge chart.
    var trace2 = {
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: 'Belly Button Washing Frequency <br> Scrubs per Week'
      },
      gauge: {
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "darkorange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ]
      },
    };
    var gaugeData = [trace2];

    // Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 300,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black" }

    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
