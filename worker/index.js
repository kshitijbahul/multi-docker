'use strict';
//import {key} from "./config";

//import redis from 'redis'
const key = require('./config');
const redis = require('redis')


const redisClient = redis.createClient({
    host: key.redisHost,
    port: key.redisPort,
    retry_strategy: ()=> 1000
});


//To create a subscriber for redis Client
const sub= redisClient.duplicate();

function fib(index){
    if (index<2)return 1;
    return fib(index-1)+fib(index-2);
}

//On Getting a new message use a hashset to put the username and password
sub.on('message',(channel,message)=>{
    redisClient.hset('values',message,fib(parseInt(message)))
});

//subscribing to insert event on redis
sub.subscribe('insert');