export class UnsplashAPI {
  #page = 1;
  #searchQuery = '';
  #totalPages = 0;
  #perPage = 40;

  getPhotos() {
    const url = `https://pixabay.com/api/?key=30576193-c13648781b6f89bf6b7ef27da&q=${
      this.#searchQuery
    }&page=${
      this.#page
    }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
      this.#perPage
    }`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }

  set searchQuery(newQuery) {
    this.#searchQuery = newQuery;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
