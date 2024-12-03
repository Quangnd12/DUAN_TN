import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const exportToPDF = ( username, amount, subscription_date, expiry_date ) => {
    const doc = new jsPDF();
    doc.setFont("Arial");

    doc.setFontSize(18);
    doc.setTextColor(26, 115, 232);
    doc.text('Music Heals - Premium Activation', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Hello ${username},`, 20, 40);
    doc.text('We are excited that you have upgraded to the Premium plan. Below are your transaction details:', 20, 50);

    doc.autoTable({
        startY: 60,
        head: [['Information', 'Details']],
        body: [
            ['Plan', 'Premium'],
            ['Amount', `${amount} USD`],
            ['Payment Method', 'Online Payment'],
            ['Payment Date', subscription_date],
            ['Expiry Date', expiry_date],
        ],
        styles: {
            fontSize: 10,
            cellPadding: 5,
        },
        headStyles: {
            fillColor: [34, 99, 238],
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
    });

    doc.text('Please log into your account and enjoy unlimited music along with many benefits from the Premium plan:', 20, doc.lastAutoTable.finalY + 10);
    doc.text('- Ad-free music.', 20, doc.lastAutoTable.finalY + 20);
    doc.text('- Download songs for offline listening.', 20, doc.lastAutoTable.finalY + 30);
    doc.text('- Higher audio quality.', 20, doc.lastAutoTable.finalY + 40);

    doc.text('If you need support, please contact us via email: support@musicheals.com', 20, doc.lastAutoTable.finalY + 60);

    doc.text('© 2024 Music Heals. All rights reserved.', 20, doc.lastAutoTable.finalY + 80);

    doc.save(`${username}.pdf`);
};

export default exportToPDF;
