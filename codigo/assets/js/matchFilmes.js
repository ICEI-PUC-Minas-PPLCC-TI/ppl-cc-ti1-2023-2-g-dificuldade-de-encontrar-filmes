// import { getMoviesByName, getMoviesByImdbID, getMoviesWithFilters } from './services/fetchFunctions.js';
// import { genres } from './tmdbGenres.js'

const catalog = document.getElementById('catalog');
const rowCatalog = document.getElementById('rowCatalog');
const botaoExpansao = document.getElementById("botao-expansao");
const botaoOrdena = document.getElementById('botao-ordena');
const botaoPrevPage = document.getElementById('prevPage');
const botaoNextPage = document.getElementById('nextPage');
const search = document.getElementById("pesquisar");
const botaoSearchProfile = document.getElementById('searchProfile');
let currentPage = 1;

// Lógica de conexão com a api, ainda não implementada, implementar na sprint 3
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDEwYzE1MmU5YTgxMmFiNTkxMWMxNTcxZTE2YzVmMSIsInN1YiI6IjY1MzU5ZjFjYzhhNWFjMDBhYzM5NTU1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zic9T4hGPlYWCj_WjJwBHSzMPnGE8vqJOQdROzuMAqI'
  }
};
const YOUR_API_KEY = '1d10c152e9a812ab5911c1571e16c5f1';

// Arquivo de filters de exemplo

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

// async function fetchGenres() {
//   const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
//   const data = await response.json()
//   return data.genres;
// }

