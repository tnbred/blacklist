class ListsController < ApplicationController

  def index
    @lists = []
    if user_signed_in?
      @lists = current_user.lists
    end
  end

  def show
    @list = List.find(params[:id])
  end

  def vote

  end

end
