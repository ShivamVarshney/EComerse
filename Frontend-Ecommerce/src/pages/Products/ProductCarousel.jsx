import React from "react";
import { useGetTopProductQuery } from "../../redux/api/productApiSlice";
import Message from "../../componenets/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductQuery();
  console.log(products);

  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="mb-4 xl:block lg:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...setting}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products.map((product) => (
            <div key={product._id}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full rounded-lg object-cover h-[30rem]"
              />
              <div className="flex justify-between w-[20rem]">
                <div className="one">
                  <h2>{product.name}</h2>
                  <p>Price: $ {product.price}</p> <br />
                  <p className="w-[25rem]">
                    {product.description.substring(0, 170)}....
                  </p>
                </div>
                <div className="flex justify-between w-[20rem]">
                  <div className="one">
                    <h1 className="flex items-center mb-6 w-[8rem]">
                      <FaStore className="mr-2 text-white" /> Brand: 
                      {product.brand}
                    </h1>
                    <h1 className="flex items-center mb-6 w-[8rem]">
                      <FaClock className="mr-2 text-white" /> Added: {moment(product.createdAt).fromNow()}
                      
                    </h1>
                    <h1 className="flex items-center mb-6 w-[8rem]">
                      <FaStar className="mr-2 text-white" /> Reviews: 
                      {product.numReviews}
                    </h1>
                  </div>
                  <div className="two">
                    <h1 className="flex items-center mb-6 w-[10rem]">
                      <FaStar className="mr-2 text-white w-[2rem]"/> Ratings:{" "}{Math.round(product.ratings)}
                    </h1>
                    <h1 className="flex items-center mb-6 w-[10rem]">
                      <FaShoppingCart className="mr-2 text-white w-[2rem]"/> Quantity:{product.quantity}
                    </h1>
                    <h1 className="flex items-center mb-6 w-[10rem]">
                      <FaBox className="mr-2 text-white w-[2rem]"/> In Stock:{product.countInStock}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default ProductCarousel;
