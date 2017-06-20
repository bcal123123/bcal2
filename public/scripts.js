var empties;

$(document).ready(function () {
    if (localStorage["user"] == null) {
        localStorage["user"] = "soldier1";
    }

    $.get('/empties', function(data){
   console.log(data);
        empties = data;
        
        Object.keys(empties).forEach(function(key){
            var empty = empties[key];
            var element = "<a data-empty=\""+key+"\" href=\"#emptyModal\"><div class=\"bkal-form-card hul-form card light-blue darken-3\" style=\"background-image:url("+empty.image+")\"><div class=\"card-content white-text\"><span class=\"card-title\">"+empty.name+"</span></div></div></a>";
            $('#popular').append(element);
        });
    });

    $('#emptyModal').modal({
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            var empty = trigger.data('empty');
            console.log(empties[empty]);
            $('#emptyModal .modal-content').html(empties[empty].modal);
            RegisterForm();
        }
    });

    $.get("/tofesesByUser/" + localStorage["user"], function (tofeses) {
        var elements = [];

        tofeses.forEach(function (tofes) {
            var stages = "";
            var isTofesDone = true;

            tofes["stages"].forEach(function (stage) {
                var isDone = "";

                if (stage["done"]) {
                    isDone = "completed";
                }
                else{
                    isTofesDone = false;
                }

                stages += "<li class='" + isDone + "'><span class='bubble'></span>" + stage["name"] + "</li>";
            });

            var dismissTofesButton = "";
            var tofesDoneClass = "";
            if (isTofesDone){
                tofesDoneClass = " class='tofes-completed'";
                dismissTofesButton = "<a class='aves-effect waves-light btn' onclick=\"dissmissTofes('"+tofes.id+"')\">גבר שחרר</a>";
            }

            var element = "<li" + tofesDoneClass +"><div class='collapsible-header'><i class='material-icons wait-for-aprove-icon'>library_books</i>" +
                tofes["name"] +
                "</div><div class='collapsible-body'>" +
                "<ul class='progress-indicator'>" + stages + "</ul>" + dismissTofesButton + "</div></li>";

            elements.push(element);
        });

        elements.forEach(function (element) {
            $("#my-forms").append(element);
        });

        if (elements.length != 0) {
            $('#noAvailablesFormsLabel').hide();
        }
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
            var fields;
            if (stages[0].data && stages[0].data.fields)
                fields= stages[0].data.fields;

            var f = "";

            if (fields){
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

            }

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
        var number = 1;

        var canContinue = true;

        if (lastQuestions) {
            lastQuestions.forEach(function (q) {
                if ($('input[name=q_' + number + ']:checked').val() != q.expected) {
                    canContinue = false;
                    Materialize.toast('לא ענית נכון על השאלון', 1000);
                }
                number++;
            });
        }

        if (canContinue) {
            var tofesid = $(this).data('tofesid');
            var stageid = $(this).data('stageid');

            $.get("/approve/" + tofesid + "/" + stageid, function (data) {
                Materialize.toast('הטופס אושר בהצלחה', 1000, '', function () {
                    location.reload();
                });
            });
        } else {
            return false;
        }
       
    });

    var lastQuestions;

    function updateAllNeedToMe(data) {

        for (var i = 0; i < data.length; i++) {

            if (data[i].creator != user) {
                continue;
            }

            $('#amountOfWaitToMe').html('(' + data.length + ')');

            $('#noToMeLabel').hide();

            var stages = data[i].stages;

            
            for (var j = 0; j < stages.length; j++) {
                var item = stages[j];
                if (item.done == false) {
                    console.log(item);

                    var fullhtml = "<form >";

                    if (item.type == "test") {
                        
                        var questions = item.data.test;
                        lastQuestions=questions;
                        var number = 1;
                        fullhtml += "<h5>מבחן</h5>";
                        questions.forEach(function (cQuestion) {
                            fullhtml += "<h6>" + cQuestion.q + "<h6>";
                            fullhtml += "<div ><input type='radio' name='q_" + number + "' value='" + cQuestion.a[0] + "' style='left:0px !important; opacity:1;position:initial'>" + cQuestion.a[0] + "</div>";
                            fullhtml += "<div ><input type='radio' name='q_" + number + "' value='" + cQuestion.a[1] + "' style='left:0px !important; opacity:1;position:initial'>" + cQuestion.a[1] + "</div>";
                            fullhtml += "<div ><input type='radio' name='q_" + number + "' value='" + cQuestion.a[2] + "' style='left:0px !important; opacity:1;position:initial'>" + cQuestion.a[2] + "</div> </br>";
                            number++;
                        });

                        fullhtml += "</form>";
                    }

                    if (item.type == "video") {
                        fullhtml += "<center><iframe style='width:95%;height:200px' src='" + item.data.link + "' frameborder='0' allowfullscreen></iframe></center>"
                    }


                    var headline = "טופס זה ממתין לאישורך. פרטים מלאים:<br/> " ;
                    $("#wait-for-me-list").append("<li><div style='direction:rtl' class='collapsible-header'><i class='material-icons wait-for-aprove-icon'>library_books</i>טופס " + data[i].name + ", של " + data[i].creator + "</div><div class='collapsible-body' style='padding:0px;padding-right:30px'><p>" + fullhtml + "</p><center><button class='waitToMe waves-effect waves-light btn' data-tofesid='" + data[i].id + "' data-stageid='" + item.id + "'>אשר</button> &nbsp <a class='waves-effect waves-light btn'>דחה</a><br/><br/></center></div></li>");
                    break;
                }
            }
        }

    }

    /* end of wait to me section */
});

function RegisterForm(){
    /**/
}

$('#user-dropdown li a').on('click', function(e){
    localStorage.setItem('user', $(e.target).data('user'));
    localStorage.setItem('user-display', $(e.target).html());
    location.reload();
});

function dissmissTofes(id){
    $.post('/dismiss/'+id, function(data){
        if (data){
            location.reload();
        }
    });
}

RegisterForm();