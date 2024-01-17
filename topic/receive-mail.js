const amqplib = require('amqplib');
//.env
const amqp_url = 'amqps://oyyubwpx:KcIvhkoxkHPRvyhZAJy0IXffLvsjetNN@armadillo.rmq.cloudamqp.com/oyyubwpx';

const receiveMail = async () => {
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

        //4. create queue
        const {queue} = await channel.assertQueue('',{
            exclusive:true
        })

        //5. binding 

        const args = process.argv.slice(2);
        if(!args.length){
            process.exit(0);
        }

        console.log(`waiting queue ${queue}::: topic ${args}`)

        args.forEach(async (key) => {
            await channel.bindQueue(queue,nameExchange,key);
        })

        //4. receive mail
        await channel.consume(queue,msg => {
            console.log(`Routing key${msg.fields.routingKey}:::msg ${msg.content.toString()}`);
        }) 
        
    }
    catch(err){
        console.log(err);
    }
}

receiveMail()