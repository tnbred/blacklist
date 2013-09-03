class Vote < ActiveRecord::Base
  belongs_to :user
  validates :points, presence: true, length: { minimum: 1 }, numericality: { only_integer: true }
  validate :has_enough_points?


  def has_enough_points?
    list = List.find(list_id)
    points_left = user.available_points_on_given_list list
    if points > points_left
      errors.add(:base,"Sorry only #{points_left} points left.")
    end
  end
end
