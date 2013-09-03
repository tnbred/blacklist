class CreateListsUsers < ActiveRecord::Migration
  def change
    create_table :lists_users do |t|
      t.belongs_to :list
      t.belongs_to :user
    end
  end
end
