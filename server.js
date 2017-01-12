var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(bodyParser.json());
app.use(cors());

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

var Sequelize=require("sequelize");
var sequelize=new Sequelize('database','username','password',{
    dialect:'mysql',
    host: '127.0.0.1',
    port: 3306
    
});

var Event=sequelize.define('events',{
    id_city:{
        type: Sequelize.STRING,
        field: 'id_city'
    },
    event_type:{
        type:Sequelize.STRING,
        field:'event_type'
    },
    id_data:{
        type:Sequelize.STRING,
        field:'id_data'
    
    }
    
    });
    
    // create an event
app.post('/events', function(request,response) {
  Event.create(request.body).then(function(event) {
      Event.findById(event.id).then(function(event) {
          response.status(201).send(event);
      });
  });
});

//Read all
app.get('/events',function(request,response){
    Event.findAl().then(function(events){
        response.status(200).send(events);
    });
});

//Read one
app.get('/events/:id', function(request,response){
    Event.findById(request.params.id).then(function(event){
        if(event) {
            response.status(200).send(event);
        } else {
            response.status(404).send();
        }
    });
});

// update a specific event by id
app.put('/events/:id', function(request,response){
    Event
        .findById(request.params.id)
        .then(function(event){
            if(event) {
                event
                    .updateAttributes(request.body)
                    .then(function(){
                        response.status(202).send('updated');
                    })
                    .catch(function(error){
                        console.warn(error);
                        response.status(400).send('server error');
                    });
            } else {
                response.status(404).send();
            }
        });
});

 // delete an event by id
app.delete('/events/:id', function(req,res){
    Event
        .findById(req.params.id)
        .then(function(event){
            if(event) {
                event
                    .destroy()
                    .then(function(){
                        res.status(204).send();
                    })
                    .catch(function(error){
                        console.warn(error);
                        res.status(400).send('server error');
                    });
            } else {
                res.status(404).send();
            }
        });
});
                    

// REST methods
/*app.get('/events', function(req,res){
        res.status(200).send([]);
});*/
app.listen(process.env.PORT);