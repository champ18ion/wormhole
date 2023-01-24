const User = require('../models/user')


module.exports.addToLikedMovies = async (req, res) => {
    try {
      const { email, data } = req.body;
      
      const user = await await User.findOne({ email });
      if (user) {
        const { likedMovies } = user;
        const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
        if (!movieAlreadyLiked) {
          await User.findByIdAndUpdate(
            user._id,
            {
              likedMovies: [...user.likedMovies, data],
            },
            { new: true }
          );
        } else return res.json({ msg: "Movie already added to the liked list." });
      } else await User.create({ email, likedMovies: [data] });
      return res.json({ msg: "Movie successfully added to liked list." });
    } catch (error) {
      return res.json({ msg: "Error adding movie to the liked list" });
    }
  };
  
  module.exports.getLikedMovies = async function(req,res){
    try {
      const {email} = req.params;
      const user = await await User.findOne({ email });
      if(user){
        res.json({message:"success", movies:user.likedMovies})
      }else{
        return res.json({message:"user not found"})
      }
      
    } catch (error) {
      return res.json({ msg: "Error fetching movies" });
    }
  };

  module.exports.removeFromLikedMovies = async (req, res) => {
    try {
      // Check if required parameters are present in the request body
      if (!req.body.email || !req.body.movieId) {
        return res.status(400).json({ msg: "Missing required parameters." });
      }
      const { email, movieId } = req.body;
      const user = await User.findOne({ email });
      // Check if a user is found
      if (!user) {
        return res.status(404).json({ msg: "User with given email not found." });
      }
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      // Check if movie is found in likedMovies array
      if (movieIndex === -1) {
        return res.status(404).json({ msg: "Movie not found." });
      }
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies:movies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie successfully removed.", movies });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Error removing movie." });
    }
  };
