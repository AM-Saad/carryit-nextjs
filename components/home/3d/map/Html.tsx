import React from 'react'

const items = [
  { text: "Ready To Go?", top: '0' },
  { text: "Live Tracking", top: '100vh' },
  { text: "Chat Support", top: '200vh' },
  { text: "Instant Notifications", top: '300vh' },
  { text: "Real-Time Analytics", top: '400vh' },
  { text: "Multiple Branches", top: '500vh' }
]

function Html() {
  
  return (
    <div className='relative'>
      {items.map((item: any, idx:number) => (
        <div className={`p-3 rounded my-2 flex items-center text-[8vw] leading-[7rem] w-[35rem] absolute h-[100vh] top-[${item.top}] lg:right-[${idx % 2 !== 0 ? '-100vw': ''}] text-[#292828] font-bold bg-sky-400 bg-opacity-25`}>
          <h1>
            {item.text}
          </h1>
        </div>
      ))}
    </div>
  )
}

export { Html }
