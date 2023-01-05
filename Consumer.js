const EventEmitter = require("events").EventEmitter;
const { Kafka } = require("kafkajs");

const clientId = "my-app";
const topic = "crawler-fb-group-cmt";
const brokers = [
    "10.5.38.129:9092", "10.5.38.136:9092", 
    "10.5.38.80:9092",  "10.5.37.137:9092",
    "10.5.38.126:9092", "10.5.37.161:9092", 
    "10.5.38.245:9092", "10.5.38.212:9092",
    "10.5.37.136:9092", "10.5.36.202:9092"
];

const kafka = new Kafka({ clientId, brokers });
const consumer = kafka.consumer({ groupId: "myapp1" });

class Consumer extends EventEmitter {
    constructor() {
        super();
    }

    async ReceiveData() {
        try {
            await consumer.connect();
            await consumer.subscribe({ topic });
            await consumer.run({
                eachMessage: ({ message }) => {
                    this.emit("ReceiveData", +message.value);
                }
            });
        } catch(e) {
            console.log(e);
        }
    }
}

module.exports = Consumer;