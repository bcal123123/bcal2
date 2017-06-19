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

$(document).ready(function () {

    var user = localStorage['user'];
    if (localStorage['user-display'])
        $('#user-dropdown-activator').html(localStorage['user-display']);

    /* wait to aprove section */

    $.get("/tofes/gettofesbyapprover/" + user, function (data) {
        updateAllNeedToBeAproved(data);
    });

    $(document).on('click','.waitToApprove', function (item) {
        var tofesid = $(this).data('tofesid');
        var stageid = $(this).data('stageid');

        $.get("/approve/" + tofesid + "/" + stageid, function (data) {
            Materialize.toast('הטופס אושר בהצלחה', 1000, '', function () {
                location.reload();
            });
        });
    });

    function updateAllNeedToBeAproved(data) {

        for (var i = 0; i < data.length; i++) {

            if (data[i].creator == user) {
                continue;
            }

            $('#amountOfWaitToApprove').html('(' + data.length + ')');

            $('#noToAproveLabel').hide();

            var stages = data[i].stages;
            var fields = stages[0].data.fields;

            var f = "";

            fields.forEach(function (field) {
                if (field.fieldName == 'name') {
                    field.fieldName = 'שם פרטי';
                }
                if (field.fieldName == 'lname') {
                    field.fieldName = 'שם משפחה';
                }
                if (field.fieldName == 'sdate') {
                    field.fieldName = 'תאריך טיסה';
                }
                if (field.fieldName == 'edate') {
                    field.fieldName = 'תאריך חזרה';
                }
                if (field.fieldName == 'dest') {
                    field.fieldName = 'יעד';
                }
                if (field.fieldName == 'pNumber') {
                    field.fieldName = 'מספר אישי';
                }

                f += "<b>" + field.fieldName + "</b>: " + field.value + "<br/>";
            });

            for (var j = 0; j < stages.length; j++) {
                var item = stages[j];
                if (item.type == 'approve' && item.done == false) {

                    var headline = "טופס זה ממתין לאישורך. פרטים מלאים:<br/> " + f;
                    $("#wait-for-aprove-list").append("<li><div class='collapsible-header'><i class='material-icons wait-for-aprove-icon'>library_books</i>טופס " + data[i].name + ", של " + data[i].creator + "</div><div class='collapsible-body' style='padding:0px;padding-right:30px'><p>" + headline + "</p><center><button class='waitToApprove waves-effect waves-light btn' data-tofesid='" + data[i].id + "' data-stageid='" + item.id + "'>אשר</button> &nbsp <a class='waves-effect waves-light btn'>דחה</a><br/><br/></center></div></li>");
                    break;
                }
            }
        }

    }

    /* end of wait to aprove section */



    /* wait to me section */

    $.get("/tofes/gettofesbyapprover/" + user, function (data) {
        updateAllNeedToMe(data);
    });

    $(document).on('click', '.waitToMe', function (item) {
        var tofesid = $(this).data('tofesid');
        var stageid = $(this).data('stageid');

        $.get("/approve/" + tofesid + "/" + stageid, function (data) {
            Materialize.toast('הטופס אושר בהצלחה', 1000, '', function () {
                location.reload();
            });
        });
    });

    function updateAllNeedToMe(data) {

        for (var i = 0; i < data.length; i++) {

            if (data[i].creator != user) {
                continue;
            }

            $('#amountOfWaitToMe').html('(' + data.length + ')');

            $('#noToMeLabel').hide();

            var stages = data[i].stages;
            var fields = stages[0].data.fields;

            var f = "qqqq";

            for (var j = 0; j < stages.length; j++) {
                var item = stages[j];
                if (item.done == false) {
                    console.log(item);
                    var headline = "טופס זה ממתין לאישורך. פרטים מלאים:<br/> " + f;
                    $("#wait-for-me-list").append("<li><div class='collapsible-header'><i class='material-icons wait-for-aprove-icon'>library_books</i>טופס " + data[i].name + ", של " + data[i].creator + "</div><div class='collapsible-body' style='padding:0px;padding-right:30px'><p>" + headline + "</p><center><button class='waitToMe waves-effect waves-light btn' data-tofesid='" + data[i].id + "' data-stageid='" + item.id + "'>אשר</button> &nbsp <a class='waves-effect waves-light btn'>דחה</a><br/><br/></center></div></li>");
                    break;
                }
            }
        }

    }

    /* end of wait to me section */
});




$('#run-form').submit(function(ev) {
    var tofes = {
        type: "חול",
        data: {
            name: $('#first_name')[0].value,
            lname: $('#last_name')[0].value,
            edate: $('#date_back')[0].value,
            sdate: $('#date_fly')[0].value,
            dest: $('#destination')[0].value,
            pNumber: $('#private_number')[0].value
        }};

    $.post('/runtofes/' + localStorage['user'], tofes);

});

$('#user-dropdown li a').on('click', function(e){
    localStorage.setItem('user', $(e.target).data('user'));
    localStorage.setItem('user-display', $(e.target).html());
    location.reload();
});
