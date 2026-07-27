export type Currency = 'PKR' | 'USD' | 'GBP';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price: number | null;
  discount_percentage: number | null;
  currency: Currency;
  image_url: string;
  category: string;
  featured: boolean;
  best_seller: boolean;
  enabled: boolean;
  sort_order: number;
  created_at: string;
}

export interface TiktokAccount {
  id: string;
  title: string;
  followers: string;
  country: string;
  price: number;
  currency: Currency;
  status: 'available' | 'sold';
  description: string;
  image_url: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  expiry_date: string | null;
  usage_limit: number | null;
  used_count: number;
  enabled: boolean;
  created_at: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  country: string;
  service_id: string | null;
  service_title: string;
  price: number;
  currency: Currency;
  requirements: string;
  coupon_code: string;
  discount_amount: number;
  final_price: number;
  status: OrderStatus;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  link: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  avatar_url: string;
  role: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  replied: boolean;
  created_at: string;
}

export interface Settings {
  id: number;
  website_name: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  whatsapp_number: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  footer_text: string;
  primary_color: string;
  about_text: string;
  created_at: string;
}
