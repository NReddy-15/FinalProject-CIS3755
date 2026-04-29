function GetGenre(genre){
    // Convert the map genres to 




    // console.log(`=======GetGenre retrieved: ${genre}========`);
    renderHexbin(genre);

    // Victoria : Add my function that will showcase
    // the country that deems the selected genre as 
    // high ranking or low ranking from their users
    GenerateDashboard(genre, "United States", "Germany");

    // Display the genre the user selected
    var genreDisplay = document.getElementById("displayGenre");
    var countryOne = document.getElementById("countryOneName");
    var countryTwo = document.getElementById("countryTwoName");

    genreDisplay.innerHTML = `Here are the readers based on the genre ${genre}`;
    countryOne.innerHTML = `TESTING ONE: ${genre}`;
    countryTwo.innerHTML = `TESTING TWO: ${genre}`;

    // console.log(genreCountries);
}

// Make the function global it can be called
window.GetGenre = GetGenre;