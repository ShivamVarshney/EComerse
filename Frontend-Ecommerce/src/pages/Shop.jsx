import { use, useEffect ,useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import {useGetFilteredProductsQuery} from '../redux/api/productApiSlice'
import {useFetchCategoriesQuery} from '../redux/api/categoryApiSlice.js'
import  {
  setProducts,
  setCategories,
  setChecked,
} from '../redux/features/shop/shopSlice.js'
import Loader from '../componenets/Loader.jsx'
import ProductCard from "./Products/ProductCard.jsx"


function Shop() {
  const dispatch = useDispatch()
  const {categories ,products , checked , radio} = useSelector((state) => state.shop)
  const categoriesQuery = useFetchCategoriesQuery()

  const [priceFilter, setPriceFilter] = useState('')

  const filteredProductQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    
  });

  useEffect(()=>{
    if(!categoriesQuery.isLoading){
      dispatch(setCategories(categoriesQuery.data))
    }
  } , [categoriesQuery.data ,dispatch])

  useEffect(()=>{
    if(!checked.length || !radio.length){
      if(!filteredProductQuery.isLoading){
        // filter products based on both checked categories and price filter

        const filteredProducts = filteredProductQuery.data.filter((product)=>{
          // check id=f the product price includes the enterd proce filter value
          return(
            product.price.toString().includes(priceFilter) || product.price === parseInt(priceFilter,10)
          )
        })
        dispatch(setProducts(filteredProducts));
      }
    }
  },[filteredProductQuery.data, filteredProductQuery.isLoading, dispatch, priceFilter])

  const handleBrandClick = (brand) => {
    const  productsByBrand = filteredProductQuery.data?.filter((product)=> product.brand === brand);
    dispatch(setProducts(productsByBrand))
  };

  const handleCheck = (value,id ) =>{
    const updatedChecked = value ? [... checked , id] : checked.filter((c) => c !== id)
    dispatch(setChecked(updatedChecked))
  }

  // Add All Brands option to unique brand;

  const uniqueBrands = [
    ...Array.from(
      new Set(filteredProductQuery.data?.map((product) => product.brand).filter((brand)=> brand !== undefined))
    )
  ];

  const handlePriceChange = e =>{
    // upadate the price gilter atate when the user types in the input feild 
    setPriceFilter(e.target.value)
  }


  return (
    <>
    <div className="container mx-auto">
      <div className="flex md : flex-row">
        <div className="bg-[#151515] p-3 mt-2 mb-2">
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter By Categories
          </h2>
          <div className="p-5 w-[15rem]">
            {categories?.map((c)=>(
              <div key={c._id} className="mb-2">
                <div className="flex items-center mr-4">
                  <input type="checkbox" id="red-checkbox"
                  onChange={(e) => handleCheck(e.target.checked , c._id)}
                   />
                   <label htmlFor="pink-checkbox" className="ml-2 text-sm font-medium text-white dark:text-gray-300">
                    {c.name}
                   </label>
                </div>
              </div>
            ))}
          </div>
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 ">Filter By Brands</h2>
          <div className="p-5">
            {uniqueBrands?.map((brand)=>(
              <>
              <div className="flex items-center mr-4 mb-5">
                <input type="radio" id="brand" name="brand" onChange={() => handleBrandClick(brand)}/>
                <label htmlFor="pink-radio" className="ml-2 text-sm font-medium dark : text-gray-300">{brand}</label>
              </div>
              </>
            ))}
          </div>
          <h2 className=" h4 text-center py-2 bg-black rounded-full mb-2">Filter By Price</h2>
          <div className="p-5 w-[15rem]">
            <input type="text" placeholder="Enter Price" value={priceFilter} onChange={handlePriceChange}
            className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none 
            focus:ring focus:border-pink-500"/>
          </div>
          <div className="p-5 pt-0">
            <button className="w-full border my-4" onClick={()=>window.location.reload()}>Reset</button>
          </div>
        </div>

        <div className="p-3">
          <h2 className="h4 text-center mb-2">
            {products?.length} Products
            <div className="flex flex-wrap">
              {products?.length === 0 ? (
                <Loader/>
              ):(
                products?.map((p)=>(
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p}/>
                  </div>
                ))
              )}
            </div>
          </h2>
        </div>
      </div>
    </div>
    </>
  )
}

export default Shop