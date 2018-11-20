document.addEventListener("DOMContentLoaded", function (event) {
    load();

    function load() {
        // Load users into table 
        $.get("/api/users", function (data, status) {
            $("#table tbody").html("");
            var appendtext = "";
            data.forEach(element => {
                appendtext += '<tr><td class="id">' + element.Id + '</td><td>' + element.Email + '</td><td><button class="btn btn-danger btn-sm deletebtn" style="display:flex; float:right;">Delete</button></td></tr>';
            });

            // Delete user from table 
            $("#table tbody").append(appendtext);
            $(".deletebtn").off();
            $(".deletebtn").on("click", function () {
                var id = $(this).closest("tr").find(".id").html();
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/api/users");
                xhr.setRequestHeader("Id", id);
                xhr.send();
                xhr.addEventListener("load", load);
            });
        });
    }
});
    




