const keys= require('./config');
const express= require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app=express();


app.use(cors());
app.use(bodyParser.json());


// PG client setup 

const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error',()=> console.log('Lost connection to Postgress'));

pgClient.query('CREATE TABLE IF NOT EXISTS VALUES (number INT)')
    .catch(err => console.log('cannot create table',err));

//Redis Setup 
const redis= require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})
//Create new connection to Publisher
const redisPublisher = redisClient.duplicate();


//Express Handler




app.get("/",(req,res)=>{
    res.send('Hi');
});

app.get("/values/all",async (req,res)=>{
    const values = await pgClient.query('Select * From VALUES');
    res.send(values.rows);
});

app.get("/values/current",async (req,res) =>{
    redisClient.hgetall('values',(err,values)=>{
        res.send(values);
    });
});

app.post('/values',async (rec,res) =>{
    const index= rec.body.index;
    if(parseInt(index)>40){
        return res.status(422).send('Index too hight');
    }
    redisClient.hset('values',index,'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('insert into values(number) values ($1) ',[index]);
    res.send({working:true});
})

app.listen(5000,()=>{
    console.log('Listening')
});