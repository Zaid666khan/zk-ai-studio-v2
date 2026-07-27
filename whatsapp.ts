import type { Currency } from './types';

const CURRENCY_SYMBOL: Record<Currency, string> = {
  PKR: 'Rs',
  USD: '$',
  GBP: '£',
};

export function formatPrice(price: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOL[currency];
  return `${symbol}${Number(price).toLocaleString()}`;
}

export function effectivePrice(service: {
  price: number;
  sale_price: number | null;
  discount_percentage: number | null;
}): number {
  if (service.sale_price && service.sale_price > 0) return service.sale_price;
  if (service.discount_percentage && service.discount_percentage > 0) {
    return Math.round(service.price * (1 - service.discount_percentage / 100));
  }
  return service.price;
}

export function buildWhatsAppUrl(
  number: string,
  message: string
): string {
  const clean = number.replace(/[^0-9]/g, '');
  // Convert leading 0 to Pakistan country code 92 if it looks like a local PK number
  let normalized = clean;
  if (clean.startsWith('0')) {
    normalized = '92' + clean.slice(1);
  }
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export interface OrderWhatsAppPayload {
  customerName: string;
  serviceTitle: string;
  price: number;
  currency: Currency;
  orderDetails?: string;
  email?: string;
  phone?: string;
  country?: string;
  requirements?: string;
  couponCode?: string;
  discountAmount?: number;
  finalPrice?: number;
}

export function buildOrderMessage(p: OrderWhatsAppPayload): string {
  const lines = [
    `*New Order - ZK AI Studio*`,
    ``,
    `*Customer Name:* ${p.customerName}`,
    `*Selected Service:* ${p.serviceTitle}`,
    `*Price:* ${formatPrice(p.price, p.currency)}`,
  ];
  if (p.couponCode)
    lines.push(`*Coupon:* ${p.couponCode} (-${formatPrice(p.discountAmount || 0, p.currency)})`);
  if (p.finalPrice !== undefined)
    lines.push(`*Final Price:* ${formatPrice(p.finalPrice, p.currency)}`);
  if (p.email) lines.push(`*Email:* ${p.email}`);
  if (p.phone) lines.push(`*Phone:* ${p.phone}`);
  if (p.country) lines.push(`*Country:* ${p.country}`);
  if (p.requirements) lines.push(`*Requirements:* ${p.requirements}`);
  if (p.orderDetails) lines.push(`*Order Details:* ${p.orderDetails}`);
  return lines.join('\n');
}

export function buildContactMessage(
  name: string,
  email: string,
  message: string
): string {
  return `*New Contact Message - ZK AI Studio*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;
}
