import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { UnsplashAPI } from './js/UnsplashAPI';
import { createMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const unsplash = new UnsplashAPI();

const handleSubmit = event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const query = searchQuery.value;
  if (!query) {
    Notify.failure('Ввдедіть дані для пошуку!!!');
    return;
  }

  unsplash.searchQuery = query;
  clearPage();

  unsplash
    .getPhotos()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      const markup = createMarkup(hits);
      refs.galleryReg.insertAdjacentHTML('beforeend', markup);

      unsplash.calculateTotalPages(totalHits);

      let lightbox = new SimpleLightbox('.photo-card a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
      });

      Notify.success(`Hooray! We found ${totalHits} images.`);

      if (unsplash.isShowLoadMore) {
        refs.btnLoadMore.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message);
      clearPage();
    });
};

const loadMore = event => {
  unsplash.incrementPage();

  if (!unsplash.isShowLoadMore) {
    refs.btnLoadMore.classList.add('is-hidden');
  }

  unsplash
    .getPhotos()
    .then(({ hits }) => {
      const markup = createMarkup(hits);
      refs.galleryReg.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    })
    .catch(error => {
      Notify.failure(error.message);
      clearPage();
    });
};

function clearPage() {
  unsplash.resetPage();
  refs.galleryReg.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

refs.form.addEventListener('submit', handleSubmit);
refs.btnLoadMore.addEventListener('click', loadMore);
