class CreateDeedCompletions < ActiveRecord::Migration[7.0]
  def change
    create_table :deed_completions do |t|
      t.references :deed, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.boolean :confirmed, default: false

      t.timestamps
    end
  end
end