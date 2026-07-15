import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 1. Generate Academic Transcripts
export const generateTranscriptPDF = (student: any, results?: any[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header & Branding
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text("SUNSHINE INTER COLLEGE", pageWidth / 2, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Firozabad Road,Tundla-283204", pageWidth / 2, 27, { align: "center" });
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("Official Academic Result", pageWidth / 2, 35, { align: "center" });

  // Student Details
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Student Name: ${student.firstName} ${student.lastName}`, 14, 45);
  doc.text(`Enrollment No: ${student.enrollmentNo || 'N/A'}`, 14, 52);
  doc.text(`Grade/Section: ${student.gradeLevel} - ${student.section}`, 14, 59);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, pageWidth - 14, 45, { align: "right" });

  // The Data Table
  // If `results` is passed, it prints a single certificate. Otherwise, it prints all results.
  const dataToPrint = results || student.results || [];
  const tableData = dataToPrint.map((exam: any) => [
    exam.examName,
    exam.subject,
    `${exam.marksObtained} / ${exam.totalMarks}`,
    exam.grade
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['Exam Name', 'Subject', 'Score', 'Grade']],
    body: tableData,
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    theme: 'grid',
  });

  // Footer Signature
  const finalY = (doc as any).lastAutoTable.finalY || 70;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Sanjeev Tomar", pageWidth - 50, finalY + 30, { align: "center" });
  doc.text("Principal's Signature", pageWidth - 50, finalY + 35, { align: "center" });
  
  doc.text("This is a digitally generated official transcript.", pageWidth / 2, finalY + 50, { align: "center" });

  doc.text("Kindly Contact Administrative Office For Physical Copy", pageWidth / 2, finalY + 60, { align: "center" });

  // Save the file
  doc.save(`${student.firstName}_Transcript.pdf`);
};

// 2. Generate Fee Receipts
export const generateReceiptPDF = (student: any, transaction: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header & Branding
  doc.setFontSize(22);
  doc.setTextColor(225, 29, 72); // Rose-600
  doc.text("NEXUS ACADEMY", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("Official Payment Receipt", pageWidth / 2, 28, { align: "center" });

  // Receipt Details
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Receipt No: ${transaction.id || transaction.transactionId}`, 14, 45);
  doc.text(`Payment Date: ${transaction.date || new Date().toLocaleDateString()}`, 14, 52);
  doc.text(`Student Name: ${student.firstName} ${student.lastName}`, 14, 59);

  // The Data Table
  autoTable(doc, {
    startY: 70,
    head: [['Description', 'Payment Method', 'Amount']],
    body: [
      [transaction.title, transaction.method || 'Credit Card', `$${transaction.amount.toFixed(2)}`]
    ],
    headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255] },
    theme: 'grid',
  });

  const finalY = (doc as any).lastAutoTable.finalY || 70;

  // Total Summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Paid: $${transaction.amount.toFixed(2)}`, pageWidth - 14, finalY + 15, { align: "right" });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your payment. Keep this receipt for your records.", pageWidth / 2, finalY + 40, { align: "center" });

  // Save the file
  doc.save(`Receipt_${transaction.id || 'Payment'}.pdf`);
};