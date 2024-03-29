import fetch from "node-fetch"; // Desativar verificação de certificado SSL
import fs from "fs";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function transformarNumerosEArmazenarJSON() {
  const initial = 1; // Defina o valor inicial desejado
  const context = 2670; // Defina o valor do concurso desejado
  const lastNumber = 2664; // Defina o valor do ultimo concurso

  function checkContest(contestNumber, results) {
    const found = results.some((result) => result.contest === contestNumber);
    if (!found) {
      results.unshift({
        listaDezenas: [],
        contest: contestNumber,
      });
    }
  }

  async function fetchNumbers() {
    const theBigArray = [];
    const numbersMap = [];

    for (let i = initial; i <= context; i++) {
      try {
        const response = await fetch(`https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/${i}`, {
          method: "GET",
        });
        console.log(response);

        if (response.ok) {
          const data = await response.json();
          const newNumber = {
            listaDezenas: data.listaDezenas,
            contest: data.numero,
          };
          numbersMap.push(newNumber);
          checkContest(data.numero, numbersMap);
          console.log(newNumber);
          console.log(numbersMap.length);

          theBigArray.push(data.listaDezenas);
        } else {
          if (i > lastNumber) {
            console.log("Erro ao buscar os números");
            numbersMap.push({
              listaDezenas: [],
              contest: i,
            });
            theBigArray.push(["00", "00", "00", "00", "00", "00"]);
            i++;
          }
  
          console.log(i);
  
          i -= 1;
          // console.log(err);
  
          console.log(i);
        }
        
      } catch (err) {
        if (i > lastNumber) {
          console.log("Erro ao buscar os números", err);
          numbersMap.push({
            listaDezenas: [],
            contest: i,
          });
          theBigArray.push(["00", "00", "00", "00", "00", "00"]);
          i++;
        }

        console.log(i);

        i -= 1;
        console.log(err);

        console.log(i);
      }

      if (i === context) break;
    }

    // Passo 1: Converter as strings em números e diminuir pelo número posterior
    let numerosDiminuidos = theBigArray.map((arrayDeStrings) => {
      return arrayDeStrings.map((string, index, array) => {
        const numeroAtual = Number(string);
        const numeroPosterior = Number(array[index + 1]) || 0; // Se for o último número, assume 0
        return (numeroAtual - numeroPosterior)*(-1);
      });
    });

    // Passo 2: Obter apenas os 5 primeiros números de cada subarray
    let resultadoArrays = numerosDiminuidos.map((numerosDiminuidosSubarray) => {
      return numerosDiminuidosSubarray.slice(0, 5);
    });

    // Passo 3: Converter o array em uma string JSON
    const jsonString = JSON.stringify(numbersMap);

    // Passo 4: Escrever o JSON em um arquivo
    fs.writeFile("src/sextetos2.json", jsonString, "utf8", (err) => {
      if (err) {
        console.error("Erro ao escrever o arquivo:", err);
        return;
      }
      console.log("Arquivo foi salvo com sucesso!");
    });
  }

  fetchNumbers();
}

transformarNumerosEArmazenarJSON();

// import megaJob from "../../megaJob.json"

// function GenerateAndWriteJson() {
//     function Factorial(factorial:number) {
//         let result = factorial
//         for (let i = 1; i < factorial; i++) {
//             result *= i
//         }
//         return result
//     }
//     function GeneratePossibilities(numbers:number, cases:number) {
//         const possibilities = Factorial(numbers)/(Factorial(cases)*Factorial(numbers-cases))
//         let arr: string[] = []
//         for (let i = 0; i < array.length; i++) {

//         }
//         return possibilities
//     }
//     function permutate(numbers: number[], size: number): number[][] {
//         const results: number[][] = [];

//         function permuteUtil(numbers: number[], permutation: number[], size: number): void {
//           if (permutation.length === size) {
//             results.push([...permutation]);
//             return;
//           }

//           for (let i = 0; i < numbers.length; i++) {
//             const current = numbers[i];
//             if (!permutation.includes(current)) {
//               permutation.push(current);
//               permuteUtil(numbers, permutation, size);
//               permutation.pop();
//             }
//           }
//         }

//         permuteUtil(numbers, [], size);
//         return results;
//       }

//       const numbers: number[] = Array.from({length:60},(_,i)=> (i+1));
//       const combinations: number[][] = permutate(numbers, 6);

//       console.log(combinations);
//       console.log("Total de combinações:", combinations.length);
// }

// const fs = require('fs');

// const data = {
//   key1: 'value1',
//   key2: 'value2',
//   key3: 'value3'
// };

// const jsonData = JSON.stringify(data, null, 2);

// fs.writeFile('data.json', jsonData, 'utf8', (err) => {
//   if (err) {
//     console.error('Erro ao escrever o arquivo JSON:', err);
//     return;
//   }

//   console.log('Arquivo JSON foi escrito com sucesso!');
// });
