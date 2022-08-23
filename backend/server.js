var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors=require("cors");

var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'zh1998501',
  database : 'CSE6242'
});
connection.connect();



app.use(cors()); 

app.use(bodyParser());

app.get('/institution', function (req, res) {
  var promise = new Promise(function(resolve, reject){
    var query = "select institution from topicBySchool GROUP BY institution";
    connection.query(query, function (err, result) {
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }        
    data = result
    resolve(data)  
    // res.end(JSON.stringify(data));
    });
  }).then(data => {
    res.end(JSON.stringify(data));
  })
})

app.post('/institutionDetail', function (req, res) {
  var promise = new Promise(function(resolve, reject){
    var query = `select * from topicBySchool where institution = "${req.body.selected}"`;
    connection.query(query, function (err, result) {
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }    
    console.log("result",result)    
    data = result
    resolve(data)  
    // res.end(JSON.stringify(data));
    });
  }).then(data => {
    res.end(JSON.stringify(data));
  })
})

app.post('/GetInstitutionPaper', function (req, res) {
  var promise = new Promise(function(resolve, reject){
    var query = "select institution from topicBySchool GROUP BY institution";
    connection.query(query, function (err, result) {
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }        
    data = result
    resolve(data)  
    // res.end(JSON.stringify(data));
    });
  }).then(data => {
    res.end(JSON.stringify(data));
  })
})

//hash table => scan data
app.get('/paperList4000', async function (req, res) {
 let data = {}
 var promise = new Promise(function(resolve, reject){
   var query = 'select id, title from paper limit 4000';
   connection.query(query, function (err, result) {
   if(err){
     console.log('[INSERT ERROR] - ',err.message);
     return;
   }        
   resolve(result)  
   });
 }).then(data => {
    res.end(JSON.stringify(data));
 })
})
 
 
app.post('/paperList', async function (req, res) {
   console.log(req.body);
  let data = {}
  var promise = new Promise(function(resolve, reject){
    var query = 'select * from paper limit ' + (req.body.curPage - 1) * 6 + ", 6";
    connection.query(query, function (err, result) {
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }        
    data['data'] = result
    resolve(data)  
    // res.end(JSON.stringify(data));
    });
  }).then(data => {
    var query = "select count(*) as total from paper";
    connection.query(query, function (err, result) {
      data['total'] = result;
      res.end(JSON.stringify(data));
    });
  })
  // connection.end();
})

app.post('/search', function (req, res) {
  console.log(req.body);
  let searchWord = req.body.searchWord;
   let data = {}
   var promise = new Promise(function(resolve, reject){
      var query = "select * from paper where title like '%" + searchWord + "%'" + " limit " + (req.body.curPage - 1) * 6 + ", 6";
      connection.query(query, function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }   
      data['data'] = result
      resolve(data);     
    });
  }).then(data => {
      var query = "select count(*) as total from paper where title like '%" + searchWord + "%'";
      connection.query(query, function (err, result) {
      data['length'] = result;    
      res.end(JSON.stringify(data));
      console.log("final", data)
    });
  })
})

app.post('/GetInsitutionPaper', function (req, res) {
  let institutions = req.body.institutions;
  let curPage = req.body.curPage; // 传接口参数

  let promise_arr = [];
  for(let i = 0; i < institutions.length; i++) {
    var promise = new Promise(function(resolve, reject){
      var query = "select * from paper where affiliation = '" + institutions[i] +"'";
      connection.query(query, function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }   
      data = result
      resolve(data);     
      });
    })
    promise_arr.push(promise);
  }   
  Promise.all(promise_arr).then(values => {
    let data = {};
    values = values.flat();
    values = values.filter(a => a != null)
    data['total'] = values.length;
    values = values.slice(curPage * 6, curPage * 6 + 6)
    data['data'] = values;
    res.end(JSON.stringify(data));
  })
})

var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("visit http://%s:%s", host, port)
 
})
