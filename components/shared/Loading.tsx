import React from 'react'

const Loading = () => {
  return (
    <div role='status' className="flex animate-pulse w-full h-22">
  
    <div className="ml-4 mt-2 w-full">
  
      <ul className="mt-5 gap-3 grid items-center">
        <li className="w-full min-h-[2rem] bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li className="w-full min-h-[2rem] bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li className="w-full min-h-[2rem] bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li className="w-full min-h-[2rem] bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li className="w-full min-h-[2rem] bg-gray-200 rounded-md dark:bg-gray-700"></li>
        <li className="w-full min-h-[2rem] bg-gray-200 rounded-md dark:bg-gray-700"></li>
      </ul>
    </div>
  </div>
  )
}

export default Loading