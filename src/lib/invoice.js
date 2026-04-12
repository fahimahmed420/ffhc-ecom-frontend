import QRCode from "qrcode";

export async function generateInvoiceHTML(order) {
  const qrData = await QRCode.toDataURL(
    JSON.stringify({
      orderId: order.orderId,
      total: order.total,
      email: order.customer.email,
    })
  );

  const itemsHTML = (order.items || [])
    .map(
      (i, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${i.title}</td>
        <td style="text-align:center">${i.qty}</td>
        <td style="text-align:right">৳${i.discountedPrice}</td>
        <td style="text-align:right">৳${(
          i.qty * i.discountedPrice
        ).toFixed(0)}</td>
      </tr>
    `
    )
    .join("");

  return `
  <html>
  <head>
    <style>
      body { font-family: Arial; padding: 30px; }
      .header { text-align:center; border-bottom:3px solid #0C6AED; }
      .brand { font-size:30px; color:#0C6AED; font-weight:bold; }

      table { width:100%; border-collapse:collapse; margin-top:20px; }
      th { background:#0C6AED; color:white; padding:10px; }
      td { border-bottom:1px solid #ddd; padding:10px; }

      .footer { margin-top:30px; text-align:center; font-size:12px; }
      .qr { margin-top:20px; text-align:center; }
    </style>
  </head>

  <body>

    <div class="header">
      <div class="brand">Family Fashion Hub China Store</div>
      <p>INVOICE</p>
      <p><b>Order ID:</b> ${order.orderId}</p>
    </div>

    <p><b>Name:</b> ${order.customer.name}</p>
    <p><b>Phone:</b> ${order.customer.phone}</p>
    <p><b>Email:</b> ${order.customer.email}</p>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <h3 style="text-align:right;">TOTAL: ৳${order.total}</h3>

    <div class="qr">
      <p>Scan to verify order</p>
      <img src="${qrData}" width="120" />
    </div>

    <div class="footer">
      Cash on Delivery | Thank you for shopping with us ❤️
    </div>

  </body>
  </html>
  `;
}