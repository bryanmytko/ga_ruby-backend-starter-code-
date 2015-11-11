require "sinatra"
require "byebug"
require "httparty"
require "cgi"
require "json"
require "./lib/omdb"

get "/" do
  File.read(File.join("views", "index.html"))
end

get "/search.json" do
  content_type :json
  client = Sinatra::Omdb::Client.new

  if title = params[:title]
    response = client.search_by_title(title)
  elsif keyword = params[:keyword]
    response = client.search_by_keyword(keyword)
  end

  response.to_json
end

get "favorites" do
  response.header["Content-Type"] = "application/json"
  File.read("data.json")
end

patch "/favorites" do
  file = JSON.parse(File.read("data.json"))
  return "Invalid Request" unless params[:name] && params[:oid]
  movie = { name: params[:name], oid: params[:oid] }
  file << movie
  File.write("data.json",JSON.pretty_generate(file))
  movie.to_json
end
