import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface LotteryResult {
  listaDezenas: string[];
  contest: number;
}

interface LotteryContextProps {
  responses: LotteryResult[];
  allNumberArrays: string[][];
}

export const LotteryContext = createContext<LotteryContextProps>({
  responses: [],
  allNumberArrays: [],
});

export interface IProviderProps {
  children: ReactNode;
}

export const LotteryProvider = ({ children }: IProviderProps) => {
  const [responses, setResponses] = useState<LotteryResult[]>([]);
  const [allNumberArrays, setAllNumberArrays] = useState<string[][]>([]);

  const initial = 1; // Defina o valor inicial desejado
  const context = 2650; // Defina o valor do concurso desejado

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
    let retries: number = 0;
    const numbersMap: LotteryResult[] = [];
    const theBigArray: string[][] = [];

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
          theBigArray.push(data.listaDezenas);
        } catch (err) {
          if (retries <= 3) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 400 * retries));
            i--;
          } else {
            console.log('Erro ao buscar os números', err);
            numbersMap.push({
              listaDezenas: [],
              contest: i,
            });
            theBigArray.push(['00', '00', '00', '00', '00', '00']);
          }
        }
        if (i === context) break;
      }
      setResponses(numbersMap);
      setAllNumberArrays(theBigArray);
    }
    console.log(responses)

    fetchNumbers();
  }, [context, initial]);

  return (
    <LotteryContext.Provider value={{ responses, allNumberArrays }}>
      {children}
    </LotteryContext.Provider>
  );
};

export default LotteryProvider;