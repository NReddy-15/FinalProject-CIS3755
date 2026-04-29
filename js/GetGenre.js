
function GetGenre(genre){
    console.log(`=======GetGenre retrieved: ${genre}========`);
    renderHexbin(genre);

    // Victoria : Add my function that will showcase
    // the country that deems the selected genre as 
    // high ranking or low ranking from their users

    var countryOne = document.getElementById("countryOneName");
    var countryTwo = document.getElementById("countryTwoName");

    countryOne.innerHTML = `TESTING ONE: ${genre}`;
    countryTwo.innerHTML = `TESTING TWO: ${genre}`;
}

// Make the function global it can be called
window.GetGenre = GetGenre;