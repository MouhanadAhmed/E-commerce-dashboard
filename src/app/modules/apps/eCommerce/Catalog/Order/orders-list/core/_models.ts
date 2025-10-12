export type Order = {
  _id: string;
  orderNumber?: string;
  customerName?: string;
  total?: number;
  status?: string;
  createdAt?: string;
  user?: { name?: string } | string;
  guest?: string;
  branch?: { name?: string } | string;
  cartItems?: any[];
  paymentMethod?: string;
  totalOrderPrice?: number;
};

export type OrdersQueryResponse = {
  data: Order[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number | null;
  raw?: any;
};
