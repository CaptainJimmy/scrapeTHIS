$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {

        $("#articles").append(
            $('<div>').addClass("panel panel-default")
            .append(
                $('<a>')
                .attr({
                    "href": "https://reddit.com" + data[i].link,
                    "target": "_blank"
                }).append($("<p>").attr({
                    "data-id": data[i]._id
                }).addClass("article panel-heading").text(data[i].link))
            ),
            $("<h3>").attr({
                "data-id": data[i]._id,
                "data-toggle": "popover",
                "title": "Click to list notes made on this article",
                "data-content": "Click to list notes made on this article"
            }).addClass("article panel-body").text(data[i].title),

        )
    }
});


$(document).on("click", ".article", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
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
                    "data-id": data._id,
                    "id": 'savenote',
                    "type": "submit"
                }).addClass("btn btn-danger")
                .text("Save Note")
            )

            if (data.note) {
                console.log("HERE")
                $("#stickies").empty()
                data.note.forEach(element => {
                    console.log("each!")
                    console.log(element)
                    $("#stickies").append(
                        $('<div>').addClass("panel panel-default").append(
                            $('<h3>').addClass("panel-heading").text(element.title),
                            $('<h4>').addClass("panel-body").text(element.body)
                        )
                    )
                });
            }
        });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    console.log("savenote ", JSON.stringify(thisId));
    console.log($("#titleinput").val(), $("#bodyinput").val());
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .done(function(data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});