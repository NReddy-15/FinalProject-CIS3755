# Book Trend Analysis
The Book Trend Analysis is geared towards bookstore owners and authors who want to have an edge 
at the book market. One way to get an edge is to understand the trends in the market,
specifically the genre of books that have been popular. 

For this analysis, there are three parts:
1. Genre Popularity Map
2. Popularity Review
3. Reader Demographics

Dataset Sources: https://drive.google.com/drive/folders/1txonocNwhJM1L7uwY3kyu2Oz9PcjID99?usp=sharing

# Running the Project
No additional setup is required to run the project. 

## Genre Popularity Map
The Genre popularity map uses a geomap to show the most countries where a genre is popular. Genres are selected and deselected using buttons, which once clicked will highlight countries where the genre is popular. Hovering over a country will show the name of the country.

### Datasets Referenced
- Book Swapped: https://www.kaggle.com/datasets/sergiykovalchuck/the-most-popular-books-for-exchanging

### Lessons Learned
- Finding Needed Data
    - Finding datasets for books with their genre and review score was not complex. Datasets that contain genre and the country the reviewer/buyer is nonexistent to the public. These datasets are locked behind paywalls, with alternatives being difficult to find.

- Geomap
    - First, making the map quite difficult. Finding the right script to use, and linking it to properly generate the map was more tedious then I thought, I had to run command lines in google dev tool to debug and find the issues (data that generate the map wasn't being properly passed through), but once I fixed it properly rendered.
    - Once rendered I the country does not properly display in the mouseover, just the ID number, so I created a list that has Country ID and Country Name pairs to have the names proper displayed when hovered on most of the countries.
    - To know which country had to be highlighted I had to make another list that has the same pair as the previous one but in reverse (Country Name and Country ID) so the proper country is hovered when the genre button is clicked.

## Popularity Review
The Popularity vs Quality hexbin chart uses a comprehensive dataset of books from Goodreads and takes the number of ratings and average rating. Based on the selected genre from the Genre Popularity Map, the chart will filter the list of books.

Each hexagon represents a bin with an average rating and approximate number of ratings. This provides an informative look of where most books in the genre are concentrated.

### Datasets Referenced
- Books with Genres: https://www.kaggle.com/datasets/middlelight/goodreadsbookswithgenres

### Lessons Learned
- Additional Dataset Searching
  - In the original dataset that I had found, there were no genres listed. My first solution was to find a book API that would allow me to
    fetch and store the genre for each book. However, it was difficult to find one that was free and properly functional. After some trial and
    error, I decided to continue searching for datasets. I found another similar dataset with books from Goodreads with the genres.
    
- Genre Determination for Books
  - In the dataset I found, each book was assigned a list of genres. I was not sure how to approach narrowing each list down to a single best
    genre. To do this, I took the classifications that Victoria made based on her dataset and applied it to the most relevant genre for each
    book to classify it.

## Reader Demographics
The Reader Demographics takes 4 different datasets to combine reader age, reader gender, reader country, and favorite genre(s).
Based on the selected genre from Genre Popularity Map, the visuals will filter the reader datasets.

The first two visualizations are pie charts showcasing the global gender distribution and global age distribution for a particular genre. This helps cater the writing and advertising towards a specific demographic.

The other two visualizations showcase the driving country for the observations. Based on the number of records provided, users can dedicate their book to a specific country. 

### Datasets Referenced
- Reader Gender: https://www.mdpi.com/2306-5729/6/8/83
- Reader Ages: https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset
- Middle Man - Link Books by Genre: https://drive.google.com/drive/folders/1qroO-ijf9vYMO_v4-w5ysJEE3boBSQ53

### Lessons Learned
- Data Cleaning Challenges
  - Since demographic data on consumers is often hidden and restricted, I had a hard time finding the data.
    When I did find some, they were split across different sources. For example, I had a list of user reviews and the books
    they reviewed but not the specific genre of the book. I would have to use a separate source to match the sets by the title of
    the book.
  - After cleaning the data, which originally had 10,000 records, I was left with 1,000-2,000 records due to missing information,
    in any column (Age, Gender, Country, etc.) or duplicate users. As a result, the distribution of data accross different
    countries was limited.
      
- Pie Chart Selections
  - Referencing Lab 6, creating the pie charts were not too bad. However, making them interactive or fit our story is hard.
    The initial idea was to filter the pie charts based on the countries returned from the Popularity Map. However, due
    to my datasets limitations, some genres could not display the pie chart due to no users from that country. This was
    super restrictive to our story.

- Bar Chart Selections
  - To adapt to the lack of data, we pivoted to showcasing the readers that were contributing to the data.
    Since I want to match a categorical data to the count, it was a bit tricky at first to clean the data.
    When I initially started, I was creating dictionaries to store the country and their record counts. However,
    D3 required my data to be objects instead of string/int pairs. To manage this, I had to use Object.entries, which
    took a while to figure out
