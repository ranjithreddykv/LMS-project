import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkMode from "@/pages/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const role = "student";
  const navigate = useNavigate();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutUserHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User logged out");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <header className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-gray-800 border-gray-200 fixed top-0 left-0 right-0 z-50 transition-colors">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center px-6 h-full">
        <div className="flex items-center gap-2">
          <School size={28} className="text-blue-600 dark:text-white" />
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            E-learning
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="user"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/my-learning" className="w-full">
                    My Learning
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/my-profile" className="w-full">
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                {role === "instructor" && (
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logoutUserHandler}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Sign Up</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={24} className="text-blue-600 dark:text-white" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            E-learning
          </h1>
        </div>
      {/* <MobileNavbar
        user={user}
        role={role}
        logoutUserHandler={logoutUserHandler}
      /> */}
      </div>
    </header>
  );
};

export default Navbar;
