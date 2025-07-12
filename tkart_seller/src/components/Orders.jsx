import React from 'react';
import { jsPDF } from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import { FiDownload } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import bag from './bag.jpeg'
import honey from './honey.jpeg'

const fakeOrders = [
  {
    orderId: 'TK43256546',
    productName: 'Handcrafted Bag',
    productImage: bag,
    quantity: 2,
    price: 500,
    customerName: 'Priya Mari',
    customerMobile: '9876543210',
    customerAddress: '123, MG Road, Chennai, Tamil Nadu',
    orderDate: '2025-06-12',
  },
  {
    orderId: 'TK43256547',
    productName: 'Organic Honey',
    productImage: honey,
    quantity: 1,
    price: 300,
    customerName: 'Dhanya Dharun',
    customerMobile: '9988776655',
    customerAddress: '45, Nehru Street, Coimbatore, Tamil Nadu',
    orderDate: '2025-06-13',
  },
];

const Orders = () => {
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('INVOICE', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`ORDER ID: ${order.orderId}`, 20, 30);
    doc.text(`Order Date: ${order.orderDate}`, 20, 37);

    doc.text('BILL TO:', 20, 50);
    doc.text(order.customerName, 20, 57);
    doc.text(order.customerAddress, 20, 64);
    doc.text(`Mobile: ${order.customerMobile}`, 20, 71);

    doc.text('PRODUCT DETAILS:', 20, 85);
    doc.text(`Name: ${order.productName}`, 20, 92);
    doc.text(`Quantity: ${order.quantity}`, 20, 99);
    doc.text(`Price per unit: ₹${order.price}`, 20, 106);

    const subtotal = order.quantity * order.price;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 20, 120);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 20, 127);
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, 134);

    doc.text('From: Thirumathi Kart, NIT-Trichy', 20, 150);
    doc.text('Email: hello@reallygreatsite.com', 20, 157);

    doc.save(`${order.orderId}_invoice.pdf`);
    toast.success("✅ Invoice downloaded");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-4 font-josefin">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-10">Orders</h2>

        <div className="grid gap-6">
          {fakeOrders.map((order, index) => {
            const total = order.quantity * order.price * 1.18;

            return (
              <div
                key={index}
                className="bg-white border border-pink-100 rounded-2xl shadow-lg flex flex-col sm:flex-row transition-all duration-300 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="w-full h-60 sm:w-60 sm:h-auto flex-shrink-0">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-full h-full object-cover rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl hover:scale-105 transition-transform duration-300"
                 />
               </div>

                {/* Details */}
                <div className="flex flex-col justify-between p-5 text-sm text-gray-700 w-full">
                  <div className="space-y-1">
                    <p className="text-gray-600"><strong>Order ID:</strong> {order.orderId}</p>
                    <p className="text-gray-600"><strong>Product:</strong> {order.productName}</p>
                    <p className="text-gray-600"><strong>Quantity:</strong> {order.quantity}</p>
                    <p className="text-gray-600">
                      <strong>Total:</strong> ₹{total.toFixed(2)} <span className="text-xs text-gray-400">(incl. GST)</span>
                    </p>
                  </div>

                  <div className="mt-3 space-y-1 text-gray-600">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Mobile:</strong> {order.customerMobile}</p>
                    <p><strong>Address:</strong> {order.customerAddress}</p>
                    <p><strong>Date:</strong> {order.orderDate}</p>
                  </div>

                  <button
                    onClick={() => generateInvoice(order)}
                    className="mt-4 w-fit flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700"
                  >
                    <FiDownload className="text-base" />
                    Download Invoice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Orders;