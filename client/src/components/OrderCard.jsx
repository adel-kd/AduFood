const OrderCard = ({ order }) => {
  return (
    <div className="border p-3 mb-3">
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> {order.totalAmount} ETB</p>
      <ul className="pl-4 list-disc">
        {order.items.map(item => (
          <li key={item._id}>{item.name} x {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;
