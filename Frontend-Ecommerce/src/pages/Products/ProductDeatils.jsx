import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductdetailQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../componenets/Loader";
import Message from "../../componenets/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Rating from "./Rating";
import ProductTabs from "./ProductTabs";
import { addTocart } from "../../redux/features/cart/cartSlice";

function ProductDetails() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductdetailQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review Created SuccessFully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };
  const addToCartHandler = ()=>{
    dispatch(addTocart({...product,qty}))
    navigate('/cart')
  }

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white bg-pink-600 mt-[5rem] rounded-full font-semibold hover:underline p-2 ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative  mt-[2rem] ml-[10rem] ">
            <div>
              <img
                src={product?.images?.[0]}
                alt={product.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
              />
              <HeartIcon product={product}></HeartIcon>
            </div>
            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w[30rem] text-[#B0B0B0]">
                {product.description}
              </p>
              <p className="text-5xl items-center justify-between w-[20rem] font-extrabold ">
                {" "}
                $ {product.price}
              </p>
              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaStore className="mr-2 text-white " /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaClock className="mr-2 text-white " /> Added:{" "}
                    {moment(product.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaStar className="mr-2 text-white " /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>
                <div className="two">
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaStar className="mr-2 text-white" /> Ratings : {rating}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity :{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2 text-white " /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>
              <div className="flex  justify-between flex-wrap ">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews}
                reviews`}
                />
                {product.countInStock > 0 && (
                  <div className="relative z-50">
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-[6rem] rounded-lg text-white bg-black border border-gray-500 focus:outline-none focus:border-pink-500 z-50 relative pointer-events-auto"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option
                          key={x + 1}
                          value={x + 1}
                          className="text-white bg-black"
                        >
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                comment={comment}
                setRating={setRating}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetails;