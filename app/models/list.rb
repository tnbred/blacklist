class List < ActiveRecord::Base
  has_and_belongs_to_many  :users


  def ordered_list
    table = []
    users.each do |user|
      hash = {}
      hash[:points] = user.points_on_given_list(self)
      hash[:variation] = user.variation_on_given_list(self)
      hash[:firstname] = user.firstname
      hash[:lastname] = user.lastname
      hash[:user_to_id] = user.id
      table << hash
    end
    table.sort { |x,y| y[:points] <=> x[:points] }
  end
end
