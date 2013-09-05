class Vote < ActiveRecord::Base
  belongs_to :user
  validates :points, presence: true, length: { minimum: 1 }, numericality: { only_integer: true }
  validate :has_enough_points?



  def self.get_votes_from_specific_user_for_specific_list(user,list,from=nil,to=nil)
    votes = Vote.all.where(user_id: user.id, list_id: list.id).to_a
    votes = get_votes_in_between(votes,from,to)
    votes
  end


  def has_enough_points?
    list = List.find(list_id)
    points_left = user.available_points_on_given_list list
    if points > points_left
      errors.add(:base,"Sorry only #{points_left} points left.")
    end
  end


  private

  def self.get_votes_in_between(votes,from,to)
    if (from != nil && to != nil)
      votes.find_all {|v| (v.created_at > from && v.created_at < to)}
    elsif (from!=nil)
      votes.find_all {|v| (v.created_at > from)}
    elsif (to!=nil)
      votes.find_all {|v| (v.created_at < to)}
    else
      votes
    end

  end

end
