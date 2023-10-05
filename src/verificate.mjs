import jsonx from "../resultado.json"
console.log(jsonx)


function verificarIgualdade(arrayDeArrays) {
    const tamanho = arrayDeArrays.length;
    
    for (let i = 0; i < tamanho; i++) {
      for (let j = i + 1; j < tamanho; j++) {
        if (arrayDeArrays[i].every(str => arrayDeArrays[j].includes(str))) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Exemplo de uso
  const arrayDeArrays = [
    ['foo', 'bar', 'baz', 'qux', 'quux'],
    ['bar', 'quux', 'qux', 'baz', 'foo'],
    ['quux', 'foo', 'baz', 'qux', 'bar'],
    ['baz', 'bar', 'quux', 'qux', 'foo'],
    ['foo', 'baz', 'qux', 'bar', 'quux']
  ];
  
  console.log(verificarIgualdade(jsonx));