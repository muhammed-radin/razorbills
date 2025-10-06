import React from 'react'
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card"
export default function Wishlist() {
  return (
    <div>
        <h1 className='text-2xl font-bold ml-35 my-4'>Wishlist</h1>
        <div className='flex flex-wrap gap-5 justify-center'>
            <HorizontalProductCard/>
             <HorizontalProductCard/>
              <HorizontalProductCard/>
               <HorizontalProductCard/>
                <HorizontalProductCard/>
                 <HorizontalProductCard/>
        </div>
    </div>
  )
}
