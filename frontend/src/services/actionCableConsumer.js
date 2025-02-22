import { createConsumer } from "@rails/actioncable";

const token = localStorage.getItem("token");
// const consumer = createConsumer(`ws://localhost:3000/cable?token=${token}`);
const consumer = createConsumer(`wss://young-dusk-69972-fa429cadde5b.herokuapp.com/cable?token=${token}`);

export default consumer;
