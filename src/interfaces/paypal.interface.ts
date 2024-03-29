export interface PayPalOrderStatusResponse {
  id: string;
  intent: string;
  status: string;
  payment_source: Payment_source;
  purchase_units: PurchaseUnitsItem[];
  payer: Payer;
  create_time: string;
  update_time: string;
  links: LinksItem[];
}

interface Payment_source {
  paypal: Paypal;
}

interface Paypal {
  email_address: string;
  account_id: string;
  account_status: string;
  name: Name;
  address: Address;
}

interface Name {
  given_name?: string;
  surname?: string;
  full_name?: string;
}

interface Address {
  country_code: string;
  address_line_1?: string;
  admin_area_2?: string;
  admin_area_1?: string;
  postal_code?: string;
}

interface PurchaseUnitsItem {
  reference_id: string;
  amount: Amount;
  payee: Payee;
  invoice_id: string;
  shipping: Shipping;
  payments: Payments;
}

interface Amount {
  currency_code: string;
  value: string;
}

interface Payee {
  email_address: string;
  merchant_id: string;
}

interface Shipping {
  name: Name;
  address: Address;
}

interface Payments {
  captures: CapturesItem[];
}

interface CapturesItem {
  id: string;
  status: string;
  amount: Amount;
  final_capture: boolean;
  seller_protection: Seller_protection;
  seller_receivable_breakdown: Seller_receivable_breakdown;
  invoice_id: string;
  links: LinksItem[];
  create_time: string;
  update_time: string;
}

interface Seller_protection {
  status: string;
  dispute_categories: string[];
}

interface Seller_receivable_breakdown {
  gross_amount: Gross_amount;
  paypal_fee: Paypal_fee;
  net_amount: Net_amount;
}

interface Gross_amount {
  currency_code: string;
  value: string;
}

interface Paypal_fee {
  currency_code: string;
  value: string;
}

interface Net_amount {
  currency_code: string;
  value: string;
}

interface LinksItem {
  href: string;
  rel: string;
  method: string;
}

interface Payer {
  name: Name;
  email_address: string;
  payer_id: string;
  address: Address;
}
