import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';
import axios from '../utils/axios';
import { Plus, Edit } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, leasesRes] = await Promise.all([
        axios.get('/payments'),
        axios.get('/leases')
      ]);
      setPayments(paymentsRes.data);
      setLeases(leasesRes.data);
    } catch (error) {
      console.log('Using dummy data');
      setPayments([
        {
          _id: '1',
          tenant: { name: 'John Doe' },
          lease: { _id: 'l1', tenant: { name: 'John Doe' }, unit: { unitNumber: '101' } },
          amount: 1200,
          date: '2023-11-01',
          type: 'rent',
          status: 'paid'
        },
      ]);
      setLeases([
        { _id: 'l1', tenant: { name: 'John Doe' }, unit: { unitNumber: '101' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment) => {
    setCurrentPayment(payment);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentPayment(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentPayment) {
        const { data } = await axios.put(`/payments/${currentPayment._id}`, formData);
        // We need to refresh or manually populate to show tenant name immediately
        // For simplicity, let's re-fetch or just update with what we have
        const updatedPayment = {
          ...data,
          // Attempt to find tenant info from leases if available
          tenant: leases.find(l => l._id === formData.lease)?.tenant
        };
        setPayments(payments.map(p => p._id === currentPayment._id ? updatedPayment : p));
      } else {
        const { data } = await axios.post('/payments', formData);
        const newPayment = {
          ...data,
          tenant: leases.find(l => l._id === formData.lease)?.tenant
        };
        setPayments([...payments, newPayment]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving payment', error);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments & Invoices</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-500">Tenant</th>
              <th className="p-4 text-sm font-medium text-gray-500">Amount</th>
              <th className="p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="p-4 text-sm font-medium text-gray-500">Type</th>
              <th className="p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{payment.tenant?.name || 'Unknown'}</td>
                <td className="p-4 font-bold text-gray-800">${payment.amount}</td>
                <td className="p-4 text-gray-600">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="p-4 capitalize text-gray-600">{payment.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        payment={currentPayment}
        leases={leases}
      />
    </div>
  );
};

export default Payments;
