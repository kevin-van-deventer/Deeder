import { createConsumer } from "@rails/actioncable"

const token = localStorage.getItem("token")
const consumer = createConsumer(
  `${process.env.REACT_APP_WS_BASE_URL}?token=${token}`
)

export default consumer
