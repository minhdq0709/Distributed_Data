const Consumer = require('./Consumer');
const HandleModel = require("./Handle");

let consumer = new Consumer();
consumer.ReceiveData();

let handle = new HandleModel({
    consumer: consumer
});

