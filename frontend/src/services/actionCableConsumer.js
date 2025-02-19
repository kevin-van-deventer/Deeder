import { createConsumer } from "@rails/actioncable";

const consumer = createConsumer("/cable"); // Uses relative path

export default consumer;