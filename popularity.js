function renderHexbin(selectedGenre) {

    console.log("THIS IS THE GENRE: " + selectedGenre);

    const margin = {top: 40, right: 30, bottom: 50, left: 60},
      width = 1200 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    const svg = d3.select("#hexbin")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    d3.csv("data/books_with_genres.csv").then((data)=>{
        console.log(data);
    
        const filteredData = data.filter(d => {
            if (!d.genres || d.genres.trim() === "") return false;
            return true;
        });

        console.log("Rows after filtering:", filteredData.length);

        const mappedData = filteredData.map(d => ({
            title: d.Title,
            author: d.Author,
            genre: d.genres.split(";")[0],
            average_rating: d.average_rating,
            ratings_count: d.ratings_count
        }));

        console.log(mappedData);

        const splitGenres = mappedData.flatMap(d => d.genre);

        const genreCounts = d3.rollup(
            splitGenres,           // the array of movie objects
            group => group.length,  // how do we count movies in this group? 
            d => d       // what do you want to group? 
        );

        const genreArray = Array.from(
            genreCounts, 
            ([genre, count]) => ({ genre, count })
        );

        console.log("Genre Table:")
        console.table(genreArray)

        let subset = mappedData;

        if(selectedGenre != "All") {
            subset = mappedData.filter(d => d.genre === selectedGenre);
            console.log(selectedGenre);
            console.log("SUBSETTTT");

            console.log(subset);
        }

        const x = d3.scaleLog()
            .domain([100, d3.max(data, d => d.ratings_count)])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([3, 5]) // Zoomed in on 3-5 stars
            .range([height, 0]);

        const hexbin = d3.hexbin()
            .radius(10) // Size of the hexagons
            .extent([[0, 0], [width, height]]);
            

        // Calculate the bins
        const bins = hexbin(subset.map(d => [x(d.ratings_count), y(d.average_rating)]));

        const color = d3.scaleSequential(d3.interpolateBuPu)
            .domain([0, d3.max(bins, d => d.length)]); 

        svg.append("g")
            .attr("clip-path", "url(#clip)") // Apply the mask here
            .selectAll("path")
            .data(bins)
            .join("path")
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("d", hexbin.hexagon())
                .attr("fill", d => color(d.length))
                .attr("stroke", "#fff")
                .attr("stroke-width", "0.5");

        
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5, "~s"));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append('text') //x-axis
            .attr('class', 'axis-title') //Optional: change font size and font weight
            .attr('y', height + 30) //add to the bottom of graph (-15 to add it above axis)
            .attr('x', width - 600) //add to the end of X-axis (offsets the width of text)  
            .text('Ratings Count');

        svg.append('text') //y-axis
            .attr('class', 'axis-title') //Optional: change font size and font weight
            .attr('x', 10) //add some x padding to clear the y axis
            .attr('y', 25) //add some y padding to align the end of the axis with the text
            .text('Average Rating'); //actual text to display

    })
}

