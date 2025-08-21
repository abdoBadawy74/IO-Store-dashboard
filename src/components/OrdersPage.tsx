import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Plus } from "lucide-react";
import { Order } from "../types";
import { BASE } from "../Api/Api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // remove double quotes
  const token = localStorage.getItem("admin-token")?.slice(1, -1);
  // console.log(token);
  // 🟢 جلب البيانات من السيرفر
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data.data);

      const data = response.data.data.data;

      // 🟢 تحويل البيانات لشكل مناسب للـ UI
      const mappedOrders: Order[] = data.map((o: Order) => ({
        id: o.order_number, // استخدم order_number للعرض
        status: o.status,
        total: o.total,
        date: o.created_at,
        customerName: o.customer?.name || "Unknown",
        shippingAddress: o.vendor?.name || "N/A",
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🟢 فلترة النتائج
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 🟢 ألوان الـ status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 🟢 تحديث حالة الأوردر

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await axios.post(
        `${BASE}/admin/orders/updatestatus/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer theme="colored" />
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by customer name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, i) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value as Order["status"]
                        )
                      }
                      className={`text-xs font-medium px-3 py-1 rounded-full border cursor-pointer ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.date.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Name:</span>{" "}
                      {selectedOrder.customerName}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Order Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Date:</span>{" "}
                      {selectedOrder.date}
                    </p>
                    <p>
                      <span className="text-gray-500">Total:</span> $
                      {selectedOrder.total}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
};

export default OrdersPage;
