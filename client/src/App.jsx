import React from "react";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import MyProfile from "./pages/student/MyProfile";
import SideBar from "./pages/admin/SideBar";
import DashBoard from "./pages/admin/DashBoard";
import CourseTable from "./pages/admin/course/CourseTable";
import AdminLayout from "./layout/AdminLayout";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import UpdateLecture from "./pages/admin/lecture/UpdateLecture";
import CourseDetailsPage from "./pages/admin/course/CourseDetailsPage";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "my-learning",
        element: <MyLearning />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "course-details/:courseId",
        element: <CourseDetailsPage />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashBoard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:_id",
            element: <EditCourse />,
          },
          {
            path: "course/:_id/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <UpdateLecture />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
