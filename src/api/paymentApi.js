import { api } from './api';

export async function createRazorpayOrder(payload) {
  const response = await api.post('/payments/create-order', payload);
  return response.data;
}

export async function verifyRazorpayPayment(payload) {
  const response = await api.post('/payments/verify', payload);
  return response.data;
}

export function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
