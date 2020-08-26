const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');

const generateId = require('./lib/generate-id');
/*
  The script should run in container. Container assumes to contain one process
  Default network is bridged, and it looks better from security perspective than host network
  To allow container communicate redis env var REDIS_HOST has been introduced.
  You can continue using localhost instead but need to configure shared network
  for service and redis container to let the service communicate with redis
*/

var redis = require("redis"),
  client = redis.createClient('6379', process.env.REDIS_HOST || '127.0.0.0');

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

app.locals.title = 'Pizza Express'
app.locals.pizzas = {};

app.get('/', (request, response) => {
  response.render('index');
});

app.post('/pizzas', (request, response) => {
  if (!request.body.pizza) { return response.sendStatus(400); }

  var id = generateId();
  var pizza = request.body.pizza;
  pizza.id = id;

  app.locals.pizzas[id] = pizza;

  response.redirect('/pizzas/' + id);
});

app.get('/pizzas/:id', (request, response) => {
  var pizza = app.locals.pizzas[request.params.id];

  response.render('pizza', { pizza: pizza });
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
    console.log(`putting key 'somekey' with value in redis and getting it: `);

    client.set("somekey", "successful test");
    client.get("somekey", function(err, reply) {
      // reply is null when the key is missing
      console.log(reply);
    });
  });
}

module.exports = app;
