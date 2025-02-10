class AddLatitudeAndLongitudeToDeeds < ActiveRecord::Migration[8.0]
  def change
    add_column :deeds, :latitude, :decimal
    add_column :deeds, :longitude, :decimal
  end
end
