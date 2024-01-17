const amqplib = require('amqplib');
const amqp_url = 'amqps://oyyubwpx:KcIvhkoxkHPRvyhZAJy0IXffLvsjetNN@armadillo.rmq.cloudamqp.com/oyyubwpx';
const amqp_docker = '';

const receiveQueue = async () => {
    try{
        //1.create connect
        const conn = await amqplib.connect(amqp_url);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create new queue
        const nameQueue = 'q1';
        //4. create queue 
        await channel.assertQueue(nameQueue,{
            durable:false,
        })
        //5. receive to queue
        await channel.consume(nameQueue, msg => {
            console.log('Msg', msg.content.toString())
        },{
            noAck:true
        })

        //6.close conn and channel
    }
    catch(err){
        console.log(err);
    }
}

receiveQueue()

