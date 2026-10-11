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

export interface VerifyCodeRequest {
  code: string;
  phone?: string;
}

export interface VerifyCodeResponse {
  status: "AUTHENTIC" | "ALREADY_VERIFIED" | "INVALID" | "BLOCKED";
  message: string;
  code?: string;
  batchNumber?: string;
  mfgDate?: string;
  expDate?: string;
  firstVerifiedAt?: string;
  lastVerifiedAt?: string;
  verificationCount?: number;
  product?: {
    id: string;
    title: string;
    image: string;
    slug: string;
  } | null;
}

export interface BatchSummary {
  batchNumber: string;
  totalCodes: number;
  verifiedCodes: number;
  duplicateScans: number;
  product?: { id: string; title: string; slug: string } | null;
  mfgDate?: string;
  expDate?: string;
  createdAt?: string;
}

export interface GenerateBatchRequest {
  batchNumber: string;
  productId?: string;
  count: number;
  mfgDate?: string;
  expDate?: string;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  image: string;
  price: number;
  mrp: number;
  stock?: number;
  tag?: string;
  badge?: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  price: number;
  mrp: number;
  stock: number;
  tag?: string | null;
  badge?: string | null;
  active?: boolean;
  createdAt?: string;
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

  getProducts: () =>
    request<AdminProduct[]>("/products"),

  createProduct: (body: CreateProductRequest) =>
    request<AdminProduct>("/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteProduct: (id: string) =>
    request<{ success?: boolean }>(`/products/${id}`, {
      method: "DELETE",
    }),

  uploadProductImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error("Failed to upload image file");
    }
    const data = await res.json();
    return data.url;
  },

  verifyCode: (body: VerifyCodeRequest) =>
    request<VerifyCodeResponse>("/authenticity/verify", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getBatches: () =>
    request<BatchSummary[]>("/authenticity/admin/batches"),

  generateBatch: (body: GenerateBatchRequest) =>
    request<{
      success: boolean;
      batchNumber: string;
      requestedCount: number;
      insertedCount: number;
    }>("/authenticity/admin/generate", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getExportCsvUrl: (batchNumber: string) =>
    `${API_URL}/authenticity/admin/export/${batchNumber}`,
};


