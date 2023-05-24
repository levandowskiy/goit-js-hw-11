import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './news-service'

const formEl = document.querySelector("#search-form");
const galleryEl = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more-btn");
const newsApiService = new NewsApiService();
formEl.addEventListener("submit", onSearch);

async function onSearch(evt) {
    evt.preventDefault();

    newsApiService.searchQuery = evt.currentTarget.elements.searchQuery.value;
    
    galleryEl.innerHTML = "";
    loadMoreBtn.style.display = "none";
    newsApiService.reset();

    const data = await newsApiService.fetchCountries();
    const isQueryVerified = await queryVerification(data);
    
    if(isQueryVerified){
      await addGalleryMarkup(data)
      await checkLoadMoreImages(data) 
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function checkLoadMoreImages(data) {
  const totalImages = data.totalHits;
  newsApiService.loadedImages = newsApiService.loadedImages + data.hits.length;


  if(newsApiService.loadedImages === totalImages){
    loadMoreBtn.style.display = "none"
    
    window.addEventListener('scroll', handleScroll);
    function handleScroll() {
      const isScrollAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;      
      
      if (isScrollAtBottom) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results");
        window.removeEventListener('scroll', handleScroll);
      }
    }
  }else(loadMoreBtn.style.display = "block")  
}

function queryVerification({hits}) {
  const requestNotFound = hits.length === 0;
  
  if(requestNotFound){ 
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
    return false;
  }
  return true;
}

function addGalleryMarkup({hits}){
  const galleryMarkup = hits.map(makeGalleryMarkup).join("");

  galleryEl.insertAdjacentHTML("beforeend", galleryMarkup);
}

loadMoreBtn.addEventListener("click", hendlerloadMoreBtn);

async function hendlerloadMoreBtn(){
  
  const data = await newsApiService.fetchCountries();
  await addGalleryMarkup(data);
  await checkLoadMoreImages(data)
}

function makeGalleryMarkup(hit){
    const galleryItemMarkup = `
    <div class="photo-card">
    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    <div class="info">
      <div class="info-data">
        <p>Likes</p>
        <p>${hit.likes}</p>
      </div>
      <div class="info-data">
        <p>Views</p>
        <p>${hit.views}</p>
      </div>
      <div class="info-data">
        <p>Comments</p>
        <p>${hit.comments}</p>
      </div>
      <div class="info-data">
        <p>Downloads</p>
        <p>${hit.downloads}</p>
      </div>
    </div>
  </div>`

    return galleryItemMarkup;
}