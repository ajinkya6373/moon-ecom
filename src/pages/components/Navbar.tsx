import Link from "next/link";
import { FC } from "react";
interface NavItem {
  name: string;
  href: string;
}

interface IconItem {
  name: string;
  img: JSX.Element;
}

interface NavbarProps {
  userName?: string;
}

const Navbar: FC<NavbarProps> = ({userName="user"}) => {
  const navItems: NavItem[] = [
    { name: "Categories", href: "/categories" },
    { name: "Sale", href: "/sale" },
    { name: "Clearance", href: "/clearance" },
    { name: "New Stock", href: "/new-stock" },
    { name: "Trending", href: "/trending" },
  ];

  const rightItems: NavItem[] = [
    { name: "Help", href: "/help" },
    { name: "Orders & Returns", href: "/orders-returns" },
    { name: userName, href: "/profile" },
  ];

  const icons: IconItem[] = [
    {
      name: "search",
      img: <img src="/search.png" alt="search" className="w-[20px]" />,
    },
    {
      name: "cart",
      img: <img src="/cart.png" alt="cart" className="w-[20px]" />,
    },
  ];

  return (
    <>
      <nav className="mx-auto flex h-[100px] items-end justify-between bg-white px-4 pb-2 sm:px-6 lg:px-8">
        <div className="text-[2rem] font-bold text-black">ECOMMERCE</div>
        <div className="flex justify-between gap-6">
          {navItems.map((item) => {
            return (
              <span
                key={item.name}
                className="text-[1rem] font-semibold text-black"
              >
                {item.name}
              </span>
            );
          })}
        </div>

        <div className="flex h-[80%] flex-col items-end justify-between">
          <div>
            {rightItems.map((item) => (
              // <Link href={item.href}>
              <span
                key={item.name}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-black"
              >
                {item.name}
              </span>
              // </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {icons.map((icon) => (
              <button
                key={icon.name}
                className="rounded-full p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span className="sr-only">{icon.name}</span>
                {icon.img}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <section className="flex h-[36px] items-center justify-center bg-[#F4F4F4] text-sm font-[500]">
        <span className="px-2">&lt;</span> Get 10% on business sign up{" "}
        <span className="px-2">&gt;</span>
      </section>
    </>
  );
};

export default Navbar;
