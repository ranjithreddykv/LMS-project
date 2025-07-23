import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery,setSearchQuery]=useState("");
  const navigate=useNavigate();
  const searchHandler=(e)=>{
    e.preventDefault();
    if(searchQuery?.trim()!== "")
    navigate(`/course/search/?query=${searchQuery}`)
    setSearchQuery("");
  }
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-100 dark:text-gray-400 text-lg sm:text-xl mb-10">
          Discover, learn, and upskill with our wide range of expert-curated
          courses.
        </p>

        <form className="flex flex-col sm:flex-row items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-2xl mx-auto mb-6">
          <div className="flex items-center w-full">
            <Search
              className="ml-4 text-gray-400 dark:text-gray-500 hidden sm:block"
              size={20}
            />
            <input
              onChange={(e)=>setSearchQuery(e.target.value)}
              type="text"
              value={searchQuery}
              placeholder="Search Courses"
              className="flex-grow bg-transparent border-none focus:ring-0 px-4 py-3 w-full text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
            />
          </div>
          <Button
            onClick={searchHandler}
            className=" bg-blue-600 dark:bg-blue-700 text-white px-7 py-6 rounded-full w-full sm:w-auto sm:rounded-l-none hover:bg-blue-700 dark:hover:bg-blue-800 transition-all"
            type="submit"
          >
            Search
          </Button>
        </form>

        <Button
          onClick={()=>navigate(`/course/search?query=`)}
          variant="outline"
          className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-3 rounded-full transition-all"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
