const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: API_KEY,
  },
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

async function createMovies(movies,container){
    container.innerHTML ="";

    movies.forEach((movie)=>{

        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");
        movieContainer.addEventListener('click', ()=>{
            location.hash = `#movie=${movie.id}`;
        })
        const moviePoster = document.createElement("img");
        moviePoster.classList.add("movie-img");
        moviePoster.setAttribute("alt", movie.title);
        moviePoster.src = "https://image.tmdb.org/t/p/w300/" + movie.poster_path;

        movieContainer.appendChild(moviePoster);
        container.appendChild(movieContainer);

    })
}

async function createCategories(categories,container){
    container.innerHTML ="";

    categories.forEach((category) => {
   
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");
    
        const categoryName = document.createElement("h3");
        categoryName.classList.add("category-title");
        categoryName.setAttribute("id", "id" + category.id);
        categoryName.addEventListener('click', ()=>{
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryNameText = document.createTextNode(category.name);
    
        categoryName.appendChild(categoryNameText);
        categoryContainer.appendChild(categoryName);
    
        container.appendChild(categoryContainer);
      });
}



async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");

  const movies = data.results;
 /*  console.log({ movies, data }); */
 createMovies(movies, trendingPreviewSection);
 
}


async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");

  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
 
}


async function getCategoryMovies(id) {
    const { data } = await api(`discover/movie`,{
        params: {
          with_genres: id,
        },
      });
    
    const movies = data.results;
    createMovies(movies, genericSection)
   
    
}

async function getMoviesSearch(searchData) {

    const { data } = await api(`search/movie`,{
        params: {
          query: searchData,
        },
      });
    
    const movies = data.results;
    createMovies(movies, genericSection)

}

async function getTrendingMoviesSection() {
    const { data } = await api("trending/movie/day");
  
    const movies = data.results;
   /*  console.log({ movies, data }); */
   createMovies(movies, genericSection);
   
}


async function getMovieById(id) {
    const { data } = await api(`movie/${id}`);
    const movie = data;
    const imgSrc = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
    
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${imgSrc})
    `;
    movieDetailTitle.innerHTML = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMovies(movie.id)
}

async function getRelatedMovies(id) {
    const { data } = await api(`movie/${id}/similar`);
    const movies = data.results;
    createMovies(movies, relatedMoviesContainer);
}