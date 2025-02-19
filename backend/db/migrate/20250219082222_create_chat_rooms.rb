class CreateChatRooms < ActiveRecord::Migration[8.0]
  def change
    create_table :chat_rooms do |t|
      t.references :deed, null: false, foreign_key: true

      t.timestamps
    end
  end
end
