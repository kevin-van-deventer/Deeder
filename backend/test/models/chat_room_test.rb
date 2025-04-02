require "test_helper"

class ChatRoomTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)  # Requester (John Doe)
    @volunteer = users(:two)  # Volunteer
    @deed = deeds(:one)  # "Help build a house"

    @deed.volunteers << @volunteer  # Assign volunteer

    @chat_room = ChatRoom.create!(deed: @deed)
  end

  ## ✅ Associations ##
  test "should belong to a deed" do
    assert_equal @deed, @chat_room.deed, "ChatRoom deed association is incorrect"
  end

  test "should have many messages" do
    assert_respond_to @chat_room, :messages, "ChatRoom does not have a messages association"
  end

  ## ✅ Participants Method ##
  test "should return correct participants" do
    participants = @chat_room.participants
    assert_includes participants, @user, "Requester is not in participants"
    assert_includes participants, @volunteer, "Volunteer is not in participants"
    assert_equal 2, participants.count, "Participants count is incorrect"
  end

  ## ✅ ChatRoom Creation ##
  test "should create a chat room" do
    new_chat_room = ChatRoom.new(deed: @deed)
    assert new_chat_room.save, "Failed to create a chat room"
  end

  test "should not create chat room without a deed" do
    chat_room = ChatRoom.new
    assert_not chat_room.valid?, "ChatRoom is valid without a deed"
    assert_includes chat_room.errors[:deed], "must exist", "No validation error for missing deed"
  end
end
