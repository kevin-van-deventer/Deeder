import { createConsumer } from "@rails/actioncable"

const token = localStorage.getItem("token")
const consumer = createConsumer(
  `${process.env.REACT_APP_WS_BASE_URL}/cable?token=${token}`
)

export default consumer
