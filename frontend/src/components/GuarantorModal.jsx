import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const GuarantorModal = ({ isOpen, onClose, onSubmit, guarantor }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        idNumber: '',
        workInfo: '',
        status: 'active'
    });
    const [idPhoto, setIdPhoto] = useState(null);
    const [workIdPhoto, setWorkIdPhoto] = useState(null);

    useEffect(() => {
        if (guarantor) {
            setFormData({
                name: guarantor.name || '',
                phone: guarantor.phone || '',
                email: guarantor.email || '',
                idNumber: guarantor.idNumber || '',
                workInfo: guarantor.workInfo || '',
                status: guarantor.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                email: '',
                idNumber: '',
                workInfo: '',
                status: 'active'
            });
        }
    }, [guarantor, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (idPhoto) data.append('idPhoto', idPhoto);
        if (workIdPhoto) data.append('workIdPhoto', workIdPhoto);

        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">
                        {guarantor ? 'Edit Guarantor' : 'Add New Guarantor'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Phone *</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">ID / Passport Number *</label>
                        <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">ID Photo</label>
                            <div className="relative">
                                <input type="file" onChange={(e) => handleFileChange(e, setIdPhoto)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100">
                                    <Upload size={16} />
                                    <span className="text-xs truncate">{idPhoto ? idPhoto.name : 'Upload Photo'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Work ID Photo</label>
                            <div className="relative">
                                <input type="file" onChange={(e) => handleFileChange(e, setWorkIdPhoto)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100">
                                    <Upload size={16} />
                                    <span className="text-xs truncate">{workIdPhoto ? workIdPhoto.name : 'Upload Photo'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Work Information & Notes</label>
                        <textarea name="workInfo" value={formData.workInfo} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-xl font-bold transition-all">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                        {guarantor ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuarantorModal;
