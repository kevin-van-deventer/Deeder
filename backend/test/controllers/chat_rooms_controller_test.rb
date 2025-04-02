require "test_helper"

class ChatRoomsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)  # John Doe (requester)
    @volunteer = users(:two)  # A volunteer
    @stranger = users(:three)  # Someone unrelated to the deed

    @deed = deeds(:one)  # "Help build a house"
    @deed.volunteers << @volunteer  # Add a volunteer to the deed

    @chat_room = ChatRoom.create!(deed: @deed)

    # Generate a valid JWT token for authentication
    secret_key = Rails.application.secret_key_base
    @user_token = JWT.encode({ user_id: @user.id, exp: 24.hours.from_now.to_i }, secret_key, 'HS256')
    @volunteer_token = JWT.encode({ user_id: @volunteer.id, exp: 24.hours.from_now.to_i }, secret_key, 'HS256')
    @stranger_token = JWT.encode({ user_id: @stranger.id, exp: 24.hours.from_now.to_i }, secret_key, 'HS256')

    @headers_user = { "Authorization" => "Bearer #{@user_token}" }
    @headers_volunteer = { "Authorization" => "Bearer #{@volunteer_token}" }
    @headers_stranger = { "Authorization" => "Bearer #{@stranger_token}" }
  end

  ## ✅ Show Chat Room Tests ##
  test "should show chat room to requester" do
    get chat_room_url(@chat_room), headers: @headers_user
    assert_response :success
  end

  test "should show chat room to volunteers" do
    get chat_room_url(@chat_room), headers: @headers_volunteer
    assert_response :success
  end

  test "should not show chat room to unauthorized user" do
    get chat_room_url(@chat_room), headers: @headers_stranger
    assert_response :forbidden
    assert_match /Unauthorized/, @response.body
  end

  ## ✅ Create Chat Room Tests ##
  test "should create chat room for valid requester" do
    assert_difference('ChatRoom.count', 0) do  # Already exists, should not create new
      post chat_rooms_url, params: { deed_id: @deed.id, recipient_id: @volunteer.id }, headers: @headers_user
    end
    assert_response :success
  end

  test "should create chat room for valid volunteer" do
    assert_difference('ChatRoom.count', 0) do
      post chat_rooms_url, params: { deed_id: @deed.id, recipient_id: @user.id }, headers: @headers_volunteer
    end
    assert_response :success
  end

  test "should not allow stranger to create chat room" do
    post chat_rooms_url, params: { deed_id: @deed.id, recipient_id: @user.id }, headers: @headers_stranger
    assert_response :forbidden
    assert_match /Unauthorized/, @response.body
  end

  test "should not allow recipient who is not part of deed" do
    outsider = users(:four)  # Someone not part of the deed
    post chat_rooms_url, params: { deed_id: @deed.id, recipient_id: outsider.id }, headers: @headers_user
    assert_response :forbidden
    assert_match /Recipient is not part of this deed/, @response.body
  end
end
