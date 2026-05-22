// Shared types — mirror the backend Prisma models.

export type UserRole = "USER" | "ADMIN";

export type FoodOrderStatus =
  | "PENDING"
  | "CANCELED"
  | "COOKING"
  | "DELIVERING"
  | "DELIVERED";

export interface User {
  id: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCategory {
  id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  categoryId: string;
  category?: FoodCategory;
  createdAt: string;
  updatedAt: string;
}

export interface FoodOrderItem {
  id: string;
  foodId: string;
  food?: Food;
  quantity: number;
  foodOrderId: string;
}

export interface FoodOrder {
  id: string;
  userId: string;
  totalPrice: number;
  status: FoodOrderStatus;
  foodOrderItems: FoodOrderItem[];
  user?: Pick<User, "id" | "email" | "phoneNumber" | "address">;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/** A line in the local shopping cart. */
export interface CartItem {
  food: Food;
  quantity: number;
}
