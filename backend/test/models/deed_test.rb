require "test_helper"

class DeedTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)  # Assuming `users(:one)` refers to John Doe
    @deed = deeds(:one)  # Assuming `deeds(:one)` refers to "Help build a house"
  end

  test "should not save deed without description" do
    deed = Deed.new(deed_type: "one-time", status: "unfulfilled", latitude: 40.7128, longitude: -74.0060, address: "123 Main St", requester: @user)
    assert_not deed.save, "Saved the deed without a description"
  end

  test "should save deed with valid attributes" do
    deed = Deed.new(description: "Help build", deed_type: "one-time", status: "unfulfilled", latitude: 40.7128, longitude: -74.0060, address: "123 Main St", requester: @user)
    assert deed.save, "Failed to save the deed with valid attributes"
  end

  test "should have default status 'unfulfilled'" do
    deed = Deed.new(description: "Help build a house", deed_type: "one-time", latitude: 40.7128, longitude: -74.0060, address: "123 Main St", requester: @user)
    deed.valid?  # Ensures before_validation callback runs
    assert_equal "unfulfilled", deed.status, "Status was not set to 'unfulfilled' by default"
  end

  test "should validate presence of description" do
    deed = Deed.new(deed_type: "one-time", status: "unfulfilled", latitude: 40.7128, longitude: -74.0060, address: "123 Main St", requester: @user)
    assert_not deed.valid?, "Deed is valid without description"
    assert_includes deed.errors[:description], "can't be blank", "No error for missing description"
  end

  test "should validate inclusion of deed_type" do
    deed = Deed.new(description: "Help build a house", deed_type: "invalid_type", status: "unfulfilled", latitude: 40.7128, longitude: -74.0060, address: "123 Main St", requester: @user)
    assert_not deed.valid?, "Deed is valid with an invalid deed_type"
    assert_includes deed.errors[:deed_type], "is not included in the list", "No error for invalid deed_type"
  end

  test "should check if ActionCable is enabled" do
    assert_not_nil ActionCable.server, "ActionCable server is not running in the test environment"
  end

  test "should have many deed_completions" do
    assert_respond_to @deed, :deed_completions, "Deed does not respond to deed_completions"
  end
end
