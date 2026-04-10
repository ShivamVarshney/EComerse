import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/api/productApiSlice';
import Loader from '../componenets/Loader';
import Message from '../componenets/Message';
import Header from '../componenets/Header';
import Product from './Products/Product';

function Home() {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant='danger'>
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className='flex justify-between items-center mb-8'>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
                Special Products
              </h1>
              <Link 
                to='/shop' 
                className='bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full py-2 px-8 transition-colors duration-300'
              >
                Shop
              </Link>
            </div>

            {/* FLEXBOX IMPLEMENTATION */}
            {/* flex-wrap: allows items to drop to new lines */}
            {/* justify-center: keeps the group centered on the screen */}
            {/* gap-6: adds space between items */}
            <div className='flex flex-wrap justify-center  mt-8'>
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;