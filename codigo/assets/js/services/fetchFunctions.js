/**
 * Obtém o poster de um filme com base no ID do filme usando uma API externa.
 * Retorna a URL do poster do filme.
 *
 * @param {string} id - O ID do filme para o qual deseja obter o poster.
 * @returns {Promise<string>} - Uma promessa que resolve com a URL do poster do filme ou uma string vazia se não for encontrado.
 */

const getMoviePoster = async (id) => {
  const url = `https://moviesdatabase.p.rapidapi.com/titles/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '27275e5a9cmshe0ae42986655ad3p13431bjsn13fe85d6b627',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const {results} = await response.json();
    // console.log('Pegango Img',results.primaryImage.url);
    return results.primaryImage.url;
  } catch (error) {
    console.error(error);
    return '';
  }
}

/**
 * Adiciona os posters dos filmes a um array de objetos filmes.
 * Para cada filme no array, chama a função `getMoviePoster` para obter o poster do filme.
 * Os posters são adicionados como propriedades 'image' em cada objeto de filme no array.
 *
 * @param {Array<Object>} movies - Um array de objetos de filme.
 * @returns {Promise<Array<Object>>} - Uma promessa que resolve com o array de filmes atualizado com os posters ou um array vazio em caso de erro.
 */

export const addPoster2Movies = async (movies) => {
  for(let i = 0; i < movies.length; i++) {
    const urlImage = await getMoviePoster(movies[i].imdbId);
    movies[i].image = urlImage;
  }
  // console.log('Movies:', movies);
  return movies;
}

/**
 * Pesquisa por filmes com base em um termo específico no título.
 * Ela retorna um array de objetos que descrevem os filmes encontrados,
 * @param {string} name - O termo a ser pesquisado no título dos filmes.
 * @returns {Promise<Array<Object>>} - Uma promessa que retorna um array de objetos contendo informações sobre os filmes encontrados.
 */

export const getMoviesByName = async (name) => {
  const url = `https://streaming-availability.p.rapidapi.com/search/title?title=${name}&country=br&show_type=all&output_language=en`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '27275e5a9cmshe0ae42986655ad3p13431bjsn13fe85d6b627',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const {result} = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

/**
* Pesquisa por filmes com base em um ID IMDB específico.
* Ela retorna um objeto que descreve o filme encontrado com base no ID IMDB fornecido.
* @param {string} id - O ID IMDB do filme a ser pesquisado.
* @returns {Promise<Object>} - Uma promessa que retorna um objeto contendo informações sobre o filme encontrado.
*/

export const getMoviesByImdbID = async (id) => {
  const url = `https://streaming-availability.p.rapidapi.com/get?output_language=en&imdb_id=${id}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '27275e5a9cmshe0ae42986655ad3p13431bjsn13fe85d6b627',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const {result} = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Pesquisa por filmes com base em diversos filtros e parâmetros.
 * Ela retorna um objeto que contém informações sobre os filmes encontrados de acordo com os filtros especificados.
 * @param {string} options.keyword - Palavra-chave para a pesquisa (padrão: '').
 * @param {number} options.yearMax - Ano máximo de lançamento (padrão: null).
 * @param {number} options.yearMin - Ano mínimo de lançamento (padrão: null).
 * @param {string[]} options.genres - Lista de gêneros para filtrar, precisa ser baseado nos numeros dos generos descritos na variavel genres (padrão: []).
 * @param {string} options.typeOfFilter - Tipo de filtro a ser aplicado ( so aceita 'and' ou 'or', padrão: 'and').
 * @param {string} options.showType - Tipo de exibição (so aceita 'movie', 'series', 'all', padrão: 'all').
 * @returns {Promise<Array<Object>>} - Uma promessa que retorna um objeto contendo informações sobre os filmes encontrados de acordo com os filtros.
 * 
 * exemplo de uso: getMoviesWithFilters({ keyword:'Batman', genres:[16,12], yearMin:2020})
 * ira retornar um array de objetos com os filmes com 'Batman' no titulo, de generos de Animacao E Aventura que foram lancados apartir de 2020
 */

export const getMoviesWithFilters = async ({
  keyword = '',
  yearMax = null,
  yearMin = null,
  genres = [],
  typeOfFilter = 'and',
  showType = 'all',

  } = {}) => {
    // Monta a url apartir dos parametros passados, caso existam
    let movies = [];
    let url = 'https://streaming-availability.p.rapidapi.com/search/filters?services=prime.subscription%2Chbo%2Cnetflix&country=br';
    if(keyword) {
      url += `&keyword=${keyword}`;
    }
    url += `&output_language=en`;
    if(yearMax) {
      url += `&year_max=${yearMax}`;
    }
    url += `&order_by=original_title`;
    if(genres.length > 0) {
      let text = `${genres[0]}`;
      for(let i = 1; i < genres.length; i++) {
        text += `%2C${genres[i]}`;
      }
      url += `&genres=${text}`;
    }
    if(typeOfFilter) {
      url += `&genres_relation=${typeOfFilter}`;
    }
    if(yearMin) {
      url += `&year_min=${yearMin}`;
    }
    if(showType) {
      url += `&show_type=${showType}`;
    }

    let options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '27275e5a9cmshe0ae42986655ad3p13431bjsn13fe85d6b627',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options);
      const {result} = await response.json();
      movies = result
    } catch (error) {
      console.error(error);
      return [];
    }
  return movies;    
}

/**
 * Pesquisa os lancamentos futuros de filmes no brasil usando a API do tmdb.
 * Ela retorna um objeto que contém informações sobre os filmes encontrados de acordo com os filtros de genero especificados.
 * @param {string[]} options.genres - Lista de gêneros para filtrar, precisa ser baseado nos numeros dos generos descritos na variavel genres (padrão: []).
 * @returns {Promise<Array<Object>>} - Uma promessa que retorna um objeto contendo informações sobre os filmes encontrados de acordo com os filtros.
 * 
 * exemplo de uso: getUpcomingMovies({ genres:[16,12] })
 * ira retornar um array de objetos com os lancamentos de generos de Animacao E Aventura
 */

export const getUpcomingMovies = async ({
  genres = [],
  } = {}) => {

    let movies = [];
    
    const urlTMDB = 'https://api.themoviedb.org/3/movie/upcoming?language=pt-BR&page=1&region=BR&external_source=imdb_id';
    const optionsTMDB = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjhiYzNlMDE3ZmU5MDVjYWMxOTg5NmMwZDY4ZTk2MCIsInN1YiI6IjY1MmVlZWFhMGNiMzM1MTZmNjQwN2Q3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LKP2asLbQUo_of8JRAw5sssiMKK6Du7CD7bRgDk7Fk'
      }
    };

    // Tenta realizara requisicao e retorna o erro caso falhe
    try {
      const response = await fetch(urlTMDB, optionsTMDB);
      const {results} = await response.json();
      console.log(results);
      movies = results
      // console.log(movies);
    } catch (error) {
      console.error(error);
      return [];
    }

    // console.log('Nao filtrados', movies);
    // console.log('genres', genres);
    if (genres.length != 0) {
      const filtredMovies = movies.filter(e => e.genre_ids.some(id => genres.includes(id)));
      return filtredMovies;  
    }
  
  return movies;    
}