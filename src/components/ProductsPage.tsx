import { useEffect, useState } from "react";
import { BASE } from "../Api/Api";
import { toast, ToastContainer } from "react-toastify";

interface Product {
  id: number;
  name: string;
  status: string;
  price: number;
  image?: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("admin-token")?.slice(1, -1);

  // ✅ 1. GET all products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const { data } = await res.json();
      setProducts(data.data);
      console.log(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 2. GET search products
  const searchProducts = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/admin/products/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to search products");
      const { data } = await res.json();
      setProducts(data.data);
      // console.log(data.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3. POST update status
  const updateProductStatus = async (id: number, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/admin/products/updatestatus/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: status }),
      });
      if (!res.ok) throw new Error("Failed to update product status");
      const { data } = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: data.status } : p))
      );
      toast.success("Product status updated successfully");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to update product status");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. GET pending products
  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/admin/products/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch pending products");
      const { data } = await res.json();
      setProducts(data.data);
      console.log(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 5. DELETE product
  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`${BASE}/admin/products/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to delete product");
    }
  };

  // أول ما الصفحة تفتح نجيب كل المنتجات
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer theme="colored" />
      <h1 className="text-xl font-bold mb-4">Products</h1>
      <div className="flex align-items-center justify-content-center">
        {/* Search box */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded mr-2"
            onKeyDown={(e) => {
              if (e.key === "Enter")
                searchProducts((e.target as HTMLInputElement).value);
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              searchProducts(input.value);
            }}
            className="bg-green-500 text-white px-3 py-2 rounded mr-2"
          >
            Search
          </button>
        </div>
       <div className="flex items-center mb-4">
         <button
           onClick={fetchPendingProducts}
           className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
         >
           Show Pending
         </button>
         <button
           onClick={fetchAllProducts}
           className="bg-blue-500 text-white px-3 py-1 rounded"
         >
           Show All
         </button>
       </div>
      </div>

      {/* Errors */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Loading */}
      {loading && <p className="mt-2">Loading...</p>}

      {/* Products list */}
      <div className="mt-4 space-y-2">
        {products?.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">${p.price}</p>
                <p className="text-xs">Status: {p.status}</p>
              </div>
            </div>

            <div className="space-x-2">
              <select
                name="status"
                id={`status-${p.id}`}
                value={p.status}
                onChange={(e) => updateProductStatus(p.id, e.target.value)}
              >
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="pending">pending</option>
              </select>

              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
