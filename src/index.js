import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { pixabayAPI } from './js/pixabayAPI';
import { createMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new pixabayAPI();

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const handleSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const query = searchQuery.value;
  if (!query) {
    Notify.failure('Ввдедіть дані для пошуку!!!');
    return;
  }

  pixabay.searchQuery = query;
  clearPage();

  try {
    const { hits, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createMarkup(hits);
    refs.galleryReg.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();

    pixabay.calculateTotalPages(totalHits);
    console.log(pixabay)

    Notify.success(`Hooray! We found ${totalHits} images.`);

    if (pixabay.isShowLoadMore) {
      refs.btnLoadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }

  // unsplash
  //   .getPhotos()
  //   .then(({ hits, totalHits }) => {
  //     if (hits.length === 0) {
  //       Notify.info(
  //         'Sorry, there are no images matching your search query. Please try again.'
  //       );
  //       return;
  //     }

  //     const markup = createMarkup(hits);
  //     refs.galleryReg.insertAdjacentHTML('beforeend', markup);

  //     lightbox.refresh();

  //     unsplash.calculateTotalPages(totalHits);

  //     Notify.success(`Hooray! We found ${totalHits} images.`);

  //     if (unsplash.isShowLoadMore) {
  //       refs.btnLoadMore.classList.remove('is-hidden');
  //     }
  //   })
  //   .catch(error => {
  //     Notify.failure(error.message);
  //     clearPage();
  //   });
};

const loadMore = async event => {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info(
      'Were sorry, but youve reached the end of search results.'
    );
  }
  try {
    const { hits } = await pixabay.getPhotos();
    const markup = createMarkup(hits);
    refs.galleryReg.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.photo-card ')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }

  // unsplash
  //   .getPhotos()
  //   .then(({ hits }) => {
  //     const markup = createMarkup(hits);
  //     refs.galleryReg.insertAdjacentHTML('beforeend', markup);
  //     lightbox.refresh();
  //   })
  //   .catch(error => {
  //     Notify.failure(error.message);
  //     clearPage();
  //   });
};

function clearPage() {
  pixabay.resetPage();
  refs.galleryReg.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

refs.form.addEventListener('submit', handleSubmit);
refs.btnLoadMore.addEventListener('click', loadMore);