async function fetchData() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${currentPage}`, options);
  const data = await response.json();
  return data.results;
}

let films;

async function fetchFilms () {
  try {
    films = await fetchData();

    // Só após carregados os filmes a lógica é implementada
    main();
  } catch (e) {
    console.log(e);
  }
}

// Função executada para carregar os filmes
fetchFilms();


// Funções
// Envia formulario com of filtros da requisicao
const filterSubmit = (event) => {
    event.preventDefault(); // Evitar o envio do formulário padrão
  
    // Resgata valores do DOM caso existam, se nao passa valores padroes
    const formulario = document.getElementById('filtersForm');
    const keyword = document.getElementById('keyword').value ? document.getElementById('keyword').value : '';
    const selected = Array.from(document.querySelectorAll('input[name="opcoes"]:checked')).map(input => Number(input.value));
    const genres = selected ? selected : [];
    const yearMax = document.getElementById('maxYear').value ? document.getElementById('maxYear').value : null;
    const yearMin = document.getElementById('minYear').value ? document.getElementById('minYear').value : null;
    const typeFilter = document.querySelector(`input[name="typeFilter"]:checked`).value;
    const typeShow = document.querySelector(`input[name="typeShow"]:checked`).value;
  
    // Cria obj com os valores e passa para o LocalStorage, para ser acessado nas outras paginas
    const filterRequest = {
      keyword: keyword,
      yearMax: yearMax,
      yearMin: yearMin,
      genres: genres,
      typeOfFilter: typeFilter,
      showType: typeShow,
    }
    localStorage.setItem('filterRequest', JSON.stringify(filterRequest));
  
    // Redireciona para a nova pagina
    window.location.href = '/pages/filmesSugeridos.html';
  }
  
  // Envia formulario com os generos para redirecionamento dos filmes futuros
  const genresSubmit = (event) => {
    event.preventDefault(); // Evitar o envio do formulário padrão
  
    // Resgata valores do DOM caso existam, se nao passa valores padroes
    const selected = Array.from(document.querySelectorAll('input[name="opcoes"]:checked')).map(input => Number(input.value));
    const genres = selected ? selected : [];
  
    // Cria obj com os valores e passa para o LocalStorage, para ser acessado nas outras paginas
    const upcomingRequest = {
      genres: genres,
    }
    localStorage.setItem('upcomingRequest', JSON.stringify(upcomingRequest));
  
    // Redireciona para a nova pagina
    window.location.href = '/pages/filmesFuturos.html';
  }
  const filtersForm = document.getElementById('filtersForm');
  const genresForm = document.getElementById('genresForm');
  const openRecomendation = document.getElementById('openMovieRecomendation');
  const closeRecomendation = document.getElementById('closeMovieRecomendation');
  const openUpcoming = document.getElementById('openUpcoming');
  const closeUpcoming = document.getElementById('closeUpcoming');
  
  // Adicione um manipulador de evento ao formulário
  filtersForm.addEventListener('submit', filterSubmit);
  
  // Adicione um manipulador de evento ao formulário
  genresForm.addEventListener('submit', genresSubmit);
  
  // Gerencia abetura do modal dos botoes
  openRecomendation.addEventListener('click', () => { document.getElementById('recomendationForm').style.display = "block" });
  closeRecomendation.addEventListener('click', () => { document.getElementById('recomendationForm').style.display = "none" });
  openUpcoming.addEventListener('click', () => { document.getElementById('upcomingForm').style.display = "block" });
  closeUpcoming.addEventListener('click', () => { document.getElementById('upcomingForm').style.display = "none" });
  
  /*
    Função que renderiza as opções do select de recomendação, baseado nos dados pré existentes
    no array de filmes
  */


// Arquivo de filters de exemplo
const filterOptions = [
  {
    name: "genre",
    key: "genre",
    text: "Gênero"
  },
]

// // Carrega o array de filmes de exemplo vindo do arquivo .json

// async function fetchData() {
//   const response = await fetch('../films.json');
//   const data = await response.json();
//   return data;
// }

// let films;

// async function fetchFilms () {
//   try {
//     films = await fetchData();

//     // Só após carregados os filmes a lógica é implementada
//     // main();
//   } catch (e) {
//     console.log(e);
//   }
// }

// // Função executada para carregar os filmes
// fetchFilms();
const profiles = [
  {
      "films": []
  }, {
    "films": [
      {
          "id": 1075794,
          "title": "Leo",
          "genre_ids": [28],
          "cover": "./covers/d1.jpeg"
      },
      {
          "id": 901362,
          "title": "Trolls",
          "genre_ids": [28, 16],
          "cover": "./covers/download.jpeg"
      },
      {
          "title": "Besouro Azul",
          "genre_ids": [27],
          "cover": "./covers/images.jpeg"
      },
      {
        "title": "Terrifier",
        "genre_ids": [27],
        "cover": "./covers/terrifier_2_poster_oficial.jpg"
    },
    {
        "title": "Casa Gucci",
        "genre_ids": [18, 27],
        "cover": "./covers/casa-gucci.jpg"
    }
    ]
  }
];

// // Funções

/*
  Função que renderiza as opções do select de recomendação, baseado nos dados pré existentes
  no array de filmes
*/
function renderFilterOptions(films){
  const filtrosSelect = document.getElementById("filtros");

  filterOptions.forEach((item, index) => {
    const select = document.createElement('select');
    select.id = item.key;
    select.name = item.text;

    if (index === 0) {
      const optionPadrao = document.createElement("option");
      optionPadrao.text = "Selecione uma opção";
      optionPadrao.value = null;
      select.appendChild(optionPadrao);
    }

    for (const id in genres) {
      const option = document.createElement("option");
      option.text = genres[id];
      option.value = id;
      select.appendChild(option);
    }

    filtrosSelect.appendChild(select);
  })

}

async function filterFilms(filterValue, filterKey) {
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc&with_genres=${filterValue}`, options);
  const data = await response.json();
  const copyFilms = data.results;
  renderFilms(copyFilms);
}

// Função de comparação personalizada com base na propriedade selecionada
function compararFilmes(propriedade) {
  return function(a, b) {
    if (a[propriedade] < b[propriedade]) {
      return -1;
    }
    if (a[propriedade] > b[propriedade]) {
      return 1;
    }
    return 0;
  };
}

function ordernaFilms(key) {
  const copyFilms = films.sort(compararFilmes(key));
  renderFilms(copyFilms);
}

// Função auxiliar para criar botões
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.classList.add('btn', 'btn-primary', 'mr-2');
  button.onclick = onClick;
  return button;
}

