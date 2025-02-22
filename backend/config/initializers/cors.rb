Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://deeder.vercel.app"

    resource "*",
      headers: :any,
      expose: ["Authorization"],
      methods: [:get, :post, :put, :patch, :delete, :options, :head :show],
      credentials: false
    end
end
