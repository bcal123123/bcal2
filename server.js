var express = require('express');
var app = express();
var path = require('path');
var _ = require('lodash');
var bodyParser = require('body-parser');

var port = process.env.port || 8200;

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/empties', function(res, req){
    req.send(db.empties);
});

app.get('/tofesById/:id', function(req, res) {
	var id = req.params.id;
	
	var resTofes = getTofesById(id);
	
	res.send(resTofes);
	res.status(200);	
});

function ResolveApproverSyntax(user, approver){
    var resolver = {
        "soldier1": {
            "::1": "rashatz1",
            "::2": "ramad1"
        },
        "soldier2": {
            "::1": "rashatz2",
            "::2": "ramad2"
        },
        "rashatz1": {
            "::1": "rashatz1"
        }
    };

    if (approver == "::0")
        return user;

    if (user.lastIndexOf("soldier", 0) !== 0)
        return user;
    
    return resolver[user][approver];
}

function getTofesById(id) {
	
	var resTofes;
	db.tofes.forEach(function(tofes){ 
		if(tofes.id == id) {
			resTofes = tofes;
			return resTofes;
		}
			
	});
	return resTofes;
}

app.get('/tofesesByUser/:user', function(req, res) {
	var user = req.params.user;
	
	var resdata = [];
	db.tofes.forEach(function(tofes){ 
		if(tofes.creator == user && !tofes.dismissed) {
			resdata.push(tofes);
		}
			
	});
	
	res.send(resdata);
	res.status(200);	
});

app.get('/allTofeses', function(req, res) {
	res.send(db);
});


app.get('/approve/:tofesid/:stageid', function(req, res) {
	var stageid = req.params.stageid;
	var tofesid = req.params.tofesid;
	
	var resStage; 
	var tofes = getTofesById(tofesid);
	tofes.stages.forEach(function(stage) {
		if(stage.id == stageid) {
			stage.done = true;
			return;
		}
	});
	
	res.send(tofes);
	res.status(200);
});


// method:post, url:'/tofes/:userid', data:{ name:'d1', lname:'aviram', sdate:'11/12/13', ndate:'12/14/14', dest:'Thai', pNumber: '123123'}
app.post('/tofes/:userid', function(req, res) {
	var user = req.params.userid;
	var body = req.body; // may body.data
	
	res.send(create(user, body));
	res.status(200);
});

app.get('/tofes/getTofesByApprover/:user', function(req, res) {
	var approver = req.params.user;
	
	var tofesRes=[];
	db.tofes.forEach(function(tofes) {
		var firstUnDoneStage = _.find(tofes.stages, function(stage) { 
			return stage.done == false;
		});

		if(firstUnDoneStage  && firstUnDoneStage.approver == approver){
			tofesRes.push(tofes);
		}
	});
	res.send(tofesRes);
	res.status(200);
	
});

app.post('/empty/add/:newempty', function(req, res){
    var newEmptyName = req.params.newempty;
    var newEmpty = req.body;

    db.empties[newEmptyName] = newEmpty;
    res.send(200);
});

app.post('/runtofes/:userid', function(req, res) {
	var user = req.params.userid;
	var type = req.body.type;
	var data = req.body.data;
	
	res.send(create(user, data, type));
	res.status(200);
});

app.post('/dismiss/:tofesid', function(req, res){
    var tofesid = req.params.tofesid;

    var tofesToDismiss = _.find(db.tofes, function(tofes) {
        return tofes.id == tofesid;
    });

    tofesToDismiss.dismissed = true;

    res.send(true);
});

var types = {
	'vication':{},
};

//todo: data schema ?
var stage_types = [
	{ id:"approve" },
	{ id:"input", data: "fields"},
	{ id:"video", data: "link"},
	{ id:"test", data: "questions"}
];

function createNewTofesType(tofesType, stages){
	types[tofesType] = {
		stages:[		
		]		
	};
	
	stages.forEach(function(stage) {
		var tStages = types[tofesType].stages;
		tStages.push({ id:'st' + tStages.length, type: stage.type, 
			name:tofesType, data: stage.data, done: false, approver: stage.approver });
	});
	
}

function createTofesStagesByType(type, user) {
	// change data relative to user
	var stages = types[type].stages;
	stages.forEach(function(stage) {
		if(stage.approver == '{user}')
			stage.approver = user;
	});
	
	return stages;
}

