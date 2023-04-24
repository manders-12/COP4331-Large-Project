const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
//INSERT CORRECT URL
const url = 'mongodb+srv://michaela12:1234@cluster0.iuw6cpn.mongodb.net/COP4331Cards?retryWrites=true&w=majority';

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

  const { login, password } = req.body;
  //INSERT DATABASE NAME
  const db = client.db("INSERT DATABASE NAME");
  const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

  var id = -1;
  var fn = '';
  var ln = '';

  if( results.length > 0 )
  {
    id = results[0].UserID;
    fn = results[0].FirstName;
    ln = results[0].LastName;
  }

  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/addEntry', async (req, res, next) =>
{
  // incoming: userId, journal entry
  // outgoing: error
	
  const { userId, entry } = req.body;

  const newEntry = {Entry:entry,UserId:userId};
  var error = '';

  try
  {
    //INSERT DB NAME
    const db = client.db('COP4331Cards');
    // INSERT COLLECTION NAME
    const result = db.collection('Cards').insertOne(newEntry);
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

  const { startDate, endDate, userId } = req.body;
  
  const db = client.db();
  const results = await db.collection('Entries').find({"date":{$get: new Date(startDate), $let: new Date(endDate)}}).toArray();
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Entry );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});