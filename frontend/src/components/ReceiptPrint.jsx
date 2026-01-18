import React from 'react';

const ReceiptPrint = ({ payment, settings }) => {
    if (!payment) return null;

    const { lease, amount, paymentDate, paymentMethod, referenceId } = payment;
    const { tenant, unit } = lease || {};
    const property = unit?.property;

    return (
        <div id="receipt-print" className="hidden print:block p-10 bg-white text-gray-900 font-sans max-w-4xl mx-auto border shadow-sm">
            <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-blue-600 tracking-tighter uppercase mb-1">
                        {settings?.companyName || 'AYATIIN PROPERTY'}
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Professional Property Management Services</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800">OFFICIAL RECEIPT</h2>
                    <p className="text-gray-500 font-mono">#{payment._id?.substring(0, 8).toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Received From</h3>
                    <p className="text-lg font-bold text-gray-900">{tenant?.name || 'Valued Tenant'}</p>
                    <p className="text-gray-600">{tenant?.phone || 'N/A'}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Info</h3>
                    <p className="text-gray-900"><span className="font-semibold">Date:</span> {new Date(paymentDate).toLocaleDateString()}</p>
                    <p className="text-gray-900 capitalize"><span className="font-semibold">Method:</span> {paymentMethod}</p>
                    {referenceId && <p className="text-gray-900"><span className="font-semibold">Ref:</span> {referenceId}</p>}
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Property Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-800">
                        {property?.name} - {unit?.unitNumber}
                    </p>
                    <p className="text-sm text-gray-500">{property?.location || 'Mogadishu, Somalia'}</p>
                </div>
            </div>

            <div className="border-y-2 border-gray-100 py-6 mb-12">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-medium text-gray-600">Total Amount Paid</span>
                    <span className="text-4xl font-black text-blue-600">
                        {settings?.currency || '$'}{amount.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-20">
                <div className="text-center">
                    <div className="border-t border-gray-300 pt-2 w-48 mx-auto">
                        <p className="text-xs text-gray-400 uppercase font-bold">Authorized Signature</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className="border-t border-gray-300 pt-2 w-48 mx-auto">
                        <p className="text-xs text-gray-400 uppercase font-bold">Tenant Signature</p>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-xs">
                    Thank you for choosing {settings?.companyName || 'Ayatiin Property Management'}.
                    This is a computer-generated receipt.
                </p>
            </div>

            <style type="text/css" media="print">
                {`
                    @page { size: auto; margin: 0mm; }
                    body { -webkit-print-color-adjust: exact; padding: 20px; }
                    #receipt-print { display: block !important; border: none; shadow: none; }
                    .no-print { display: none !important; }
                `}
            </style>
        </div>
    );
};

export default ReceiptPrint;
