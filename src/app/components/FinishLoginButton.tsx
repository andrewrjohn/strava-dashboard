"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { completeLogin } from "../actions/strava";

export default function FinishLoginButton({ code }: { code: string }) {
  return <Button onClick={() => completeLogin(code)}>Finish Login</Button>;
}
