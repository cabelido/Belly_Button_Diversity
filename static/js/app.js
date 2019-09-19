
// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  var metadataURL = "/metadata/" + sample;
// Use `d3.json` to fetch the metadata for a sample
  d3.json(metadataURL).then(function(data) {
// Use d3 to select the panel with id of `#sample-metadata`
  var sampleData = d3.select("#sample-metadata")
// Use `.html("") to clear any existing metadata
  sampleData.html("");
     
// Use `Object.entries` to add each key and value pair to the panel     
  Object.entries(data).forEach(([key,value]) => {
      sampleData.append("h4").text(`${key}:${value}`)
      .append("hr")
      });
        
   });
};
// BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
   
function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
   var chartsURL = "/samples/" +sample;
   d3.json(chartsURL).then(function(data) {
// @TODO: Build a Bubble Chart using the sample data
      var trace = [{
      "x": data.otu_ids,
      "y": data.sample_values,
      mode: "markers",
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
        colorscale: "Picnic"
        }
      }];
  
      var layout = {
      showLegend: false,
      // height: 600,
      // width: 2000
    };
    Plotly.newPlot('bubble', trace, layout);

// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).
    var data = [{
    values: data.sample_values.slice(0, 10),
    labels: data.otu_ids.slice(0, 10),
    hovertext: data.otu_labels.slice(0, 10),
    type: 'pie'
    }];
    var layout = {
    showlegend: true
    };
    Plotly.newPlot('pie', data, layout);
  });
  };

function init() {
// Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}
// Initialize the dashboard

init();
