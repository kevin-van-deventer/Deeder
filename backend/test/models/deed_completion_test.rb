require "test_helper"

class DeedCompletionTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)   # Example user from fixtures
    @deed = deeds(:one)   # Example deed from fixtures
    @deed_completion = DeedCompletion.new(deed: @deed, user: @user)
  end

  test "should save valid deed completion" do
    assert @deed_completion.save, "Failed to save a valid deed completion"
  end

  test "should not save without a user" do
    @deed_completion.user = nil
    assert_not @deed_completion.valid?, "DeedCompletion is valid without a user"
    assert_includes @deed_completion.errors[:user], "must exist"
  end

  test "should not save without a deed" do
    @deed_completion.deed = nil
    assert_not @deed_completion.valid?, "DeedCompletion is valid without a deed"
    assert_includes @deed_completion.errors[:deed], "must exist"
  end

  test "should enforce uniqueness of user per deed" do
    @deed_completion.save!
    duplicate = DeedCompletion.new(deed: @deed, user: @user)
    
    assert_not duplicate.valid?, "Duplicate deed completion was allowed"
    assert_includes duplicate.errors[:user_id], "has already been taken"
  end
end
