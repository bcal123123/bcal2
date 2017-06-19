var express = require('express');
var app = express();
var path = require('path');

var port = process.env.port || 8200;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/tofes/:id', function(req, res) {
	var id = req.params.id;
	
	res.send(db.tofes[0]);
	res.status(200);
	
});


var db = 
{
  "tofes": [
    {
      "id": "t1",
      "name": "hul",
      "stages": [
        {
          "id": "s1",
          "type": "input",
          "name": "????? ?????",
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
          "approver": "{{self}}"
        },
        {
          "id": "s2",
          "type": "video",
          "name": "תדרוך",
          "data": {
            "link": "sadasd.youtube.com"
          },
          "done": true,
          "approver": "{{self}}"
        },
        {
          "id": "s3",
          "type": "test",
          "name": "???? ?? ??????",
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
          "done": false,
          "approver": "{{self}}"
        },
        {
          "id": "s4",
          "type": "approve",
          "name": "????? ???",
          "done": false,
          "approver": "{{rashatz}}"
        },
        {
          "id": "s5",
          "type": "approve",
          "name": "????? ???",
          "done": false,
          "approver": "{{ramad}}"
        },
        {
          "id": "s6",
          "type": "approve",
          "name": "????? ?????",
          "done": false,
          "approver": "{{kabatia}}"
        },
        {
          "id": "s7",
          "type": "approve",
          "name": "????? ???",
          "done": false,
          "approver": "{{alam}}"
        },
        {
          "id": "s8",
          "type": "approve",
          "name": "????? ??????",
          "done": false,
          "approver": "{{shalishut}}"
        }
      ]
    }
  ]
};


app.listen(port);

