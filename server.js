var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var db = require('./models');

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

// Routes


app.get("/scrape/:id", function(req, res) {
    // First, we grab the body of the html with request
    var timeStamp = new Date();
    var reddit = req.params.id;
    var board = encodeURI("https://reddit.com/r/" + reddit)

    console.log(`Scrape started on ${reddit} at ${timeStamp}`)

    axios.get(board).then(function(response) {
        console.log("HERE FOO")
            // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        console.log(`Axios get completed at ${timeStamp}`)
            // Now, we grab every h2 within an article tag, and ido the following:
        $("p.title").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.reddit = reddit;
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            console.log(result)
            db.Article.create(result)
                .then(function(dbArticle) {
                    // If we were able to successfully scrape and save an Article, send a message to the client
                    console.log('scrape complete', dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    console.log("error!")
                    console.log(err)
                        //res.json(err);
                });
        });
        res.send('Scrape Complete');
        console.log(`Scrape Completed at ${timeStamp}`)
    });
});
//fetch all the distinct reddits
app.get('/reddit/distinct', function(req, res) {
    db.Article.find({}).distinct("reddit", (error, distinct) => {
        console.log(distinct)
        res.json(distinct)
    })

});

//fetch all reddits by reddit

app.get("/reddit/:id", function(req, res) {
    console.log("reddit!!")
    var redditID = req.params.id
    db.Article.find({ reddit: redditID }).then(stuff => {
        res.json(stuff)
    })
});

// Route for getting all Articles from the db
app.get('/articles', function(req, res) {
    db.Article.find()
        .then(function(articles) {
            res.json(articles);
        })
        .catch(function(err) {
            res.json(err)
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get('/articles/:id', function(req, res) {
    db.Article.findOne({
            _id: req.params.id
        })
        .populate('note')
        .then(function(article) {
            res.json(article);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post('/articles/:id', function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    note: dbNote._id
                }
            }, {
                new: true
            });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            console.log("ERROR CATCH CREATE")
            res.json(err);
        });
});
app.delete("/note/:id", function(req, res) {
        db.Note.deleteOne({ _id: req.params.id }).then(function(data) {
            res.json(data)
        }).catch(err => res.json(err))
    })
    // Start the server
app.listen(PORT, function() {
    console.log('App running on port ' + PORT + '!');
});