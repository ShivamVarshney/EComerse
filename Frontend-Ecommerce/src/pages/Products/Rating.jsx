import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

function Rating({ value, text, color = 'yellow-500' }) { // Added default color
  const fullStars = Math.floor(value)
  // FIX 1: Change > to >= so 3.5 counts as a half star
  const halfStars = value - fullStars >= 0.5 ? 1 : 0 
  
  // FIX 2: Calculate empty stars based on a total of 5
  const emptyStar = 5 - fullStars - halfStars

  return (
    <div className='flex items-center'>
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className={`text-${color} ml-1`} />
      ))}
      
      {/* Half Star */}
      {halfStars === 1 && <FaStarHalfAlt className={`text-${color} ml-1`}/>}
      
      {/* Empty Stars */}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className={`text-${color} ml-1`} />
      ))}
      
      {/* FIX 3: Fixed ml-{2rem} to valid Tailwind syntax ml-[0.5rem] or ml-2 */}
      <span className={`rating-text ml-2 text-${color} font-medium`}>
        {text && text}
      </span>
    </div>
  )
}
Rating.defaultProps = {
  color: 'yellow-500',
}

export default Rating