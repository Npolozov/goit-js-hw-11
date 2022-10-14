import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { UnsplashAPI } from './js/UnsplashAPI';
import { createMarkup } from './js/createMarkup';

const unsplash = new UnsplashAPI();

console.log(unsplash);

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

  unsplash.getPhotos().then(({ hits, totalHits }) => {
    const markup = createMarkup(hits);
    refs.galleryReg.insertAdjacentHTML('beforeend', markup);

    unsplash.calculateTotalPages(totalHits);

    Notify.success(`Ми знайшли ${totalHits} зображень по запиту ${query}`);

    if (unsplash.isShowLoadMore) {
      refs.btnLoadMore.classList.remove('is-hidden');
    }
  });
};

const loadMore = event => {
  unsplash.incrementPage();

  if (!unsplash.isShowLoadMore) {
    refs.btnLoadMore.classList.add('is-hidden');
  }

  unsplash.getPhotos().then(({ hits }) => {
    const markup = createMarkup(hits);
    refs.galleryReg.insertAdjacentHTML('beforeend', markup);
  });
};

refs.form.addEventListener('submit', handleSubmit);
refs.btnLoadMore.addEventListener('click', loadMore);
