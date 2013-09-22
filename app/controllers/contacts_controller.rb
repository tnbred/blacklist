class ContactsController < ApplicationController

  def new
    @contact = Contact.new
  end

  def create
    Contact.create!(contact_params)
    if current_user
      redirect_to authenticated_root_path, status: 301
    else
      redirect_to unauthenticated_root_path, status: 301
    end
  end


  private

  def contact_params
    params.require(:contact).permit(:text)
  end

end
