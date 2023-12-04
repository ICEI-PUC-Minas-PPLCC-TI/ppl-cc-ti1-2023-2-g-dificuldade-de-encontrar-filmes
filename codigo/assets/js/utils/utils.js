// Funcao auxiliar que aleatoriza um determinado numero de objetos de um array e os retorna
export const selectRandomObjects = (arr, size) => {
  const copyArr = [...arr];
  // Embaralhe o array copiado
  for (let i = copyArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyArr[i], copyArr[j]] = [copyArr[j], copyArr[i]];
  }
  const selectedObjects = copyArr.slice(0, size);

  return selectedObjects;
}
