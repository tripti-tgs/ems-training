const amqp = require("amqplib");

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.NAME}:${process.env.PASSWORD}@localhost/${process.env.VHOST}`
    );
    const channel = await connection.createChannel();
    const queue = process.env.QUEUE;

    // Assert queue exists
    await channel.assertQueue(queue, {
      durable: false,
    });

    return {
      channel,
      queue,
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

module.exports = { connectRabbitMQ };
