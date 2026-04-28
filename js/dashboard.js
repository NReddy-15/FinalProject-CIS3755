import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

var readerAgesData = await d3.csv("../datasets/dashboard/Combined_BookRec_GenreToAge.csv");
var readerGenderData = await d3.csv("../datasets/dashboard/Combined_GlobalReader_GenreToGender.csv");

// //grab our canvas 
// let svg = d3.select("#canvas");

// //set the width and height
// svg.attr('width', 500)
//     .attr('height', 500)



console.log(readerAgesData)
console.log(readerGenderData)


