# app/middleware/request_logger.rb
class RequestLogger
  def initialize(app)
    @app = app
  end

  def call(env)
    request = ActionDispatch::Request.new(env)

    # Якщо це CORS preflight, пропускаємо детальне логування — very common source of issues.
    if request.request_method == 'OPTIONS'
      return @app.call(env)
    end

    start_time = Time.current

    begin
      status, headers, response = @app.call(env)
    rescue => e
      # Якщо додатковий middleware/контролер впав — логнемо і повертаємо 500 адекватно.
      Rails.logger.error("[RequestLogger] upstream error: #{e.class} #{e.message}\n#{e.backtrace.first(10).join("\n")}")
      body = { error: 'Internal Server Error' }.to_json
      return [500, { 'Content-Type' => 'application/json', 'Content-Length' => body.bytesize.to_s }, [body]]
    end

    duration = ((Time.current - start_time) * 1000).round

    # Захищене локальне логування — ніяких небезпечних констант
    begin
      log_request(request, status, duration)
    rescue => e
      # Якщо щось пішло не так під час логування — логуємо помилку, але не даємо падати всьому стеку.
      Rails.logger.error("[RequestLogger] logging error: #{e.class} #{e.message}\n#{e.backtrace.first(10).join("\n")}")
      # не піднімаємо далі — вже маємо відповідь від @app
    end

    [status, headers, response]
  end

  private

  def log_request(request, status, duration)
    return if skip_logging?(request.path)

    entry = {
      timestamp: Time.current.iso8601,
      method: request.method,
      path: request.fullpath,
      status: status,
      duration: duration,
      ip: request.ip,
      user_agent: request.user_agent || 'unknown'
    }

    # Викликаємо AnalyticsService.record лише якщо сервіс визначений і має метод record
    if defined?(AnalyticsService) && AnalyticsService.respond_to?(:record)
      begin
        AnalyticsService.record(entry)
      rescue => e
        # Якщо внутрішній сервіс падає або робить небезпечні референси — не ламаємо middleware
        Rails.logger.error("[RequestLogger] AnalyticsService.record error: #{e.class} #{e.message}")
      end
    else
      Rails.logger.debug("[RequestLogger] AnalyticsService not available or doesn't respond to :record")
    end

    if duration > 1000
      Rails.logger.warn("Slow request detected: #{request.path} (#{duration}ms)")
    end

    if status >= 400
      Rails.logger.warn("HTTP error: #{status} - #{request.method} #{request.path}")
    end
  end

  def skip_logging?(path)
    path == '/api/v1/health' ||
      path.start_with?('/assets') ||
      path.start_with?('/favicon') ||
      path == '/robots.txt'
  end
end