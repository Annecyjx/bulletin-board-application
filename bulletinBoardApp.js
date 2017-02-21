var pg = require('pg') //npm install pg --save
const express = require('express');//npm install express --save
const app = express();
const fs = require('fs');
const pug = require('pug');//npm install pug --save
const bodyParser = require('body-parser');// npm install --save body-parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('views', __dirname + '/views');
app.set('view engine','pug');
app.use(express.static('static'));

var Sequelize = require('sequelize');//npm install --save sequelize
var sequelize = new Sequelize('postgres://'+ process.env.POSTGRES_USER + ':'+ process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard');

//Set Messages model
var Messages = sequelize.define('messages', {
    title: Sequelize.TEXT,
    body:{
    	type:Sequelize.TEXT,
    	length:1024
    } 
});

//Show home page of form
app.get('/home',(request,response) => {
	console.log('Render index pug page');
	response.render('index'); //render the index.pug
});

//Send message
app.post('/home',(request,response) =>{
	//post the message form into database
	const inputSubject = request.body.subject
	const inputMessage = request.body.message

sequelize
.sync(/*{force:true}*/)//we can use {force:true} to clean table 'messages'
.then(function(){
    //insert the values to table 'messages'
    return Messages.create({
        title: inputSubject,
        body: inputMessage
    })
})
.then(function(){
	response.render('send-message-success');
})
})

//Show all the messages
app.get('/history',(request,response)=>{
	console.log('Render history pug page');
	Messages.findAll()/*the second key of db object from module.exports*/
		.then(function(data){
		console.log('logging the data variable:')
		console.log(data)
		var result = []
		for(i=0;i<data.length;i++){
			result.push({'title':data[i].title,'body':data[i].body})
		} 
		response.render('history',{messageInfo:result})
    })
})

app.listen(3000,() => {
	console.log('Server has started');
})

//process.env.POSTGRES_USER //we can use this as a variable 
//and here we want to install username 'postgres' in it

//process.env.POSTGRES_PASSWORD//this is the password of database 'postgres'

//we create a database called 'bulletinboard in PSQL'


// var connectionString = 'postgres://'+ process.env.POSTGRES_USER + ':'+ process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'
// pg.connect(connectionString,function(err,client,done){
// 	//create a table called 'messages'
// 	client.query(`create table messages (
// 		id serial primary key,
// 		title text,
// 		body text
// 		);`,function(err,result){
// 			console.log('result is:');
// 			console.log(result);
// 			//console.log(`${result.rows.title}:${result.rows.body}`);

// 			done();
// 			pg.end();
// 		})
// })
