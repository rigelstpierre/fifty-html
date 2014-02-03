# Compile stylesheet (compass watch)
if File.exists?("./config.rb")
  # Compile on start.
  puts `compass compile --time --quiet`
  # https://github.com/guard/guard-compass
  guard :compass do
    watch(%r{(.*)\.s[ac]ss$})
  end
end

# Minify CSS
guard 'process', :name => 'Minify CSS', :command => 'juicer merge assets/css/style.css --force -c none' do
  watch %r{assets/css/style\.css}
end

# Minify JS
guard 'process', :name => 'Minify application javascript', :command => 'juicer merge assets/js/app.js --force -s' do
  watch %r{assets/js/app\.js}
end


# Livereload
guard :livereload do
  watch(%r{.+\.(css|js|html?)$})
end