function createTofesHulStages(user) {
	
		var rashatz = 'rashatz2';
		if(user == 'soldier1')
			 rashatz = 'rashatz1';
		 
		var stages = [{
          "id": "s1",
          "type": "input",
          "name": "פרטי הטופס",
          "data": {
            "fields": [
              {
                "fieldName": "name",
                "value": null
              },
              {
                "fieldName": "lname",
                "value": null
              },
              {
                "fieldName": "sdate",
                "value": null
              },
              {
                "fieldName": "edate",
                "value": null
              },
              {
                "fieldName": "pNumber",
                "value": null
              },
              {
                "fieldName": "dest",
                "value": null
              }  
            ]
          },
          "done": true,
          "approver": user
        },
        {
          "id": "s2",
          "type": "video",
          "name": "תדרוך",
          "data": {
            "link": "https://www.youtube.com/embed/Y_OLslE3bX8"
          },
          "done": false,
          "approver": user
        },
        {
          "id": "s3",
          "type": "test",
          "name": "מבחן",
          "data": {
            "test": [{
                  "q": "האם מותר לדבר בחול על היחידה?",
                  "a": [
                    "כן",
					"לא",
					"תלוי איך היא נראית"
                  ],
                  "expected": "לא"
            },{
                  "q": "האם מותר לצאת מהשדה בקונקשן?",
                  "a": [
                    "כן",
					"לא",
					"תלוי איך היא נראית"
                  ],
                  "expected": "לא"
            }]
            
          },
          "done": false,
          "approver": user
        },
        {
          "id": "s4",
          "type": "approve",
          "name": "אישור רשצ",
          "done": false,
          "approver": rashatz
        },
        {
          "id": "s5",
          "type": "approve",
          "name": "אישור רמד",
          "done": false,
          "approver": "ramad1"
        },
        {
          "id": "s6",
          "type": "approve",
          "name": "אישור קבטיה",
          "done": false,
          "approver": "kabatia"
        },
        {
          "id": "s7",
          "type": "approve",
          "name": "אישור אלמ",
          "done": false,
          "approver": "gilgur"
        },
        {
          "id": "s8",
          "type": "approve",
          "name": "אישור שלישות",
          "done": false,
          "approver": "shalishut"
        },
        {
          "id": "s9",
          "type": "approve",
          "name": "אישור רמטית",
          "done": false,
          "approver": "ramatit"
        }];

		return stages;
}

var db = { "tofes": [], "empties": {} };

function create(user, data, type) {
    var emptyTofes = db.empties[type];

	var newTofes = {
      "id": "t" + db.tofes.length+1,
	  "creator": user,
      "name": emptyTofes.name
	};

    // Generate Stages
    newTofes.stages = [];
    emptyTofes.stages.forEach(function(emptyStage){
        var newStage = {};
        //Object.assign(newStage, emptyStage); //Fuck old versions
        for (var attrname in emptyStage) { newStage[attrname] = emptyStage[attrname]; }

        //if (newStage.approver.startsWith("::")) //fuck old versions
        if (newStage.approver.lastIndexOf("::", 0) === 0)
            newStage.approver = ResolveApproverSyntax(user, newStage.approver);

        newTofes.stages.push(newStage);
    });
	
	var st0 = newTofes.stages[0];
    if (st0.data && st0.data.fields)
        st0.data.fields.forEach(function(field) {
            if(field) {
                field.value = data[field.fieldName];
            }
        });

	db.tofes.push(newTofes);

	return newTofes;
}