function renderFilms (movies) {
  rowCatalog.innerHTML = "";
  const larguraFixa = '200px'; // Define largura fixa para as imagens
  const alturaFixa = '300px'; // Define altura fixa para as imagens
  const arrayFilms = movies.length ? movies : films;
  arrayFilms.forEach((film) => {
    const div = document.createElement('div'); // Cria a div da coluna que vai envelopar a imagem e o subtítulo
    div.classList.add('col-md-3');
    div.classList.add('mb-3');

    const figureDiv = document.createElement('figure');
    figureDiv.classList.add('text-center');
    figureDiv.classList.add('card-film');

    const figureCaption = document.createElement('figcaption');
    figureCaption.textContent = film.title;
    figureCaption.classList.add("text-light")

    const posterPath = film.poster_path;

    const posterUrl = `https://image.tmdb.org/t/p/w500/${posterPath}`;
    const img = document.createElement('img');
    img.src = posterUrl;
    img.style.width = larguraFixa;
    img.style.height = alturaFixa;
    img.classList.add('img-fluid');
    const likeButton = createButton('Curtir', () => likeFilm(film.title));

    // Agora por ordem, adiciona os elementos filhos aos elementos pais correpondentes
    figureDiv.appendChild(img)
    figureDiv.appendChild(figureCaption);
    figureDiv.appendChild(likeButton);
    div.appendChild(figureDiv);

    // Adiciona todos os elementos criados a rowCatalog, presente no index.html
    rowCatalog.appendChild(div)
  })
}

