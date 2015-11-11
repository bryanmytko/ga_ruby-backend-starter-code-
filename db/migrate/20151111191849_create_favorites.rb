class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.integer :user_id
      t.json :data
    end
  end
end
