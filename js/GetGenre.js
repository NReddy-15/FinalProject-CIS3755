
function GetGenre(genre){
    console.log(`=======GetGenre retrieved: ${genre}========`);
    renderHexbin(genre);

    var countryOne = document.getElementById("countryOneName");
    var countryTwo = document.getElementById("countryTwoName");

    countryOne.innerHTML = `TESTING ONE: ${genre}`;
    countryTwo.innerHTML = `TESTING TWO: ${genre}`;
}

// Make the function global it can be called
window.GetGenre = GetGenre;