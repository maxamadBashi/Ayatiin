import React, { useState, useEffect } from 'react';
import { X, UserPlus, Home, Shield, Car, Swords, Users as WitnessesIcon, FileText, Plus } from 'lucide-react';
import TenantModal from './TenantModal';
import UnitModal from './UnitModal';
import PropertyModal from './PropertyModal';
import GuarantorModal from './GuarantorModal';
import axios from '../utils/axios';

const LeaseModal = ({ isOpen, onClose, onSubmit, lease, tenants, units, properties, guarantors, onRefreshData }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
    const [isGuarantorModalOpen, setIsGuarantorModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        tenant: '',
        property: '', // Added for filtering
        unit: '',
        startDate: '',
        endDate: '',
        rentAmount: '',
        deposit: 0,
        rentCycle: 'monthly',
        autoInvoice: true,
        status: 'active',
        guarantorId: '',
        guarantorName: '',
        guarantorPhone: '',
        guarantorID: '',
        conditions: '',
        vehicleMake: '',
        vehicleModel: '',
        vehiclePlate: '',
        weaponType: '',
        weaponLicense: '',
        witness1Name: '',
        witness1Phone: '',
        witness1ID: '',
        witness2Name: '',
        witness2Phone: '',
        witness2ID: '',
        witness3Name: '',
        witness3Phone: '',
        witness3ID: '',
    });

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (lease) {
            console.log('🔍 LeaseModal - Editing lease:', lease);
            console.log('🔍 Extracting IDs - tenantId:', lease.tenantId, 'unitId:', lease.unitId);

            setFormData({
                tenant: lease.tenantId || lease.tenant?._id || lease.tenant?.id || lease.tenant || '',
                unit: lease.unitId || lease.unit?._id || lease.unit?.id || lease.unit || '',
                startDate: lease.startDate ? new Date(lease.startDate).toISOString().split('T')[0] : '',
                endDate: lease.endDate ? new Date(lease.endDate).toISOString().split('T')[0] : '',
                rentAmount: lease.rentAmount || '',
                deposit: lease.deposit || 0,
                rentCycle: lease.rentCycle || 'monthly',
                autoInvoice: lease.autoInvoice !== undefined ? lease.autoInvoice : true,
                status: lease.status || 'active',
                guarantorId: lease.guarantorId || (lease.guarantor?._id || lease.guarantor?.id || ''),
                guarantorName: lease.guarantorName || '',
                guarantorPhone: lease.guarantorPhone || '',
                guarantorID: lease.guarantorID || '',
                conditions: lease.conditions || '',
                vehicleMake: lease.vehicleMake || '',
                vehicleModel: lease.vehicleModel || '',
                vehiclePlate: lease.vehiclePlate || '',
                weaponType: lease.weaponType || '',
                weaponLicense: lease.weaponLicense || '',
                witness1Name: lease.witness1Name || '',
                witness1Phone: lease.witness1Phone || '',
                witness1ID: lease.witness1ID || '',
                witness2Name: lease.witness2Name || '',
                witness2Phone: lease.witness2Phone || '',
                witness2ID: lease.witness2ID || '',
                witness3Name: lease.witness3Name || '',
                witness3Phone: lease.witness3Phone || '',
                witness3ID: lease.witness3ID || '',
                property: units.find(u => (u._id || u.id) === (lease.unitId || lease.unit?._id || lease.unit?.id || lease.unit))?.property?._id ||
                    units.find(u => (u._id || u.id) === (lease.unitId || lease.unit?._id || lease.unit?.id || lease.unit))?.property?.id ||
                    units.find(u => (u._id || u.id) === (lease.unitId || lease.unit?._id || lease.unit?.id || lease.unit))?.propertyId || ''
            });

            console.log('✅ Form data populated - tenant:', lease.tenantId, 'unit:', lease.unitId);
        } else {
            resetForm();
        }
        setError(null);
    }, [lease, isOpen, units]);

    const resetForm = () => {
        setFormData({
            tenant: '',
            property: '',
            unit: '',
            startDate: '',
            endDate: '',
            rentAmount: '',
            deposit: 0,
            rentCycle: 'monthly',
            autoInvoice: true,
            status: 'active',
            guarantorId: '',
            guarantorName: '',
            guarantorPhone: '',
            guarantorID: '',
            conditions: '',
            vehicleMake: '',
            vehicleModel: '',
            vehiclePlate: '',
            weaponType: '',
            weaponLicense: '',
            witness1Name: '',
            witness1Phone: '',
            witness1ID: '',
            witness2Name: '',
            witness2Phone: '',
            witness2ID: '',
            witness3Name: '',
            witness3Phone: '',
            witness3ID: '',
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Auto-populate rent amount when unit is selected
        if (name === 'unit' && value) {
            const selectedUnit = units.find(u => (u._id || u.id) === value);
            if (selectedUnit && selectedUnit.rentAmount) {
                setFormData((prev) => ({
                    ...prev,
                    unit: value,
                    rentAmount: selectedUnit.rentAmount
                }));
                console.log('✅ Auto-populated rent amount:', selectedUnit.rentAmount, 'from unit:', selectedUnit.unitNumber);
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.tenant) return setError("Tenant is required");
        if (!formData.property) return setError("Property is required");
        if (!formData.unit) return setError("Unit is required");
        if (!formData.startDate) return setError("Start Date is required");
        if (!formData.endDate) return setError("End Date is required");
        if (!formData.rentAmount) return setError("Rent Amount is required");

        // Check if property has units
        const propertyUnits = units.filter(u => {
            const unitPropertyId = u.property?._id || u.property?.id || u.property;
            return unitPropertyId === formData.property;
        });
        if (propertyUnits.length === 0) {
            return setError("Selected property has no units. Please add units to the property before creating a lease.");
        }

        // Guarantor Validation (Must have ID or Manual Name)
        if (!formData.guarantorId && !formData.guarantorName) {
            setActiveTab('guarantor');
            return setError("Guarantor information is required (Select or fill manually)");
        }

        if (!formData.witness1Name || !formData.witness1Phone || !formData.witness1ID) {
            setActiveTab('witnesses');
            return setError("Witness 1 details are required");
        }

        setSubmitting(true);
        const result = await onSubmit(formData);
        setSubmitting(false);

        if (result && !result.success) {
            setError(result.message);
        }
    };

    const handleInlineTenantCreate = async (tenantData) => {
        try {
            const res = await axios.post('/tenants', tenantData);
            if (onRefreshData) await onRefreshData();
            setFormData(prev => ({ ...prev, tenant: res.data._id || res.data.id }));
            setIsTenantModalOpen(false);
        } catch (err) {
            alert('Failed to create tenant: ' + err.message);
        }
    };

    const handleInlineUnitCreate = async (unitData) => {
        try {
            const res = await axios.post('/units', unitData);
            if (onRefreshData) await onRefreshData();
            setFormData(prev => ({ ...prev, unit: res.data._id || res.data.id }));
            setIsUnitModalOpen(false);
        } catch (err) {
            alert('Failed to create unit: ' + err.message);
        }
    };

    const handleInlinePropertyCreate = async (propertyData) => {
        try {
            const res = await axios.post('/properties', propertyData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (onRefreshData) await onRefreshData();
            setFormData(prev => ({ ...prev, property: res.data._id || res.data.id }));
            setIsPropertyModalOpen(false);
        } catch (err) {
            alert('Failed to create property: ' + err.message);
        }
    };

    const handleInlineGuarantorCreate = async (guarantorData) => {
        try {
            const res = await axios.post('/guarantors', guarantorData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (onRefreshData) await onRefreshData();
            setFormData(prev => ({ ...prev, guarantorId: res.data._id || res.data.id }));
            setIsGuarantorModalOpen(false);
        } catch (err) {
            alert('Failed to create guarantor: ' + err.message);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <FileText size={18} /> },
        { id: 'guarantor', label: 'Guarantor', icon: <Shield size={18} /> },
        { id: 'witnesses', label: 'Witnesses', icon: <WitnessesIcon size={18} /> },
        { id: 'vehicle', label: 'Vehicle & Weapons', icon: <Car size={18} /> },
        { id: 'conditions', label: 'Conditions', icon: <Swords size={18} /> },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 flex-shrink-0 bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {lease ? 'Update Lease Contract' : 'New Lease Contract'}
                        </h2>
                        <p className="text-sm text-gray-500">All fields marked with * are required</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex bg-slate-100 p-2 overflow-x-auto gap-1 border-b border-slate-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Error:</span>
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-full">
                            <X size={16} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    {activeTab === 'basic' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Tenant *</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="tenant"
                                            value={formData.tenant}
                                            onChange={handleChange}
                                            required
                                            className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">Select Tenant</option>
                                            {tenants.map(t => <option key={t._id} value={t._id || t.id}>{t.name}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsTenantModalOpen(true)}
                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                            title="Add New Tenant"
                                        >
                                            <UserPlus size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Property *</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="property"
                                            value={formData.property}
                                            onChange={handleChange}
                                            required
                                            className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">Select Property</option>
                                            {properties.map(p => (
                                                <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsPropertyModalOpen(true)}
                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                            title="Add New Property"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Unit *</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            required
                                            className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">Select Unit</option>
                                            {(() => {
                                                const filteredUnits = units.filter(u => {
                                                    // Check both direct propertyId field and nested property object
                                                    const unitPropertyId = u.propertyId || u.property?.id || u.property?._id;
                                                    const matchProp = !formData.property || unitPropertyId === formData.property;

                                                    // For new leases: only show available units
                                                    // For editing: show available units OR the current lease's unit (even if occupied)
                                                    let matchStatus;
                                                    if (lease) {
                                                        // Editing mode: allow current unit even if occupied
                                                        matchStatus = u.status === 'available' ||
                                                            u._id === lease.unitId ||
                                                            u.id === lease.unitId ||
                                                            u._id === lease.unit?._id ||
                                                            u.id === lease.unit?.id;
                                                    } else {
                                                        // New lease mode: only available units
                                                        matchStatus = u.status === 'available';
                                                    }

                                                    if (formData.property) {
                                                        console.log(`Unit ${u.unitNumber}: propertyId=${unitPropertyId}, selectedProperty=${formData.property}, status=${u.status}, match=${matchProp && matchStatus}`);
                                                    }

                                                    return matchProp && matchStatus;
                                                });

                                                if (formData.property && filteredUnits.length === 0) {
                                                    console.warn('⚠️ No units found for selected property:', formData.property);
                                                    console.log('Available units:', units.map(u => ({ id: u._id || u.id, number: u.unitNumber, propertyId: u.propertyId, status: u.status, nestedProp: u.property?.id })));
                                                }

                                                return filteredUnits.map(u => (
                                                    <option key={u._id || u.id} value={u._id || u.id}>
                                                        {u.unitNumber}
                                                    </option>
                                                ));
                                            })()}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsUnitModalOpen(true)}
                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                            title="Add New Unit"
                                        >
                                            <Home size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Start Date *</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">End Date *</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Monthly Rent ($) *</label>
                                    <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Security Deposit ($)</label>
                                    <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-emerald-600" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Rent Cycle</label>
                                    <select name="rentCycle" value={formData.rentCycle} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="active">Active</option>
                                        <option value="terminated">Terminated</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                                <input type="checkbox" name="autoInvoice" checked={formData.autoInvoice} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                                <label className="text-sm font-medium text-blue-900">Generate monthly invoices automatically?</label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'guarantor' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <Shield size={20} className="text-blue-600" />
                                Guarantor Selection
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700">Select Existing Guarantor</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="guarantorId"
                                            value={formData.guarantorId}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">None / Select Guarantor</option>
                                            {guarantors.map(g => (
                                                <option key={g._id || g.id} value={g._id || g.id}>{g.name} ({g.phone})</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsGuarantorModalOpen(true)}
                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                            title="Add New Guarantor"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 italic">Or fill details manually below if not in list</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Manual Name (Optional)</label>
                                    <input type="text" name="guarantorName" value={formData.guarantorName} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Manual Phone (Optional)</label>
                                    <input type="text" name="guarantorPhone" value={formData.guarantorPhone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'witnesses' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4">
                            {[1, 2, 3].map(num => (
                                <div key={num} className="space-y-4">
                                    <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">{num}</span>
                                        Witness {num} {num === 1 && <span className="text-red-500 text-xs ml-2">(Required)</span>}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input type="text" name={`witness${num}Name`} value={formData[`witness${num}Name`]} onChange={handleChange} placeholder="Full Name" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required={num === 1} />
                                        <input type="text" name={`witness${num}Phone`} value={formData[`witness${num}Phone`]} onChange={handleChange} placeholder="Phone Number" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required={num === 1} />
                                        <input type="text" name={`witness${num}ID`} value={formData[`witness${num}ID`]} onChange={handleChange} placeholder="ID Card / Passport" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required={num === 1} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'vehicle' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <Car size={20} className="text-blue-600" />
                                    Vehicle Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} placeholder="Make (e.g. Toyota)" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Model (e.g. Camry)" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <input type="text" name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} placeholder="Plate Number" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <Swords size={20} className="text-red-600" />
                                    Legal Weapons
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="weaponType" value={formData.weaponType} onChange={handleChange} placeholder="Weapon Type" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <input type="text" name="weaponLicense" value={formData.weaponLicense} onChange={handleChange} placeholder="License Number" className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'conditions' && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 h-full">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <FileText size={20} className="text-blue-600" />
                                Special Rules & Lease Conditions
                            </h3>
                            <textarea
                                name="conditions"
                                value={formData.conditions}
                                onChange={handleChange}
                                placeholder="Enter any special rules, notes, or contract conditions here..."
                                className="w-full h-64 px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none font-sans text-gray-700 leading-relaxed"
                            ></textarea>
                            <p className="text-xs text-gray-400 italic">This content will be included in the final printed contract.</p>
                        </div>
                    )}
                </form>

                <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                    <div className="flex gap-2">
                        {tabs.map((tab, idx) => (
                            <div
                                key={tab.id}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${activeTab === tab.id ? 'bg-blue-600 w-8' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? 'Saving...' : (lease ? 'Save Changes' : 'Create Contract')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Inline Creation Modals */}
            <TenantModal
                isOpen={isTenantModalOpen}
                onClose={() => setIsTenantModalOpen(false)}
                onSubmit={handleInlineTenantCreate}
                units={units}
            />
            <UnitModal
                isOpen={isUnitModalOpen}
                onClose={() => setIsUnitModalOpen(false)}
                onSubmit={handleInlineUnitCreate}
                properties={properties}
            />
            <PropertyModal
                isOpen={isPropertyModalOpen}
                onClose={() => setIsPropertyModalOpen(false)}
                onSubmit={handleInlinePropertyCreate}
            />
            <GuarantorModal
                isOpen={isGuarantorModalOpen}
                onClose={() => setIsGuarantorModalOpen(false)}
                onSubmit={handleInlineGuarantorCreate}
            />
        </div>
    );
};

export default LeaseModal;
