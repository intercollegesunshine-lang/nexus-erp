import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 1. Generate Academic Transcripts
export const generateTranscriptPDF = (student: any, results?: any[]) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- SCHOOL TEMPLATE DESIGN ---
  // Header Background
  doc.setFillColor(27, 19, 60); // Dark Blue (#1B133C)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Footer Background
  doc.setFillColor(27, 19, 60);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

  // Watermark (Faint background text)
  doc.setTextColor(27, 19, 60); // Very light grey
  doc.setFontSize(30);
  doc.text("SUNSHINE INTER COLLEGE", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
  // ------------------------------

  // Header Text
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SUNSHINE INTER COLLEGE", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Official Academic Transcript", pageWidth / 2, 28, { align: "center" });

  // Student Details
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Student Name: ${student.firstName} ${student.lastName}`, 14, 55);
  doc.text(`Enrollment No: ${student.enrollmentNo || 'N/A'}`, 14, 62);
  doc.text(`Grade/Section: ${student.gradeLevel} - ${student.section}`, 14, 69);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, pageWidth - 14, 55, { align: "right" });

  // The Data Table
  const dataToPrint = results || student.results || [];
  const tableData = dataToPrint.map((exam: any) => [
    exam.examName,
    exam.subject,
    `${exam.marksObtained} / ${exam.totalMarks}`,
    exam.grade
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Exam Name', 'Subject', 'Score', 'Grade']],
    body: tableData,
    headStyles: { fillColor: [27, 19, 60], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    theme: 'grid',
  });

  const finalY = (doc as any).lastAutoTable.finalY || 80;

  // --- CALCULATE OVERALL PERCENTAGE ---
  let totalObtained = 0;
  let totalMax = 0;
  dataToPrint.forEach((exam: any) => {
    totalObtained += Number(exam.marksObtained) || 0;
    totalMax += Number(exam.totalMarks) || 0;
  });
  const overallPercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

  // Print Percentage Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(`Overall Percentage: ${overallPercentage}%`, pageWidth - 14, finalY + 15, { align: "right" });

  // Signatures
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("_________________________", pageWidth - 50, finalY + 50, { align: "center" });
  doc.text("Registrar Signature", pageWidth - 50, finalY + 56, { align: "center" });
  
  // Footer Text
  doc.setTextColor(255, 255, 255);
  doc.text("This is a digitally generated official transcript.", pageWidth / 2, pageHeight - 8, { align: "center" });

  // Save the file
  doc.save(`${student.firstName}_Transcript.pdf`);
};

// 2. Generate Fee Receipts (NEW TEMPLATE WITH REMAINING BALANCE)
export const generateReceiptPDF = (student: any, transaction: any) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- SCHOOL TEMPLATE DESIGN ---
  // Header Background
  doc.setFillColor(27, 19, 60); // Dark Blue (#1B133C)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Footer Background
  doc.setFillColor(27, 19, 60);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

  // Watermark (Faint background text)
  doc.setTextColor(27, 19, 60); // Very light grey
  doc.setFontSize(30);
  doc.text("SUNSHINE INTER COLLEGE", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
  // ------------------------------

  // Header Text
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SUNSHINE INTER COLLEGE", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Official Payment Receipt", pageWidth / 2, 28, { align: "center" });

  // Receipt & Student Details
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Receipt No: ${transaction.transactionId || transaction.id}`, 14, 55);
  doc.text(`Payment Date: ${transaction.date || new Date().toLocaleDateString()}`, pageWidth - 14, 55, { align: "right" });
  
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 14, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`Student Name: ${student.firstName} ${student.lastName}`, 14, 77);
  doc.text(`Enrollment No: ${student.enrollmentNo || 'N/A'}`, 14, 84);
  doc.text(`Class/Section: ${student.gradeLevel || ''} - ${student.section || ''}`, 14, 91);

  // The Data Table
  autoTable(doc, {
    startY: 105,
    head: [['Description', 'Payment Method', 'Amount Paid']],
    body: [
      [transaction.title, transaction.method || 'Cash / Online', `Rs. ${transaction.amount.toLocaleString('en-IN')}`]
    ],
    headStyles: { fillColor: [27, 19, 60], textColor: [255, 255, 255] },
    theme: 'grid',
  });

  const finalY = (doc as any).lastAutoTable.finalY || 120;

  // --- CALCULATE REMAINING BALANCE ---
  // Sum up all fees that are STILL pending (excluding the one they just paid)
  let remainingBalance = 0;
  if (student.fees && student.fees.length > 0) {
    const pendingFees = student.fees.filter((f: any) => f.status === 'PENDING' && f.id !== transaction.id);
    remainingBalance = pendingFees.reduce((sum: number, f: any) => sum + f.amount, 0);
  }

  // Payment Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(`Total Paid: Rs. ${transaction.amount.toLocaleString('en-IN')}`, pageWidth - 14, finalY + 15, { align: "right" });
  
  // Highlight Remaining Balance in Red/Rose color
  doc.setTextColor(225, 29, 72); 
  doc.text(`Remaining Balance Due: Rs. ${remainingBalance.toLocaleString('en-IN')}`, pageWidth - 14, finalY + 25, { align: "right" });

  // Signatures
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  doc.text("_________________________", 50, finalY + 60, { align: "center" });
  doc.text("Authorized Signatory", 50, finalY + 66, { align: "center" });

  doc.text("_________________________", pageWidth - 50, finalY + 60, { align: "center" });
  doc.text("Parent / Guardian", pageWidth - 50, finalY + 66, { align: "center" });

  // Footer Message
  doc.setTextColor(255, 255, 255);
  doc.text("Thank you for your payment. Keep this receipt for your records.", pageWidth / 2, pageHeight - 8, { align: "center" });

  // Save the file
  doc.save(`Receipt_${student.firstName}_${transaction.id?.substring(0,6) || 'Payment'}.pdf`);
};