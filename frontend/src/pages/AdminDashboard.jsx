import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/orderApi';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PREPARING', 'COMPLETED'];
const ALL_STATUSES = [...STATUS_FLOW, 'CANCELLED'];

const STATUS_STYLES = {
  PENDING:   'bg-amber-100 text-amber-700 border border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border border-blue-200',
  PREPARING: 'bg-purple-100 text-purple-700 border border-purple-200',
  COMPLETED: 'bg-green-100 text-green-700 border border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
};

const STATUS_ICONS = {
  PENDING:   '⏳',
  CONFIRMED: '✅',
  PREPARING: '👨‍🍳',
  COMPLETED: '🎉',
  CANCELLED: '❌',
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [expandedId, setExpandedId]     = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  const [toast, setToast]               = useState(null);  // { type, text }
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch]             = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllOrders();
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data.sort((a, b) => b.id - a.id)); // newest first
    } catch {
      setError('Failed to load orders. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      showToast('success', `Order #${orderId} status → ${newStatus}`);
    } catch {
      showToast('error', `Failed to update Order #${orderId}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Delete Order #${orderId}? This cannot be undone.`)) return;
    try {
      setDeletingId(orderId);
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      showToast('success', `Order #${orderId} deleted.`);
    } catch {
      showToast('error', `Failed to delete Order #${orderId}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  // Filtered + searched orders
  const visibleOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchSearch =
      !search ||
      String(o.id).includes(search) ||
      (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.phoneNumber  || '').includes(search);
    return matchStatus && matchSearch;
  });

  // Stats
  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'PENDING').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── TOP NAV ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☕</span>
            <div>
              <p className="font-extrabold text-amber-900 leading-tight">BrewDesk</p>
              <p className="text-xs text-gray-400 font-medium">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user?.firstName?.[0]?.toUpperCase()}
              </span>
              {user?.firstName}
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-bounce-in ${
          toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders',   value: stats.total,     color: 'from-amber-500 to-amber-600',   icon: '📋' },
            { label: 'Pending',        value: stats.pending,   color: 'from-yellow-400 to-yellow-500', icon: '⏳' },
            { label: 'In Kitchen',     value: stats.preparing, color: 'from-purple-500 to-purple-600', icon: '👨‍🍳' },
            { label: 'Completed',      value: stats.completed, color: 'from-green-500 to-green-600',   icon: '✅' },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-5 shadow-md`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              id="admin-search"
              type="text"
              placeholder="Search by order ID or customer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2">
            {['ALL', ...ALL_STATUSES].map(s => (
              <button
                key={s}
                id={`filter-${s.toLowerCase()}`}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                  filterStatus === s
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                {s === 'ALL' ? `All (${orders.length})` : `${STATUS_ICONS[s]} ${s}`}
              </button>
            ))}
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="ml-auto text-xs font-semibold border border-amber-200 text-amber-600 px-4 py-2 rounded-xl hover:bg-amber-50 transition disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex flex-col items-center py-24 text-gray-400 gap-3">
            <span className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm">Loading orders…</p>
          </div>
        )}

        {/* ── ORDERS TABLE ── */}
        {!loading && !error && (
          <>
            {visibleOrders.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <div className="text-7xl mb-4">🔍</div>
                <p className="text-lg font-semibold">No orders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleOrders.map(order => {
                  const isExpanded = expandedId === order.id;
                  const isUpdating = updatingId === order.id;
                  const isDeleting = deletingId === order.id;

                  return (
                    <div
                      key={order.id}
                      id={`order-row-${order.id}`}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all"
                    >
                      {/* ── ROW ── */}
                      <div className="p-4 flex flex-wrap items-center gap-3">

                        {/* Order info */}
                        <div className="flex-1 min-w-[140px]">
                          <p className="font-bold text-gray-800 text-sm">
                            Order <span className="text-amber-600">#{order.id}</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : 'N/A'}
                          </p>
                        </div>

                        {/* Customer */}
                        <div className="min-w-[120px]">
                          <p className="text-xs text-gray-400">Customer</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {order.customerName || `User #${order.userId}`}
                          </p>
                        </div>

                        {/* Total */}
                        <div className="min-w-[80px]">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="text-sm font-extrabold text-amber-800">
                            ₹{parseFloat(order.totalAmount ?? order.total ?? 0).toFixed(2)}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_ICONS[order.status]} {order.status}
                        </span>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-1">
                          {isUpdating ? (
                            <span className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                          ) : (
                            <select
                              id={`status-select-${order.id}`}
                              value={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-xl px-2 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer font-semibold text-gray-700"
                            >
                              {ALL_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            id={`expand-${order.id}`}
                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                            className="text-xs text-amber-600 font-semibold border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-50 transition"
                          >
                            {isExpanded ? '▲ Hide' : '▼ Details'}
                          </button>
                          <button
                            id={`delete-${order.id}`}
                            onClick={() => handleDelete(order.id)}
                            disabled={isDeleting}
                            className="text-xs text-red-500 font-semibold border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                          >
                            {isDeleting ? '…' : '🗑 Delete'}
                          </button>
                        </div>
                      </div>

                      {/* ── EXPANDED DETAILS ── */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-0 border-t border-dashed border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">

                            {/* Items */}
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Order Items</p>
                              {order.menuItems && order.menuItems.length > 0 ? (
                                <div className="space-y-2">
                                  {order.menuItems.map((mi, i) => (
                                    <div key={i} className="flex justify-between text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-xl">
                                      <span>{mi.menuItemName || `Item #${mi.menuItemId}`} × {mi.quantity}</span>
                                      <span className="font-semibold">₹{mi.subtotal ?? (mi.price * mi.quantity) ?? '—'}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-400 italic">No item details available</p>
                              )}
                            </div>

                            {/* Meta */}
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Order Info</p>
                              <div className="space-y-2 text-sm text-gray-700">
                                {order.paymentMethod && (
                                  <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-xl">
                                    <span className="text-gray-400">Payment</span>
                                    <span className="font-semibold">{order.paymentMethod}</span>
                                  </div>
                                )}
                                {order.tableNumber && (
                                  <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-xl">
                                    <span className="text-gray-400">Table</span>
                                    <span className="font-semibold">#{order.tableNumber}</span>
                                  </div>
                                )}
                                {order.phoneNumber && (
                                  <div className="flex justify-between bg-gray-50 px-3 py-2 rounded-xl">
                                    <span className="text-gray-400">Phone</span>
                                    <span className="font-semibold">{order.phoneNumber}</span>
                                  </div>
                                )}
                                <div className="flex justify-between bg-amber-50 px-3 py-2 rounded-xl">
                                  <span className="text-gray-500">Total Amount</span>
                                  <span className="font-extrabold text-amber-800">
                                    ₹{parseFloat(order.totalAmount ?? order.total ?? 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status pipeline */}
                          <div className="mt-5">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Status Pipeline</p>
                            <div className="flex items-center gap-1 flex-wrap">
                              {STATUS_FLOW.map((s, i) => {
                                const currentIdx = STATUS_FLOW.indexOf(order.status);
                                const isDone   = i < currentIdx;
                                const isActive = s === order.status;
                                return (
                                  <React.Fragment key={s}>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                      isActive ? STATUS_STYLES[s]
                                      : isDone  ? 'bg-gray-100 text-gray-400 border-gray-200'
                                      : 'bg-white text-gray-300 border-gray-100'
                                    }`}>
                                      {STATUS_ICONS[s]} {s}
                                    </div>
                                    {i < STATUS_FLOW.length - 1 && (
                                      <span className={`text-sm ${isDone ? 'text-gray-400' : 'text-gray-200'}`}>→</span>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-6">
              Showing {visibleOrders.length} of {orders.length} orders
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
