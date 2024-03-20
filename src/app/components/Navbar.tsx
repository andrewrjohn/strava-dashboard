"use client";
import React, { useEffect } from "react";
import { getAthlete } from "../actions/strava";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAthleteId } from "../lib/cookies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [athlete, setAthlete] = React.useState<Awaited<
    ReturnType<typeof getAthlete>
  > | null>(null);
  useEffect(() => {
    const getData = async () => {
      const a = await getAthlete();
      setAthlete(a);
    };

    getData();
  }, []);
  return (
    <nav className="flex justify-between w-full px-4 py-3">
      {/* <Image
        src="/logo.webp"
        alt="Run Hub"
        width={1024}
        height={1024}
        className="h-20 w-20"
      /> */}
      <h1 className="dark:font-black text-2xl dark:text-dark-tremor-content-emphasis">
        Run Hub
      </h1>

      {athlete ? (
        // <NavigationMenu className="flex items-center gap-2">
        //   <NavigationMenuList>
        //     <NavigationMenuItem>
        //       <NavigationMenuTrigger>
        //         {athlete.firstname} {athlete.lastname}
        //         <img
        //           src={athlete.profile}
        //           alt="profile"
        //           className="h-12 w-12 rounded-full"
        //         />
        //         <NavigationMenuContent className="p-2 w-24 right-0">
        //           <NavigationMenuLink>Log Out</NavigationMenuLink>
        //         </NavigationMenuContent>
        //       </NavigationMenuTrigger>
        //     </NavigationMenuItem>
        //   </NavigationMenuList>
        // </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            {athlete.firstname} {athlete.lastname}
            <img
              src={athlete.profile}
              alt="profile"
              className="h-12 w-12 rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuItem>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
