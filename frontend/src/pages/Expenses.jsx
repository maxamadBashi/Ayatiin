import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import ExpenseModal from '../components/ExpenseModal';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expensesRes, propertiesRes] = await Promise.all([
                axios.get('/expenses'),
                axios.get('/properties')
            ]);
            setExpenses(expensesRes.data);
            setProperties(propertiesRes.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`/expenses/${id}`);
                setExpenses(expenses.filter(e => e._id !== id));
            } catch (error) {
                alert('Failed to delete expense');
            }
        }
    };

    const handleEdit = (expense) => {
        setCurrentExpense(expense);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentExpense(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentExpense) {
                await axios.put(`/expenses/${currentExpense._id}`, formData);
            } else {
                await axios.post('/expenses', formData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            alert('Error saving expense');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    Add Expense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Property</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400">Loading expenses...</td></tr>
                        ) : expenses.length === 0 ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400">No expenses recorded yet.</td></tr>
                        ) : expenses.map((expense) => (
                            <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium uppercase">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{expense.property?.name || 'Company Global'}</td>
                                <td className="p-4 font-bold text-red-600">-${expense.amount.toLocaleString()}</td>
                                <td className="p-4 text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                expense={currentExpense}
                properties={properties}
            />
        </div>
    );
};

export default Expenses;
