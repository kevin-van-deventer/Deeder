require "test_helper"

class MessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one) # John Doe
    @volunteer = users(:two) # Another participant
    @deed = deeds(:one) # "Help build a house"
    @chat_room = ChatRoom.create!(deed: @deed)

    @deed.volunteers << @volunteer # Assign volunteer

    secret_key = Rails.application.secret_key_base
    @token = JWT.encode({ user_id: @user.id, exp: 24.hours.from_now.to_i }, secret_key, 'HS256')
    @headers = { "Authorization" => "Bearer #{@token}" }
  end

  ## ✅ Create Message ##
  test "should create message in chat room" do
    assert_difference('Message.count', 1) do
      post chat_room_messages_url(@chat_room), params: { content: "Test message" }, headers: @headers
    end
    assert_response :created
  end

  test "should not create message if user is not a participant" do
    other_user = users(:three) # A user who is not part of the deed
    other_token = JWT.encode({ user_id: other_user.id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base, 'HS256')
    other_headers = { "Authorization" => "Bearer #{other_token}" }

    assert_no_difference('Message.count') do
      post chat_room_messages_url(@chat_room), params: { content: "Unauthorized message" }, headers: other_headers
    end
    assert_response :forbidden
  end

  test "should not create message without content" do
    assert_no_difference('Message.count') do
      post chat_room_messages_url(@chat_room), params: { content: "" }, headers: @headers
    end
    assert_response :unprocessable_entity
  end
end
