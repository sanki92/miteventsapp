import React from "react";
import { useLocation } from "react-router-dom";
import { RiHome5Line } from "react-icons/ri";
import { MdPeople } from "react-icons/md";

import { IoCalendarClearOutline } from "react-icons/io5";

import { MdOutlinePersonOutline } from "react-icons/md";
import { Link } from "react-router-dom";

const BottomNavigation = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const navItems = [
        { href: "/home", icon: <RiHome5Line size={24} />, label: "Home" },
        { href: "/events", icon: <IoCalendarClearOutline size={22} />, label: "Events" },
        { href: "/clubs", icon: <MdPeople size={24} />, label: "Clubs" },
        {
            href: `/profile`,
            icon: <MdOutlinePersonOutline size={25} />,
            label: "Profile",
        },
    ];

    return (
        <div className="w-full bg-black text-gray-400 py-2 bottom-0 fixed flex justify-evenly items-center text-xs">
            {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={index} to={item.href}>
                        <span
                            className={`flex flex-col gap-y-1 items-center ${
                                isActive ? "text-white" : "text-gray-400"
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
