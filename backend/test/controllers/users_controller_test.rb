require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  # Test user creation (sign up)
  test "should create user" do
    post users_url, params: { user: { first_name: "John", last_name: "Doe", email: "john.book@example.com", password: "password123", password_confirmation: "password123" } }
    assert_response :created
    assert_includes @response.body, 'user'
  end

  # Test user login
  test "should log in user" do
    user = users(:one)
    post login_url, params: { email: user.email, password: 'password123' }
    assert_response :ok
    assert_includes @response.body, 'token'
  end

  # Test failed login with wrong credentials
  test "should not log in with invalid credentials" do
    user = users(:one)
    post login_url, params: { email: user.email, password: 'wrongpassword' }
    assert_response :unauthorized
    assert_includes @response.body, 'Invalid email or password'
  end

  # Test user show
  test "should show user details" do
    user = users(:one)
    get user_url(user.id)
    assert_response :success
    assert_includes @response.body, user.first_name
  end

  # Test user update
  test "should update user details" do
    user = users(:one)
    patch user_url(user.id), params: { user: { first_name: "Updated", last_name: user.last_name, email: user.email, password: "password123", password_confirmation: "password123" } }
    assert_response :success
    assert_includes @response.body, 'User updated successfully'
  end
end
