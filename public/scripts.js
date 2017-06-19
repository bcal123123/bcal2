$(document).ready(function () {


    function getAllNeedTobeAproved() {
        // return from the server the array;

        var data = [{ name: "עמית", last_name: "שטאובר", details: "טיול לגרמניה" }, { name: "איתי", last_name: "ששון", details: "טיול לגרמניה" }];

        return data;
    }

    function updateAllNeedToBeAproved() {

        var data = getAllNeedTobeAproved();

        for (var i = 0; i < data.length; i++) {
            $("#wait-for-aprove-list").append("<li><div class='collapsible-header'><i class='material-icons wait-for-aprove-icon'>library_books</i>" + data[i].name +" "+ data[i].last_name + "</div><div class='collapsible-body'><p>"+ data[i].details + "</p><a class='waves-effect waves-light btn'>אשר</a><a class='waves-effect waves-light btn'>אל תאשר</a></div></li>");
        }

    }


    updateAllNeedToBeAproved();

});


function send_form_details_for_server() {
    console.log("here");
}
