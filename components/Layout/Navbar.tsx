'use client'

import StaggeredMenu from '@/components/ReactBits/StaggeredMenu';

import Logo from "@/public/logo_little.png"

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Medal Table', ariaLabel: 'Full medal table', link: '/medal-table' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'WCA Quiz', ariaLabel: 'WCA Quiz Game', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

export default function Navbar(){
  return (
    <StaggeredMenu
    isFixed
    position="right"
    items={menuItems}
    socialItems={socialItems}
    displaySocials={true}
    displayItemNumbering={true}
    menuButtonColor="#fff"
    openMenuButtonColor="#EB6222"
    changeMenuColorOnOpen={true}
    colors={['#F58024', '#26368B']}
    logoUrl={Logo.src}
    accentColor="#EB6222"
    closeOnClickAway
    />
  )
}