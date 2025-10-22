export type Coupon = {
  _id: string;
  code?: string;
  type?: string;
  discount?: number | string;
  expiresAt?: string;
  minAmount?: number | string;
  maxAmount?: number | string;
  limit?: number;
  validFor?: string;
  appliedOn?: any[];
  createdAt?: string;
};

export type CouponsQueryResponse = {
  data: Coupon[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number | null;
  raw?: any;
};
