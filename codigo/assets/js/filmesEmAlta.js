// Substituição pela chave de API TMDb 
const apiKey = 'db8bc3e017fe905cac19896c0d68e960';
const moviesContainer = document.getElementById('movies-container');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

// Array para armazenar os filmes favoritos
const favoriteMovies = [];
let movies;

// Função para buscar filmes populares
async function getPopularMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        const data = await response.json();

        movies = data.results;

        // Adicionar filmes ao DOM
        movies.forEach(async movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');

            // Verificar se o poster está presente
            if (movie.poster_path) {
                movieElement.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                `;

                movieElement.addEventListener('click', () => openModal(movie.id, movie.title, movie.overview || 'Sinopse não disponível', movie.poster_path));
                moviesContainer.appendChild(movieElement);
            } else {
                console.warn(`Dados ausentes para o filme: ${movie.title}`);
            }
        });
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
    }
}

// Função para abrir o modal com a sinopse e informações detalhadas
async function openModal(movieId, title, overview, posterPath) {
    console.log('Abrindo modal para:', title);

    try {
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        const detailsData = await detailsResponse.json();

        const genres = detailsData.genres.map(genre => genre.name).join(', ');

        // Verificar se o filme está favoritado
        const isFavorite = favoriteMovies.some(movie => movie.id === movieId);

        modalContent.innerHTML = `
            <h2>${title}</h2>
            <a href="filmeIndividual.html?id=${detailsData.imdb_id}">
            <img src="https://image.tmdb.org/t/p/w500/${posterPath}" alt="${title} Poster">
            </a>
            <p>${overview}</p>
            <p><strong>Gênero:</strong> ${genres}</p>
            <!-- Botão para fechar sinopse -->
            <button class="close-btn" onclick="closeModal()">Fechar Sinopse</button>
            <!-- Botão para favoritar/desfavoritar -->
            <button class="favorite-btn" onclick="toggleFavorite(${movieId})">${isFavorite ? 'Desfavoritar' : 'Favoritar'}</button>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Erro ao buscar informações detalhadas do filme:', error);
    }
}

// Função para fechar o modal
function closeModal() {
    console.log('Fechando modal');
    modal.style.display = 'none';
}

// Função para favoritar ou desfavoritar um filme
function toggleFavorite(movieId) {
    let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let usuarioCorrente;
    if (usuarioCorrenteJSON) {
      usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
    }
  
    movies.forEach((f) => {
        console.log(f);
      if (f.id === movieId) {
        console.log('achei');
        if (usuarioCorrente.likedFilms.length) {
          usuarioCorrente.likedFilms.push(f); 
        } else {
          usuarioCorrente.likedFilms = [];
          usuarioCorrente.likedFilms.push(f); 
        }
        if (f.liked) {
          const index = profiles[1].films.findIndex(filme => filme.title === nomeDoFilme);
  
          if (index !== -1) {
              // Remove o filme do array
              profiles[1].splice(index, 1);
              console.log(`Filme "${f.name}" removido com sucesso.`);
          } else {
              console.log(`Filme "${f.name}" não encontrado no array.`);
          }
        } else {
          // profiles[1].films.push(f);
        }
      }
    })
    console.log(usuarioCorrente.likedFilms);
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
  
  
    const db_usuariosJSON = localStorage.getItem('db_usuarios');
    let db_usuarios;
    if (db_usuariosJSON) {
      console.log('asd')
      db_usuarios = JSON.parse(db_usuariosJSON);
    }
    console.log(db_usuarios);
  
    db_usuarios.usuarios.forEach((user) => {
      if (user.id === usuarioCorrente.id) {
        user.likedFilms = usuarioCorrente.likedFilms;
      }
    })
  
    localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios));
    // Atualizar o estado do botão no modal
    const favoriteButton = document.querySelector('.favorite-btn');
    const isFavorite = favoriteMovies.some(movie => movie.id === movieId);
    favoriteButton.innerText = isFavorite ? 'Desfavoritar' : 'Favoritar';
}

// Chamar a função para buscar filmes populares ao carregar a página
getPopularMovies();