function likeFilm(nome) {
  let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
  let usuarioCorrente;
  if (usuarioCorrenteJSON) {
    usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
  }

  films.forEach((f) => {
    if (f.title === nome) {
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
            console.log(`Filme "${nome}" removido com sucesso.`);
        } else {
            console.log(`Filme "${nome}" não encontrado no array.`);
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
  profiles[0].films = usuarioCorrente.likedFilms; 
}


let usuarioCorrenteAtualJSON = sessionStorage.getItem('usuarioCorrente');
let usuarioCorrenteAtual;
if (usuarioCorrenteAtualJSON) {
  usuarioCorrenteAtual = JSON.parse (usuarioCorrenteAtualJSON);
}
profiles[0].films = usuarioCorrenteAtual.likedFilms;

function searchProfile(login) {
  console.log(login);
  const db_usuariosJSON = localStorage.getItem('db_usuarios');
  let db_usuarios;
  if (db_usuariosJSON) {
    console.log('asd')
    db_usuarios = JSON.parse(db_usuariosJSON);
  }
  console.log(db_usuarios.usuarios);
  
  const usuario = db_usuarios.usuarios.find((u) => u.login === login);
  console.log(usuario);
  if (usuario) {
    profiles[1].films = usuario.likedFilms;
    alert('Perfil encontrado! Clique em gerar recomendações para dar match.');

  } else {
    alert('Perfil não encontrado ;(. Confira novamente se o login informado está correto.');
  }

}

function encontrarGeneroMaisCurtido(usuario) {
  const filmesCurtidos = usuario.films;

  // Criar um objeto para contar a ocorrência de cada gênero
  const contagemGeneros = {};
  filmesCurtidos.forEach(filme => {
    filme.genre_ids.forEach((genre) => {
      const genreName = genres[genre];
      count = (contagemGeneros[genres[genre]]?.count || 0) + 1;
      contagemGeneros[genres[genre]] = {id: genre, count };
    })
  });

  // Converter o objeto em um array de objetos { genre, count }
  const generosComContagem = [];

  for (const id in contagemGeneros) {
    generosComContagem.push({ count: contagemGeneros[id].count, id_genre: contagemGeneros[id].id });
  }

  // Ordenar o array com base na contagem (do mais curtido para o menos curtido)
  generosComContagem.sort((a, b) => b.count - a.count);
  console.log(generosComContagem);
  // Pegar o gênero mais curtido

  if (generosComContagem && generosComContagem.length) {
    const generoMaisCurtido = generosComContagem[0].id_genre;

    // Retorna o id do gênero mais curtido
    return generoMaisCurtido;
  }

  return -1;
}


function renderRecommendedFilms () {
  if (!profiles.length) {
    throw 'Sem perfis';
  }

  const filmesUsuario1 = profiles[0].films.map(filme => filme.genre_ids);
  const filmesUsuario2 = profiles[1].films.map(filme => filme.genre_ids);

  // Concatenar os arrays de gêneros dos dois usuários
  const todosGeneros = filmesUsuario1.concat(filmesUsuario2);

  // Criar um objeto para contar a ocorrência de cada gênero
  const contagemGeneros = {};
  todosGeneros.forEach(genero => {  
      contagemGeneros[genero] = (contagemGeneros[genero] || 0) + 1;
  });

  // Calcular a média da contagem de gêneros
  const mediaContagem = Object.values(contagemGeneros).reduce((soma, contagem) => soma + contagem, 0) / todosGeneros.length;

  // Calcular o desvio padrão
  const desvioPadrao = Math.sqrt(
      Object.values(contagemGeneros).reduce((soma, contagem) => soma + Math.pow(contagem - mediaContagem, 2), 0) / todosGeneros.length
  );


  // Filtrar os gêneros que têm uma contagem acima da média + 1 desvio padrão
  const generosMaisComuns = Object.keys(contagemGeneros).filter(
      genero => contagemGeneros[genero] > mediaContagem + desvioPadrao
  );
  console.log(contagemGeneros);
  console.log(generosMaisComuns);
  
  const mostLikedGenre = encontrarGeneroMaisCurtido(profiles[0]);
  const mostLikedGenre2 = encontrarGeneroMaisCurtido(profiles[1]);

  const genresToFilter = [];
  if (mostLikedGenre) genresToFilter.push(mostLikedGenre);
  if (mostLikedGenre2) genresToFilter.push(mostLikedGenre2);
  if (generosMaisComuns.length) {
    generosMaisComuns.forEach((g) => {
      genresToFilter.push(g);
    })
  }

  const movies = new Set();
  genresToFilter.forEach((g) => {
    let count = 0;
    films.forEach((f) => {
      if (count <= 10) {
        if (f.genre_ids.includes(+g)) movies.add(f);
        count++;
      }
    })
  })

  const filmesEmComum = filmesUsuario1.filter(filme => filmesUsuario2.includes(filme));

  if (filmesEmComum.length) {
    let count = 0;
    filmesEmComum.forEach((f) => {
      if (count < 10) {
        movies.add(f);
      }
    })
  }
  const arrayMovies = Array.from(movies);
  arrayMovies.forEach((i, index) => {
    if (typeof(i) !== 'object') {
      // Remove o filme do array
      arrayMovies.splice(index, 1);
    }
  })
  renderFilms(arrayMovies);
  renderFilterOptions(arrayMovies);
}

async function previousPage() {
    if (currentPage != 1) {
      currentPage--;
    }
  
    const currentPageHTML = document.getElementById('currentPage');
    currentPageHTML.textContent = `Página ${currentPage}`;
    console.log(currentPage);
  
    botaoPrevPage.disabled = true; // Desativa o botão durante a solicitação
    await fetchFilms();
    botaoPrevPage.disabled = false; // Ativa o botão após a conclusão da solicitação
  
  }
  
async function nextPage() {
  currentPage++;
  console.log(currentPage);

  const currentPageHTML = document.getElementById('currentPage');
  currentPageHTML.textContent = `Página ${currentPage}`;

  botaoNextPage.disabled = true; // Desativa o botão durante a solicitação
  await fetchFilms();
  botaoNextPage.disabled = false; // Ativa o botão após a conclusão da solicitação
}

function main() {
  // Sempre executado (main)
  renderFilterOptions(films);
  // search.addEventListener("input", async function(event) {
  //   event.preventDefault(); // Impede a recarga da página
  // })
  
  botaoExpansao.addEventListener("click", function() {
    if (filtros.style.display === "none") {
      filtros.style.display = "block";
      botaoExpansao.textContent = "Ocultar Filtros";
    } else {
      filtros.style.display = "none";
      botaoExpansao.textContent = "Expandir Filtros";
    }
  });
  
  botaoOrdena.addEventListener("click", function() {
    if (ordena.style.display === "none") {
      ordena.style.display = "block";
      botaoOrdena.textContent = "Ocultar";
    } else {
      ordena.style.display = "none";
      botaoOrdena.textContent = "Ordenar";
    }
  });
  
  const selectElement = document.getElementById('genre');
    
  selectElement.addEventListener("change", function() {
    const selected = selectElement.value;
    const selectedKey = selectElement.key;
    filterFilms(selected, selectedKey);
  });
  
  const selectOrdena = document.getElementById('ordenacao');
  selectOrdena.addEventListener("change", function() {
    const selected = selectOrdena.value;
    const selectedKey = selectOrdena.key;
    ordernaFilms(selected, selectedKey);
  });
}

botaoPrevPage.addEventListener("click", async function() {
await previousPage();
});

botaoNextPage.addEventListener("click", async function() {
await nextPage();
})

botaoSearchProfile.addEventListener("click", async function() {
  const searchTerm = document.getElementById('userSearch').value;
  searchProfile(searchTerm);
})