class AddAddressToDeeds < ActiveRecord::Migration[8.0]
  def change
    add_column :deeds, :address, :string
  end
end
