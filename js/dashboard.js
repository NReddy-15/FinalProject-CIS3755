import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

var readerAgesData = await d3.csv("../datasets/dashboard/Combined_BookRec_GenreToAge.csv");
var readerGenderData = await d3.csv("../datasets/dashboard/Combined_GlobalReader_GenreToGender.csv");

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

// Set up a color scale
const color = d3.scaleOrdinal(d3.schemeObservable10);

// Define the pie pieces
const pie = d3.pie().value(d => d.count); 

// Get just a list of genders split by female and male
// Hardcode the genre to be Romance
// console.log("==============Filtered by Genre and Country ================");
var readerGenderOne = FilterByGenre(readerGenderData, "Fantasy", "United States");
var readerGenderTwo = FilterByGenre(readerGenderData, "Fantasy", "Germany");
var readerAgeOne = FilterByGenre(readerAgesData, "Fantasy", "usa");
var readerAgeTwo = FilterByGenre(readerAgesData, "Fantasy", "Germany");


// Create the data for the pie chart
var genderArrayOne = CreatePieArrayByGender(readerGenderOne);
var genderArrayTwo = CreatePieArrayByGender(readerGenderTwo);
var ageArrayOne = CreatePieArrayByAge(readerAgeOne);
var ageArrayTwo = CreatePieArrayByAge(readerAgeTwo);

// Generate the arc genometry data
const arcsGenderOne = pie(genderArrayOne);
const arcsGenderTwo = pie(genderArrayTwo);
const arcsAgeOne = pie(ageArrayOne);
const arcsAgeTwo = pie(ageArrayTwo);

// // Generate the pie pieces
const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// Generate the Pie Charts
// Pass in the SVG, the datasets, and the filter for the color: gender or age
GeneratePieChart(genderSVGOne, arcsGenderOne, "gender");
GeneratePieChart(genderSVGTwo, arcsGenderTwo, "gender");
GeneratePieChart(ageSVGOne, arcsAgeOne, "age");
GeneratePieChart(ageSVGTwo, arcsAgeTwo, "age");


// ========= Helper Functions ===========
function FilterByGenre(dataset, genre, country) 
/*  Returns a dataset that is filtered by genre 
    Dataset : Array Obj => One of the cleaned datasets 
    Genre : String => Genre Name
*/
{
    // console.log(dataset);
    // Create a set; this is to clean any duplicate readers
    const dupUsers = new Set();

    var filteredSet = dataset.filter(d =>{
            // Filter the dataset by genres
            // GENRES NOT MATCHING FOR THE AGES
            const genreMatch = d.Genres == genre;

            const countryMatch = d.Country.toLowerCase().trim() == country.toLowerCase().trim();

            // Remove any duplicate users who have been counted multiple times
            // for the same genre
            const userID = `${d.User_ID}`;
            const newUser = !dupUsers.has(userID);
            
            // if(genreMatch) {
            //     // console.log(d);
            //     console.log(`Given Country ${d.Country.trim()}, Country to match ${country}`)
            //     console.log(`Genre ${genreMatch}, Country: ${countryMatch}, ${genreMatch}`)

            // }

            // console.log(`${genreMatch}, ${newUser}, ${countryMatch}`);
            if(genreMatch && newUser && countryMatch) {
                dupUsers.add(userID);
                return true;
            }
            return false;
        }
    );

    // Check the filter sets to ensure it is good to go
    // console.log(filteredSet);
    return filteredSet;
}

function CreatePieArrayByGender(dataset) 
/*  Creates a dictionary of the gender counts
    Dataset : Array Obj => An array of records

    Output {"Female": 8888, "Male": 7773}
*/
{

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
/*  Creates a dictionary of the gender counts
    Dataset : Array Obj => An array of records
*/
{

    // console.log("=====CREATE PIECHART BY AGE======");
    // console.log(dataset);
    const counts = d3.rollup(
        dataset,
        group => group.length,
        d => d.age
    );


    const ageArray = Array.from(
        counts,
        ([age, count]) => ({ age, count })
    );
    
    // console.table(ageArray);
    return ageArray;
}



// Basic Generators 
function GeneratePieChart(svg, arcData, colorFilter) {
    // console.log("======= I am generating a pie chart=======");
    svg.selectAll("path")
        .data(arcData)  
        .join("path")
        .attr("d", arcGenerator) 
        .attr("fill", function (d) { return colorFilter == "gender" ?  color(d.data.gender) : color(d.data.age) })
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    
    return svg;
}


function GenerateSVG(idName, width, height) {
    // console.log("=======I am generating my SVG, a canvas=========");
    let svg = d3.select(idName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    return svg;
}
