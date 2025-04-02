require "test_helper"

class MessageTest < ActiveSupport::TestCase
  setup do
    @user = users(:one) # Sender (John Doe)
    @deed = deeds(:one) # "Help build a house"
    @chat_room = ChatRoom.create!(deed: @deed)
    @message = Message.new(chat_room: @chat_room, user: @user, content: "Hello, this is a test message.")
  end

  ## ✅ Associations ##
  test "should belong to a chat room" do
    assert_equal @chat_room, @message.chat_room, "Message does not belong to the correct chat room"
  end

  test "should belong to a user" do
    assert_equal @user, @message.user, "Message does not belong to the correct user"
  end

  ## ✅ Validations ##
  test "should be valid with all attributes" do
    assert @message.valid?, "Message is not valid with all attributes"
  end

  test "should not be valid without content" do
    @message.content = nil
    assert_not @message.valid?, "Message is valid without content"
    assert_includes @message.errors[:content], "can't be blank", "No error for missing content"
  end

  test "should not be valid without a user" do
    @message.user = nil
    assert_not @message.valid?, "Message is valid without a user"
    assert_includes @message.errors[:user], "must exist", "No error for missing user"
  end

  test "should not be valid without a chat room" do
    @message.chat_room = nil
    assert_not @message.valid?, "Message is valid without a chat room"
    assert_includes @message.errors[:chat_room], "must exist", "No error for missing chat room"
  end
end
