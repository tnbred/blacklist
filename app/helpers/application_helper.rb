module ApplicationHelper
  def get_title(title)
    base_title = "The Blacklist"
    res = (title.empty?) ?  title :  "#{base_title} | #{title}"
    res
  end

  def bootstrap_class_for flash_type
    case flash_type
      when :success
        "alert-success"
      when :error
        "alert-error"
      when :alert
        "alert-block"
      when :notice
        "alert-info"
      else
        flash_type.to_s
    end
  end

  def sidebar?(title)
    (title == "Home") ? false : true
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

end
