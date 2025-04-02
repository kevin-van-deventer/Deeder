# README

User Tests
**Model Tests**
1 test "should create valid user"
2 test "should not create user without first name"
3 test "should not create user without email"
4 test "should not create user with duplicate email"
5 test "should not create user with invalid email format"
6 test "should not create user if password and confirmation don't match"
7 test "password should be securely hashed"
8 test "should authenticate user with correct password"
9 test "should not authenticate user with incorrect password"
**Controller Tests** rails test test/controllers/users_controller_test.rb
1 test "should create user"
2 test "should log in user"
3 test "should not log in with invalid credentials"
4 test "should show user details"
5 test "should update user details"

Deeds Test
**Model Tests**
1 test "should not save deed without description"
2 test "should save deed with valid attributes"
3 test "should have default status 'unfulfilled'"
4 test "should validate presence of description"
5 test "should validate inclusion of deed_type"
6 test "should check if ActionCable is enabled"
7 test "should have many deed_completions"
**Controller Tests** rails test test/controllers/deeds_controller_test.rb
1 test "should get index"
2 test "should create deed"
3 test "should not create deed without requireed fields"
4 test "should not create deed without authentication"
5 test "should show deed"
6 test "should destroy deed"
7 test "should not volunteer for own deed"
8 test "should volunteer for deed"

Chat Rooms Test
**Model Test**rails test test/models/chat_room_test.rb
1 test "should belong to a deed"
2 test "should have many messages"
3 test "should return correct participants"
4 test "should create a chat room"
5 test "should not create chat room without a deed"
**Controller Tests** test test/controllers/chat_rooms_controller_test.rb
1 test "should show chat room to requester"
2 test "should show chat room to volunteers"
3 test "should not show chat room to unauthorized user"
4 test "should create chat room for valid requester"
5 test "should create chat room for valid volunteer"
6 test "should not allow stranger to create chat room"
7 test "should not allow recipient who is not part of deed"

Message Test
**Model Test**rails test test/models/message_test.rb
1 test "should belong to a chat room"
2 test "should belong to a user"
3 test "should be valid with all attributes"
4 test "should not be valid without content"
5 test "should not be valid without a user"
6 test "should not be valid without a chat room"
**Controller Tests** test test/controllers/message_controller_test.rb
1 test "should create message in chat room"
2 test "should not create message if user is not a participant"
3 test "should not create message without content"

Deed Completions Test
**Model Test**rails test test/models/deed_completion_test.rb
1 test "should save valid deed completion"
2 test "should not save without a user"
3 test "should not save without a deed"
4 test "should enforce uniqueness of user per deed"

Deed Volunteer Test
**Model Test**rails test test/models/deed_volunteer_test.rb
1 test "should save valid deed volunteer"
2 test "should not save without a user"
3 test "should not save without a deed"
4 test "should enforce uniqueness of user per deed"

- ...
