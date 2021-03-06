var express = require('express');
var app = express();
var logger = require('morgan');
var passport = require("passport");
var route = require("./routes")(passport);
var compression = require("compression");
var bodyParser = require('body-parser');


app.use(express.static('bin'));
app.set('views', './src');
app.set('view engine', 'jade');

app.use(bodyParser());

app.use(logger("dev"));
app.use(compression());

app.use(route);

app.disable('etag');

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});
