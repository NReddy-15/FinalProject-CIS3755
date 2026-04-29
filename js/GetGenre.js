function GetGenre(genre, minRankCountry, maxRankCountry){
    console.log(`=======GetGenre retrieved: ${genre}========`);
    console.log(`High Ranking in ${maxRankCountry}\nLow Ranking in ${minRankCountry}`)

    // VIVI - Hardcode the data
    genre = "Adventure"
    minRankCountry = ['Spain', 0]
    maxRankCountry = ["United States", 33]


    // Generate the popularity visual
    renderHexbin(genre);

    // Victoria : Add my function that will showcase
    // the country that deems the selected genre as 
    // high ranking or low ranking from their users
    GenerateDashboard(genre, maxRankCountry[0], minRankCountry[0]);

    // Display the genre the user selected
    var genreDisplay = document.getElementById("displayGenre");
    var countryOne = document.getElementById("countryOneName");
    var countryTwo = document.getElementById("countryTwoName");

    genreDisplay.innerHTML = `Here are the readers based on the genre ${genre}`;
    countryOne.innerHTML = `Highest Ranking: ${maxRankCountry[0]}`;
    countryTwo.innerHTML = `Lowest Ranking: ${minRankCountry[0]}`;

    // console.log(genreCountries);
}

// Make the function global it can be called
window.GetGenre = GetGenre;