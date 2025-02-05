class CreateDeedVolunteers < ActiveRecord::Migration[8.0]
  def change
    create_table :deed_volunteers do |t|
      t.integer :user_id
      t.integer :deed_id

      t.timestamps
    end
  end
end
