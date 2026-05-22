"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { CartItemRow } from "./CartItemRow";
import { OrderHistory } from "./OrderHistory";

const SHIPPING_FEE = 0.99;

export function CartDrawer() {
  const { items, totalPrice, isDrawerOpen, closeDrawer, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"cart" | "order">("cart");
  const [address, setAddress] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill the delivery address from the user's saved address.
  useEffect(() => {
    if (user?.address) setAddress(user.address);
  }, [user]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  function handleClose() {
    closeDrawer();
    setShowLoginAlert(false);
    // Reset the success screen after the slide-out transition finishes.
    window.setTimeout(() => setSuccess(false), 300);
  }

  // Close on Escape.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen]);

  async function handleCheckout() {
    if (items.length === 0) return;
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    if (!address.trim()) {
      toast.error("Хүргэлтийн хаягаа оруулна уу");
      return;
    }

    setPlacing(true);
    try {
      await apiFetch("/food-order", {
        method: "POST",
        body: {
          foodOrderItems: items.map((item) => ({
            food: item.food.id,
            quantity: item.quantity,
          })),
          address: address.trim(),
        },
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Захиалга амжилтгүй боллоо",
      );
    } finally {
      setPlacing(false);
    }
  }

  function handleBackHome() {
    handleClose();
    router.push("/");
  }

  const shipping = items.length > 0 ? SHIPPING_FEE : 0;
  const total = totalPrice + shipping;

  const tabClass = (active: boolean) =>
    `flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
      active ? "bg-[#e8432d] text-white" : "bg-gray-100 text-gray-500"
    }`;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Order detail"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Order detail</h2>
          <button
            onClick={handleClose}
            aria-label="Хаах"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          /* Success screen */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-[#e8432d]" strokeWidth={1.5} />
            <p className="text-lg font-bold text-gray-900">
              Your order has been successfully placed!
            </p>
            <p className="text-sm text-gray-400">
              Захиалга баталгаажлаа. Захиалгын явцыг "Order" хэсгээс хянана уу.
            </p>
            <button
              onClick={handleBackHome}
              className="mt-2 rounded-full bg-[#e8432d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d03a26] transition-colors"
            >
              Back to home
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 px-5 py-3">
              <button
                onClick={() => setTab("cart")}
                className={tabClass(tab === "cart")}
              >
                Cart
              </button>
              <button
                onClick={() => setTab("order")}
                className={tabClass(tab === "order")}
              >
                Order
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5">
              {tab === "order" ? (
                <OrderHistory />
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingCart
                    className="h-14 w-14 text-gray-200"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium text-gray-400">
                    Your cart&apos;s empty
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="pt-1 text-sm font-bold text-gray-900">
                    My cart
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <CartItemRow key={item.food.id} item={item} />
                    ))}
                  </div>

                  {/* Delivery location */}
                  <div className="border-t border-gray-100 py-4">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">
                      Delivery location
                    </h3>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      placeholder="Хүргэлтийн хаягаа дэлгэрэнгүй бичнэ үү"
                      className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#e8432d]"
                    />
                  </div>

                  {/* Payment info */}
                  <div className="border-t border-gray-100 py-4">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">
                      Payment info
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Items</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span>{formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-1.5 font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Checkout footer (cart tab only) */}
            {tab === "cart" && (
              <div className="border-t border-gray-100 p-5">
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || placing}
                  className="w-full rounded-full bg-[#e8432d] py-3 text-sm font-semibold text-white hover:bg-[#d03a26] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {placing ? "Захиалж байна…" : "Checkout"}
                </button>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Login alert */}
      {showLoginAlert && (
        <div
          onClick={() => setShowLoginAlert(false)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl"
          >
            <p className="text-base font-bold text-gray-900">
              You need to log in first
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Захиалга хийхийн тулд нэвтэрнэ үү.
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                href="/login"
                onClick={handleClose}
                className="flex-1 rounded-full bg-[#e8432d] py-2.5 text-sm font-semibold text-white hover:bg-[#d03a26] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={handleClose}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
