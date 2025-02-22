import { createConsumer } from "@rails/actioncable";

const token = localStorage.getItem("token");
// const consumer = createConsumer(`ws://localhost:3000/cable?token=${token}`);
const consumer = createConsumer(`ws://young-dusk-69972-fa429cadde5b.herokuapp.com/?token=${token}`);

export default consumer;
