class DeedsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "deeds_channel"
  end

  def unsubscribed
    Rails.logger.info "Unsubscribed from deeds_channel"
  end
end
