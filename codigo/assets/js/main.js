import { getMoviesByName, getMoviesByImdbID, getMoviesWithFilters } from './services/fetchFunctions.js';
import { genres } from './tmdbGenres.js'
let currentPage = 1;

var db_usuarios = {};

// const catalog = document.getElementById('catalog');
const rowCatalog = document.getElementById('rowCatalog');
const botaoExpansao = document.getElementById("botao-expansao");
const botaoOrdena = document.getElementById('botao-ordena');
const botaoPrevPage = document.getElementById('prevPage');
const botaoNextPage = document.getElementById('nextPage');
const search = document.getElementById("pesquisar");

// Cria dinamicamente o checkbox dos filtros
const checkboxContainer1 = document.getElementById("checkBoxContainer1");
const checkboxContainer2 = document.getElementById("checkBoxContainer2");
for (const id in genres) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `opcao${id}`;
  checkbox.name = "opcoes";
  checkbox.value = id;

  const label = document.createElement("label");
  label.htmlFor = `opcao${id}`;
  label.textContent = genres[id];

  checkboxContainer1.appendChild(checkbox);
  checkboxContainer1.appendChild(label);

}

for (const id in genres) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `opcao${id}`;
  checkbox.name = "opcoes";
  checkbox.value = id;

  const label = document.createElement("label");
  label.htmlFor = `opcao${id}`;
  label.textContent = genres[id];


  checkboxContainer2.appendChild(checkbox);
  checkboxContainer2.appendChild(label);
}


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
const filterOptions = [
  {
    name: "genre",
    key: "genre",
    text: "Gênero"
  },
]
// Carrega o array de filmes de exemplo vindo do arquivo .json

async function fetchData() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=${currentPage}`, options);
  const data = await response.json();
  return data.results;
}

let films;

async function fetchFilms () {
  try {
    films = await fetchData();
    console.log(films);

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
}

// Função auxiliar para criar botões
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.classList.add('btn', 'btn-primary', 'mr-2', 'text-center');
  button.onclick = onClick;
  return button;
}

function renderFilms (movies) {
  rowCatalog.innerHTML = "";
  const larguraFixa = '200px'; // Define largura fixa para as imagens
  const alturaFixa = '300px'; // Define altura fixa para as imagens
  const arrayFilms = movies.length ? movies : films;
  arrayFilms.forEach(async (film) => {
    const div = document.createElement('div'); // Cria a div da coluna que vai envelopar a imagem e o subtítulo
    div.classList.add('col-md-3');
    div.classList.add('mb-3');

    const figureDiv = document.createElement('figure');
    figureDiv.classList.add('text-center');
    figureDiv.classList.add('card-film');

    const divImageAndCaption = document.createElement('div');

    divImageAndCaption.addEventListener('click', async () => {
      // Implemente a lógica que você deseja executar quando a div for clicada
      const response = await fetch(`https://api.themoviedb.org/3/movie/${film.id}?language=pt-BR`, options);
      const data = await response.json();
      console.log(data);
      // Neste exemplo, redirecionamos para a página do filme com base no ID do IMDB
      window.location.href = `../../pages/filmeIndividual.html?id=${data.imdb_id}`;
    });

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
    divImageAndCaption.appendChild(img)
    divImageAndCaption.appendChild(figureCaption)
    figureDiv.appendChild(divImageAndCaption);
    figureDiv.appendChild(likeButton);
    div.appendChild(figureDiv);

    // Adiciona todos os elementos criados a rowCatalog, presente no index.html
    rowCatalog.appendChild(div)
  })
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
  renderFilms(films);
  renderFilterOptions(films);
  search.addEventListener("input", async function(event) {
    event.preventDefault(); // Impede a recarga da página
    let searchTerm = search.value;
  
    // Deixa o termo todo em minúsculo, para não afetar a pesquisa
    searchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");
    console.log(searchTerm);
  
    // Faz uma cópia do array de filmes, para não alterar o array original na hora de filtrar
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1language=en-US&page=1`, options);
    const data = await response.json();
    console.log(data);
    const copyFilms = data.results;
    
    // Passa para a função que renderiza os filmes na página o novo array apenas com as correspondências
    renderFilms(copyFilms);
  })
  
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

