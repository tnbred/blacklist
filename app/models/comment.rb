class Comment < ActiveRecord::Base
  belongs_to :list



  def user
    User.find_by id: user_id
  end

  def list
    List.find_by id: list_id
  end

end
