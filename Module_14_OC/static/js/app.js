// Fetch JSON data and populate the dropdown menu
d3.json("samples.json").then((data) => {
    var names = data.names;
  
    var dropdownMenu = d3.select("#selDataset");
  
    names.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });
  
    // Initial data population
    populateCharts(names[0]);
    populateDemographicInfo(names[0]);
  });
  
  // Function to populate the charts
  function populateCharts(selectedSampleID) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
  
      // Filter samples data for the selected sample ID
      var selectedSample = samples.find((sample) => sample.id === selectedSampleID);
  
      // Extract top 10 OTU IDs, values, and labels
      var top10OTUIDs = selectedSample.otu_ids.slice(0, 10).reverse();
      var top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
      var top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();
  
      // Create the horizontal bar chart
      var barTrace = {
        x: top10SampleValues,
        y: top10OTUIDs.map((id) => `OTU ${id}`),
        text: top10OTULabels,
        type: "bar",
        orientation: "h",
      };
  
      var barData = [barTrace];
  
      var barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" },
      };
  
      Plotly.newPlot("bar", barData, barLayout);
  
      // Create the bubble chart
      var bubbleTrace = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: "markers",
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids,
          colorscale: "Earth",
        },
      };
  
      var bubbleData = [bubbleTrace];
  
      var bubbleLayout = {
        title: "OTU IDs vs. Sample Values",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" },
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
  }
  
  // Function to populate the demographic info table
  function populateDemographicInfo(selectedSampleID) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
  
      // Find the metadata object for the selected sample ID
      var selectedMetadata = metadata.find((metadata) => metadata.id === parseInt(selectedSampleID));
  
      // Select the demographic info table element
      var demographicInfoTable = d3.select("#sample-metadata");
  
      // Clear any existing content in the table
      demographicInfoTable.html("");
  
      // Iterate over the properties of the selected metadata and append rows to the table
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        var row = demographicInfoTable.append("tr");
        row.append("td").text(key);
        row.append("td").text(value);
      });
    });
  }
  
  // Event handler for dropdown menu change
  function optionChanged(selectedSampleID) {
    populateCharts(selectedSampleID);
    populateDemographicInfo(selectedSampleID);
  }
  
  // Initialize the webpage with the default sample
  var defaultSampleID = d3.select("#selDataset").property("value");
  populateCharts(defaultSampleID);
  populateDemographicInfo(defaultSampleID);
  