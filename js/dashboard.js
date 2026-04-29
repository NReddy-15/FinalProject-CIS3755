async function GenerateDashboard(genre, countryOne, countryTwo) {
    var readerAgesData = await d3.csv("../datasets/dashboard/Combined_BookRec_GenreToAge_V3.csv");
    var readerGenderData = await d3.csv("../datasets/dashboard/Combined_GlobalReader_GenreToGender_V3.csv");

    // Check if the data loads properly + filepath is correct
    // console.log("=========Log All Datasets==========");
    // console.log(readerAgesData);
    // console.log(readerGenderData);
    //console.table(dataset);


    // Let's start by making a simply piechart display the reader's gender by genre first
    // Then sort again by specific country

    // Create the PieChart Visual - Reference Lab 6

    // Start defining some constances
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Generate the SVG for each pie chart!
    let genderSVGOne = GenerateSVG("#genderChartOne", width, height);
    let ageSVGOne = GenerateSVG("#ageChartOne", width, height);
    // SVG for the barcharts are generated in their own function

    // Set up a color scale, using the popularity color theme
    let colorScale = ["#EBF5C6", "#9ED9B0", "#4CB1C2", "#2B6BA5", "#081D58"]

    // const color = d3.scaleOrdinal(d3.schemeObservable10);
    let color = d3.scaleOrdinal()
        .range(colorScale)

    // Define the pie pieces
    const pie = d3.pie().value(d => d.count);

    // console.log("==============Filtered by Genre and Country ================");
    var readerGenderOne = FilterByGenre(readerGenderData, genre);
    var readerAgeOne = FilterByGenre(readerAgesData, genre);
    var readerGenderByCountry = GetRecordsByCountry(readerGenderOne);
    var readerAgeByCountry = GetRecordsByCountry(readerAgeOne);

    // console.log(recordsByCountry)

    // console.log("=====Get the datasets filtered by genre and the country=====");
    // console.log(readerGenderOne);
    // console.log(readerAgeOne);
    // console.log(readerGenderTwo);
    // console.log(readerAgeTwo);

    // Create the data for the pie chart
    var genderArrayOne = CreatePieArrayByGender(readerGenderOne);
    var ageArrayOne = CreatePieArrayByAge(readerAgeOne);


    // Generate the arc genometry data
    const arcsGenderOne = pie(genderArrayOne);
    const arcsAgeOne = pie(ageArrayOne);

    // // Generate the pie pieces
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Generate the Pie Charts
    // Pass in the SVG, the datasets, and the filter for the color: gender or age
    GeneratePieChart(genderSVGOne, arcsGenderOne, "gender", arcGenerator, color);
    GeneratePieChart(ageSVGOne, arcsAgeOne, "age", arcGenerator, color);
    GenerateBarChart(readerGenderByCountry, "#genderChartTwo", width + 100, height + 100, color);
    GenerateBarChart(readerAgeByCountry, "#ageChartTwo", width + 100, height + 100, color);

}


// ========= Helper Functions ===========

function FilterByGenre(dataset, genre)
/*  Returns a dataset that is filtered by genre 
    Dataset : Array Obj => One of the cleaned datasets 
    Genre : String => Genre Name
*/ {
    // console.log(dataset);

    var filteredSet = dataset.filter(d => {
        // Filter the dataset by genres
        const genreMatch = d.Genres == genre;

        // console.log(`${genreMatch}, ${newUser}, ${countryMatch}`);
        if (genreMatch) {
            return true;
        }
        return false;
    }
    );
    console.log(filteredSet)
    return filteredSet;
}

function GetRecordsByCountry(dataset)
/*  Returns a dataset that has the number of records by country
    Dataset : Array Obj => One of the cleaned datasets 
*/ {

    // Store the key value pairs of country:count
    const records = {};

    dataset.forEach(d => {
        var country = d.Country

        if(records[country]) {
            records[country] += 1;
        } 
        else {
            records[country] = 1;
        }
    })

    // D3 is picky about our data, so convert it ot an array of objects, not a dicitonary
    var results = Object.entries(records).map(([country, total]) => {
        return {
            country: country,
            count: total
        }
    })
    
    return results;
}

function CreatePieArrayByGender(dataset)
/*  Creates a dictionary of the gender counts
    Dataset : Array Obj => An array of records

    Output {"Female": 8888, "Male": 7773}
*/ {
    // console.log("=====CREATE PIECHART BY GENDER======");
    // console.log(dataset);
    const counts = d3.rollup(
        dataset,
        group => group.length,
        d => d.Gender
    );

    const genderArray = Array.from(
        counts,
        ([gender, count]) => ({ gender, count })
    );

    // console.table(genderArray);
    return genderArray;
}

function CreatePieArrayByAge(dataset)
/*  Creates a dictionary of the age group counts
    Dataset : Array Obj => An array of records
*/ {

    // console.log("=====CREATE PIECHART BY AGE======");
    // console.log(dataset);
    const counts = d3.rollup(
        dataset,
        group => group.length,
        d => d.Age_Group
    );


    const ageArray = Array.from(
        counts,
        ([Age_Group, count]) => ({ Age_Group, count })
    );

    // console.table(ageArray);
    return ageArray;
}


