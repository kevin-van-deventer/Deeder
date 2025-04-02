require "test_helper"
require 'rails/test_help'
include ActionDispatch::TestProcess

class UserTest < ActiveSupport::TestCase
  # Test user creation
  test "should create valid user" do
    user = User.new(
      first_name: "John",
      last_name: "Doe",
      email: "john.deed@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
     assert user.save, "Failed to save valid user: #{user.errors.full_messages.join(", ")}"
  end

  # Test invalid user without first name
  test "should not create user without first name" do
    user = User.new(
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    assert_not user.save, "Saved the user without a first name"
  end

  # Test invalid user without email
  test "should not create user without email" do
    user = User.new(
      first_name: "John",
      last_name: "Doe",
      password: "password123",
      password_confirmation: "password123"
    )
    assert_not user.save, "Saved the user without an email"
  end

  # Test email uniqueness
  test "should not create user with duplicate email" do
    user1 = users(:one)
    user2 = User.new(
      first_name: "Jane",
      last_name: "Smith",
      email: user1.email,
      password: "password123",
      password_confirmation: "password123"
    )
    assert_not user2.save, "Saved the user with a duplicate email"
  end

  # Test email format validation
  test "should not create user with invalid email format" do
    user = User.new(
      first_name: "John",
      last_name: "Doe",
      email: "invalid-email",
      password: "password123",
      password_confirmation: "password123"
    )
    assert_not user.save, "Saved the user with an invalid email format"
  end

  test "should not create user if password and confirmation don't match" do
    user = User.new(
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      password_confirmation: "mismatch123"
    )
    assert_not user.save, "Saved the user with mismatched passwords"
  end

  test "password should be securely hashed" do
    user = User.create(
      first_name: "John",
      last_name: "Doe",
      email: "john.peep@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    assert_not_equal "password123", user.reload.password_digest, "Password is not hashed"
  end

  test "should authenticate user with correct password" do
    user = users(:one)
    assert user.authenticate('password123'), "Failed to authenticate with correct password"
  end
  
  test "should not authenticate user with incorrect password" do
    user = users(:one)
    assert_not user.authenticate('wrongpassword'), "Authenticated with incorrect password"
  end

  # Test valid user with an id_document
  # test "should attach an id document" do
  #   user = users(:one)
  #   user.id_document = fixture_file_upload('files/test_document.pdf', 'application/pdf')
  #   assert user.save, "Failed to save user with an attached id document"
  # end
end
