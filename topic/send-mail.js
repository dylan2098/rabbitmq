const amqplib = require('amqplib');
//.env
const amqp_url = 'amqps://oyyubwpx:KcIvhkoxkHPRvyhZAJy0IXffLvsjetNN@armadillo.rmq.cloudamqp.com/oyyubwpx';

const sendMail = async () => {
    try{
        //1.create connect 
        const conn = await amqplib.connect(amqp_url);
        //2.create channel 
        const channel = await conn.createChannel();

        //3.create exchange
        const nameExchange = 'send_email';

        await channel.assertExchange(nameExchange, 'topic', {
            durable:false,
        })

        const args = process.argv.slice(2);
        const msg = args[1] || 'Fixed';
        const topic = args[0];

        console.log(`msg::${msg}:::topic${topic}`)

        //4. publish video
        await channel.publish(nameExchange, topic, Buffer.from(msg))
        console.log(`[x] Send Oke::${msg}`);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        },2000)
    }
    catch(err){
        console.log(err);
    }
}

sendMail()