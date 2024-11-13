// Load the data
const data1 = d3.csv("iris.csv");

// Once the data is loaded, proceed with plotting
data1.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.PetalLength = +d.PetalLength;
        d.PetalWidth = +d.PetalWidth;
    });

    // Define the dimensions and margins for the SVG
  let
    width = 600,
    height = 600;
  
  let margin = {
    top: 40,
    bottom: 30,
    left: 30,
    right: 30
}
    // Create the SVG container
    let svg = d3.select('#scatterplot')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'lightyellow');
    
    // Set up scales for x and y axes  

    let yScale = d3.scaleLinear() // for the continous data
              .domain([d3.min(data, d => d.PetalWidth) - 1, d3.max(data, d => d.PetalWidth) + 1]) //the data
              .range([height - margin.bottom, margin.top])

    let xScale = d3.scaleLinear()
              .domain([d3.min(data, d => d.PetalLength) - 1, d3.max(data, d => d.PetalLength) + 1])
              .range([margin.left, width - margin.right])

  const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.Species))
      .range(d3.schemeCategory10);

    // Add scales 

    let yAxis = svg.append('g')
        .call(d3.axisLeft(yScale))
        .attr('transform', `translate(${margin.left},0)`)

    let xAxis = svg.append('g')
          .call(d3.axisBottom(xScale))
          .attr('transform', `translate(0,${height - margin.bottom})`)

    // Add circles for each data point
    let circle = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.PetalLength))
        .attr("cy", d => yScale(d.PetalWidth))
        .attr("r", 5)
        .attr("fill", d => color(d.Species));

    // Add x-axis label
    svg.append('text')
        .attr('x', width/2)
        .attr('y', height - 50)
        .text('Petal Length')
        .style('text-anchor', 'middle')
        
    // Add y-axis label
    svg.append('text')
    .attr('x', 0 - height/2)
    .attr('y', 0)
    .text('Petal Width')
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    
    // Add legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, + ${i * 20 + 15})`)

    legend.append("circle")
    .attr("x", width - 20)
    .attr("width", 18)
    .attr("height", 7)
    .style("fill", colorScale);

    legend.append("text")
    .attr("x", width - 8)
    .attr("y", 10)
    .style("text-anchor", "start")
    .text(d => d);
});

    // Convert string values to numbers
   data1.then(function(data) {
        data.forEach(function(d){
            d.PetalLength = +d.PetalLength;
            d.PetalWidth = +d.PetalWidth;
        }); 

    // Define the dimensions and margins for the SVG
  let
  width = 600,
  height = 400;

let margin = {
  top: 40,
  bottom: 30,
  left: 30,
  right: 30
}
  // Create the SVG container
  let svg = d3.select('#boxplot')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', 'lightyellow');
  
  // Set up scales for x and y axes  

  let yScale = d3.scaleLinear() // for the continous data
            .domain([d3.min(data, d => d.PetalWidth) - 1, d3.max(data, d => d.PetalWidth) + 1]) //the data
            .range([height - margin.bottom, margin.top])

  let xScale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Species))])  // unique species names
    .range([margin.left, width - margin.right])
    .padding(0.2);

const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.Species))
    .range(d3.schemeCategory10);

  // Add scales 

  let yAxis = svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', `translate(${margin.left},0)`)

  let xAxis = svg.append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${height - margin.bottom})`)
 
    // Add x-axis label

    svg.append('text')
        .attr('x', width/2)
        .attr('y', height - 15)
        .text("Species")
        .style("text-anchor", 'middle') 

    // Add y-axis label
    svg.append('text')  
        .attr('x', 0 - height/2) 
        .attr('y', 20)
        .text("Petal Length")
        .style('text-anchor', 'middle') 
        .attr('transform', 'rotate(-90)')
    
    // this gets all the necessary functions to figure out where we need to start 
    // the box plot and where we need to end the box plot. 
    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.PetalLength).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const q2 = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const min = Math.max(d3.min(values), q1 - 1.5 * (q3-q1));
        const max = Math.min(d3.max(values), q3 + 1.5 * (q3-q1));
        return { q1, q2, q3, min, max};
    }; 

    //  This uses the function defined above to get all the necessary data points and then splits it by species
    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);

    // this creates the scale for the boxplot by getting the x and y coordinates. 
    quartilesBySpecies.forEach((quartiles, Species) => {
        const x = xScale(Species);
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
            
        svg.append('line')
        .attr('x1', x + boxWidth / 2) 
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(quartiles.min))  
        .attr('y2', yScale(quartiles.max))
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

        // Draw box
 
        svg.append('rect')
            .attr('x', x) 
            .attr('y', yScale(quartiles.q3)) 
            .attr('width', boxWidth) 
            .attr('height', yScale(quartiles.q1) - yScale(quartiles.q3)) 
            .attr('fill', 'lightgrey')
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
             
        // Draw median line

        svg.append('line')
            .attr('x1', x) 
            .attr('x2', x + boxWidth) 
            .attr('y1', yScale(quartiles.q2))
            .attr('y2', yScale(quartiles.q2)) 
            .attr('stroke', 'black')
            .attr('stroke-width', 1);  
    });
}); 