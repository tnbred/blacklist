class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :votes
  has_and_belongs_to_many :lists

  TOTAL_POINTS_PER_WEEK=25


  def available_points_on_given_list(list)
    current_week_start =  DateTime.now.beginning_of_week.to_i
    total_voted = 0
    votes = clean_search_result(Vote.all.where(user_id: id).to_a)
    votes = clean_search_result(votes.find_all {|v| v.list_id == list.id}) if votes
    votes = clean_search_result(votes.find_all {|v| v.created_at.to_i > current_week_start}) if votes
    votes.each {|v| total_voted+=v.points} if votes
    total_left = TOTAL_POINTS_PER_WEEK-total_voted
    total_left
  end

  def points_on_given_list(list,timestamp=nil)
    total_votes = 0
    votes = clean_search_result(Vote.all.where(list_id: list.id).to_a)
    votes = clean_search_result(votes.find_all {|v| v.user_to_id == id}) if votes
    votes = clean_search_result(votes.find_all {|v| v.created_at.to_i < timestamp }) if (votes && timestamp)
    votes.each {|v| total_votes+=v.points} if votes
    total_votes
  end

  def variation_on_given_list(list)
    current_week_start =  DateTime.now.beginning_of_week.to_i
    variation_total = 0
    votes = clean_search_result(Vote.all.where(list_id: list.id).to_a)
    votes = clean_search_result(votes.find_all {|v| v.created_at.to_i > current_week_start}) if votes
    votes = clean_search_result(votes.find_all {|v| v.user_to_id == id}) if votes
    votes.each {|v| variation_total+=v.points} if votes
    variation_total
  end

  def rank_on_given_list(list)
    rank = 0
    list.ordered_list.each_with_index do |order_item, index|
        if order_item[:user_to_id] == self.id
          rank = index
        end
    end
    rank
  end

  def formatted_name
    "#{firstname.humanize} #{lastname.humanize}"
  end

  private

  def clean_search_result(array)
    array = array.flatten if array
    array = array.compact if array
    array = array.uniq if array
    array
  end

end
