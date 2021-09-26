const mongoose = require("mongoose");
var config = require("../configs/development.json");
const color = require('colors');
const sampleData = require('../utils/loadSampleData.json');
const Customer = require('../models/user');
const Vehicle = require('../models/vehicle');

mongoose.Promise = Promise;
mongoose.connection.on('connected', () => {
  console.log(color.green('Connection Established'))
})

mongoose.connection.on('reconnected', () => {
  console.log(color.green('Connection Reestablished'))
})

mongoose.connection.on('disconnected', () => {
  console.log(color.red('Connection Disconnected'))
  mongoose.connection.close().then(()=>{
    console.log(color.red('Connection Closed Explicitly: '));
  }).catch((er)=>{
    console.log(color.red('Connection Closed Explicitly: ' , er));
  })
})

mongoose.connection.on('close', () => {
  console.log(color.red('Connection Closed'))
})

mongoose.connection.on('error', (error) => {
  console.log('ERROR: ' + error);
  mongoose.connection.close().then(()=>{
    console.log(color.red('Connection Closed Explicitly: '));
  }).catch((er)=>{
    console.log(color.red('Connection Closed Explicitly: ' , er));
  })
})

const connectToDb = async (app,port) => {
  const dbConnection = 
  config.dev.DIALECT + 
  config.dev.USERNAME +
  config.dev.PASSWORD + 
  config.dev.HOST + 
  config.dev.PARAMS;
  await mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((data)=>{
    // let vehiclesData,userData;
    // try {
    //   new Promise(async(resolve, reject)=> {
    //     mongoose.connection.collections["users"].drop(resolve, reject);
    //     mongoose.connection.collections["vehicles"].drop(resolve, reject);
    //     userData  = await Customer.insertMany(sampleData.users);
    //     vehiclesData = await Vehicle.insertMany(sampleData.vehicles);
    //     console.log(color.green("Mock Data created"));  
    //   }).catch((err)=>{
    //     console.log(color.red("Db Error While saving Condition Parameters is:" , err));
    //   })   
    // } catch (error) {
    //    console.log(color.red("Db Error While saving Condition Parameters is:" , error));
    // }
    app.listen(port, () => {
      console.log(color.green(`Application Running Please Open: http://${config.dev.HOST_NAME}:${port}${config.dev.BASE_CONTEXT}${config.dev.VERSION}${config.dev.API_ORCHESTRATION_ROUTE}`));
      console.log(color.green("Mock Data created"));
    });  
  })
}


module.exports = { connectToDb };
