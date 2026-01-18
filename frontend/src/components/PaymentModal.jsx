import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, payment, leases }) => {
    const [formData, setFormData] = useState({
        lease: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'rent',
        method: 'bank_transfer',
        status: 'pending',
    });

    useEffect(() => {
        if (payment) {
            setFormData({
                lease: payment.lease?._id || payment.lease || '',
                amount: payment.amount || '',
                date: payment.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                type: payment.type || 'rent',
                method: payment.method || 'bank_transfer',
                status: payment.status || 'pending',
            });
        } else {
            setFormData({
                lease: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'rent',
                method: 'bank_transfer',
                status: 'pending',
            });
        }
    }, [payment, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {payment ? 'Edit Payment' : 'Record Payment'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lease (Tenant - Unit)
                        </label>
                        <select
                            name="lease"
                            value={formData.lease}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Lease</option>
                            {leases.map((lease) => (
                                <option key={lease._id || lease.id} value={lease._id || lease.id}>
                                    {lease.tenant?.name} - {lease.unit?.unitNumber} (${lease.rentAmount})
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.lease && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Rent Due:</span>
                                <span className="font-bold text-gray-800">${leases.find(l => (l._id || l.id) === formData.lease)?.rentAmount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Currently Entering:</span>
                                <span className="font-bold text-blue-600">${formData.amount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-1 mt-1">
                                <span className="text-gray-600">Remaining after this:</span>
                                <span className="font-bold text-red-600">
                                    ${(leases.find(l => (l._id || l.id) === formData.lease)?.rentAmount || 0) - (formData.amount || 0)}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="rent">Rent</option>
                                <option value="deposit">Deposit</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Method
                            </label>
                            <select
                                name="method"
                                value={formData.method}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="cash">Cash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="check">Check</option>
                                <option value="mobile_money">Mobile Money</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {payment ? 'Update Payment' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
