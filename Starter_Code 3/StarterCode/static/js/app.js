// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Console log JSON data
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard 
function init() {

    // Select the dropdown menu
    let dropdownmenu = d3.select("#selDataset");

    // Get sample names and populate drop-down selector
    d3.json(url).then((data) => {
        
        // Set variable for sample names
        let samplenames = data.names;

        // Add samples to dropdown menu
        samplenames.forEach((id) => {
            dropdownmenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let first_sample = samplenames[0];

        // Log the value of sample_one
        console.log(first_sample);

        // Build the initial visualizations
        builddemodata(first_sample);
        buildbarchart(first_sample);
        buildbubblechart(first_sample);
        buildgaugechart(first_sample);
        
    });
};

// Populate Demographic info
function builddemodata(sample) {

    // Use D3 to retrieve data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let demodata = data.metadata;
        // Filter based on sample value
        let value = demodata.filter(result => result.id == sample);
        // Find first index
        let valuedata = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");
        // Add each key/value pair to the panel
        Object.entries(valuedata).forEach(([key,value]) => {

            // Log the pairs as they are being appended
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Build the bar chart
function buildbarchart(sample) {

    // Retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleinfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleinfo.filter(result => result.id == sample);

        // Find first index
        let valuedata = value[0];

        // Identify data to plot
        let otu_ids = valuedata.otu_ids;
        let otu_labels = valuedata.otu_labels;
        let sample_values = valuedata.sample_values;

        // Log the data to console
        console.log(otu_ids,otu_labels,sample_values);

        // Display top ten in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h",
            marker:{
                color:"darkblue"
            }
        };

        // Set the layout
        let layout = {
            title: `Top 10 OTUs Found in the Individual`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };

        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Builds the bubble chart
function buildbubblechart(sample) {

    // Retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleinfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleinfo.filter(result => result.id == sample);

        // Find first index
        let valuedata = value[0];

        // Identify data to plot
        let otu_ids = valuedata.otu_ids;
        let otu_labels = valuedata.otu_labels;
        let sample_values = valuedata.sample_values;

        // Log the data to console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Viridis"
            }
        };

        // Set the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        // Plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Builds the Gauge Chart
function buildgaugechart(sample) {

    // Retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleinfo = data.metadata;

        // Filter based on the value of the sample
        let value = sampleinfo.filter(result => result.id == sample);

        // Find first index
       let valuedata = value[0];
        
        // Data for gauge chart
        var data2 = [
            {
                domain: { 
                    x: [0, 1], 
                    y: [0, 1] 
                },
                value: valuedata.wfreq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis:{
                        range:[0,10]
                    },
                    bar:{
                        color: 'gold'
                    },
                    steps: [
                        {range: [0,1], color: '#F5F5F5'},
                        {range: [1,2], color: '#EBEBEB'},
                        {range: [2,3], color: '#D0D0D0'},
                        {range: [3,4], color: '#B6B6B6'},
                        {range: [4,5], color: '#9C9C9C'},
                        {range: [5,6], color: '#828282'},
                        {range: [6,7], color: '#697A3A'},
                        {range: [7,8], color: '#556B2F'},
                        {range: [8,9], color: '#465E2B'},
                        {range: [9,10], color: '#354F25'}
                    ]
                }
                }
        ];
         // Set the layout
        var layout2 = { 
            width: 600, 
            height: 500, 
            margin: { 
                t: 0, 
                b: 0 
            } };
        
        Plotly.newPlot('gauge', data2, layout2);
    });
};

// Function that updates dashboard when dropdown changes
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    builddemodata(value);
    buildbarchart(value);
    buildbubblechart(value);
    buildgaugechart(value);
};

// Initialize
init();