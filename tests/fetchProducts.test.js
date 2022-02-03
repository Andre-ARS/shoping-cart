require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  it('Deve ser uma função', () => {
    expect.assertions(1)
    expect(typeof fetchProducts).toBe('function');
  });

  it('Verifica se fetch() foi chamada', async () => {
    expect.assertions(1)
    await fetchProducts('computador');

    expect(fetch).toHaveBeenCalled()
  });

  it('Verifica se fetch() foi chamada com a url certa', async () => {
    expect.assertions(1)
    await fetchProducts('computador');

    expect(fetch).toHaveBeenCalledWith("https://api.mercadolibre.com/sites/MLB/search?q=computador")
  });

  it('Verifica se o retorno da função é o esperado', async () => {
    const response = await fetchProducts("computador");
    expect(response).toEqual(computadorSearch)
  });

  it('Verifica se a função lança erro esperado se o produto não for passado', async () => {
    const response = await fetchProducts();
    expect(response).toEqual(new Error('You must provide an url'))
  });
});
