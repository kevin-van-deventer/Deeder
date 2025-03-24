Redis.current = Redis.new(
  url: ENV['REDIS_URL'],
  reconnect_attempts: 3,
#   reconnect_delay: 1.5,
  ssl: false
)