import React from 'react'
import ReactPlayer from 'react-player'
const CourseProgress = () => {
  return (
    <div className="flex mt-20 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Mastering Docker: From Begineer to Pro
        </h1>
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-gray-100">
          <ReactPlayer
            width={700}
            height={400}
            src="https://www.youtube.com/watch?v=XUO4fCXG7tE&list=RDXUO4fCXG7tE&start_radio=1"
          />
          <p className="font-bold text-xl">
            Lecture 1: Introduction to Docker and containerization
          </p>
        </div>
      </div>
      <div>
        <h1>Course Lectures</h1>
        <div>
          {Array.from({ length: 8 }).map((_, index) => (
            <div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseProgress
