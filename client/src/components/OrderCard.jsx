const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <p className="text-gray-900"><strong>Status:</strong> {order.status}</p>
      <p className="text-gray-900"><strong>Total:</strong> {order.totalAmount} ETB</p>
      <ul className="pl-4 list-disc text-gray-700">
        {order.items.map(item => (
          <li key={item._id}>{item.name} x {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;
