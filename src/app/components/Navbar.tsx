import React from "react";
import { getAthlete } from "../actions";
import Link from "next/link";
import { getAthleteId } from "../lib/cookies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import LogoutButton from "@/components/logout-button";

export default async function Navbar() {
  const athlete = getAthleteId() ? await getAthlete() : null;
  return (
    <nav className="flex justify-between w-full py-3">
      <h1 className="dark:font-black text-2xl dark:text-dark-tremor-content-emphasis">
        Run Hub
      </h1>

      {athlete ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            {athlete.firstname} {athlete.lastname}
            <Image
              src={athlete.profile}
              alt="profile"
              className="h-12 w-12 rounded-full"
              height={48}
              width={48}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuItem asChild>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
