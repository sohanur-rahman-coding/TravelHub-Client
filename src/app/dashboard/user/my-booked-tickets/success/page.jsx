import { stripe } from '@/lib/stripe'; 
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TicketReceipt from '@/components/TicketReceipt';
import { updateBookingToPaid } from '@/lib/actions/tickets';
import "animate.css";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const { status, metadata, customer_details, amount_total, payment_intent } = session;

  if (status === 'open') {
    return redirect('/dashboard/user');
  }

  if (status === 'complete') {
    if (metadata?.bookingId) {
      try {
        await updateBookingToPaid(metadata.bookingId);
      } catch (error) {
        console.error("Failed to update booking in database:", error);
      }
    }

    const paymentIntentId = typeof payment_intent === 'string' ? payment_intent : payment_intent?.id || "UNKNOWN_ID";
    const ticketTitle = metadata?.title || 'Travel Ticket';
    const customerEmail = customer_details?.email || 'Guest';

    return (
      <div className="animate__animated animate__fadeIn animate__faster">
        <TicketReceipt 
          paymentIntentId={paymentIntentId}
          amountTotal={amount_total}
          customerEmail={customerEmail}
          ticketTitle={ticketTitle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md w-full animate__animated animate__zoomIn animate__faster">
        <h1 className="text-2xl font-black text-red-600 dark:text-red-400 mb-3 tracking-tight">Payment Status Unknown</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">Please check your dashboard to verify your booking.</p>
        <Link href="/dashboard/user" className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}