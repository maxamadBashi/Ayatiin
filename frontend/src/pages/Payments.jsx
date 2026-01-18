import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';
import axios from '../utils/axios';
import { Plus, Edit, Printer, RefreshCw, Download } from 'lucide-react';
import ReceiptPrint from '../components/ReceiptPrint';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [selectedPaymentForPrint, setSelectedPaymentForPrint] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, leasesRes, settingsRes] = await Promise.all([
        axios.get('/payments'),
        axios.get('/leases'),
        axios.get('/settings')
      ]);
      setPayments(paymentsRes.data);
      setLeases(leasesRes.data);
      setSettings(settingsRes.data);
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
        await axios.put(`/payments/${currentPayment._id}`, formData);
        await fetchData(); // Refresh to get populated links
      } else {
        await axios.post('/payments', formData);
        await fetchData(); // Refresh to get populated links
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
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (window.confirm('Generate rent invoices for all active leases for this month?')) {
                try {
                  const res = await axios.post('/payments/generate-invoices');
                  alert(res.data.message);
                  fetchData();
                } catch (err) { alert('Failed to generate invoices'); }
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-200"
          >
            <RefreshCw size={18} />
            Auto-Invoice
          </button>
          <button
            onClick={() => {
              // Basic CSV Export
              const headers = ['Tenant', 'Amount', 'Date', 'Type', 'Status'];
              const rows = payments.map(p => [
                p.lease?.tenant?.name || 'N/A',
                p.amount,
                new Date(p.paymentDate).toLocaleDateString(),
                p.paymentMethod,
                p.status
              ]);
              const csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map(e => e.join(",")).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `payments_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all border border-gray-200"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md active:scale-95 transition-all"
          >
            <Plus size={20} />
            Record Payment
          </button>
        </div>
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
                <td className="p-4 font-medium text-gray-800">
                  {payment.lease?.tenant?.name || 'Walk-in / Unknown'}
                </td>
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
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit Payment"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPaymentForPrint(payment);
                        setTimeout(() => window.print(), 100);
                      }}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      title="Print Receipt"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
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

      {/* Hidden during normal view, visible only during print */}
      <ReceiptPrint payment={selectedPaymentForPrint} settings={settings} />
    </div>
  );
};

export default Payments;
