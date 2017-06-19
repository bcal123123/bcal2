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

app.get('/tofesByUser/:user', function(req, res) {
	var user = req.params.user;
	
	var resTofes;
	db.tofes.forEach(function(tofes){ 
		if(tofes.creator == user) {
			resTofes = tofes;
			return;
		}
			
	});
	
	res.send(resTofes);
	res.status(200);	
});

app.get('/approve/:id/:stage', function(req, res) {
	var stageid = req.params.stage;
	
	var resStage; 
	var tofes = getTofesById(req.params.id);
	tofes.stages.forEach(function(stage) {
		if(stage.id == stageid) {
			stage.done = true;
			return;
		}
	});
	
	res.send(tofes);
	res.status(200);
});


var db = 
{
  "tofes": [
    {
      "id": "t1",
	  "creator":"soldier1",
      "name": "חול",
      "stages": [
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
                "fieldName": "date",
                "value": null
              }
            ]
          },
          "done": true,
          "approver": "soldier1"
        },
        {
          "id": "s2",
          "type": "video",
          "name": "תדרוך",
          "data": {
            "link": "sadasd.youtube.com"
          },
          "done": true,
          "approver": "soldier1"
        },
        {
          "id": "s3",
          "type": "test",
          "name": "מבחן",
          "data": {
            "test": {
              "qs": [
                {
                  "q": "a?",
                  "a": [
                    "1",
                    "2",
                    "3"
                  ],
                  "expected": "4"
                }
              ]
            }
          },
          "done": true,
          "approver": "soldier1"
        },
        {
          "id": "s4",
          "type": "approve",
          "name": "אישור רשצ",
          "done": false,
          "approver": "rashaz1"
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
        }
      ]
    },
	{
      "id": "t2",
	  "creator": "soldier2",
      "name": "hul",
      "stages": [
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
                "fieldName": "date",
                "value": null
              }
            ]
          },
          "done": true,
          "approver": "soldier2"
        },
        {
          "id": "s2",
          "type": "video",
          "name": "תדרוך",
          "data": {
            "link": "sadasd.youtube.com"
          },
          "done": true,
          "approver": "soldier2"
        },
        {
          "id": "s3",
          "type": "test",
          "name": "מבחן",
          "data": {
            "test": {
              "qs": [
                {
                  "q": "a?",
                  "a": [
                    "1",
                    "2",
                    "3"
                  ],
                  "expected": "4"
                }
              ]
            }
          },
          "done": true,
          "approver": "soldier2"
        },
        {
          "id": "s4",
          "type": "approve",
          "name": "אישור רשצ",
          "done": false,
          "approver": "rashaz2"
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
        }
      ]
    }
  ]
};


app.listen(port);

