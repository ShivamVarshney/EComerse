

// add a product to local storage 
  export const addFavoritesToLocalStorage = (product) =>{
    const favorites = getFavoritesFromLocalStorage()
    if(!favorites.some((p)=> p._id === product._id)){
      favorites.push(product);
      localStorage.setItem('favorites' ,JSON.stringify(favorites));
    }
  }


// remove product from localstorage
export const removeFavoritesFromLocalStorage = (productId) =>{
const favorites = getFavoritesFromLocalStorage()
const updateFavorites = favorites.filter((product) => product._id !== productId)

localStorage.setItem("favorites",JSON.stringify(updateFavorites))
}

// retrive favorites from localstorage

export const getFavoritesFromLocalStorage = () =>{
  const favoritesJSON = localStorage.getItem('favorites')
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}