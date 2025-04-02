require "test_helper"

class DeedVolunteerTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)   # Example user from fixtures
    @deed = deeds(:one)   # Example deed from fixtures
    @deed_volunteer = DeedVolunteer.new(deed: @deed, user: @user)
  end

  test "should save valid deed volunteer" do
    assert @deed_volunteer.save, "Failed to save a valid deed volunteer"
  end

  test "should not save without a user" do
    @deed_volunteer.user = nil
    assert_not @deed_volunteer.valid?, "DeedVolunteer is valid without a user"
    assert_includes @deed_volunteer.errors[:user], "must exist"
  end

  test "should not save without a deed" do
    @deed_volunteer.deed = nil
    assert_not @deed_volunteer.valid?, "DeedVolunteer is valid without a deed"
    assert_includes @deed_volunteer.errors[:deed], "must exist"
  end

  test "should enforce uniqueness of user per deed" do
    @deed_volunteer.save!
    duplicate = DeedVolunteer.new(deed: @deed, user: @user)
    
    assert_not duplicate.valid?, "Duplicate deed volunteer was allowed"
    assert_includes duplicate.errors[:user_id], "has already volunteered for this deed"
  end
end
