import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { addToFavorites, removeFromFavorites, setFavorites } from '../../redux/features/favorites/favoriteSlice'

import {
  addFavoritesToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoritesFromLocalStorage
} from '../../utils/localStorage'
import { useEffect } from 'react';
function HeartIcon({ product }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites) || []
  const isFavorite = favorites.some((p) => p._id === product._id)

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  },[]);

    const toggleFavorites  = () =>{
      if(isFavorite){
          dispatch(removeFromFavorites(product))
          // remove the product from local storage
          removeFavoritesFromLocalStorage(product._id)
      }
      else{
        dispatch(addToFavorites(product))
        // add the product to local storage ass well
        addFavoritesToLocalStorage(product)
      }
    }

  return (
    <div onClick = {toggleFavorites} className='absolute top-2 right-5 cursor-pointer '>
      {
        isFavorite ? (<FaHeart className='text-pink-500'/>) : (
          <FaRegHeart  className='text-white'/>
        )
      }
    </div>
  )
}

export default HeartIcon