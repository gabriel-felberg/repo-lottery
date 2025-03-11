import fs from "fs";

function transformarNumerosEArmazenarJSON() {
  const initial = 1; // Defina o valor inicial desejado
  const context = 2809; // Defina o valor do concurso desejado
  const lastNumber = 2805; // Defina o valor do ultimo concurso
  const resulContext = context - lastNumber; // Valor obtido da primeira volta

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
    let theBigArray = [];
    const numbersMap = [];
    const newArrayOccurrences = []

    for (let i = initial; i <= context; i++) {
      try {
        const response = await fetch(`https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/${i}`, {
          method: "GET",
        });
        const data = await response.json();
        // console.log(data);
        const newNumber = {
          listaDezenas: data.listaDezenas,
          contest: data.numero,
        };
        numbersMap.push(newNumber);
        checkContest(data.numero, numbersMap);
        console.log(data.numero);
        theBigArray.push(data.listaDezenas);
        const turns = Array.from({ length: 596 }, (_, i) => i + resulContext);

        // function GetGroups(array) {
        //   const GroupArray = [];
        //   array?.forEach((e) => GroupArray.push(Math.ceil(+e / 5).toString()));
        //   return GroupArray;
        // }
        // function GetDifference(array) {
        //   const DifferenceArray = [];
        //   array?.forEach((e, i) => {
        //     if (typeof array[i + 1] === "string")
        //       DifferenceArray.push(Math.abs(+e - +array[i + 1]).toString());
        //   });
        //   return DifferenceArray;
        // }
        // function GetSum(array) {

        //   let SumArray = [];
        //   SumArray.push(array?.reduce((acc, cur) => (acc += +cur), 0).toString());
        //   SumArray.push(array?.reduce((acc, cur) => (acc += +cur[0]), 0).toString());
        //   SumArray.push(array?.reduce((acc, cur) => (acc += +cur[1]), 0).toString());
        //   SumArray.push(
        //     array?.reduce((acc, cur) => (acc += +cur[0] + +cur[1]), 0).toString()
        //   );
        //   return SumArray;
        // }
        function ResponseSumDifferenceAndGroups(
          array,
          turns
        ) {
          const results = [];

          for (let i = array?.length - 1; i > 0; i -= turns) {
            if (results?.length >= 16) break;
            const container = {
              numbers: ["", "", "", "", "", ""],
              // group: ["", "", "", "", "", ""],
              // difference: ["", "", "", "", ""],
              // sum: ["", "", "", ""],
              contest: array[i]?.contest,
            };

            container.numbers = array[i]?.listaDezenas;
            // container.group = GetGroups(array[i]?.listaDezenas);
            // container.difference = GetDifference(array[i]?.listaDezenas);
            // container.sum = GetSum(array[i]?.listaDezenas);
            if (container.numbers) {

              if (container.numbers[0] !== "") {
                results.push(container);
                // results.push(array[i]?.listaDezenas)
                // results.push(array[i]?.contest)

              }
            }
            // else{
            // results.push(["", "", "", "", "", ""])
            // }

          }

          return results;
        }

        const Occurrences = turns?.map((turn) => ({
          // turn,
          result: ResponseSumDifferenceAndGroups(numbersMap, turn),
        }));
        newArrayOccurrences.push(Occurrences);
      } catch (err) {
        if (i > lastNumber) {
          console.log("Erro ao buscar os números", err);
          numbersMap.push({
            listaDezenas: [],
            contest: i,
          });
          // theBigArray.push(["00", "00", "00", "00", "00", "00"]);
          i++;
        }

        i -= 1;
      }
      if (i === context) break;
    }

    fs.writeFileSync('lotteryResults.json', JSON.stringify(numbersMap));

    let results = [];

    for (let i = 0; i <= theBigArray.length; i++) {
      let result = theBigArray[i].map(e => Math.ceil(Number.parseInt(e) / 5))
      // console.log(JSON.stringify(result))
      if (JSON.stringify(result) === "[1,2,3,4,5,6]" ||JSON.stringify(result) === "[1,3,5,7,9,11]" || JSON.stringify(result) === "[2,4,6,8,10,12]" || JSON.stringify(result) === "[7,8,9,10,11,12]") {
        console.log(theBigArray[i], result, i)
      }
    }

    WriteJson("allResults", theBigArray)

    theBigArray = theBigArray.reverse();

    for (let i = resulContext; i <= 600 - (resulContext + 1); i += 1) {
      let subArray = [];
      for (let j = i; j <= theBigArray?.length; j += i) {
        subArray.push(theBigArray[j - 2]);
      }
      results.push(subArray);
    }

    // WriteJson("allResults", theBigArray)
    WriteJson("TEST", results)


    let subConjunto = []
    let conjuntos = []

    results?.forEach((e) => {
      let arr = []
      e?.forEach((numArr) => {
        if (arr?.length <= 38) {
          numArr?.forEach((num) => {
            if (!arr.includes(num)) {
              arr.push(num);
            }
          });
        }
      });
      if (arr?.length >= 38) {
        conjuntos.push(arr);
      }
    });

    let miniConjuntos = [];

    results?.forEach((e) => {
      let arr = []
      e?.forEach((numArrMiniConjuntos) => {
        if (arr?.length <= 18) {
          numArrMiniConjuntos?.forEach((num) => {
            if (!arr.includes(num)) {
              arr.push(num);
            } else {
              arr = []
              return
            }
          });
        }
      });
      if (arr?.length === 18) {
        miniConjuntos.push(arr);
      }
    });

    for (let i = 0; i < results?.length; i++) {
      let arr = [];
      for (let j = 0; j < results[i]?.length; j++) {
        let numArrConjunto = results[i][j];
        if (arr?.length <= 18) {
          for (let k = 0; k < numArrConjunto?.length; k++) {
            // console.log(numArr);
            let num = numArrConjunto[k];
            if (!arr?.includes(num)) {
              arr?.push(num);
            } else {
              arr = [];
              break;
            }
          }
        }
      }
      if (arr?.length === 18) {
        miniConjuntos.push(arr);
      }
    }

    conjuntos.forEach((e) => {
      let arr = []
      for (let i = 1; i <= 60; i++) {
        if (!e.includes(i.toString().padStart(2, '0'))) {
          arr.push(i.toString().padStart(2, '0'))
        }
      }
      subConjunto.push(arr)
    })
    // console.log(conjuntos[0])
    // console.log(subConjunto[0])



    // WriteJson("TEST_number",  numbersMap)
    // WriteJson("allResults", theBigArray)
    // WriteJson("TEST_new",  newArrayOccurrences)
    // WriteJson("TEST", results)
    WriteJson("conjuntos", conjuntos)
    WriteJson("subConjuntos", subConjunto)
    WriteJson("miniConjuntos", miniConjuntos)
    // console.log(results);


    function WriteJson(name, arr) {

      const jsonString = JSON.stringify(arr, null, 1);

      // Passo 4: Escrever o JSON em um arquivo
      fs.writeFile(`src/${name}.json`, jsonString, "utf-8", (err) => {
        if (err) {
          console.error("Erro ao escrever o arquivo:", err);
          return;
        }
        console.log("Arquivo foi salvo com sucesso!");
      });
    }
  }

  fetchNumbers();

}
transformarNumerosEArmazenarJSON()