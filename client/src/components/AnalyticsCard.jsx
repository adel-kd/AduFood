const AnalyticsCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">Total Orders: {data.totalOrders}</div>
      <div className="card">Total Revenue: {data.totalRevenue} ETB</div>
      <div className="card">Top Food: {data.topFood?.name || 'N/A'}</div>
    </div>
  );
};

export default AnalyticsCards;
