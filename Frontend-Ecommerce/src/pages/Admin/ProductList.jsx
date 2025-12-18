import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import { toast } from "react-toastify";
import Loader from '../../componenets/Loader.jsx'
import AdminMenu from "./AdminMenu.jsx";

function ProductList() {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleImageChange = (e) => {
    // Get the newly selected files as an array
    const files = Array.from(e.target.files);

    // Create URL previews for the new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // Append the new files to the existing images state
    setImages((prevImages) => [...prevImages, ...files]);

    // Append the new preview URLs to the existing imageUrls state
    setImageUrl((prevUrls) => (prevUrls ? [...prevUrls, ...newPreviews] : newPreviews));
  };

  const handleRemoveImage = (indexToRemove) => {
    // A good practice to revoke the object URL to free up memory
    URL.revokeObjectURL(imageUrl[indexToRemove]);

    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );

    setImageUrl((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images || images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      const formData = new FormData();

      // append multiple images
      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("stock", stock);

      const data = await createProduct(formData).unwrap();

      toast.success(`${data.product?.name || "Product"} created successfully`);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row justify-between ">
         <AdminMenu/> 
        <div className="md:w-3/4 p-3">
          <div className="h-12 font-semibold mb-3 ">
            <p className="mb-10 "> Create Product</p>

            {imageUrl && imageUrl.length > 0 && (
              
              <div className="flex flex-wrap justify-center gap-4">
                {imageUrl.map((url, index) => (
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
                {images.length > 0 ? `${images.length} image(s) selected` : "Upload Image ❤️"}
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className={!images ? "hidden" : "text-white"}
                ></input>
              </label>
            </div>
            <div className="p-3">
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
                    className="p-4 mb-3  w-[30rem] border rounded-lg bg-[#101011] text-white"
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
                    className="p-4 mb-3  w-[30rem] border rounded-lg bg-[#101011] text-white"
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
                  <select aria-placeholder="Choose Category" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    onChange={e => setCategory(e.target.value)}
                  >
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}

                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 ">
                Create
              </button>
              {isLoading ? <Loader /> : ""}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
