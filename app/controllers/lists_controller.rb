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

end
