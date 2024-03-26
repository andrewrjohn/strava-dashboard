"use client";
import { logout } from "@/app/actions";
import React from "react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          logout();
        } catch (error) {
          console.error(error);
        }
      }}
    >
      Log Out
    </button>
  );
}
