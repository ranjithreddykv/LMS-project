import React from "react";
import SideBar from "../pages/admin/SideBar"; // adjust path
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
