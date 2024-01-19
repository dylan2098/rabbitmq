const amqplib = require('amqplib');
const amqp_url = 'amqps://oyyubwpx:KcIvhkoxkHPRvyhZAJy0IXffLvsjetNN@armadillo.rmq.cloudamqp.com/oyyubwpx';
const amqp_docker = 'amqp://localhost:5672';

const sendQueue = async (msg) => {
    try{
        //1.create connect
        const conn = await amqplib.connect(amqp_docker);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create new queue
        const nameQueue = 'q2';
        //4. create queue 
        await channel.assertQueue(nameQueue,{
            durable:true, 
            //true khi start lại queue khong mat message
            // false: mất hàng đợi khi bị crash
        })
        //5. send to queue

        // Buffer là gì? là một vận chuyển dữ liệu bằng byte và tốc độ siêu nhanh
        await channel.sendToQueue(nameQueue,Buffer.from(msg), {
            // expiration:'10000' // => time to live (TTL) nghĩa là message trong 10s không xử lý thì sẽ bị đóng
            persistent:true, // liên tục lưu vào cache
        })

        //6.close conn and channel
    }
    catch(err){
        console.log(err);
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello'
sendQueue(msg)

