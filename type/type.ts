// import { checkoutSchema, loginSchema } from "@/utils/validation";
import * as z from "zod";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  password1: string;
  password2: string;
}

export interface SignupResponse {
  message: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  variant: Variant;
  quantity: number;
  price: string;
  subtotal: string;
  name?: string;
  category_name?: string;
}

export interface CartResponse {
  id: number;
  created_at: string;
  items: CartItem[];
  total_price: string;
}

export interface TReview {
  id: number;
  comment: string;
  rating: number;
  customer_name: string;
  created_at: string;
  product_name?: string;
}

export interface AddReviewRequest {
  product: number;
  comment: string;
  rating: number;
}
export interface SalesOrder {
  month: string;
  orders: number;
  sales: number;
}

export type Product = {
  id: number;
  name: string;
  name_en: string;
  name_ar?: string;
  category_name: string;
  category: string;
  categories: string[];
  lowest_price: string;
  thumbnail: string | null;
  is_active: boolean;
  average_rating: number | null;
  review_count: number;
  created_at: string;
  description?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  fragrance_family_ar?: string | null;
  fragrance_family_en?: string | null;
  fregrance_family?: string | null;
  quantity?: number;
  price?: string;
  variants?: Variant[];
  highest_price?: string;
  is_bestseller: boolean;
};

export interface WishlistResponse {
  products: Product[];
}

export interface AddToCartRequest {
  variant_id: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  item_id: number;
  quantity: number;
}

export interface Variant {
  id: number;
  product_name?: string;
  category_name: string;
  price: string;
  compare_at_price: string;
  is_on_sale: boolean;
  is_active: boolean;
  stock: number;
  images: { url: string }[] | string[];

  volume: string;
  color?: string;
}

export interface ReviewsDataRes {
  count: number;
  next: string | null;
  previous: string | null;
  reviews: TReview[];
}
export interface CartItem {
  id: number;
  price: string;
  quantity: number;
  subtotal: string;
  variant: Variant;
}

export interface RecentOrdersDatares {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface RecentOrdersData {
  results?: Order[];
  orders?: Order[];
  count: number;
  next: string | null;
  previous: string | null;
}
export interface OrderItems {
  quantity: number;
  price: string;
  subtotal: number;
  created_at: string;
  variant_name: string;
  variant_volume: string;
}
export interface Order {
  id: number;
  message: string;
  status: OrderStatus;
  full_name: string;
  country: string;
  total_price: string;
  created_at: string;
  full_address: string;
  governorate_name_en: string;
  governorate_name_ar: string;
  phone_number: string;
  shipping_fee: string;
  payment_method: string;
  items: OrderItems[];
}
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ProductsStats {
  count: number;
  total_stock: number;
}

export interface OrdersStats {
  total: number;
  pending: number;
  paid: number;
  delivered: number;
  shipped: number;
  cancelled: number;
}

export interface DashboardStats {
  sales: number;
  products: ProductsStats;
  users: number;
  orders: OrdersStats;
}

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_name?: string;
}

export type ReviewsResponse = Review[];

export interface SalesOrder {
  name: string;
  orders: number;
  sales: number;
}

export type SalesOrdersResponse = SalesOrder[];

export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
}

export interface LowStockResponse {
  variants: ProductVariant[];
}

export interface TopSellingProduct {
  product__name: string;
  volume: string;
  total_sold: number;
}

export interface TopSellingResponse {
  topSelling: TopSellingProduct[];
}

export interface CreateProduct {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  categories: string[];
  fragrance_family_ar: string;
  fragrance_family_en: string;
  is_bestseller: boolean;
}
export interface SubVariant {
  id: number;
  price: string;
  compare_at_price: string;
  stock: number;
  category_name: string;
  images: { url: string }[];
  is_active: boolean;
  is_on_sale: boolean;
  product_name?: string;
  volume: string;
  color?: string;
}
export interface CreateProductResponse {
  message: string;
  product_id: number;
  data: {
    id: string;
    name: string;
    category: string;
    description: string;
    material_composition: string;
    variants: SubVariant[];
  };
}
export interface AddVariants {
  id?: number;
  price: string;
  compare_at_price: string;
  stock: number;
  category_name?: string;
  images?: string[];
  is_active?: boolean;
  is_on_sale?: boolean;
  product_name?: string;
  volume: string;
  color?: string;
}
export interface AddImageVariants {
  message: string;
  url: string;
}

