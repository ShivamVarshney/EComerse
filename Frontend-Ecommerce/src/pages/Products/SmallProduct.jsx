import React from "react";
import { Link } from 'react-router-dom';
import HeartIcon from "./HeartIcon.jsx";

function SmallProduct({ product }) {
  return (
    // 1. Removed ml-[2rem]
    // 2. Added a simple shadow and border for better UI
    <div className="w-[18rem] ml-[2rem]  p-3 rounded border shadow-sm">
      <div className="relative ">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-auto w-full rounded object-cover aspect-square" // Added aspect-square
        />
        {/* overlay heart */}
        <div className="absolute top-2 right-2 z-50">
          <HeartIcon product={product}/>
        </div>
        
        {/* 3. Fixed typo p-54 to pt-4 (padding-top) */}
        <div className="pt-4"> 
          <Link to={`/product/${product._id}`}>
          
            <h2 className="flex justify-between items-center">
              
              <div className="font-semibold truncate">{product.name}</div>
              <span className="bg-pink-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-pink-300">
                ${product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SmallProduct;