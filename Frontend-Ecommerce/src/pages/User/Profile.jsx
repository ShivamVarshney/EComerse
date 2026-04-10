import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../componenets/Loader.jsx";
import { setCredentials } from "../../redux/features/auth/authSlice.js";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice.js";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async(e) =>{
    e.preventDefault()
    if(password !== confirmPassword) {
      toast.error("Password do not match")
    }
    else{
      try {
        const res = await updateProfile({_id: userInfo._id,username ,email ,password}).unwrap()
        dispatch(setCredentials({...res}))
        toast.success('Profile Updated Successfully')
      } catch (error) {
        toast.error(
        err?.data?.message || err.error || "Updation failed. Please try again."
      );
      }
    }

  }

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full "
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full "
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
           <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full "
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmpassword"
              className="block font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              className="mt-1 p-2 border rounded w-full "
              placeholder="Enter name"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
              Update
            </button>


            <Link to ='/user-orders' className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700">My Orders</Link>
          </div>
        </form>
        </div>
        {loadingUpdateProfile && <Loader/>}
      </div>
    </div>
  );
}

export default Profile;
