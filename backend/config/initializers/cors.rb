Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://deeder.vercel.app"

    resource "*",
      headers: :any,
      expose: ['Authorization'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 86400
    end
end
