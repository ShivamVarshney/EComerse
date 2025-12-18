import React from 'react'
import { useSelector } from 'react-redux'


function FavoritesCount () {
  const favorites = useSelector(state => state.favorites)
  const favoriteCount = favorites.length; 
  return (
    <div className='absolute left-3 top -8'>
      {
        favoriteCount > 0 && (
          <span className='px-1 py-0 text-white bg-pink-500 rounded-full'>{favoriteCount}</span>
        )
      }
      
       </div>
  )
}

export default FavoritesCount 