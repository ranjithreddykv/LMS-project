import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="hidden sm:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300  dark:border-gray-900 p-5 sticky top-16 h-[calc(100vh-4rem)] z-10">
      <div>
        <div className="mt-16 space-y-3">
          <Link
            to="dashboard"
            className="flex items-center space-x-2 hover:text-blue-600"
          >
            <ChartNoAxesColumn size={22} />
            <h1 className="text-base font-medium">Dashboard</h1>
          </Link>
          <Link
            to="course"
            className="flex items-center space-x-2 hover:text-blue-600"
          >
            <SquareLibrary size={22} />
            <h1 className="text-base font-medium">Courses</h1>
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default SideBar;
