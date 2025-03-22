class CreateDeeds < ActiveRecord::Migration[7.0]
  def change
    drop_table :deeds, if_exists: true # Ensures the table is removed before recreating

    create_table :deeds do |t|
      t.string :description
      t.string :deed_type
      t.float :latitude
      t.float :longitude
      t.string :status
      t.integer :requester_id
      t.integer :completed_by_id

      t.timestamps
    end
  end
end
