import { 
  getMoviesByName, 
  getMoviesByImdbID,
  getMoviesWithFilters,
  addPoster2Movies 
} from './services/fetchFunctions.js';

import { moviesMock } from './mockData.js';
import { selectRandomObjects } from './utils/utils.js'

// Recuperar o objeto filterRequest do localStorage
let request ;
let movies = [];
let notFound = false;
let loading = true;

const infoGathering = async () => {
  const filterRequestJSON = localStorage.getItem('filterRequest');
  if (filterRequestJSON) {
    request = JSON.parse(filterRequestJSON);
    // localStorage.removeItem('filterRequest');
  } else {
    request = null;
    console.log("Nenhum objeto encontrado no localStorage.");
  }

  // Faz requisicao para popular a pagina e adiona poster do filme de uma segunda API,
  // caso nao ache a pagina sera populado com elementos locais previamente carregados
  if (request) {
    const {keyword, yearMax, yearMin, genres, typeOfFilter, showType } = request;
    movies = await getMoviesWithFilters({keyword, yearMax, yearMin, genres, typeOfFilter, showType});
    if(keyword == '' && yearMax == null && yearMin == null && genres.length == 0 ) { movies = []}
    if (movies.length < 3 && movies.length >= 0) {
      notFound = true; // Talvez nao foi possivel achar muitos titulos com seus filtros
      if (movies.length != 0) {
        movies = await addPoster2Movies(movies);
      }
      const moreMovies = selectRandomObjects(moviesMock, (3 - movies.length) );
      for(let i = 0; i < moreMovies.length; i++) {
        movies.push(moreMovies[i]);
      }
    } else {
      movies = movies.slice(0, 3)
      movies = await addPoster2Movies(movies);
    }
  } else {
    movies = selectRandomObjects(moviesMock, 3 );
  }
  loading = false;
}

const constructor = (movies) => {
  if (notFound) {
    const notFoundInfo = document.getElementById('notFoundInfo');
    notFoundInfo.textContent = 'Nao foi possivel achar 3 filmes com todos seus filtros Aqui estao algumas sugestoes :';
  }
  const container = document.getElementById('movie-painel');
  console.log(movies);
  
  movies.forEach((movie, index) => {
    console.log(movie);
    const movieDiv = document.createElement('div');
    movieDiv.id = `movie${index + 1}`;
    movieDiv.className = 'm-0 pt-2 col-12 col-sm-6 col-md-4 col-lg-4';

    const movieInfo = document.createElement('p');
    const movieLink = document.createElement('a');
    movieLink.href = `../../pages/filmeIndividual.html?id=${movie.imdbId}`;

    const movieImage = document.createElement('img');
    movieImage.src = movie.image;
    movieImage.className = 'img-fluid';
    movieImage.alt = `movie_${index + 1}_poster`;
    movieImage.className = 'img-container';

    const movieTitle = document.createElement('h5');
    movieTitle.textContent = movie.title;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info_movie';

    const yearPara = document.createElement('p');
    yearPara.className = 'ano_lancamento';
    yearPara.textContent = `Ano de Lançamento: ${movie.year}`;

    const directorPara = document.createElement('p');
    directorPara.className = 'diretor_filme';
    if ('directors' in movie) {
      directorPara.textContent = `Diretor: ${movie.directors[0]}`;
    }


    const genreDiv = document.createElement('div');
    genreDiv.className = 'genero_filme';

    if ('genres' in movie) {
      movie.genres.forEach((genre) => {
        const genreSpan = document.createElement('span');
        genreSpan.textContent = `${genre.name} `;
        genreDiv.appendChild(genreSpan);
      });
    }
    

    const saberMaisLink = document.createElement('a');
    saberMaisLink.href = `/codigo/pages/filmeIndividual.html?id=${movie.imdbId}`;
    saberMaisLink.className = 'btn btn-primary mt-2';
    saberMaisLink.textContent = 'Saber mais';

    infoDiv.appendChild(yearPara);
    infoDiv.appendChild(directorPara);
    infoDiv.appendChild(genreDiv);
    infoDiv.appendChild(saberMaisLink);

    movieLink.appendChild(movieImage);
    movieLink.appendChild(movieTitle);

    const streamingsDiv = document.createElement('div');
    streamingsDiv.className = 'streamings';

    if(movie.streamingInfo.br.length) {
      movie.streamingInfo.br.forEach((stream) => {
        if(stream.streamingType == 'subscription') {
          const streamingLink = document.createElement('a');
          streamingLink.className = 'streaming-link';
          streamingLink.href = stream.link;
          const streamPlataform = document.createElement('p');
          streamPlataform.textContent = `Disponivel em: ${stream.service}`;
    
          streamingLink.appendChild(streamPlataform);
          streamingsDiv.appendChild(streamingLink);
        }  
      });
    } else {
      const streamPlataform = document.createElement('p');
      streamPlataform.textContent = `Nao disponivel atualmente no Brasil`;
    }

    // movieDiv.className = 'card-film';
    movieDiv.appendChild(movieLink);
    movieDiv.appendChild(infoDiv);
    movieDiv.appendChild(streamingsDiv);

    container.appendChild(movieDiv);
  });
}

await infoGathering();
if (!loading) {
  const loadingElement = document.getElementById("loading");
  loadingElement.parentNode.removeChild(loadingElement);
}
constructor(movies);
