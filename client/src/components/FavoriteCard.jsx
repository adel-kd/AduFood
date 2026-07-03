const FavoriteCard = ({ food, onRemove }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-3 flex justify-between shadow-sm">
      <div>
        <h3 className="text-gray-900 font-medium">{food.name}</h3>
        <p className="text-gray-600 text-sm">{food.description}</p>
      </div>
      <button onClick={() => onRemove(food._id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
    </div>
  );
};

export default FavoriteCard;
