import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateRevenueReport = (
  startDate: Date, 
  endDate: Date, 
  data: { 
    totalRevenue: number, 
    revenueByMethod: Record<string, number>,
    totalTips: number,
    dailyRevenue: Record<string, number>
  }
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Revenue Report', 105, 15, { align: 'center' });
  
  // Add date range
  doc.setFontSize(12);
  doc.text(
    `Period: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    105, 25, { align: 'center' }
  );
  
  // Add summary section
  doc.setFontSize(14);
  doc.text('Summary', 14, 40);
  
  doc.setFontSize(12);
  doc.text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`, 20, 50);
  doc.text(`Total Tips: $${data.totalTips.toFixed(2)}`, 20, 60);
  
  // Add revenue by payment method section
  doc.setFontSize(14);
  doc.text('Revenue by Payment Method', 14, 80);
  
  const paymentMethodsTable = [
    ['Payment Method', 'Amount'],
    ...Object.entries(data.revenueByMethod).map(([method, amount]) => [
      method, `$${amount.toFixed(2)}`
    ])
  ];
  
  doc.autoTable({
    startY: 85,
    head: [paymentMethodsTable[0] as string[]],
    body: paymentMethodsTable.slice(1) as string[][],
    theme: 'striped',
    headStyles: { fillColor: [23, 118, 210] }
  });
  
  // Add daily revenue section
  const dailyRevenueY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.text('Daily Revenue', 14, dailyRevenueY);
  
  const dailyRevenueTable = [
    ['Date', 'Revenue'],
    ...Object.entries(data.dailyRevenue)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, amount]) => [
        format(new Date(date), 'MMM dd, yyyy'), 
        `$${amount.toFixed(2)}`
      ])
  ];
  
  doc.autoTable({
    startY: dailyRevenueY + 5,
    head: [dailyRevenueTable[0] as string[]],
    body: dailyRevenueTable.slice(1) as string[][],
    theme: 'striped',
    headStyles: { fillColor: [23, 118, 210] }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Generated on ${format(new Date(), 'MMM dd, yyyy')} | Page ${i} of ${pageCount}`,
      105, 285, { align: 'center' }
    );
  }
  
  // Save the PDF
  return doc;
};

export const generateItemFrequencyReport = (
  startDate: Date, 
  endDate: Date, 
  data: { menuItemId: string, name: string, count: number }[]
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Item Order Frequency Report', 105, 15, { align: 'center' });
  
  // Add date range
  doc.setFontSize(12);
  doc.text(
    `Period: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    105, 25, { align: 'center' }
  );
  
  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  // Generate table
  const tableData = [
    ['Item Name', 'Order Count'],
    ...sortedData.map(item => [item.name, item.count.toString()])
  ];
  
  doc.autoTable({
    startY: 40,
    head: [tableData[0] as string[]],
    body: tableData.slice(1) as string[][],
    theme: 'striped',
    headStyles: { fillColor: [23, 118, 210] }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Generated on ${format(new Date(), 'MMM dd, yyyy')} | Page ${i} of ${pageCount}`,
      105, 285, { align: 'center' }
    );
  }
  
  // Save the PDF
  return doc;
};

export const generateOrderStatisticsReport = (
  startDate: Date, 
  endDate: Date, 
  data: { 
    totalOrders: number,
    ordersByStatus: Record<string, number>,
    averageOrderAmount: number,
    ordersByDayOfWeek: Record<string, number>
  }
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Order Statistics Report', 105, 15, { align: 'center' });
  
  // Add date range
  doc.setFontSize(12);
  doc.text(
    `Period: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    105, 25, { align: 'center' }
  );
  
  // Add summary section
  doc.setFontSize(14);
  doc.text('Summary', 14, 40);
  
  doc.setFontSize(12);
  doc.text(`Total Orders: ${data.totalOrders}`, 20, 50);
  doc.text(`Average Order Amount: $${data.averageOrderAmount.toFixed(2)}`, 20, 60);
  
  // Add orders by status section
  doc.setFontSize(14);
  doc.text('Orders by Status', 14, 80);
  
  const ordersByStatusTable = [
    ['Status', 'Count'],
    ...Object.entries(data.ordersByStatus).map(([status, count]) => [
      status, count.toString()
    ])
  ];
  
  doc.autoTable({
    startY: 85,
    head: [ordersByStatusTable[0] as string[]],
    body: ordersByStatusTable.slice(1) as string[][],
    theme: 'striped',
    headStyles: { fillColor: [23, 118, 210] }
  });
  
  // Add orders by day of week section
  const dayOfWeekY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.text('Orders by Day of Week', 14, dayOfWeekY);
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const ordersByDayTable = [
    ['Day of Week', 'Count'],
    ...daysOfWeek.map(day => [
      day, (data.ordersByDayOfWeek[day] || 0).toString()
    ])
  ];
  
  doc.autoTable({
    startY: dayOfWeekY + 5,
    head: [ordersByDayTable[0] as string[]],
    body: ordersByDayTable.slice(1) as string[][],
    theme: 'striped',
    headStyles: { fillColor: [23, 118, 210] }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Generated on ${format(new Date(), 'MMM dd, yyyy')} | Page ${i} of ${pageCount}`,
      105, 285, { align: 'center' }
    );
  }
  
  // Save the PDF
  return doc;
};
