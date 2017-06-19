var express = require('express');
var app = express();
var path = require('path');

var port = process.env.port || 8200;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/tofesById/:id', function(req, res) {
	var id = req.params.id;
	
	var resTofes = getTofesById(id);
	
	res.send(resTofes);
	res.status(200);	
});

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
		if(tofes.creator == user) {
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
	
	var resStage; 
	var tofes = getTofesById(req.params.tofesid);
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

// method:post, url:'/tofes/:type/:userid', data:{ name:'d1', lname:'aviram', sdate:'11/12/13', ndate:'12/14/14', dest:'Thai', pNumber: '123123'}
app.post('/tofes/:type/:userid', function(req, res) {
	var user = req.params.userid;
	var type = req.params.type;
	var body = req.body; // may body.data
	
	
	res.send(create(user, body, type));
	res.status(200);
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
            "link": "sadasd.youtube.com"
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
                  "q": "a?",
                  "a": [
                    "1",
                    "2",
                    "3"
                  ],
                  "expected": "4"
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
        }]

		return stages;
}


var db = 
{
  "tofes": []
};


var t1 = create('soldier1',  { name:'stam', lname:'name', sdate:'11/12/13', edate:'12/14/15', dest:'Thai', pNumber: '123123'},"חול" );
t1.stages[1].done;
t1.stages[2].done;


var t2 = create('soldier2',  { name:'proper', lname:'name', sdate:'11/12/13', edate:'12/14/15', dest:'Thai', pNumber: '123123'},"חול" );
t2.stages[1].done = true;
t2.stages[2].done = true;
t2.stages[3].done = true;



function create(user, data, type) {
	var newTofes = {
      "id": "t" + db.tofes.length+1,
	  "creator":user,
      "name": type	  
	};
	
	if(!type || type == "חול") {
		newTofes.stages = createTofesHulStages(user)
	} else {
		newTofes.stages = createTofesStagesByType(type, user);
	}
	
	var st0 = newTofes.stages[0];
	st0.data.fields.forEach(function(field) {
		if(field) {
			field.value = data[field.fieldName];		
		}
	});

	db.tofes.push(newTofes);

	console.log(newTofes);
	return newTofes;
}
 


createNewTofesType('hatz', [{type:'input', data: {fields :[{'fieldName':'pNumber'}]}, approver:"{user}"}]);
create('ofir', {'pNumber':'123123'} ,'hatz');
create('soldier1', {'pNumber':'123123'} ,'hatz');



app.listen(port);

