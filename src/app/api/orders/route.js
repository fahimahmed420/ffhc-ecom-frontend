export const runtime = "nodejs";

import { generateOrderId } from "@/utils/orderId";
import { generateInvoiceHTML } from "@/lib/invoice";
import { generatePDF } from "@/lib/pdf";
import { createTransporter } from "@/lib/mail";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.customer?.email) {
      return Response.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    // 1. Order ID
    body.orderId = generateOrderId();

    // 2. HTML invoice
    const html = await generateInvoiceHTML(body);

    // 3. PDF
    const pdfBuffer = await generatePDF(html);

    // 4. Email
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.customer.email,
      subject: `Order Confirmation - ${body.orderId}`,
      html: `<h2>Thanks for your order!</h2><p>Order ID: ${body.orderId}</p>`,
      attachments: [
        {
          filename: `invoice-${body.orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return Response.json({
      success: true,
      orderId: body.orderId,
      message: "Order placed successfully",
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);

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