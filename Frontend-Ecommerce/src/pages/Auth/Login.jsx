import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../../redux/api/usersApiSlice"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import Loader from "../../componenets/Loader"

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const { userInfo } = useSelector(state => state.auth)
  const { search } = useLocation()

  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  useEffect(() => {
      // When the component mounts, hide the scrollbar on the body
      document.body.style.overflow = 'hidden';
  
      // When the component unmounts, restore the scrollbar
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
const submitHandler = async (e)=>{
  e.preventDefault()
  try {
    const res = await login({email,password}).unwrap()
    console.log(res);
    dispatch(setCredentials({...res}))
    
  } catch (error) {
    toast.error(error?.data?.message|| error.message || "Enter Valid Username Or Password")
  }
}


  return (
    <div>
      <section className="h-screen flex items-center pl-[10rem] gap-10 overflow-y-hidden">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

          <form onSubmit={submitHandler}className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium text-white">Email Address</label>
              <input type="email" id="email" className="mt-1 p-2 border rounded w-full bg-gray-700" value={email}
                onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="my-[2rem]">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input type="password" id="password" className="mt-1 p-2 border rounded w-full bg-gray-700" value={password}
                onChange={e => setPassword(e.target.value)} />
            </div>

            <button disabled={isLoading} type="submit" className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"> {isLoading ? "Signing In..." : "Sign In"}</button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-white">
              New Customer ? {" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-pink-500 hover:underline">Register</Link>

            </p>
          </div>
        </div>
        <div className="hidden xl:block flex-1 h-screen relative">
          <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        /></div>
      </section>
    </div>
  )
}

export default Login