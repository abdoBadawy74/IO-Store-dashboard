import React, { useState, useEffect } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { ApiOrderDetails, Order } from "../types";
import { BASE } from "../Api/Api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<ApiOrderDetails | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        id: o.id, // استخدم order_number للعرض
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

  // 🟢 تاريخ الفلترة
  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    // send request to server
    axios
      .post(
        `${BASE}/admin/orders/daterange`,
        { start_date: startDate, end_date: endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data.data.data;
        const mappedOrders: Order[] = data.map((o: Order) => ({
          id: o.order_number,
          status: o.status,
          total: o.total,
          date: o.created_at,
          customerName: o.customer?.name || "Unknown",
          shippingAddress: o.vendor?.name || "N/A",
        }));
        setOrders(mappedOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
    return;
  };

  useEffect(() => {
    if (startDate && endDate) {
      handleDateFilter();
    }
  }, [startDate, endDate]);

  // عرض تفاصيل الاوردر
  const fetchOrderDetails = async (orderId: number) => {
    try {
      const res = await fetch(
        `https://iostore.fivesolutions.net/api/admin/orders/show/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch details: ${res.status}`);
      }

      const response = await res.json();
      setSelectedOrder(response.data);
      console.log(response.data);
      setIsModalOpen(true); // نفتح المودال بعد ما البيانات تيجي
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      console.error("Error fetching order details:", errorMessage);
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-[50%]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="sm:w-74 flex gap-2">
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              onChange={(e) => setEndDate(e.target.value)}
            />
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
                          fetchOrderDetails(parseInt(order.id));
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                Order #{selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* بيانات العميل */}
            <div className="mb-4">
              <h3 className="font-medium">Customer</h3>
              <p>{selectedOrder.customer?.name}</p>
              <p>{selectedOrder.customer?.email || "No email"}</p>
            </div>

            {/* بيانات الأوردر */}
            <div className="mb-4">
              <h3 className="font-medium">Order Info</h3>
              <p>Status: {selectedOrder.status}</p>
              <p>Total: ${selectedOrder.total}</p>
              <p>Date: {selectedOrder.created_at}</p>
              <p>Vendor: {selectedOrder.vendor?.name}</p>
            </div>

            {/* المنتجات */}
            <div>
              <h3 className="font-medium mb-2">Items</h3>
              {selectedOrder?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border rounded-lg p-3 mb-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>${item.price}</p>
                    <p className="text-xs text-gray-400">
                      Comm: ${item.product_commission}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* كود الخصم */}
            {selectedOrder.promo_code && (
              <div className="mt-4">
                <h3 className="font-medium">Promo Code</h3>
                <p>{selectedOrder.promo_code}</p>
              </div>
            )}
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
