$(document).ready(() => {
    //gets id for the employee
    var url = $(location).attr('href'),
        parts = url.split("/"),
        last_part = parts[parts.length - 1];
    //getting employee and populating fields
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/api/Employees/" + last_part,
        "method": "GET",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function (response) {
        $("#Name").html(response.Name);
        $("#Phone").html(response.Phone);
        $("#Mail").html(response.Email);
        $("#Img").attr("src", "/" + response.Image);
    });
    $("#Form").on("submit", function (e) {
        e.preventDefault();
        var width = $("#Sending").outerWidth();
        var height = $("#Sending").innerHeight();
        $(this).find("input, textarea").css("display", "none");
        $("#Sending").css("display", "block");
        $("#Sending").css("height", height + "px");
        $("#Sending").css("width", width + "px");
        $(".loader").css("display", "block");
        $("#Title").css("display", "none");
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/sendmail",
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            },
            "data": {
                "TecId": last_part,
                "Name": $("#NameForm").val(),
                "Email": $("#EmailForm").val(),
                "Phone": $("PhoneForm").val(),
                "Company": $("#VirsomhedForm").val(),
                "Position": $("#StillingForm").val(),
                "Note": $("#NoteForm").val()
            }
        }

        $.ajax(settings).done(function (response) {
            $(".loader").css("display", "none");
            $(".mailsent").css("display", "block");
            $("#Sending").css("width", "100%");
            $("#Sending").css("height", "100%");
            $("#Sending h1").append($("#Name").html());
        });
    });
});
//makes a request to server about sending a mail