// Basic Generators 
function GeneratePieChart(svg, arcData, colorFilter, arcGenerator, colorScale)
/* Generates the Pie Charts within the given SVG */ {

    // ensure a single tooltip exists
    let tooltip = d3.select("#dashboardTooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("id", "dashboardTooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("padding", "6px 8px")
            .style("background", "#ffffff")
            .style("border", "1px solid #ccc")
            .style("border-radius", "4px")
            .style("box-shadow", "0 2px 6px rgba(0,0,0,0.15)")
            .style("font-size", "12px")
            .style("line-height", "1.2")
            .style("opacity", 0);
    }

    // calculate the total number of records for each key-value pair
    // female, male, Young Adults, Adults, Senior
    const total = d3.sum(arcData, a => a.data.count);

    svg.selectAll("path")
        .data(arcData)
        .data(arcData)
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", function (d) { return colorFilter == "gender" ? colorScale(d.data.gender) : colorScale(d.data.Age_Group) })
        .attr("stroke", "white")
        .attr("stroke-width", 1)

        // Add the tooltip on the svg
        .attr("cursor", "pointer")
        .on("mouseover", function (event, d) {
            // Check to see which piechart is created specifically
            const label = colorFilter == "gender" ? d.data.gender : d.data.Age_Group;

            // Get the total records to calculate a percentage by 2 decimal points
            const pct = total > 0 ? ((d.data.count / total) * 100).toFixed(2) : 0;

            // Display the tooltip ui with the info
            tooltip.html(`
                <h3><strong>${label}</strong></h3>
                <br/>Count: ${d.data.count}
                <br/>${pct}%`)
                .style("opacity", 1);
        })
        .on("mousemove", function (event) {
            // shift the tooltop slightly so it not covered by the mouse
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function () {
            // hide the tool tip when done
            tooltip.style("opacity", 0);
        })
        ;

    return svg;
}

// Reference lab 5
function GenerateBarChart(dataset, idName, width, height, color) {
    // Clear any existing bar chart before re-rendering
    d3.select(idName).selectAll("*").remove();

    // set up the margins, use a list to make it easier to access later on and change some values
    const margin = { top: 20, right: 90, bottom: 40, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // To showcase the country with the most records, filter it by the counnt
    // Call the sort and basically for each pair, return the one that is larger and place on the top 
    // of the sortedData first
    const sortedData = dataset.sort((a, b) => b.count - a.count);

    // Generate the svg. Will see if i can make it a separate function like the piecharts, but not really needed for now
    const svg = d3.select(idName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create a scale for the x axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.count) || 0])
        .range([0, innerWidth]);

    // create a scale for the y-axis
    const y = d3.scaleBand()
        .domain(sortedData.map(d => d.country))
        .range([0, innerHeight])
        .padding(0.2);

    // add the tick lines
    svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format("d")));

    // Shift the country labels to the left of the chart
    svg.append("g")
        .call(d3.axisLeft(y));

    // Generate the bars with the newly sorted data
    svg.selectAll(".bar")
        .data(sortedData)
        .join("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d.country))
        .attr("width", d => x(d.count))
        .attr("height", y.bandwidth()) // Uses the counts as the height
        .attr("fill", d => {
            var colorRange = color.range()
            
            if(d.count > 100) {
                return colorRange[4];
            } else if ( d.count > 50) {
                return colorRange[3];
            } else if ( d. count > 25) {
                return colorRange[2];
            } else if (d.count > 10){
                return colorRange[1];
            } else {
                return colorRange[0]
            }
        }
        );

        // var colorScale = ["#EBF5C6", "#9ED9B0", "#4CB1C2", "#2B6BA5", "#081D58"]


    // Add value labels at the end of each horizontal bar
    svg.selectAll(".bar-label")
        .data(sortedData)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.count) + 6)
        .attr("y", d => (y(d.country) || 0) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("fill", "#1f2937")
        .style("font-size", "28px")
        .text(d => d.count);

    // Add the x-axis title
    svg.append("text")
        .attr("text-anchor", "middle") 
        .attr("x", width - 350)           
        .attr("y", innerHeight + 40)   
        .style("font-size", "14px")
        .text("Number of Records");

    // add the y-axis title
    svg.append("text")
    .attr("text-anchor", "middle") 
    .attr("x", width - 600)           
    .attr("y", innerHeight - 200)   
    .style("font-size", "14px")
    .text("Countries");

}

function GenerateSVG(idName, width, height)
/* Generate the SVG canvas in the div section provided*/ {
    // console.log("=======I am generating my SVG, a canvas=========");
    // Clear any existing SVG elements to avoid duplicates
    d3.select(idName).selectAll("*").remove();

    let svg = d3.select(idName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    return svg;
}

window.GenerateDashboard = GenerateDashboard;
