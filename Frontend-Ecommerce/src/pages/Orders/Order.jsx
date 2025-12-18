import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"; // Hook imported
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../componenets/Message";
import Loader from "../../componenets/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

function Order() {
  const { id: orderId } = useParams();

  // 1. Get Order Details
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  // 2. FIX: Initialize the PayPal Reducer Hook
  // This gives you the 'paypalDispatch' function you were missing
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // 3. FIX: Separate your Mutations correctly
  // Mutation for DELIVERING (Admin only)
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  
  // Mutation for PAYING (User)
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data , actions){
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({orderId , details})
        refetch()
        toast.success("order is Paid")
      } catch (error) {
        toast.error(error?.data?.message || error.message)
      }
    })
  }

  function onError(err) {
    toast.error(err.message)
  }

  function createOrder(data ,actions) {
    return actions.order.create({
      purchase_units : [{amount : {value:order.totalPrice}}],
    })
    .then((orderID)=>{
      return orderID
    })
  }
  const deliverHandler = async ()=>{
    console.log("Delivering Order ID:", orderId); // Check console
    await deliverOrder(orderId)
    refetch();
  }

  return  isLoading ? (<Loader/>) : error ? (<Message variant="danger">{error.data.message}</Message>) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4"> 
      <div className="border gray-300 mt-5 pb-4 mb-5">
        {order.orderItems.length === 0 ? (
          <Message>Order is Empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-[80%]">
              <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
              </thead>
              <tbody>
                {
                  order.orderItems.map((item,index)=>(
                    <tr key={index}>
                      <td className="p-2">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover"></img>
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">{(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))
                }
              </tbody>

            </table>
          </div>
        )}
      </div>
      </div>
        <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">
            Shipping
          </h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500"> Order :</strong> {order._id }
          </p>
          <p className="mb-4">
            <strong className="text-pink-500"> Name :</strong> {order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500"> Email :</strong> {order.user.email}
          </p>
           <p className="mb-4">
            <strong className="text-pink-500"> Address :</strong> {order.shippingAddress.address} ,{order.shippingAddress.city}, {" "}{order.shippingAddress.postalCode},{" "}{order.shippingAddress.country}
          </p>
            <p className="mb-4">
            <strong className="text-pink-500"> Method :</strong> {order.paymentMethod}
          </p>
            {order.isPaid ? (
              <Message variant='success' className='text-pink-500'>Paid on{order.paidAt}</Message>
            ):(
              <Message variant='danger' className='text-pink-500'>Not Paid</Message>
            )}
        </div>
        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between  mb-2">
          <span>Items</span>
          <span>${order.itemsPrice}</span>
        </div>
        <div className="flex justify-between  mb-2">
          <span>Shipping</span>
          <span>${order.shippingPrice}</span>
        </div>
        <div className="flex justify-between  mb-2">
          <span>Tax</span>
          <span>${order.taxPrice}</span>
        </div>
        <div className="flex justify-between  mb-2">
          <span>Total</span>
          <span>${order.totalPrice}</span>
        </div>
        {!order.isPaid && (
          <div>
            {loadingPay && <Loader/>}{" "} {isPending? (<Loader/>) :( <div>
              <div>
                <PayPalButtons createOrder = {createOrder} onApprove={onApprove}
                onError={onError}
                ></PayPalButtons>
              </div>
              
              </div>)}
            
          </div>
         
        )}
        {loadingDeliver && (<Loader/>)}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
          <div>
            <button type="button" className="bg-pink-500 text-white w-full py-2" onClick={deliverHandler}>
              Mark As Delivered
            </button>
          </div>
        )} 
        </div>
    </div>
  )
}

export default Order;