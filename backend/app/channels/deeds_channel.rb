class DeedsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "deeds_channel"
  end

  def unsubscribed
    # stop_all_streams
  end
end
