import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface LotteryResult {
  listaDezenas: string[];
  contest: number;
}

interface LotteryContextProps {
  responses: LotteryResult[];
  allNumberArrays: string[][];
  resulContext: number;
}

export const LotteryContext = createContext<LotteryContextProps>({
  responses: [],
  allNumberArrays: [],
  resulContext: 0
});

export interface IProviderProps {
  children: ReactNode;
}

export const LotteryProvider = ({ children }: IProviderProps) => {
  const [responses, setResponses] = useState<LotteryResult[]>([]);
  const [allNumberArrays, setAllNumberArrays] = useState<string[][]>([]);

  const initial = 1; // Defina o valor inicial desejado
  const context = 2685; // Defina o valor do concurso desejado
  const lastNumber = 2681; // Defina o valor do ultimo concurso
  const resulContext = context - lastNumber; // Valor obtido da primeira volta

  function checkContest(contestNumber: number, results: LotteryResult[]) {
    const found = results.some((result) => result.contest === contestNumber);
    if (!found) {
      results.unshift({
        listaDezenas: [],
        contest: contestNumber,
      });
    }
  }

  useEffect(() => {
    // let retries: number = 4;
    const numbersMap: LotteryResult[] = [];
    const theBigArray: string[][] = [];
    // async function fetchNumbers() {
    //   for (let i = initial; i <= context; i++) {
    //     try {
    //       const { data } = await axios.get(
    //         `https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/${i}`
    //       );
    //       const newNumber = {
    //         listaDezenas: data.listaDezenas,
    //         contest: data.numero,
    //       };
    //       numbersMap.push(newNumber);
    //       checkContest(data.numero, numbersMap);
    //       theBigArray.push(data.listaDezenas);
    //     } catch (err) {
    //       if (retries <= 3) {
    //         retries++;
    //         await new Promise((resolve) => setTimeout(resolve, 400 * retries));
    //         i--;
    //       } else if (i >= lastNumber) {
    //         console.log('Erro ao buscar os números', err);
    //         numbersMap.push({
    //           listaDezenas: [],
    //           contest: i,
    //         });
    //         theBigArray.push(['00', '00', '00', '00', '00', '00']);
    //       }else{
    //         for (let j = 0; j < 10; j++) {
    //           const element = array[j];

    //         }
    //       }

    //     }
    //     if (i === context) break;
    //   }
    //   setResponses(numbersMap);
    //   setAllNumberArrays(theBigArray);
    // }

    async function fetchNumbers() {
      for (let i = initial; i <= context; i++) {
        try {
          const { data } = await axios.get(
            `https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/${i}`
          );
          const newNumber = {
            listaDezenas: data.listaDezenas,
            contest: data.numero,
          };
          numbersMap.push(newNumber);
          checkContest(data.numero, numbersMap);
          console.log(data.numero);
          theBigArray.push(data.listaDezenas);
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
      setResponses(numbersMap);
      setAllNumberArrays(theBigArray);
      // fs.writeFileSync('lotteryResults.json', JSON.stringify(numbersMap));
    }
    console.log(responses);

    fetchNumbers();
  }, [context, initial]);

  return (
    <LotteryContext.Provider value={{ responses, allNumberArrays, resulContext }}>
      {children}
    </LotteryContext.Provider>
  );
};

export default LotteryProvider;
