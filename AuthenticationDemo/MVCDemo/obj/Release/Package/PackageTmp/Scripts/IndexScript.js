$(document).ready(()=> {
    load();
    var newuser = true;
    var current;

    // On Selector change, fill form boxes with employee information
    $("#selector").on('change', function() {
        if($(this).val() != 0)
        $.get("/api/Employees/" + $(this).val(), function(data, status){
            console.log(data);
            current = data;
            newuser = false;
            $("#FormId").val(data.Id);
            $("#FormName").val(data.Name);
            $("#FormEmail").val(data.Email);
            $("#FormContactEmail").val(data.ContactEmail);
            $("#FormPhone").val(data.Phone);
            $("#FormImg").attr("src","/" + data.Image);
            $("form").attr("action", "/api/Employees");
            $("#deleteBtn").css("display", "block");
            $("#qrcode").html("");

            // Change QR code to match new employee selection
            new QRCode(document.getElementById("qrcode"), {
                text: "http://" + document.location.host + "/Home/Contact/" + current.Id,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            $("#qrcodeurl").attr("href", "/Home/Contact/" + current.Id);
            $("#qrcodeurl").html("http://" + document.location.host + "/Home/Contact/" + current.Id);
        });
        // Clears input for creating new user 
        else
        {
            newuser = true;
            $("#qrcode").html("");
            document.getElementById("img").value = "";
            $("#qrcodeurl").html("");
            $("#FormId").val("");
            $("#FormName").val("");
            $("#FormEmail").val("");
            $("#FormContactEmail").val("");
            $("#FormPhone").val("");
            $("#FormImg").attr("src","");
            $("#deleteBtn").css("display", "none");
        }
    });

    // Delete chosen user. 
    $("#deleteBtn").on("click", () =>{
        settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/Employees",
            "method": "DELETE",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cache-Control": "no-cache",
            },
            "data": {
              "Id": current.Id,
              "Name": $("#FormName").val(),
                "Email": $("#FormEmail").val(),
                "ContactEmail": $("#FormContactEmail").val(),
              "Phone": $("#FormPhone").val(),
              "Image": "hes"
            }
          };
          $.ajax(settings).done(function (response) {
            load();
              alert("User have been deleted");
              $("#FormName").val("");
              $("#FormEmail").val("");
              $("#FormEmail").val("");
              $("#FormPhone").val("");
              $("#img").val("");
              $("#FormImg").attr("src", "");
        });
    });

    $('#createedit').submit(function () {
        var settings = "";
        //Checking if we are creating a new user and then creating or updating employee
        if(!newuser)
        {
        settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/Employees",
            "method": "PUT",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cache-Control": "no-cache",
            },
            "data": {
              "Id": current.Id,
              "Name": $("#FormName").val(),
                "Email": $("#FormEmail").val(),
                "ContactEmail": $("#FormContactEmail").val(),
              "Phone": $("#FormPhone").val(),
              "Image": "hes"
            }
          };
          $.ajax(settings).done(function (response) {
            uploadFile(current.Id);
            load();
              alert("User have been created/updated");
          });
        }
          else
          {
          settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/Employees",
            "method": "POST",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cache-Control": "no-cache",
              "Postman-Token": "a7b67f88-946a-49ec-bfac-51a08a3a8f29"
            },
            "data": {
              "": "",
              "Name": $("#FormName").val(),
                "Email": $("#FormEmail").val(),
                "ContactEmail": $("#FormContactEmail").val(),
              "Phone": $("#FormPhone").val(),
              "Image": "hes"
            }
          };
          $.ajax(settings).done(function (response) {
              console.log(response);
            uploadFile(response.Id);
              load();
              $("#ErrorMessage").css("display", "none");
              alert("User have been created/updated");
          });
        }

          
          
        return false;

    });

// Add option ny to selector plus getting all employees
function load(){
    $.get("/api/Employees", function(data, status){
        $("#selector").html("");
        var appendtext = "<option value='0'>Ny</option>";
        data.forEach(element => {
            appendtext += "<option value='"+element.Id+"'>"+element.Name+"</option>"
        });
        $("#selector").append(appendtext);
        newuser = true;
    });
}

// uploads image file to server
    function uploadFile(id) {
        if (!document.getElementById('img').files[0])
            return;
    var xhr = new XMLHttpRequest();                 
    var file = document.getElementById('img').files[0];
    xhr.open("POST", "/api/imageupload");
    console.log(file);
    var filename = file.name.substr(file.name.lastIndexOf("."));
    xhr.setRequestHeader("filename", filename);
    xhr.setRequestHeader("Id", id);
    xhr.send(file);
}
    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#FormImg').attr('src', e.target.result);
                $("#ErrorMessage").css("display", "none");
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#img").change(function () {
        readURL(this);
    });
});
function imageinvalid() {
    $("#ErrorMessage").css("display", "block");
}