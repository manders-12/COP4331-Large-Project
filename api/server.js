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
  
    if( results.length > 0 )
    {
      id = results[0]._id;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      ll = results[0].LastEntry;
    }
  }
  catch(e){
    error = e.toString();
    next(e);
  }


  var ret = { id:id, firstName:fn, lastName:ln, lastLoggedIn:ll, error:''};
  res.status(200).json(ret);
});

app.post('/api/addEntry', async (req, res, next) =>
{
  // incoming: userId, journal text
  // outgoing: error
	
  const { userId, text } = req.body;

  const newEntry = {JournalText:text,User_ID:userId};
  var error = '';

  try
  {
    //INSERT DB NAME
    const db = client.db('JournalEntriesDB');
    // INSERT COLLECTION NAME
    const result = db.collection('Entries').insertOne(newEntry);
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
    const { startDate, endDate, userId } = req.body;
    const db = client.db('JournalEntriesDB');
    const results = await db.collection('Entries').find({EntryDate:{$gte:new Date(startDate).setHours(00, 00, 00), $lte:new Date(endDate).setHours(23, 59, 59)},User_ID:userId}).toArray();
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
      _ret.push( results[i].JournalText );
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