$(document).ready(function () {
    if (localStorage["user"] == null) {
        localStorage["user"] = "soldier1";
    }

    $.get("/tofesesByUser/" + localStorage["user"], function (tofeses) {
        var elements = [];
        
        tofeses.forEach(function (tofes) {
            var stages = "";
            tofes["stages"].forEach(function (stage) {
                var isDone = "";

                if (stage["done"]) {
                    isDone = "completed";
                }

                stages += "<li class='" + isDone + "'><span class='bubble'></span>" + stage["name"] + "</li>";
            });

            var element = "<li><div class='collapsible-header'><i class='material-icons wait-for-aprove-icon'>library_books</i>" +
                tofes["name"] +
                "</div><div class='collapsible-body'>" +
                "<ul class='progress-indicator'>" + stages + "</ul></div></li>";

            elements.push(element);
        });

        elements.forEach(function (element) {
            $("#my-forms").append(element);
        });
    });
});