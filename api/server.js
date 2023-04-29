const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
//INSERT CORRECT URL
const url = 'mongodb+srv://DBUserLP:o809F5cn9AMYPkdx@cluster0.3ngbphf.mongodb.net?retryWrites=true&w=majority';

const client = new MongoClient(url);
client.connect();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods', 
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
  var error = '';
  try{
    const { username, password } = req.body;
    //INSERT DATABASE NAME
    const db = client.db("JournalEntriesDB");
    const results = await db.collection('users').find({Username:username,Password:password}).toArray();
  
    var id = -1;
    var fn = '';
    var ln = '';
    var le = '';
  
    if( results.length > 0 )
    {
      id = results[0]._id;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      le = results[0].LastEntry;
    }
    var ret = { id:id, firstName:fn, lastName:ln, lastEntry:le, error:''};
  }
  catch(e){
    error = e.toString();
    next(e);
  }


  if (id != -1){
    res.status(200).json(ret);
  }
  else res.status(401).json(ret);
});

app.post('/api/addEntry', async (req, res, next) =>
{
  // incoming: userId, journal text
  // outgoing: error
	
  const { userId, text, date } = req.body;
  const newDate = new Date(date);
  const newEntry = {JournalText:text,User_ID:userId,EntryDate:newDate};
  var error = '';

  try
  {
    //INSERT DB NAME
    const db = client.db('JournalEntriesDB');
    // INSERT COLLECTION NAME
    const result = db.collection('Entries').insertOne(newEntry);
    const dt = Date.now()
    db.collection('users').updateOne({_id:userId},{$set: {LastEntry: dt}});
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
{
  // incoming: userId, journal text
  // outgoing: error
	
  const { username, password, firstName, lastName, emailAddress } = req.body;

  const newUser = {Username:username,Password:password,FirstName:firstName,LastName:lastName,email:emailAddress};
  var error = '';

  try
  {
    //INSERT DB NAME
    const db = client.db('JournalEntriesDB');
    // INSERT COLLECTION NAME
    const result = db.collection('users').insertOne(newUser);
    const results = await db.collection('users').find({Username:username,Password:password}).toArray();
    var id = -1;
  
    if( results.length > 0 )
    {
      id = results[0]._id;
      var ret = {id: id, error: error };
      res.status(200).json(ret);
    }
    else {
        res.status(400).json(ret);
    }
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {id: id, error: error };
  
});

app.post('/api/updateUser', async (req, res, next) =>
{
  // incoming: userId, journal text
  // outgoing: error
	
  const { userId, firstName, lastName, emailAddress } = req.body;

  const newUser = {FirstName:firstName,LastName:lastName,email:emailAddress};
  var error = '';

  try
  {
    //INSERT DB NAME
    const db = client.db('JournalEntriesDB');
    // INSERT COLLECTION NAME
    const result = db.collection('users').updateOne({_id:userId},{$set: newUser});
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/searchEntries', async (req, res, next) => 
{
  // incoming: startDate, endDate, userId
  // outgoing: results[], error
  
  var error = '';
  try{
    const { userId, startDate, endDate } = req.body;
    const db = client.db('JournalEntriesDB');
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const results = await db.collection('Entries').find({EntryDate:{$gte: sDate, $lte: eDate},User_ID:userId}).toArray();
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
      _ret.push( results[i].JournalText );
      _ret.push( results[i].EntryDate );
    }
  }
  catch(e){
    error = e.toString();
    next(e);
  }


  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.listen(5000);