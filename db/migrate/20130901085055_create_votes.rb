class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :points
      t.integer :user_to_id
      t.integer :user_id
      t.integer :list_id
      t.timestamps
    end
  end
end