export interface Role {
  email: string;
  is_admin: boolean;
}
export interface google {
  access: string;
  refresh: string;
  is_new_user: boolean;
  user: {
    id: number;
    email: string;
    first_name: string;
  };
}

export interface CheckoutSessionResponse {
  url: string;
}
export interface LinksPayPal {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: LinksPayPal[];
}

export interface PayPalCapture {
  orderID: string;
  django_order_id: string;
}
export interface PayPalCaptureResponse {
  message: string;
  data: {
    id: string;
    status: string;
  };
}
export interface PlaceOrderResponse {
  order_id: number;
  message?: string;
  next_step?: string;
}

export interface ProductsData {
  products: Product[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ProductsDataRes {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
}
export interface updateProduct {
  name?: string;
  category?: string;
  material_composition?: string;
  description?: string;
  is_active?: boolean;
}

export interface updateProductResponse {
  message: string;
  data: updateProduct;
}

export interface toggleWishlist {
  add: boolean;
  message: string;
}

export interface ErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  status?: string;
  non_field_errors?: string;
  name?: string;
}

export interface NotificationState {
  message: string;
  type: "success" | "error";
}

export interface GoogleLoginData {
  access?: string;
  refresh?: string;
}

export interface CheckoutFormData {
  full_name: string;
  full_address: string;
  guest_email: string;
  order_notes?: string;
  phone_number: string;
  country: string;
  payment_method: string;
  governorate_id: string;
}

export interface Props {
  open: boolean;
  onClose: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export interface OrderItem {
  variant_name: string;
  variant_color: string;
  variant_size: string;
  quantity: number;
  price: string;
  subtotal: number;
}

export interface OrderData {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  items: {
    variant_name: string;
    variant_volume: string;
    quantity: number;
    price: string;
    subtotal: number;
    created_at: string;
  }[];
  full_name: string;
  full_address: string;
  phone_number: string;
  country: string;
  shipping_fee: string;
  governorate_name: string;
}

export type OrderHistoryResponse = OrderData[];

export type PaymentPayload = {
  order_id: string;
  payment_method?: string;
  wallet_number?: string;
};
// ----------------------------------------------------------------
// Shared types, constants & pure helpers
// ----------------------------------------------------------------

export type TabType = "create" | "edit" | "addVariant" | "editVariant";

export type GalleryImage = { id: number; url: string; is_thumbnail: boolean };

export type Volume = {
  volume: string;
  color: string;
  price: string;
  compare_at_price: string;
  stock: string;
  imageFiles: File[];
  imagePreviews: string[];
  thumbnailIndex: number;
};

// export type LoginFormData = z.infer<typeof loginSchema>;

// export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export type SortTranslations = {
  featured: string;
  best: string;
  az: string;
  za: string;
  priceAsc: string;
  priceDesc: string;
  dateOld: string;
  dateNew: string;
};
export interface Banner {
  id: number;
  title_en: string;
  title_ar: string;
  link: string;
  order: number;
  is_active: boolean;
  desktop_image: string;
  mobile_image: string;
  desktop_img_url: string;
  mobile_img_url: string;
}

export interface SiteSettings {
  announcement_text: string;
  announcement_text_en: string;
  announcement_text_ar: string;
  announcement_link: string;
  is_announcement_active: boolean;
}

export type TabKey1 = "Men" | "Unisex" | "Women";
// export type TabKey2 = "Niche";
export type TabKey2 = "BodySplash";
// export type TabKey3 = "BodySplash" | "Makhmaryat" | "incense";
export type CheckoutFormDetails = {
  firstName: string;
  lastName: string;
  address: string;
  apt: string;
  guest_email: string;
  phone: string;
  payment_method: "cod" | "paymob";
  governorate_id: string;
  billing: "same" | "different";
  city: string;
  full_name: string;
  full_address: string;
  order_notes?: string;
  phone_number: string;
  country: string;
};
export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  guest_email: string;
  address: string;
  city: string;
  governorate_id: string;
  phone: string;
  payment_method: "cod" | "paymob";
  billing: "same" | "different";
  newsEmail?: boolean;
  apt?: string;
  postal?: string;
  saveInfo?: boolean;
};

