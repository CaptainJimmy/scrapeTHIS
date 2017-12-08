$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {

        $("#articles").append(
            $('<div>').addClass("panel panel-default")
            .append(
                $('<div>').addClass("article panel-heading").append(
                    $('<h4>').text(data[i].reddit),
                    $('<a>').attr({
                        "href": "https://reddit.com" + data[i].link,
                        "target": "_blank"
                    }).append($("<p>").attr({
                        "data-id": data[i]._id
                    }).addClass("article").text(data[i].link))
                ),
                $("<h3>").attr({
                    "data-id": data[i]._id,
                }).addClass("article panel-body").text(data[i].title),
            )

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
                            $('<h4>').addClass("panel-body").text(element.body).append(
                                $('<button>').addClass("btn btn-default btn-sm deleteButton").attr({ "data-id": element._id }).append($('<span>').addClass("glyphicon glyphicon-remove"))
                            )
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

$(document).on("click", ".deleteButton", function() {
    var thisID = $(this).attr("data-id");
    console.log("delete this " + thisID)
    $.ajax({
        method: "DELETE",
        url: "/note/" + thisID
    }).then(function() {
        $.getJSON("/articles", function(data) {
            for (var i = 0; i < data.length; i++) {

                $("#articles").append(
                    $('<div>').addClass("panel panel-default")
                    .append(
                        $('<div>').addClass("article panel-heading").append(
                            $('<h4>').text(data[i].reddit),
                            $('<a>').attr({
                                "href": "https://reddit.com" + data[i].link,
                                "target": "_blank"
                            }).append($("<p>").attr({
                                "data-id": data[i]._id
                            }).addClass("article").text(data[i].link))
                        ),
                        $("<h3>").attr({
                            "data-id": data[i]._id,
                        }).addClass("article panel-body").text(data[i].title),
                    )

                )
            }
        })
    }).done(() => {
        $('#stickies').empty();
    })
})
$(document).on("click", ".redditButton", function() {
    var thisReddit = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/reddit/" + thisReddit
    }).then(data => {
        $("#articles").empty();

        data.forEach(turkey => {
            $("#articles").append(
                $('<div>').addClass("panel panel-default")
                .append(
                    $('<div>').addClass("article panel-heading").append(
                        $('<h4>').text(turkey.reddit),
                        $('<a>').attr({
                            "href": "https://reddit.com" + turkey.link,
                            "target": "_blank"
                        }).append($("<p>").attr({
                            "data-id": turkey._id
                        }).addClass("article").text(turkey.link))
                    ),
                    $("<h3>").attr({
                        "data-id": turkey._id,
                    }).addClass("article panel-body").text(turkey.title),
                )

            )
        })
    })
})