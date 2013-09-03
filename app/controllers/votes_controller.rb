class VotesController < ApplicationController
  def create
    begin
      vote = Vote.new(vote_params)
      vote.user_id = current_user.id
      if vote.save
        hash = {}
        hash[:points] = vote.points
        hash[:message] = "Vote saved! (+#{vote.points})"
        hash[:tr_id] = params[:tr_id]
        hash[:points_left] = current_user.available_points_on_given_list List.find(vote.list_id)
        render json: hash
      else
        render_error vote.errors.full_messages.first
      end
    rescue
      render_error "Something went wrong."
    end
  end

  private

  def vote_params
    params.require(:vote).permit(:points,:list_id,:user_to_id)
  end

  def render_error(message)
    hash = {}
    hash[:message] = message
    hash[:tr_id] = params[:tr_id]
    render json: hash, status: 401
  end
end
