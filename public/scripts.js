$(document).ready(function () {

    var user = "gilgur";


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
});


function send_form_details_for_server() {
    console.log("here");
}
