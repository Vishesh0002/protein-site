const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export interface CreateOrderRequest {
  items: { slug: string; qty: number }[];
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  coupon?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
}

export const api = {
  createOrder: (body: CreateOrderRequest) =>
    request<CreateOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyPayment: (body: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    request<{ success: boolean; order: { id: string; status: string } }>(
      "/payments/verify",
      { method: "POST", body: JSON.stringify(body) },
    ),

  getProducts: () => request<unknown[]>("/products"),
};
