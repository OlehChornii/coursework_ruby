# app/helpers/application_helper.rb
module ApplicationHelper
  def format_currency(amount)
    number_to_currency(amount, unit: '₴', precision: 2, format: '%n %u')
  end
  
  def format_date(date)
    return nil unless date
    date.strftime('%d.%m.%Y')
  end
  
  def format_datetime(datetime)
    return nil unless datetime
    datetime.strftime('%d.%m.%Y %H:%M')
  end
  
  def pet_age_display(age_months)
    return 'Unknown' unless age_months
    
    years = age_months / 12
    months = age_months % 12
    
    if years > 0
      "#{years} #{'year'.pluralize(years)} #{months} #{'month'.pluralize(months)}"
    else
      "#{months} #{'month'.pluralize(months)}"
    end
  end
  
  def order_status_badge(status)
    colors = {
      'pending' => 'warning',
      'confirmed' => 'success',
      'processing' => 'info',
      'shipped' => 'primary',
      'delivered' => 'success',
      'cancelled' => 'danger',
      'refunded' => 'secondary'
    }
    
    color = colors[status] || 'secondary'
    "<span class='badge badge-#{color}'>#{status.titleize}</span>".html_safe
  end
end