db.empties.hul = {
    modal: "<form id=\"run-form\"><h4>הרצת טופס חול</h4><div class=\"row\"><div class=\"input-field col s6\"><input id=\"last_name\" type=\"text\" class=\"validate\"><label for=\"last_name\" class=\"hebrew-fix\">שם משפחה</label></div><div class=\"input-field col s6\"><input id=\"first_name\" type=\"text\" class=\"validate\"><label for=\"first_name\" class=\"hebrew-fix\">שם פרטי</label></div></div><div class=\"row\"><div class=\"input-field col s6\"><input id=\"date_back\" type=\"text\" class=\"validate\"><label for=\"date_back\" class=\"hebrew-fix\">תאריך חזרה</label></div><div class=\"input-field col s6\"><input id=\"date_fly\" type=\"text\" class=\"validate\"><label for=\"date_fly\" class=\"hebrew-fix\">תאריך טיסה</label></div></div><div class=\"row\"><div class=\"input-field col s12\"><input id=\"destination\" type=\"text\" class=\"validate\"><label for=\"destination\" class=\"hebrew-fix\">יעד</label></div></div><div class=\"row\"><div class=\"input-field col s12\"><input id=\"private_number\" type=\"text\" class=\"validate\"><label for=\"private_number\" class=\"hebrew-fix\">מספר אישי</label></div></div><div class=\"modal-footer center-align modal-footer-container\"><button type=\"submit\" class=\"modal-action modal-close waves-effect waves-light btn\">הרץ טופס</button></div></form><script>$('#run-form').submit(function(ev) {var tofes = {type: \"hul\",data: {name: $('#first_name')[0].value,lname: $('#last_name')[0].value,edate: $('#date_back')[0].value,sdate: $('#date_fly')[0].value,dest: $('#destination')[0].value,pNumber: $('#private_number')[0].value}};$.post('/runtofes/' + localStorage['user'], tofes, function(data){location.reload();});});</script>",
    name: "טופס חו\"ל",
    image: "/img/hul.jpg",
    stages: [
        {
            "id": "s1",
            "type": "input",
            "name": "פרטי הטופס",
            "data": {
                "fields": [
                    {
                        "fieldName": "name",
                        "value": null
                    },
                    {
                        "fieldName": "lname",
                        "value": null
                    },
                    {
                        "fieldName": "sdate",
                        "value": null
                    },
                    {
                        "fieldName": "edate",
                        "value": null
                    },
                    {
                        "fieldName": "pNumber",
                        "value": null
                    },
                    {
                        "fieldName": "dest",
                        "value": null
                    }
                ]
            },
            "done": true,
            "approver": "::0"
        },
        {
            "id": "s2",
            "type": "video",
            "name": "תדרוך",
            "data": {
                "link": "https://www.youtube.com/embed/Y_OLslE3bX8"
            },
            "done": false,
            "approver": "::0"
        },
        {
            "id": "s3",
            "type": "test",
            "name": "מבחן",
            "data": {
                "test": [{
                    "q": "האם מותר לדבר בחול על היחידה?",
                    "a": [
                        "כן",
                        "לא",
                        "תלוי איך היא נראית"
                    ],
                    "expected": "לא"
                },{
                    "q": "האם מותר לצאת מהשדה בקונקשן?",
                    "a": [
                        "כן",
                        "לא",
                        "תלוי איך היא נראית"
                    ],
                    "expected": "לא"
                }]

            },
            "done": false,
            "approver": "::0"
        },
        {
            "id": "s4",
            "type": "approve",
            "name": "אישור רשצ",
            "done": false,
            "approver": "::1"
        },
        {
            "id": "s5",
            "type": "approve",
            "name": "אישור רמד",
            "done": false,
            "approver": "::2"
        },
        {
            "id": "s6",
            "type": "approve",
            "name": "אישור קבטיה",
            "done": false,
            "approver": "kabatia"
        },
        {
            "id": "s7",
            "type": "approve",
            "name": "אישור אלמ",
            "done": false,
            "approver": "gilgur"
        },
        {
            "id": "s8",
            "type": "approve",
            "name": "אישור שלישות",
            "done": false,
            "approver": "shalishut"
        },
        {
            "id": "s9",
            "type": "approve",
            "name": "אישור רמטית",
            "done": false,
            "approver": "ramatit"
        }
    ]
};

db.empties.sick = {
    modal: "<form id=\"run-form\"><h4>הצהרה</h4><div class=\"row\" style='display: flex;'><div class=\"input-field col s6\"><input id=\"date\" type=\"text\" class=\"validate\"><label for=\"date\" class=\"hebrew-fix\">תאריך</label></div></div><div class=\"modal-footer center-align modal-footer-container\"><button type=\"submit\" class=\"modal-action modal-close waves-effect waves-light btn\">הרץ טופס</button></div></form><script>$('#run-form').submit(function(ev) {var tofes = {type: \"sick\",data: {date: $('#date')[0].value}};$.post('/runtofes/' + localStorage['user'], tofes, function(data){location.reload();});});</script>",
    name: "הצהרה",
    image: "/img/sick.jpg",
    stages: [
        {
            "id": "1",
            "type": "approve",
            "name": "אישור רש\"צ",
            "done": false,
            "approver": "::1"
        }
    ]

};

db.empties.driver = {
    modal: "<form id=\"run-form\"><h4>מדבקה לרכב</h4><div class=\"row\" style='display: flex;'><div class=\"input-field col s6\"><input id=\"carnum\" type=\"text\" class=\"validate\"><label for=\"carnum\" class=\"hebrew-fix\">מספר רכב</label></div></div><div class=\"modal-footer center-align modal-footer-container\"><button type=\"submit\" class=\"modal-action modal-close waves-effect waves-light btn\">הרץ טופס</button></div></form><script>$('#run-form').submit(function(ev) {var tofes = {type: \"driver\",data: {carnum: $('#carnum')[0].value}};$.post('/runtofes/' + localStorage['user'], tofes, function(data){location.reload();});});</script>",
    name: "מדבקה לרכב",
    image: "/img/driver.jpg",
    stages: [
        {
            "id": "1",
            "type": "approve",
            "name": "אישור רש\"צ",
            "done": false,
            "approver": "::1"
        },
        {
            "id": "2",
            "type": "approve",
            "name": "אישור קבטיה",
            "done": false,
            "approver": "kabatia"
        }
    ]
};

app.listen(port);