class CreateContactTable < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :text
      t.timestamps
    end
  end
end
