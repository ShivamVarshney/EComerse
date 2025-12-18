import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from '../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';

// NOTE: Removed 'data' from react-router-dom import, it's not a valid export
// import { data, useNavigate ,useParams } from 'react-router-dom' 

function UpdateProduct() {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  // --- 💡 FIX 1: State Declaration ---
  // We need TWO states for images:
  // 1. `imageUrls`: For *all* previews (old string URLs + new 'blob:' URLs)
  // 2. `newImageFiles`: For *only* the new File objects to be uploaded
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  
  // ❌ REMOVED These:
  // const [images , setImages] = useState([])
  // const [imageUrl, setImageUrl] = useState(null);

  const [name, setName] = useState(productData?.name || '');
  const [description, setDescription] = useState(productData?.description || '');
  const [price, setPrice] = useState(productData?.price || '');
  const [category, setCategory] = useState(productData?.category || '');
  const [brand, setBrand] = useState(productData?.brand || '');
  const [stock , setStock] = useState(productData?.countInStock || '')
const [quantity ,setQuantity] = useState(productData?.quantity || '')

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [UpdateProductMutation] = useUpdateProductMutation(); // Renamed to avoid conflict
  const [deleteProduct] = useDeleteProductMutation();

  // --- 💡 FIX 2: useEffect ---
  // This hook populates the *previews* (`imageUrls`) with existing images
  // and clears any pending new files.
  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      // Ensure you're setting the correct category ID
      setCategory(productData.category?._id || productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setStock(productData.countInStock);
      
      // ✅ Set the existing image URLs for preview
      setImageUrls(productData.images || []);
      // ✅ Reset the "new files" array
      setNewImageFiles([]);
    }
  }, [productData]);

  // --- 💡 FIX 3: Memory Cleanup ---
  // This new useEffect hook cleans up 'blob:' URLs to prevent memory leaks
  useEffect(() => {
    // This return function runs when the component unmounts
    return () => {
      imageUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]); // Run this effect when imageUrls changes (for unmount)

  // --- 💡 FIX 4: handleImageChange ---
  // This function now populates *both* correct states
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Create 'blob:' URLs just for previewing
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    // ✅ Add the new *File objects* to the files state
    setNewImageFiles((prevFiles) => [...prevFiles, ...files]);
    // ✅ Add the new *preview URLs* to the urls state
    setImageUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  // --- 💡 FIX 5: handleRemoveImage ---
  // This function now correctly manages both states and memory
  const handleRemoveImage = (indexToRemove) => {
    const urlToRemove = imageUrls[indexToRemove];

    // 1. If it's a 'blob:' URL, it's a *new file* we must remove
    if (urlToRemove.startsWith('blob:')) {
      // Revoke it from memory
      URL.revokeObjectURL(urlToRemove);

      // Find its matching file in the `newImageFiles` state and remove it
      // We calculate the file's index by subtracting the number of old URLs
      const existingUrlCount = imageUrls.length - newImageFiles.length;
      const fileIndexToRemove = indexToRemove - existingUrlCount;

      if (fileIndexToRemove >= 0) {
        setNewImageFiles((prevFiles) =>
          prevFiles.filter((_, index) => index !== fileIndexToRemove)
        );
      }
    }

    // 2. Always remove the URL from the `imageUrls` (preview) state
    setImageUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  // --- 💡 FIX 6: handleUpdate ---
  // This is the most critical fix.
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      const formData = new FormData();

      // 1. Append all text fields
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('quantity', quantity);
      formData.append('brand', brand);
      formData.append('countInStock', stock);

      // 2. Append *only the new files*
      newImageFiles.forEach((file) => {
        formData.append('images', file); // This is what your backend expects
      });

      // 3. Append the list of *existing images* to keep
      // This lets your backend know which old images to *not* delete
      const existingImages = imageUrls.filter(url => !url.startsWith('blob:'));
      // We send this as a JSON string. Your backend must be set up to read this.
      formData.append('existingImages', JSON.stringify(existingImages));

      // 4. Send the request
      const data = await UpdateProductMutation({
        productId: params._id,
        formData,
      }).unwrap();

      toast.success(`${data.product?.name} || Product updated successfully`);
      navigate('/admin/allproducts'); // Navigate to a more specific admin route
    } catch (error) {
      console.error(error);
      // ✅ Correct error handling: 'data' is not defined in the catch block
      toast.error(error?.data?.message || 'Product update failed');
    }
  };
  const handleDelete = async() => {
    try {
      let answer = window.confirm('Ary you sure to delete this product')
      if(!answer) return ;

      const {data} = await deleteProduct(params._id)
      toast.success(`${data.name} is deleted`)
       navigate('/admin/allproducts'); // Navigate to a more specific admin route
    } catch (error) {
      console.log(error)
      toast.error("Delete Failed . Try again")
    }
  }

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row justify-between ">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 font-semibold mb-3 ">
            {/* --- 💡 FIX 7: JSX ---
                The JSX now *only* reads from `imageUrls` for all previews.
            --- */}
            <p className="mb-10 "> Update Product</p>

            {imageUrls && imageUrls.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="product preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition-transform transform hover:scale-110"
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-3">
              <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {imageUrls.length > 0
                  ? `${imageUrls.length} image(s) selected`
                  : 'Upload Image ❤️'}
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  // We can hide the file input's default text
                  className="hidden" 
                />
              </label>
            </div>
            
            {/* ... rest of your form ... */}

            <div className="p-3">
              {/* ... Name, Price, Quantity, Brand inputs ... */}
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two ml-10">
                  <label htmlFor="name block">Price</label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3  w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name block">Quantity</label>
                  <br />
                  <input
                    type="Number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="two ml-10">
                  <label htmlFor="name block">Brand</label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3  w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="" className="my-5">
                Description
              </label>
              <textarea
                type="text"
                className=" p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="flex justify-between">
                <div>
                  <label htmlFor="name block">Count In Stock </label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <label>Category</label> <br />
                  <select
                    aria-placeholder="Choose Category"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={category} // ✅ Set the value for the select
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Choose Category</option> {/* Added default option */}
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="">
                <button
                  onClick={handleUpdate}
                  className="py-4 px-10 mt-5 mr-6 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete} // You still need to write this function
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-red-600 hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;