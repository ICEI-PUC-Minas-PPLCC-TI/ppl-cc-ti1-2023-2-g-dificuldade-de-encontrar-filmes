// import { genres } from './tmdbGenres.js'

const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "Cinema TV",
    53: "Thriller",
    10752: "War",
    37: "Western"
    }

let filmsFav = [];

function carregaFilms() {
    usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let usuarioCorrente;
    if (usuarioCorrenteJSON) {
      usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
      let likedMovies = usuarioCorrenteJSON.likedFilms;
    }

    filmsFav = usuarioCorrente.likedFilms;
}

function dislikeFilm(nome) {
    let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let usuarioCorrente;
    
    if (usuarioCorrenteJSON) {
      usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
  
      // Verifica se o perfil do usuário atual tem filmes curtidos
      if (usuarioCorrente.likedFilms && usuarioCorrente.likedFilms.length > 0) {
        // Encontrar o índice do filme com base no nome
        const index = usuarioCorrente.likedFilms.findIndex(filme => filme.title === nome);
  
        if (index !== -1) {
          // Remove o filme do array de filmes curtidos
          usuarioCorrente.likedFilms.splice(index, 1);
        } else {
          console.log(`Filme "${nome}" não encontrado na lista de curtidas.`);
        }
      } else {
        console.log("Nenhum filme curtido encontrado para o usuário atual.");
      }
    } else {
      console.log("Nenhum usuário corrente encontrado.");
    }
  
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
}

carregaFilms();

document.addEventListener("DOMContentLoaded", function() {
    const myList = document.getElementById("my-list");
    const profileButton = document.getElementById("profile-button");
    const movieDetails = document.getElementById("movie-details");
    const movieImageDetails = document.getElementById("image-details");
    const movieDetailsContent = document.querySelector(".movie-details-content");
    const movieTitle = document.getElementById("movie-title");
    const movieDescription = document.getElementById("movie-description");
    const genreFilter = document.getElementById("genre-filter");
    const closeDetailsButton = document.getElementById("close-details");

    let listaDeFilmes = [];
    let filmeFav = [];

    const createGenreList = () => {
        const selectContainer = document.getElementById("genre-filter");
        const opcao = document.createElement("option");
        opcao.type = "option";
        opcao.id = `opcaoAll`;
        opcao.value = 'all';
        opcao.innerHTML = `All`
        selectContainer.appendChild(opcao);
        for (const id in genres) {
            const opcao = document.createElement("option");
            opcao.type = "option";
            opcao.id = `opcao${id}`;
            opcao.value = id;
            opcao.innerHTML = `${genres[id]}`
    
            selectContainer.appendChild(opcao);
        }
    }
    
    
    const getMovieData = (arrayFilmesApi) => {
        let movies = [];
        for(let i = 0; i < arrayFilmesApi.length; i++) {
            if(!arrayFilmesApi[i].poster_path ) {
                continue;
            }
            const movie = {
                id:arrayFilmesApi[i].id,
                titulo:arrayFilmesApi[i].title,
                descricao:arrayFilmesApi[i].overview,
                genero:arrayFilmesApi[i].genre_ids,
                imagem_url:`http://image.tmdb.org/t/p/w500/${arrayFilmesApi[i].poster_path}`,
                naMinhaLista:true,
            };
            movies.push(movie);
        }
        return movies;
    }   

    const constructor = () => {
        createGenreList();
        listaDeFilmes = getMovieData(filmsFav);
    }

  constructor();
  // repetição para os filmes
  for(let i = 0;i < listaDeFilmes.length; i++){
    if(listaDeFilmes[i].naMinhaLista==true){
        filmeFav.push(listaDeFilmes[i])
    }
  } 

    // Renderiza os filmes na página
    renderMyList();

    // Exibe detalhes do filme quando clicado
    myList.addEventListener("click", (event) => {
        const clickedElement = event.target;
    
        if (clickedElement.classList.contains("movie-card")) {
            // Se o clique ocorreu em um elemento com a classe "movie-card"
            const index = clickedElement.getAttribute("data-index");
            showMovieDetails(index);
        } else if (clickedElement.tagName === "IMG" && clickedElement.closest(".movie-card")) {
            // Se o clique ocorreu em uma imagem dentro de um elemento com a classe "movie-card"
            const movieCard = clickedElement.closest(".movie-card");
            const index = movieCard.getAttribute("data-index");
            showMovieDetails(index);
        }
    });
    
    // Fecha a janela de detalhes do filme
    closeDetailsButton.addEventListener("click", () => {
    movieDetails.style.display = "none";
        
    });

    // Mostra a página de perfil do usuário quando o botão "Perfil" é clicado
    // profileButton.addEventListener('click', () => {
    //     // Redirecionar para a página de perfil do usuário (substituir a URL apropriada).
    //    // window.location.href = '!! COLOCAR O URL AQUI !!';
    // });

    // Filtra os filmes por gênero
    genreFilter.addEventListener('change', () => {
        const selectedGenre = genreFilter.value;
        if (selectedGenre === 'all') {
            renderMyList();
        } else {
            const filteredMovies = listaDeFilmes.filter(filme => filme.genero.includes(Number(selectedGenre)));
            renderMyList(filteredMovies);
        }
    });

    function renderMyList(filmes) {
        myList.innerHTML = "";
        (filmes || filmeFav).forEach((filme, index) => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.setAttribute("data-index", index);
            movieCard.innerHTML = `
                <img src="${filme.imagem_url}" alt="${filme.titulo}">
                <h3>${filme.titulo}</h3>
                <p class="remove-button">${filme.naMinhaLista ? 'Retirar da Minha Lista' : 'Adicionar à Minha Lista'}</p>
            `;
            myList.appendChild(movieCard);

            //remove o filme da Minha Lista
            movieCard.querySelector('.remove-button').addEventListener('click', () => {
                filmsFav[index].naMinhaLista = !filmeFav[index].naMinhaLista;
                filmsFav.splice(index,1);
                usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
                let usuarioCorrente;
                if (usuarioCorrenteJSON) {
                  usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
                  let likedMovies = usuarioCorrenteJSON.likedFilms;
                }
                usuarioCorrente.likedFilms = filmsFav;
                sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

                listaDeFilmes = getMovieData(filmsFav);
                renderMyList(listaDeFilmes);
            });
        });
    }

    function showMovieDetails(index) {
        movieImageDetails.src = filmeFav[index].imagem_url;
        movieTitle.textContent = filmeFav[index].titulo;
        movieDescription.textContent = filmeFav[index].descricao;
        movieDetails.style.display = 'flex';
    }
});
