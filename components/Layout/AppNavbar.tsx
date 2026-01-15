'use client'

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@heroui/navbar";
import {Link} from "@heroui/link";
import {Button} from "@heroui/button";
import {Image} from "@heroui/image";
import { usePathname } from "next/navigation";

import Logo from "@/public/logo_little.png"
import { useState } from "react";

export default function AppNavbar(){
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <Navbar
    isBordered
    isMenuOpen={isMenuOpen}
    onMenuOpenChange={setIsMenuOpen}
    classNames={{
      item: [
        "flex",
        "relative",
        "h-full",
        "items-center",
        "data-[active=true]:after:content-['']",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[2px]",
        "data-[active=true]:after:rounded-[2px]",
        "data-[active=true]:after:bg-warning",
      ],
    }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand>
          <Image src={Logo.src} alt="App Logo" width={30}/>
          <p className="font-bold text-inherit">WCA STATS</p>
        </NavbarBrand>
      </NavbarContent>
      
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link color={pathname === "/" ? "warning" : "foreground"} href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/medal-table"}>
          <Link color={pathname === "/medal-table" ? "warning" : "foreground"} href="/medal-table">
            Medals Table
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/person-stats"}>
          <Link color={pathname === "/person-stats" ? "warning" : "foreground"} href="/person-stats">
            Person Stats
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
          <NavbarMenuItem isActive={pathname === "/"}>
            <Link color={pathname === "/" ? "warning" : "foreground"} href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem isActive={pathname === "/medal-table"}>
          <Link color={pathname === "/medal-table" ? "warning" : "foreground"} href="/medal-table" onClick={() => setIsMenuOpen(false)}>
            Medals Table
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={pathname === "/person-stats"}>
          <Link color={pathname === "/person-stats" ? "warning" : "foreground"} href="/person-stats" onClick={() => setIsMenuOpen(false)}>
            Person Stats
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}