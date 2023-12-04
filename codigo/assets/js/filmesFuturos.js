import { getUpcomingMovies } from './services/fetchFunctions.js';

let request ;
let movies = [];
let notFound = false;
let loading = true;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYzE1MmU5YTgxMmFiNTkxMWMxNTcxZTE2YzVmMSIsInN1YiI6IjY1MzU5ZjFjYzhhNWFjMDBhYzM5NTU1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zic9T4hGPlYWCj_WjJwBHSzMPnGE8vqJOQdROzuMAqI'
  }
};
const YOUR_API_KEY = '1d10c152e9a812ab5911c1571e16c5f1';

const infoGathering = async () => {

  // Recupera objeto com os generos do localStorage
  const upcomingRequestJSON = localStorage.getItem('upcomingRequest');
  if (upcomingRequestJSON) {
    request = JSON.parse(upcomingRequestJSON);
  } else {
    request = null;
    console.log("Nenhum objeto encontrado no localStorage.");
  }

  // Faz requisicao e checa se retornou um numero relevante de filmes
  if (request) {
    const { genres } = request;
    movies = await getUpcomingMovies({genres});
    if (movies.length == 0) {
      notFound = true; // Nao foi possivel achar titulos com seus filtros
    }
  } else {
    console.log('Aqui');
    movies = await getUpcomingMovies({});
  }

  //Termina o loading da pagina
  loading = false;
}

const constructor = (movies) => {
  // Caso nao for possivel achar nada com os generos selecionados
  if (notFound) {
    const notFoundInfo = document.getElementById('notFoundInfo');
    notFoundInfo.textContent = 'Nao foi possivel achar lancamentos proximos com esses generos';
  }

  // Constroi o display dos filmes
  const container = document.getElementById('movies-painel');
  movies.forEach((movie, index) => {
    // Aqui eh retirado os filmes que ainda nao tem poster, futuramente pode ser implementado uma thumb genetrica para eles
    if (!movie.poster_path) {
      return;
    }

    

    const movieDiv = document.createElement('div');
    movieDiv.id = `movie${index + 1}`;
    movieDiv.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 border-light';



    const movieName = document.createElement('h3');
    movieName.textContent = `${movie.title}`
    const movieImage = document.createElement('img');
    movieImage.src = `http://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    movieImage.className = 'img-fluid';
    movieImage.alt = `movie_${index + 1}_poster`;

    const movieLink = document.createElement('a');

    movieLink.appendChild(movieImage);
    movieLink.appendChild(movieName);

    movieLink.addEventListener('click', async () => {
      // Implemente a lógica que você deseja executar quando a div for clicada
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=pt-BR`, options);
      const data = await response.json();
      console.log(data);
      // Neste exemplo, redirecionamos para a página do filme com base no ID do IMDB
      window.location.href = `filmeIndividual.html?id=${data.imdb_id}`;
    });

    movieDiv.appendChild(movieLink);

    container.appendChild(movieDiv);
  });
}

await infoGathering();
if (!loading) {
  const loadingElement = document.getElementById("loading");
  loadingElement.parentNode.removeChild(loadingElement);
}
constructor(movies);