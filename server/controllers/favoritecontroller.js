import User from '../models/User.js';

export const addFavorite = async (req, res) => {
  const userId = req.user._id;
  const foodId = req.params.foodId;

  try {
    const user = await User.findById(userId);
    if (!user.favorites.includes(foodId)) {
      user.favorites.push(foodId);
      await user.save();
    }
    res.status(200).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding favorite' });
  }
};

export const removeFavorite = async (req, res) => {
  const userId = req.user._id;
  const foodId = req.params.foodId;

  try {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(f => f.toString() !== foodId);
    await user.save();
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing favorite' });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching favorites' });
  }
};
