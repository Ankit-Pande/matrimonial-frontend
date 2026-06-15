"use client";
import { useEffect } from "react";

// Chhota notification jo upar dikh ke khud gayab ho jata hai.
// alert() ki jagah ye use karte hain (zyada saaf dikhta hai).
export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-maroon text-white px-5 py-2.5 rounded-full text-sm shadow-lg reveal">
      {message}
    </div>
  );
}
