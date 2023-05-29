import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from './firebase-config';

const usersCollectionRef = collection(firestore, 'users');

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;

    const userDocRef = doc(usersCollectionRef, email);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const user = userDoc.data();
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
      
      if (!movieAlreadyLiked) {
        await updateDoc(userDocRef, {
          likedMovies: arrayUnion(data),
        });
        return res.json({ msg: "Movie successfully added to liked list." });
      } else {
        return res.json({ msg: "Movie already added to the liked list." });
      }
    } else {
      await setDoc(userDocRef, { email, likedMovies: [data] });
      return res.json({ msg: "Movie successfully added to liked list." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error adding movie to the liked list" });
  }
};

module.exports.getLikedMovies = async function(req, res) {
  try {
    const { email } = req.params;
    const userDocRef = doc(usersCollectionRef, email);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const user = userDoc.data();
      return res.json({ message: "success", movies: user.likedMovies });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error fetching movies" });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    if (!req.body.email || !req.body.movieId) {
      return res.status(400).json({ msg: "Missing required parameters." });
    }

    const { email, movieId } = req.body;
    const userDocRef = doc(usersCollectionRef, email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ msg: "User with given email not found." });
    }

    const user = userDoc.data();
    const movies = user.likedMovies;
    const movieIndex = movies.findIndex(({ id }) => id === movieId);

    if (movieIndex === -1) {
      return res.status(404).json({ msg: "Movie not found." });
    }

    movies.splice(movieIndex, 1);
    await updateDoc(userDocRef, {
      likedMovies: movies,
    });

    return res.json({ msg: "Movie successfully removed.", movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error removing movie." });
  }
};
