# Book Trend Analysis
The Book Trend Analysis is geared towards bookstore owners and authors who want to have an edge 
at the book market. One way to get an edge is to understand the trends in the market,
specifically the genre of books that have been popular. 

For this analysis, there are three parts:
1. Genre Popularity Map
2. Popularity Review
3. Reader Demographics

# Running the Project
No additional setup is required to run the project. 

## Genre Popularity Map

### Lessons Learned

## Popularity Review

### Lessons Learned

## Reader Demographics
The Reader Demographics takes 4 different datasets to combine reader age, reader gender, reader country, and favorite genre(s).
Based on the selected genre from Genre Popularity Map, the visuals will filter the reader datasets.

The first two visualizations are pie charts showcasing the global gender distribution and global age distribution for a particular genre. This helps cater the writing and advertising towards a specific demographic.

The other two visualizations showcase the driving country for the observations. Based on the number of records provided, users can dedicate their book to a specific country. 

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
