"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Receipt, CreditCard, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function TicketReceipt({ paymentIntentId, amountTotal, customerEmail, ticketTitle }) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = receiptRef.current;

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new window.Image();
      img.src = dataUrl;
      
      img.onload = () => {
        const pdfHeight = (img.height * pdfWidth) / img.width;
        pdf.addImage(dataUrl, "PNG", 0, 10, pdfWidth, pdfHeight);
        pdf.save(`Ticket-${paymentIntentId.slice(-6)}.pdf`);
        setIsDownloading(false);
      };

    } catch (error) {
      console.error("Failed to generate PDF", error);
      toast.error("Failed to download PDF.");
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center p-4 py-12 font-sans transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-lg w-full"
      >
        
        {/* রসিদের মূল অংশ */}
        <div 
          ref={receiptRef} 
          className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden relative transition-colors duration-500"
        >
          <div className="h-3 w-full bg-emerald-500"></div>

          <div className="p-8 sm:p-10 flex flex-col items-center bg-white dark:bg-slate-900 transition-colors duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-full animate-ping opacity-70"></div>
              <div className="relative bg-emerald-100 dark:bg-emerald-500/20 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm transition-colors duration-500">
                <CheckCircle className="text-emerald-500 dark:text-emerald-400 w-12 h-12" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center transition-colors">Payment Successful!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center font-medium mb-8 transition-colors">
              Your ticket has been confirmed. A receipt has been sent to <span className="font-bold text-gray-900 dark:text-white">{customerEmail}</span>.
            </p>

            <div className="w-full bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 relative transition-colors">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-r border-gray-100 dark:border-slate-700 transition-colors"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-l border-gray-100 dark:border-slate-700 transition-colors"></div>

              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">
                <Receipt size={14} /> Transaction Details
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ticket</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{ticketTitle}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Transaction ID</span>
                  <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">
                    {paymentIntentId.slice(0, 15)}...
                  </span>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 dark:border-slate-700 my-4"></div>

                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total Paid</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ${(amountTotal / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* বাটনগুলো */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full mt-8 flex flex-col gap-3"
        >
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 cursor-pointer border-transparent"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} 
            {isDownloading ? "Generating PDF..." : "Download E-Ticket"}
          </button>
          
          <Link href="/dashboard/user/my-booked-tickets" className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 rounded-xl py-4 text-sm font-bold transition-all flex items-center justify-center gap-2">
            Back to My Bookings <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 font-medium text-xs">
          <CreditCard size={14} /> Secure payment processed by Stripe
        </div>

      </motion.div>
    </div>
  );
}