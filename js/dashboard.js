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
    let genderSVGTwo = GenerateSVG("#genderChartTwo", width, height);
    let ageSVGOne = GenerateSVG("#ageChartOne", width, height);
    let ageSVGTwo = GenerateSVG("#ageChartTwo", width, height);

    // Set up a color scale, using the popularity color theme
    var colorScale = ["#EBF5C6", "#9ED9B0", "#4CB1C2", "#2B6BA5", "#081D58"]

    // const color = d3.scaleOrdinal(d3.schemeObservable10);
    const color = d3.scaleOrdinal()
        .range(colorScale)

    // Define the pie pieces
    const pie = d3.pie().value(d => d.count);

    // Get just a list of genders split by female and male
    // Hardcode the genre to be Romance
    // console.log("==============Filtered by Genre and Country ================");
    var readerGenderOne = FilterByGenre(readerGenderData, genre);
    var readerAgeOne = FilterByGenre(readerAgesData, genre);
    // var readerGenderTwo = FilterByGenreCountry(readerGenderData, genre, countryTwo);
    // var readerAgeTwo = FilterByGenreCountry(readerAgesData, genre, countryTwo);

    // console.log("=====Get the datasets filtered by genre and the country=====");
    // console.log(readerGenderOne);
    // console.log(readerAgeOne);
    // console.log(readerGenderTwo);
    // console.log(readerAgeTwo);

    // Create the data for the pie chart
    var genderArrayOne = CreatePieArrayByGender(readerGenderOne);
    var ageArrayOne = CreatePieArrayByAge(readerAgeOne);
    // var genderArrayTwo = CreatePieArrayByGender(readerGenderTwo);
    // var ageArrayTwo = CreatePieArrayByAge(readerAgeTwo);

    // Generate the arc genometry data
    const arcsGenderOne = pie(genderArrayOne);
    const arcsAgeOne = pie(ageArrayOne);
    // const arcsGenderTwo = pie(genderArrayTwo);
    // const arcsAgeTwo = pie(ageArrayTwo);

    // // Generate the pie pieces
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Generate the Pie Charts
    // Pass in the SVG, the datasets, and the filter for the color: gender or age
    GeneratePieChart(genderSVGOne, arcsGenderOne, "gender", arcGenerator, color);
    GeneratePieChart(ageSVGOne, arcsAgeOne, "age", arcGenerator, color);
    // GeneratePieChart(genderSVGTwo, arcsGenderTwo, "gender", arcGenerator, color);
    // GeneratePieChart(ageSVGTwo, arcsAgeTwo, "age", arcGenerator, color);
}



// ========= Helper Functions ===========

function FilterByGenre(dataset, genre)
/*  Returns a dataset that is filtered by genre 
    Dataset : Array Obj => One of the cleaned datasets 
    Genre : String => Genre Name
*/ {
    console.log(dataset);

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

function FilterByGenreCountry(dataset, genre, country)
/*  Returns a dataset that is filtered by genre 
    Dataset : Array Obj => One of the cleaned datasets 
    Genre : String => Genre Name
*/ {
    // console.log(dataset);
    // Create a set; this is to clean any duplicate readers
    const dupUsers = new Set();

    var filteredSet = dataset.filter(d => {
        // Filter the dataset by genres
        const genreMatch = d.Genres == genre;

        const countryMatch = d.Country.toLowerCase().trim() == country.toLowerCase().trim();

        // if(genreMatch) {
        //     // console.log(d);
        //     console.log(`Given Country ${d.Country.trim()}, Country to match ${country}`)
        //     console.log(`Genre ${genreMatch}, Country: ${countryMatch}, ${genreMatch}`)

        // }

        // console.log(`${genreMatch}, ${newUser}, ${countryMatch}`);
        if (genreMatch && countryMatch) {
            return true;
        }
        return false;
    }
    );

    // Check the filter sets to ensure it is good to go
    // console.log(filteredSet);
    // console.log(filteredSet);
    return filteredSet;
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

            // Get the total records to calculate a percentage
            const pct = total > 0 ? ((d.data.count / total) * 100).toFixed(1) : 0;

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
