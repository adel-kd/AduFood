const FavoriteCard = ({ food, onRemove }) => {
  return (
    <div className="border p-3 mb-3 flex justify-between">
      <div>
        <h3>{food.name}</h3>
        <p>{food.description}</p>
      </div>
      <button onClick={() => onRemove(food._id)} className="text-red-600">Remove</button>
    </div>
  );
};

export default FavoriteCard;
