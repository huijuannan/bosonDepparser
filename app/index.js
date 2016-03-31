'use strict';

const app = require('koa')();
const koastatic = require('koa-static');
const router = require('koa-router')();

app.use(koastatic('../node_modules'));
app.use(koastatic('../public'));


app.on('error', function (err, ctx) {
    console.log('error:' + err.message);
    console.log('context:' + JSON.stringify(ctx));
});

app.listen(8080);
