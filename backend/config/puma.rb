# Puma configuration for Heroku

threads_count = ENV.fetch("RAILS_MAX_THREADS", 5).to_i
threads threads_count, threads_count

port ENV.fetch("PORT", 3000)

environment ENV.fetch("RAILS_ENV", "development")

workers ENV.fetch("WEB_CONCURRENCY", 2).to_i
preload_app!

# Allow Puma to be restarted by `bin/rails restart`
plugin :tmp_restart

on_worker_boot do
  # Reconnect ActiveRecord after forking
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
