import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get('/payments');
      setPayments(data);
    } catch (error) {
      setPayments([
        { 
          _id: '1', 
          tenant: { name: 'John Doe' }, 
          amount: 1200, 
          date: '2023-11-01', 
          type: 'rent', 
          status: 'paid' 
        },
        { 
          _id: '2', 
          tenant: { name: 'Jane Smith' }, 
          amount: 1800, 
          date: '2023-11-05', 
          type: 'rent', 
          status: 'pending' 
        },
      ]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments & Invoices</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-500">Tenant</th>
              <th className="p-4 text-sm font-medium text-gray-500">Amount</th>
              <th className="p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="p-4 text-sm font-medium text-gray-500">Type</th>
              <th className="p-4 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{payment.tenant?.name}</td>
                <td className="p-4 font-bold text-gray-800">${payment.amount}</td>
                <td className="p-4">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="p-4 capitalize">{payment.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-700' : 
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
