# scrapeTHIS
A reddit scraper app. It displays articles scraped into a mongo DB.

## Technologies Used
* nodeJS
* mongoDB
* Mongoose DRM
* Express
* RESTful API
* Cheerio & Axios Libraries

## API Routes:

### Get Routes
* / renders Index.html
* /scrape/:reddit Scrapes a particular subreddit
* /reddit/distinct Returns all distinct subreddits 
    * Type: JSON
* /reddit/:reddit Returns all articles in subreddit
    * Type: JSON
* /articles Returns all articles from all subreddits
    * Type: JSON
* /articles/:id Returns all detail about an article
    * Type: JSON

### Post Routes
* /articles/:id Post a note to an article

### Delete Routes
* /note/:id Delete a not by ID


