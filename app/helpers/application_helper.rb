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
    (title == "Home" || title == "Blacklists" || title == "Edit profile") ? false : true
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

  def progress_bar_status(number)
    case number
      when 0..33
        response = "progress-bar-success"
      when 34..65
        response = "progress-bar-warning"
      when 66..100
        response = "progress-bar-danger"
      else
        response = "progress-bar-info"
    end
    response
  end

end
