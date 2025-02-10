**Github Setup**
1) git init
2) git remote add origin https://github.com/kevin-van-deventer/Deeder.git
3) git remote -v
4) git add .
5) git commit -m "Commit Message"
6) git push origin main

**Rails Setup**
1) sudo apt update && sudo apt upgrade -y
2) sudo apt install -y curl git build-essential libsqlite3-dev
3) curl -sSL https://get.rvm.io | bash -s stable
4) source ~/.rvm/scripts/rvm
<!-- 5) rvm install ruby
6) rvm use ruby --default -->
7) gem install rails
8) curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
9) sudo apt install -y nodejs
10) npm install --global yarn
11) ruby -v / rails -v / node -v / yarn -v

**Backend**
12) rails new backend --api --database=sqlite3 --javascript=esbuild
13) cd backend
14) bundle add rack-cors
15) update backend/config/initializers/cors.rb
16) rails s
17) User model - rails generate model User first_name:string last_name:string email:string password_digest:string id_document:string and update the model file
18) rails db:migrate
19) bundle add bcrypt
20) rails active_storage:install
21) rails db:migrate
22) rails generate controller Users
23) edit app/controllers/users_controller.rb
24) Edit config/routes.rb
25) Create a BaseController (app/controllers/application_controller.rb)
26) create deeds model - rails generate model Deed description:string deed_type:string status:string requester_id:integer responder_id:integer  completed_by_id:integer lat:decimal lon:decimal
rails db:migrate
26.2) create a join table since multiple users can volunteer for one deed
26.3) rails generate model DeedVolunteer user_id:integer deed_id:integer - rails db:migrate
27) update the deeds and user model
28) generate deeds controller rails generate controller deeds
29) Edit app/controllers/deeds_controller.rb:


27) Update app/models/deed.rb:
28) rails generate controller Deeds
29) Edit app/controllers/deeds_controller.rb:
30) Edit config/routes.rb: to add deeds route
31) bundle add jwt
32) bundle install
33) config/secrets.yml add your secret key
34) test the api routes
35) 


**Frontend**
) npx create-react-app frontend
)npm install --legacy-peers-deps
) npm install --force
) npm install web-vitals
) npm install react-router-dom axios
) create new file called AppRouter.js
) setup App.js and import router
) npm install jwt-decode

