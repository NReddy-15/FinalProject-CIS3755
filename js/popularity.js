function renderHexbin(selectedGenre) {

    d3.select("#hexbin").selectAll("*").remove();

    // console.log("THIS IS THE GENRE: " + selectedGenre);

    const margin = {top: 60, right: 30, bottom: 50, left: 60},
      width = 1100 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

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

    d3.csv("./datasets/popularity/books_cleaned_genresV4.csv").then((data)=>{
        // // console.log(data);
    
        const filteredData = data.filter(d => {
            if (!d.overarching_genre || d.overarching_genre.trim() === "") return false;
            return true;
        });

        // console.log("Rows after filtering:", filteredData.length);

        const mappedData = filteredData.map(d => ({
            title: d.Title,
            author: d.Author,
            genre: d.overarching_genre,
            average_rating: d.average_rating,
            ratings_count: d.ratings_count
        }));

        // console.log(mappedData);

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

        genreArray.sort((a, b) => b.count - a.count); 

        // console.log("Genre Table:")
        // console.table(genreArray)

        let subset = mappedData;

        if(selectedGenre != "All") {
            subset = mappedData.filter(d => d.genre === selectedGenre);
            // console.log(selectedGenre);
            // console.log("SUBSETTTT");

            // console.log(subset);
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

        const color = d3.scaleSequential(d3.interpolateYlGnBu)
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

        svg.append('text')
            .attr('class', 'title')
            .attr('y', height - 600)
            .attr('x', width/2 - 50)
            .text('Popularity vs Quality')
            .style('font-size', '25px');

        svg.append('text') //x-axis
            .attr('class', 'axis-title')
            .attr('y', height + 35)
            .attr('x', width/2)
            .text('Ratings Count');

        svg.append('text') //y-axis
            .attr('class', 'axis-title')
            .attr('x', 10)
            .attr('y', 25)
            .text('Average Rating');

        //Averages div
        var totalRat = 0;
        var totalCount = 0;
        for (const book of subset) {
            totalRat+=+book.average_rating;
            totalCount+=+book.ratings_count;
        }

        var averageRat = totalRat/subset.length;
        var averageCount = totalCount/subset.length;

        const averages = document.getElementById("dataAverages"); //d3.select("#dataAverages");

        console.log(averages.innerHTML);
        averages.innerHTML = `<p>Overall Average Rating: ${averageRat.toFixed(2)} / 5</p>
                            <p>Overall Average Rating Count: ${averageCount.toFixed(0).toLocaleString()}</p>`;


        //Tool tip stuff
        const tooltip = d3.select("#tooltip");

        svg.append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll("path")
            .data(bins)
            .join("path")
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("d", hexbin.hexagon())
                .attr("fill", d => color(d.length))
                .attr("stroke", "#fff")
                .attr("stroke-width", "0.5")
                .on("mouseover", function(event, d) {
                    tooltip.style("opacity", 1);
                    d3.select(this).attr("stroke", "#000").attr("stroke-width", "1.5");
                })
                .on("mousemove", function(event, d) {
                    const avgRating = y.invert(d.y).toFixed(2);
                    const approxRatings = Math.round(x.invert(d.x));

                    tooltip
                        .html(`
                            <strong>Books in bin:</strong> ${d.length}<br/>
                            <strong>Avg Rating:</strong> ${avgRating} / 5<br/>
                            <strong>Approx. Ratings:</strong> ${approxRatings.toLocaleString()}
                        `)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseleave", function() {
                    tooltip.style("opacity", 0);
                    d3.select(this).attr("stroke", "#fff").attr("stroke-width", "0.5");
                });

        const defs = svg.append("defs");

        const linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient.selectAll("stop")
            .data(d3.range(10).map(i => ({ offset: `${i * 10}%`, color: d3.interpolateYlGnBu(i / 9) })))
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        const legendWidth = 200;
        const legendHeight = 15;

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - legendWidth - 30}, ${-margin.top + 10})`); // Positioned at top-right

        
        legend.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#linear-gradient)");

        legend.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("Density (Books per Hex)");


    })
}

