import { stripe } from '@/lib/stripe'; 
import { redirect } from 'next/navigation';
import Link from 'next/link';
// import { updateBookingToPaid } from '@/lib/actions/bookings'; 
import TicketReceipt from '@/components/TicketReceipt';
import { updateBookingToPaid } from '@/lib/actions/tickets';
// import TicketReceipt from './TicketReceipt'; 

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

    // শুধুমাত্র প্লেইন টেক্সট/নাম্বার ডেটাগুলো আলাদা করে নিচ্ছি
    const paymentIntentId = typeof payment_intent === 'string' ? payment_intent : payment_intent?.id || "UNKNOWN_ID";
    const ticketTitle = metadata?.title || 'Travel Ticket';
    const customerEmail = customer_details?.email || 'Guest';

    return (
      <TicketReceipt 
        paymentIntentId={paymentIntentId}
        amountTotal={amount_total}
        customerEmail={customerEmail}
        ticketTitle={ticketTitle}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Status Unknown</h1>
        <p className="text-gray-500 mb-6">Please check your dashboard to verify your booking.</p>
        <Link href="/dashboard/user" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}