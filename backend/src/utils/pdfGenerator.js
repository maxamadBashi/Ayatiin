const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceipt = (payment, tenant, property, unit) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filename = `receipt-${payment.receiptId}.pdf`;
        const filepath = path.join(__dirname, '../../public/receipts', filename);

        // Ensure directory exists
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('AAYATIIN PROPERTY LTD', { align: 'center' });
        doc.fontSize(12).text('Smart Choice for Smart Living', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('PAYMENT RECEIPT', { align: 'center', underline: true });
        doc.moveDown();

        // Details
        doc.fontSize(12);
        doc.text(`Receipt ID: ${payment.receiptId}`);
        doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`);
        doc.moveDown();
        doc.text(`Tenant: ${tenant.name}`);
        doc.text(`Property: ${property.name}`);
        doc.text(`Unit: ${unit.unitNumber}`);
        doc.moveDown();
        doc.text(`Amount Paid: $${payment.amount}`);
        doc.text(`Payment Method: ${payment.method}`);
        doc.text(`Type: ${payment.type}`);
        doc.moveDown();

        // Footer
        doc.fontSize(10).text('Thank you for your payment.', { align: 'center' });

        doc.end();

        stream.on('finish', () => {
            resolve(filepath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = { generateReceipt };
