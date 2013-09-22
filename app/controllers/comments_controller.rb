class CommentsController < ApplicationController

  def index
    @list = List.find_by id: params[:list_id]
    @comment = Comment.new
    @comments = Comment.all.where(list_id: params[:list_id]).to_a
  end


  def create
    comment = Comment.new(comment_params)
    comment.user_id = current_user.id
    list = List.find_by id: params[:list_id]
    comment.list_id = list.id
    if comment.save
      redirect_to comments_path(list_id: list.id), status: 301, :flash => { :success => "Your comment was saved!" }
    else
      redirect_to comments_path(list_id: list.id), status: 301, :flash => { :success => "Comment not saved" }
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:comment)
  end
end
