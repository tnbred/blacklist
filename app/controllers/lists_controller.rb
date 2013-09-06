class ListsController < ApplicationController

  def index
    @lists = []
    if user_signed_in?
      @lists = current_user.lists
    end
  end

  def show
    @list = List.find(params[:id])
    @users = @list.users
  end

  def user_stat
    @list = List.find_by id: params[:list_id]
  end

  def global_stat
    @list = List.find_by id: params[:list_id]
  end


  def user_stat_api
    @list = List.find_by id: params[:list_id]
    from = DateTime.now.beginning_of_week if !params[:all_time]
    @votes = Vote.get_votes_from_specific_user_for_specific_list(current_user,@list,from) if @list
    @data = format_votes(@votes)
    respond_to do |format|
      format.all  { render :json => @data.to_json }
    end
  end

  def global_stat_api
    @list = List.find_by id: params[:list_id]
    from = DateTime.now.beginning_of_week if !params[:all_time]
    @votes = Vote.get_votes_for_specific_list(@list,from) if @list
    @data = format_global_votes(@votes,@list)
    respond_to do |format|
      format.all  { render :json => @data.to_json }
    end
  end

  private

  def format_votes(votes)
    formatted_votes = []
    helper= Hash.new {|h,k| h[k] = 0 }
    votes = votes.sort {|x,y| x.created_at <=> y.created_at}
    votes.each do |vote|
      user_to = User.find(vote.user_to_id)
      helper[user_to.formatted_name]+=vote.points
    end

    helper.each do |name,points|
      formatted_votes << [name,points]
    end
    formatted_votes
  end

  def format_global_votes(votes,list)
    users_array = []
    list.users.each do |user|
      user_votes = votes.find_all {|v| (v.user_to_id == user.id)}
      start_of_week = DateTime.now.beginning_of_week.to_i
      points_start_with = user.points_on_given_list(list,start_of_week)
      hash = {}
      hash[0]=points_start_with
      (1..7).each do |day_index|
        one_day = 60*60*24
        daily_votes = user_votes.find_all {|v| ((v.created_at.to_i > (start_of_week+(day_index-1)*one_day)) && (v.created_at.to_i < (start_of_week+(day_index)*one_day)) ) }
        amount = daily_votes.inject(0) {|sum, vote| sum + vote[:points]}
        hash[day_index]= amount
      end
      hash[:name] = user.formatted_name
      users_array << hash
    end
    users_array
    final_array = []
    first_array = ['Day']
    users_array.each do |user_data_hash|
      first_array << user_data_hash[:name]
    end
    final_array << first_array
    (0..7).each do |day_index|
      row = ["Day #{day_index}"]
      users_array.each do |user_data_hash|
        row << user_data_hash[day_index]
      end
      final_array << row
    end
    final_array
  end

end
