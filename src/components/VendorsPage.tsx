import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin, Edit, Trash2, Plus, Users } from 'lucide-react';
import { mockVendors } from '../mockData';
import { Vendor } from '../types';

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const deleteVendor = (vendorId: string) => {
    setVendors(vendors.filter(vendor => vendor.id !== vendorId));
  };

  const updateVendorStatus = (vendorId: string, newStatus: Vendor['status']) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-2">Manage your business partners</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
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
                placeholder="Search vendors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{vendor.name}</h3>
                  <p className="text-sm text-gray-500">{vendor.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={vendor.status}
                    onChange={(e) => updateVendorStatus(vendor.id, e.target.value as Vendor['status'])}
                    className={`text-xs font-medium px-3 py-1 rounded-full border cursor-pointer ${getStatusColor(vendor.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">{vendor.email}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">{vendor.phone}</span>
                </div>
                
                <div className="flex items-start text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{vendor.address}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{vendor.productsCount}</p>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${vendor.totalSales.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Sales</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vendor.joinedDate}</p>
                    <p className="text-xs text-gray-500">Joined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new vendor.</p>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredVendors.length} of {vendors.length} vendors
      </div>
    </div>
  );
};

export default VendorsPage;