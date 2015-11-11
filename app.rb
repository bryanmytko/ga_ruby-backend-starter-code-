require "sinatra"
require "sinatra/activerecord"
require "byebug"
require "httparty"
require "cgi"
require "json"
require "./lib/omdb"
require "./environments"

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

    response["Search"].each do |r|
      if Favorite.find_by(imdb_id: r["imdbID"], user_id: params[:user_id])
        r["Favorite"] = true;
      end
    end unless response["Error"]
  end

  response.to_json
end

get "/favorites.json" do
  client = Sinatra::Omdb::Client.new
  response.header["Content-Type"] = "application/json"
  response = []

  favorites = Favorite.where(user_id: params[:user_id])
  favorites.each do |favorite|
    data = client.search_by_id(favorite.imdb_id)
    data["Favorite"] = true
    response << data
  end

  response.to_json
end

post "/favorites" do
  Favorite.create(
    user_id: params[:user_id],
    imdb_id: params[:imdb_id]
  )
end

class Favorite < ActiveRecord::Base; end
