"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Receipt, CreditCard, Loader2 } from "lucide-react";
import { toPng } from "html-to-image"; // নতুন ইমপোর্ট
import jsPDF from "jspdf";

export default function TicketReceipt({ paymentIntentId, amountTotal, customerEmail, ticketTitle }) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = receiptRef.current;

      // html-to-image ব্যবহার করে ছবি তৈরি করা
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2, // হাই-রেজুলেশনের জন্য
      });

      // PDF তৈরি করা
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // ইমেজের হাইট বের করা যেন রেশিও ঠিক থাকে
      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        const pdfHeight = (img.height * pdfWidth) / img.width;
        pdf.addImage(dataUrl, "PNG", 0, 10, pdfWidth, pdfHeight);
        pdf.save(`Ticket-${paymentIntentId.slice(-6)}.pdf`);
        setIsDownloading(false);
      };

    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to download PDF.");
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 py-12 font-sans">
      <div className="max-w-lg w-full">
        
        {/* রসিদের মূল অংশ */}
        <div 
          ref={receiptRef} 
          className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden relative"
        >
          <div className="h-3 w-full bg-emerald-500"></div>

          <div className="p-8 sm:p-10 flex flex-col items-center bg-white">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-70"></div>
              <div className="relative bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <CheckCircle className="text-emerald-500 w-12 h-12" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Payment Successful!</h1>
            <p className="text-gray-500 text-center font-medium mb-8">
              Your ticket has been confirmed. A receipt has been sent to <span className="font-bold text-gray-900">{customerEmail}</span>.
            </p>

            <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 p-6 relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-gray-100"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-gray-100"></div>

              <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">
                <Receipt size={14} /> Transaction Details
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Ticket</span>
                  <span className="text-sm font-bold text-gray-900">{ticketTitle}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Transaction ID</span>
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {paymentIntentId.slice(0, 15)}...
                  </span>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Paid</span>
                  <span className="text-2xl font-black text-emerald-600">
                    ${(amountTotal / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* বাটনগুলো */}
        <div className="w-full mt-8 flex flex-col gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full bg-gray-900 text-white rounded-xl py-4 text-sm font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} 
            {isDownloading ? "Generating PDF..." : "Download E-Ticket"}
          </button>
          
          <Link href="/dashboard/user/my-booked-tickets" className="w-full bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl py-4 text-sm font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
            Back to My Bookings <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 font-medium text-xs">
          <CreditCard size={14} /> Secure payment processed by Stripe
        </div>

      </div>
    </div>
  );
}