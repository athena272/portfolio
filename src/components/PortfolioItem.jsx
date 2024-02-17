import React from 'react';

function PortfolioItem({ title, imgUrl, stack, link }) {
   return (
      <a
         href={link}
         target="_blank"
         rel="noopener noreferrer"
         className="border-2 border-stone-900 dark:border-white rounded-md overflow-hidden"
      >
         <img
            src={imgUrl}
            alt="portfolio"
            rel="preload"
            fetchpriority="high"
            as="image"
            type="image/webp"
            loading='eager'
            className="w-full h-46 md:h-60 object-contain cursor-pointer"
         />
         <div className="w-full p-4">
            <p className="text-lg md:text-xl dark:text-white mb-2 md:mb-3 font-semibold ">{title}</p>
            <p className="flex flex-wrap gap-2 flex-row items-center justify-start text-xs md:text-sm dark:text-white ">
               {stack.map((item, index) => (
                  <span key={index} className="inline-block px-2 py-1 font-semibold border-2 border-stone-900 dark:border-white rounded-md">
                     {item}
                  </span>
               ))}
            </p>
         </div>
      </a>
   )
}

export default PortfolioItem;