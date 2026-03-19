import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDFFromElement = async (elementRef, filename = 'invoice.pdf') => {
  if (!elementRef.current) {
    console.error("PDF generation failed: Element ref is null");
    return;
  }

  try {
    // Generate high-resolution canvas from the off-screen DOM element
    const canvas = await html2canvas(elementRef.current, {
      scale: 2, // Higher scale for better text crispness
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create new PDF document in A4 format using pixels
    // A4 dimensions at 72 PPI are normally 595 x 842
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
    // Fix for browser blob download quirks (UUID names, missing extensions):
    // Construct the Blob manually and use an anchor tag with the download attribute.
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
