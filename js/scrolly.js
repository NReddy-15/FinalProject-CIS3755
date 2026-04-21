//grab our canvas 
let svg = d3.select("#canvas");

//set the width and height
svg.attr('width', 500)
    .attr('height', 500)

//set up grid spacing
let spacing = 40;
let rows = 3;
let column = 10;

//Create an array of 30 items (all with value the 5)
let data = d3.range(30).map(i => {
    return 5;
});



let rects = svg.selectAll('rect')
    .data(data)
    .join("rect")
    .attr("x", (d, i) => (Math.floor(i) % column * spacing))
    .attr("y", (d, i) => Math.floor(i / column) % rows * spacing)
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", "red")

function grid() {
    return rects
        .transition()
        .delay((d, i) => 10 * i)
        .duration(400)
        .attr("fill", "black");
}

function grid2() {
    return rects
        .transition()
        .delay((d, i) => 10 * i)
        .duration(400)
        .attr("fill", (d, i) => {
            // console.log(i)
            if (i > 12) {
                // console.log("BROWN")
                return "brown"
            }
            else {
                return "gray"
            }
        }
        )

}

function grid3() {
    return rects
        .transition()
        .delay((d, i) => 10 * i)
        .duration(400)
        .attr("fill", (d, i) => {
        // console.log(i)
        if (i < 12 && i != 0) {
            // console.log("BROWN")
            return "blue"
        }
        else {
            return "gray"
        }
    }
    )
}

function grid4() {
    return rects
        .transition()
        .delay((d, i) => 10 * i)
        .duration(400)
        .attr("fill", (d, i) => {
        // console.log(i)
        if (i == 0) {
            return "green"
        }
        else {
            return "gray"
        }
    }
    )
}

function grid5() {
    return rects
        .transition()
        .delay((d, i) => 10 * i)
        .duration(400)
        .attr("fill", "pink");
}



// grid();
// grid2();
// grid3();
// grid4();

// === Scrollytelling boilerplate === //
function scroll(n, offset, func1, func2) {
    const el = document.getElementById(n)
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? func1() : func2();
        },
        //start 75% from the top of the div
        offset: offset
    });
};

//trigger these functions on page scroll
new scroll('div2', '75%', grid2, grid);  //create a grid for div2
new scroll('div3', '75%', grid3, grid2); //create a grid for div3
new scroll('div4', '75%', grid4, grid3);  //create a grid for div2
new scroll('div5', '75%', grid5, grid4); //create a grid for div3
