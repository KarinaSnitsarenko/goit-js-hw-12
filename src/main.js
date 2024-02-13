// ======library iziToast=============
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// =======library SimpleLigthbox======
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// ======library Axios=============
import axios from 'axios';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.getElementById('load-more');
const apiKey = '42189534-0458e72641624c0165f7139a5';

const searchParams = {
  key: apiKey,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  q: '',
  page: 1,
  per_page: 15,
};

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  loader.style.display = 'block';
  const inputValue = e.target.elements.input.value;
  searchParams.q = inputValue;
  searchParams.page = 1;
  try {
    const images = await getPhotoByName();
    createGallery(images);
  } catch (error) {
    console.error(error);
  }
  e.target.reset();
});

loadMoreButton.addEventListener('click', async function () {
  loader.style.display = 'block';
  searchParams.page++;
  try {
    const images = await getPhotoByName();
    appendGallery(images);
  } catch (error) {
    console.error(error);
  }
});

async function getPhotoByName() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: searchParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.status);
  }
}

function createGallery(images) {
  if (images.hits.length === 0) {
    iziToast.show({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      messageColor: '#FFFFFF',
      backgroundColor: '#EF4040',
      position: 'topRight',
      messageSize: '16px',
      messageLineHeight: '24px',
      maxWidth: '432px',
    });
    gallery.innerHTML = '';
    loadMoreButton.style.display = 'none';
  } else {
    gallery.innerHTML = '';
    appendGallery(images);
    loadMoreButton.style.display = 'block';
  }
  loader.style.display = 'none';
}

function appendGallery(images) {
  loader.style.display = 'block';

  const link = images.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class='gallery-item'>
  <a class='gallery-link' href='${largeImageURL}'>
    <img class='gallery-image' src='${webformatURL}' alt='${tags}'/>
  </a>
<div class='container-app'>
<p><span>Likes</span> ${likes}</p>
<p><span>Views</span> ${views}</p>
<p><span>Comments</span> ${comments}</p>
<p><span>Downloads</span> ${downloads}</p>
</div>
 </li>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', link);
  loader.style.display = 'none';

  if (searchParams.page * 15 >= images.totalHits) {
    loadMoreButton.style.display = 'none';
    iziToast.show({
      message: "We're sorry, but you've reached the end of search results.",
      messageColor: '#FFFFFF',
      backgroundColor: '#EF4040',
      position: 'topRight',
      messageSize: '16px',
      messageLineHeight: '24px',
      maxWidth: '432px',
    });
  }

  let lightBox = new SimpleLightbox('.gallery-link');
  lightBox.refresh();
}
