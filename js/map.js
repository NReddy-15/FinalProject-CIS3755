import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const svg = d3.select("svg");
console.log("D3 loaded:", d3);

d3.csv("top_1000_most_swapped_books.csv")
    .then(function (data) {

        console.log("Rows before filtering:", data.length)
        console.log(data);
    });
    


