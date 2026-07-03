const AnalyticsCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Total Orders</p>
        <p className="text-2xl font-bold text-gray-900">{data.totalOrders}</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Total Revenue</p>
        <p className="text-2xl font-bold text-[#dd804f]">{data.totalRevenue} ETB</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Top Food</p>
        <p className="text-lg font-semibold text-gray-900">{data.topFood?.name || 'N/A'}</p>
      </div>
    </div>
  );
};

export default AnalyticsCards;
