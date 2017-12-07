// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .done(function(data) {
            console.log(data);
            $("#notes").append(
                $('<h2>').text(data.title),
                $('<input>').attr({
                    'id': 'titleinput',
                    "name": 'title'
                }),
                $('<textarea>').attr({
                    'id': 'bodyinput',
                    'name': 'body'
                }),
                $("<button>").attr({
                    "data-id": data,
                    "id": 'savenote',
                    "type": "submit"
                }).addClass("btn btn-danger")
                .text("Save Note")
            )

            // If there's a note in the article
            if (data.note) {
                data.note.forEach(element => {
                    $("#titleinput").append(
                            $('<div>').html(
                                $('<p>').text(element.title),
                                $('<p>').text(element.body)
                            )
                        )
                        // Place the body of the note in the body textarea
                });
                // Place the title of the note in the title input

            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});