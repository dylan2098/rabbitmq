const amqplib = require('amqplib');
//.env
const amqp_url = 'amqps://oyyubwpx:KcIvhkoxkHPRvyhZAJy0IXffLvsjetNN@armadillo.rmq.cloudamqp.com/oyyubwpx';

const receiveVideo = async ({msg}) => {
    try{
        //1.create connect 
        const conn = await amqplib.connect(amqp_url);
        //2.create channel 
        const channel = await conn.createChannel();

        //3.create exchange
        const nameExchange = 'video';

        await channel.assertExchange(nameExchange, 'fanout', {
            durable:false,
        })

        //4. receive video
        const {queue} = await channel.assertQueue('');

        console.log(`nameQueue:::${queue}`)

        //5.binding
        await channel.bindQueue(queue,nameExchange,'');

        await channel.consume(queue,msg => {
            console.log(`msg::`,msg.content.toString())
        }, {
            noAck:false,
        })

        setTimeout(() => {
            conn.close();
            process.exit(0);
        },2000)
    }
    catch(err){
        console.log(err);
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello'

receiveVideo({msg})