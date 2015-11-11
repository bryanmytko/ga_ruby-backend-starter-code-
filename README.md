## Live Demo
http://damp-basin-9700.herokuapp.com/

## Notes
- Since there was no account creation in the specification, users are tracked by a unique cookie. Favoriting will not persist with cookies turned off.
- I've implemented ActiveRecord to persist data because you can't write to files on Heroku.
- There is no "unfavorite" functionality, though there are comments about adding this feature, which seems obvious.
