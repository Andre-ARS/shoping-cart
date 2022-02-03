require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
it('Deve ser uma função', () => {
    expect.assertions(1)
    expect(typeof fetchItem).toBe('function');
  });

  it('Verifica se fetch() foi chamada', async () => {
    expect.assertions(1)
    await fetchItem('MLB1615760527');

    expect(fetch).toHaveBeenCalled()
  });

  it('Verifica se fetch() foi chamada com a url certa', async () => {
    expect.assertions(1)
    await fetchItem('MLB1615760527');

    expect(fetch).toHaveBeenCalledWith("https://api.mercadolibre.com/items/MLB1615760527")
  });

  it('Verifica se o retorno da função é o esperado', async () => {
    const response = await fetchItem('MLB1615760527');
    expect(response).toEqual(item)
  });

  it('Verifica se a função lança erro esperado se o produto não for passado', async () => {
    const response = await fetchItem();
    expect(response).toEqual(new Error('You must provide an url'))
  });
});
