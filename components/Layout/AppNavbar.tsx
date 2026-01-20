'use client'

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from "@heroui/navbar";
import {Link} from "@heroui/link";
import {Avatar} from "@heroui/avatar";
import {Image} from "@heroui/image";
import { usePathname, useRouter } from "next/navigation";

import Logo from "@/public/logo_little.png"
import { useState } from "react";
import useUser from "@/Context/User/useUser";

export default function AppNavbar(){
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {user, doLogout} = useUser();
  
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
      menu: [
        "flex",
        "flex-col",
        "justify-start",
      ]
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

        <NavbarItem isActive={pathname === "/medals-table"}>
          <Link color={pathname === "/medals-table" ? "warning" : "foreground"} href="/medals-table">
            Medals Table
          </Link>
        </NavbarItem>

        <NavbarItem isActive={pathname === "/person-stats"}>
          <Link color={pathname === "/person-stats" ? "warning" : "foreground"} href="/person-stats">
            Person Stats
          </Link>
        </NavbarItem>

        <NavbarItem isActive={pathname === "/personal-diary"}>
          <Link color={pathname === "/personal-diary" ? "warning" : "foreground"} href="/personal-diary" onClick={() => setIsMenuOpen(false)}>
            Personal Diary
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link color="secondary" isExternal showAnchorIcon href="https://wcaquiz.xyz" onClick={() => setIsMenuOpen(false)}>
            Check out WCA Quiz
          </Link>
        </NavbarItem>

        {
          user ?
          <NavbarItem>
            <Link onClick={() => {}}>
            <Avatar showFallback name={user.user.email} src="https://images.unsplash.com/broken" />
              {user.user.email}
            </Link>
          </NavbarItem>
          :
          <NavbarItem>
            <Link onClick={() => router.push("/login")}>
              Login
            </Link>
            <Link onClick={() => router.push("/register")}>
              Register
            </Link>
          </NavbarItem>
        }
      </NavbarContent>

      <NavbarMenu>

          <NavbarMenuItem isActive={pathname === "/"}>
            <Link color={pathname === "/" ? "warning" : "foreground"} href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem isActive={pathname === "/medals-table"}>
          <Link color={pathname === "/medals-table" ? "warning" : "foreground"} href="/medals-table" onClick={() => setIsMenuOpen(false)}>
            Medals Table
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem isActive={pathname === "/person-stats"}>
          <Link color={pathname === "/person-stats" ? "warning" : "foreground"} href="/person-stats" onClick={() => setIsMenuOpen(false)}>
            Person Stats
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem isActive={pathname === "/personal-diary"}>
          <Link color={pathname === "/personal-diary" ? "warning" : "foreground"} href="/personal-diary" onClick={() => setIsMenuOpen(false)}>
            Personal Diary
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <Link color="secondary" isExternal showAnchorIcon href="https://wcaquiz.xyz" onClick={() => setIsMenuOpen(false)}>
            Check out WCA Quiz
          </Link>
        </NavbarMenuItem>

        {
          user ?
          <>
          <NavbarMenuItem>
            <Link onClick={() => {}} className="flex gap-2">
              <Avatar showFallback size="sm" src="https://images.unsplash.com/broken" />
              Your account
            </Link>
          </NavbarMenuItem>
          
          <NavbarMenuItem aria-label="logout">
            <Link onClick={() => {doLogout(); router.push("/"); setIsMenuOpen(false)}} className="flex gap-2">
              Logout
            </Link>
          </NavbarMenuItem>
          </>
          :
          <NavbarMenuItem className="flex gap-2" aria-label="login">
            <Link onClick={() => {router.push("/login"); setIsMenuOpen(false)}}>
              Login
            </Link>
            
            <Link onClick={() => {router.push("/register"); setIsMenuOpen(false)}}>
              Register
            </Link>
          </NavbarMenuItem>
        }
      </NavbarMenu>
    </Navbar>
  )
}