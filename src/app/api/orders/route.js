import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.customer?.email) {
      return Response.json(
        { success: false, message: "Missing customer email" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHTML = (body.items || [])
      .map(
        (i) => `
        <li>
          ${i.title || "Item"} × ${i.qty || 1}
          = ৳${((i.qty || 1) * (i.discountedPrice || 0)).toFixed(0)}
        </li>
      `
      )
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.customer.email,
      subject: "🧾 Your Order Invoice",
      html: `
        <h2>Order Confirmed</h2>

        <p><b>Name:</b> ${body.customer.name}</p>
        <p><b>Phone:</b> ${body.customer.phone}</p>

        <h3>Items:</h3>
        <ul>${itemsHTML}</ul>

        <p><b>Subtotal:</b> ৳${body.subtotal}</p>
        <p><b>Shipping:</b> ৳${body.shipping}</p>
        <h3>Total: ৳${body.total}</h3>

        <p>Payment: Cash on Delivery</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Order placed successfully",
    });

  } catch (err) {
    console.error("ORDER API ERROR:", err);

    return Response.json(
      {
        success: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}