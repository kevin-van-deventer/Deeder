require "test_helper"

class DeedsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)  # John Doe
    # puts "User ID: #{@user.id}"  # Check if ID is set
    @deed = deeds(:one)  # "Help build a house"
    # Manually set a fake secret key for testing
    secret_key = Rails.application.secret_key_base
    # Manually generate a fake JWT token (fake for testing purposes)
    @token = JWT.encode({ user_id: @user.id, exp: 24.hours.from_now.to_i }, secret_key, 'HS256')
    # Set the Authorization header for token-based authentication
    @headers = { "Authorization" => "Bearer #{@token}" }
    # puts "User Token: #{@token}"
  end
  

  test "should get index" do
    get deeds_url, headers: @headers
    assert_response :success
  end

  test "should create deed" do
    assert_difference('Deed.count', 1) do
      post deeds_url, params: { deed: { description: "Donate food", deed_type: "material", status: "unfulfilled", latitude: 40.7128, longitude: -74.0060, address: "789 Some St", requester_id:  @user.id } }, headers: @headers
    end
    assert_response :created
  end

  test "should not create deed without required fields" do
    assert_no_difference('Deed.count') do
      post deeds_url, params: { deed: { description: "", deed_type: "" } }, headers: @headers
    end
    assert_response :unprocessable_entity
  end

  test "should not create deed without authentication" do
    assert_no_difference('Deed.count') do
      post deeds_url, params: { deed: { description: "Donate books", deed_type: "material", status: "unfulfilled" } }
    end
    assert_response :unauthorized
  end

  test "should show deed" do
    get deed_url(@deed), headers: @headers
    assert_response :success
  end

  test "should destroy deed" do
    assert_difference('Deed.count', -1) do
      delete deed_url(@deed), headers: @headers
    end
    assert_response :no_content
  end

  test "should not volunteer for own deed" do
    own_deed = deeds(:one)
    post volunteer_deed_url(own_deed), headers: @headers
    assert_response :forbidden
  end

  test "should volunteer for deed" do
    other_deed = deeds(:two)  # Assuming you have another deed fixture
    post volunteer_deed_url(other_deed), headers: @headers
    assert_response :success
  end

  # test "should not access deed without authentication" do
  #   get deed_url(@deed)
  #   assert_response :unauthorized
  # end

  # test "should confirm completion" do
  #   post confirm_completion_deed_url(@deed), headers: @headers
  #   assert_response :success
  # end

  # test "should get volunteered deeds" do
  #   get volunteered_deeds_user_url(@user), headers: @headers
  #   assert_response :success
  # end
end
