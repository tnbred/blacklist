class CreateCommentTable < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.belongs_to :list
      t.belongs_to :user
      t.string :comment
      t.timestamps
    end
  end
end
