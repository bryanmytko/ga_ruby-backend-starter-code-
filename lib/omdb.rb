module Sinatra
  module Omdb
    class Client
      include HTTParty

      API_URL = "http://www.omdbapi.com/".freeze
      # should be in an env variable
      # exposed only for the sake of the demo!
      API_KEY = "48920cce".freeze

      def search_by_keyword(keyword)
        keyword = CGI.escape(keyword)
        query = API_URL + "?apikey=#{API_KEY}&s=#{keyword}&y=&plot=short&r=json"
        self.class.get query
      end

      def search_by_title(title)
        title = CGI.escape(title)
        query = API_URL + "?apikey=#{API_KEY}&t=#{title}&y=&plot=short&r=json"
        self.class.get query
      end
    end
  end
end
