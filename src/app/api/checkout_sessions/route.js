import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Form data theke datagulo newa hocche
    const formData = await request.formData();
    const price = formData.get("price");
    const title = formData.get("title");
    const bookingId = formData.get("bookingId"); // <--- Form theke bookingId nilam

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(price) * 100,
            product_data: {
              name: title,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        price: Number(price),
        title: title,
        bookingId: bookingId, // <--- Metadata-te bookingId pass kore dilam
      },
      mode: "payment",
      // 404 error fix korar jonno /dashboard/ shoho accurate success url
      success_url: `${origin}/dashboard/user/my-booked-tickets/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/user`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}