'use-strict'
const express = require('express');
const graphqlHttp = require('express-graphql');
const cors = require("cors");
var configs = require('./configs/development.json');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const { connectToDb } = require("./configs/connection");
const color = require('colors');
const port = configs.dev.PORT || 3000;
const app = express();
app.disable('e-tag').disable('x-powered-by');

//CORS configs
var corsOptions = {
    origin: "*",
    methods: ["GET", "PUT", "POST", "PUT", "PATCH" , "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "X-Domain"

    ],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const start = async()=> 
{
    connectToDb(app,port)
    .catch(error => {
        console.error("error while connection is:", error)
    })
}

process.on('unhandledRejection', error => 
{
    console.error('Uncaught Error', error);
});

function onError(error) 
{
    if (error.syscall !== 'listen') 
    {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) 
    {
        case 'EACCES':
        console.error(color.red(bind + ' requires elevated privileges'));
        process.exit(1);
        break;
        case 'EADDRINUSE':
        console.error(color.red(bind + ' is already in use'));
        process.exit(1);
        break;
        default:
        throw error;
    }
}
  
function onListening() 
{
  console.log(color.green("Server is Listening" ));
}

app.on('error', onError);
app.on('listening', onListening);

//This route will be used as an endpoint to interact with Graphql,All queries will go through this route. 
app.use(
    `${configs.dev.BASE_CONTEXT}${configs.dev.VERSION}${configs.dev.API_ORCHESTRATION_ROUTE}`,
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true
    })
);

start()

