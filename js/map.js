(function () {
    const width = 960;
    const height = 500;

    const countryNames = {
        4: "Afghanistan", 8: "Albania", 12: "Algeria", 24: "Angola", 32: "Argentina",
        36: "Australia", 40: "Austria", 50: "Bangladesh", 56: "Belgium", 64: "Bhutan",
        68: "Bolivia", 76: "Brazil", 100: "Bulgaria", 116: "Cambodia", 120: "Cameroon",
        124: "Canada", 144: "Sri Lanka", 152: "Chile", 156: "China", 170: "Colombia",
        178: "Congo", 188: "Costa Rica", 192: "Cuba", 203: "Czech Republic", 208: "Denmark",
        218: "Ecuador", 818: "Egypt", 222: "El Salvador", 231: "Ethiopia", 246: "Finland",
        250: "France", 276: "Germany", 288: "Ghana", 300: "Greece", 320: "Guatemala",
        332: "Haiti", 340: "Honduras", 348: "Hungary", 356: "India", 360: "Indonesia",
        364: "Iran", 368: "Iraq", 372: "Ireland", 376: "Israel", 380: "Italy", 388: "Jamaica",
        392: "Japan", 400: "Jordan", 398: "Kazakhstan", 404: "Kenya", 408: "North Korea",
        410: "South Korea", 414: "Kuwait", 418: "Laos", 422: "Lebanon", 430: "Liberia",
        434: "Libya", 484: "Mexico", 504: "Morocco", 508: "Mozambique", 524: "Nepal",
        528: "Netherlands", 554: "New Zealand", 566: "Nigeria", 578: "Norway", 586: "Pakistan",
        591: "Panama", 604: "Peru", 608: "Philippines", 616: "Poland", 620: "Portugal",
        630: "Puerto Rico", 634: "Qatar", 642: "Romania", 643: "Russia", 646: "Rwanda",
        682: "Saudi Arabia", 686: "Senegal", 694: "Sierra Leone", 706: "Somalia",
        710: "South Africa", 724: "Spain", 729: "Sudan", 752: "Sweden", 756: "Switzerland",
        760: "Syria", 158: "Taiwan", 834: "Tanzania", 764: "Thailand", 780: "Trinidad and Tobago",
        788: "Tunisia", 792: "Turkey", 800: "Uganda", 804: "Ukraine", 784: "United Arab Emirates",
        826: "United Kingdom", 840: "United States", 858: "Uruguay", 860: "Uzbekistan",
        862: "Venezuela", 704: "Vietnam", 887: "Yemen", 894: "Zambia", 716: "Zimbabwe",
        12: "Algeria", 795: "Turkmenistan", CountryNames: null
    };

    const countryIDs = {
        "Afghanistan": 4, "Albania": 8, "Algeria": 12, "Angola": 24, "Argentina": 32,
        "Australia": 36, "Austria": 40, "Bangladesh": 50, "Belgium": 56, "Bhutan": 64,
        "Bolivia": 68, "Brazil": 76, "Bulgaria": 100, "Cambodia": 116, "Cameroon": 120,
        "Canada": 124, "Sri Lanka": 144, "Chile": 152, "China": 156, "Colombia": 170,
        "Congo": 178, "Costa Rica": 188, "Cuba": 192, "Czech Republic": 203, "Denmark": 208,
        "Ecuador": 218, "Egypt": 818, "El Salvador": 222, "Ethiopia": 231, "Finland": 246,
        "France": 250, "Germany": 276, "Ghana": 288, "Greece": 300, "Guatemala": 320,
        "Haiti": 332, "Honduras": 340, "Hungary": 348, "India": 356, "Indonesia": 360,
        "Iran": 364, "Iraq": 368, "Ireland": 372, "Israel": 376, "Italy": 380, "Jamaica": 388,
        "Japan": 392, "Jordan": 400, "Kazakhstan": 398, "Kenya": 404, "North Korea": 408,
        "South Korea": 410, "Kuwait": 414, "Laos": 418, "Lebanon": 422, "Liberia": 430,
        "Libya": 434, "Mexico": 484, "Morocco": 504, "Mozambique": 508, "Nepal": 524,
        "Netherlands": 528, "New Zealand": 554, "Nigeria": 566, "Norway": 578, "Pakistan": 586,
        "Panama": 591, "Peru": 604, "Philippines": 608, "Poland": 616, "Portugal": 620,
        "Puerto Rico": 630, "Qatar": 634, "Romania": 642, "Russia": 643, "Rwanda": 646,
        "Saudi Arabia": 682, "Senegal": 686, "Sierra Leone": 694, "Somalia": 706,
        "South Africa": 710, "Spain": 724, "Sudan": 729, "Sweden": 752, "Switzerland": 756,
        "Syria": 760, "Taiwan": 158, "Tanzania": 834, "Thailand": 764,
        "Trinidad and Tobago": 780, "Tunisia": 788, "Turkey": 792, "Uganda": 800,
        "Ukraine": 804, "United Arab Emirates": 784, "United Kingdom": 826,
        "UK": 826, "USA": 840, "United States": 840,
        "Uruguay": 858, "Uzbekistan": 860, "Venezuela": 862, "Vietnam": 704,
        "Yemen": 887, "Zambia": 894, "Zimbabwe": 716, "Turkmenistan": 795
    };

    const svg = d3.select("#mapgraph")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const projection = d3.geoNaturalEarth1()
        .scale(160)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const graticule = d3.geoGraticule();

    // Tooltip — appended to body so it floats freely
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "geomap-tooltip");

    // Sphere background (ocean)
    svg.append("path")
        .datum({ type: "Sphere" })
        .attr("class", "sphere")
        .attr("d", path);

    // Graticule grid lines
    svg.append("path")
        .datum(graticule())
        .attr("class", "graticule")
        .attr("d", path);

    // Load world TopoJSON and render countries
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
        const countries = topojson.feature(world, world.objects.countries);

        svg.selectAll(".country")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .on("mousemove", function (event, d) {
                tooltip
                    .style("opacity", 1)
                    .style("left", (event.clientX + 12) + "px")
                    .style("top", (event.clientY - 28) + "px")
                    .text(countryNames[+d.id] || "Unknown (" + d.id + ")");
            })
            .on("mouseleave", function () {
                tooltip.style("opacity", 0);
            });
    });

    d3.csv("./datasets/map/Cleaned_1000_Swapped_Books_V2.csv").then(data => {
        // Collect unique genres (at least one occurrence)
        const genres = [...new Set(data.map(d => d.genre).filter(Boolean))].sort();

        const panel = d3.select("#genre-panel");

        genres.forEach(genre => {
            panel.append("button")
                .attr("class", "genre-btn")
                .attr("data-genre", genre)
                .text(genre)
                .on("click", function () {
                    // Toggle active state
                    const isActive = d3.select(this).classed("genre-btn--active");
                    d3.selectAll(".genre-btn").classed("genre-btn--active", false);
                    d3.selectAll(".country")
                        .classed("country--highlighted", false)
                        .classed("country--dimmed", false);

                    if (!isActive) {
                        d3.select(this).classed("genre-btn--active", true);

                        const matchedCountries = data
                            .filter(d => d.genre === genre)
                            .map(d => d.most_popular_country.trim());


                        // get the ranking between popular countries
                        const matchedCountriesRanking = {}

                        matchedCountries.forEach(country => {
                            if (matchedCountriesRanking[country]) {
                                matchedCountriesRanking[country] += 1;
                            } else {
                                matchedCountriesRanking[country] = 1;
                            }
                        })
                        console.log(matchedCountriesRanking)


                        // Convert to a list of pairs for easier access
                        var matchedCountriesPairs = Object.entries(matchedCountriesRanking);

                        // use reduce to loop through the entries and replace the maxPair/min pair value 
                        // Basically a short cut of a for-loop
                        // Check if the current pair great than the previoys pair
                        var maxPair = matchedCountriesPairs.reduce((prev, curr) => curr[1] > prev[1] ? curr : prev)
                        // check the current pair is less than the previous pair
                        var minPair = matchedCountriesPairs.reduce((prev, curr) => curr[1] < prev[1] ? curr : prev)


                        // Convert country names to numeric IDs
                        const matchedIDs = new Set(
                            matchedCountries
                                .map(name => countryIDs[name])
                                .filter(Boolean)
                        );

                        d3.selectAll(".country")
                            .classed("country--highlighted", d => matchedIDs.has(+d.id))
                            .classed("country--dimmed", d => !matchedIDs.has(+d.id));


                        // Call the GetGenre Function here as well
                        GetGenre(genre, minPair, maxPair);
                    }
                })
        })

    });


})();


