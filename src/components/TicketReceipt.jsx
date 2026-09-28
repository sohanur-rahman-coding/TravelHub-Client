"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Receipt, CreditCard, Loader2, QrCode as QrIcon, ShieldCheck } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function TicketReceipt({ paymentIntentId, amountTotal, customerEmail, ticketTitle }) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const pnr = (paymentIntentId || "TH").slice(-8).toUpperCase();

  useEffect(() => {
    // Generate QR code data URL
    const generateQR = async () => {
      try {
        const payload = JSON.stringify({
          app: "TravelHub",
          pnr: `TH-${pnr}`,
          txn: paymentIntentId,
          ticket: ticketTitle,
          passenger: customerEmail,
          paid: `$${(amountTotal / 100).toFixed(2)}`,
          status: "CONFIRMED",
          issuedAt: new Date().toISOString(),
        });
        const url = await QRCode.toDataURL(payload, {
          width: 200,
          margin: 1,
          color: {
            dark: "#090d16",
            light: "#ffffff",
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("Failed to generate QR Code:", err);
      }
    };
    generateQR();
  }, [paymentIntentId, pnr, ticketTitle, customerEmail, amountTotal]);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = receiptRef.current;
      if (!element) throw new Error("Receipt element not found");

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
        pdf.save(`TravelHub-Ticket-${pnr}.pdf`);
        setIsDownloading(false);
        toast.success("E-Ticket PDF downloaded successfully!");
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
        {/* Printable Ticket Receipt */}
        <div
          ref={receiptRef}
          className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden relative transition-colors duration-500"
        >
          <div className="h-3 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500"></div>

          <div className="p-8 sm:p-10 flex flex-col items-center bg-white dark:bg-slate-900 transition-colors duration-500">
            {/* Verified badge icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-full animate-ping opacity-70"></div>
              <div className="relative bg-emerald-100 dark:bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm transition-colors duration-500">
                <CheckCircle className="text-emerald-500 dark:text-emerald-400 w-10 h-10" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 text-center tracking-tight transition-colors">
              Payment Confirmed!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm text-center font-medium mb-6 transition-colors">
              Your ticket is confirmed. A receipt has been issued to{" "}
              <span className="font-bold text-gray-900 dark:text-white">{customerEmail}</span>.
            </p>

            {/* E-Ticket Card with QR Code */}
            <div className="w-full bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 relative transition-colors">
              {/* Notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-r border-gray-100 dark:border-slate-700 transition-colors"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-l border-gray-100 dark:border-slate-700 transition-colors"></div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  <Receipt size={14} /> Official Boarding Pass
                </div>
                <span className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                  PNR: TH-{pnr}
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Journey</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white text-right line-clamp-1">
                    {ticketTitle}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Transaction ID</span>
                  <span className="text-[11px] font-mono font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {paymentIntentId?.slice(0, 18)}...
                  </span>
                </div>

                {/* QR Code section */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 my-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-cyan-600 dark:text-cyan-400">
                      Scan to Verify
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-bold mt-0.5">
                      Digital QR Verification
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                      <ShieldCheck size={11} className="text-emerald-500" /> Tamper-Proof
                    </span>
                  </div>

                  <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
                    {qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrCodeUrl} alt="Ticket QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrIcon size={32} className="text-gray-400 animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 dark:border-slate-700 my-3"></div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Total Amount Paid</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ${(amountTotal / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full mt-8 flex flex-col gap-3"
        >
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white rounded-xl py-4 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 disabled:opacity-70 cursor-pointer border-transparent"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isDownloading ? "Generating PDF Ticket..." : "Download E-Ticket with QR Code"}
          </button>

          <Link
            href="/dashboard/user/my-booked-tickets"
            className="w-full bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-800 rounded-xl py-4 text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            View All My Booked Tickets <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 font-medium text-xs">
          <CreditCard size={14} /> Secure payment processed by Stripe
        </div>
      </motion.div>
    </div>
  );
}