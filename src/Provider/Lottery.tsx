import axios from "axios";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

interface LotteryResult {
  listaDezenas: string[];
  contest: number;
}

interface LotteryContextProps {
  responses: LotteryResult[];
  allNumberArrays: string[][];
  resulContext: number;
  newArrayOccurrences: TurnOccurrence[];
}

interface LotteryResult {
  listaDezenas: string[];
  contest: number;
}

interface Container {
  numbers: string[];
  group: Array<string>;
  difference: Array<string>;
  sum: Array<string>;
  contest: number;
}

interface TurnOccurrence {
  turn: number;
  result: Container[];
}

export const LotteryContext = createContext<LotteryContextProps>({
  responses: [],
  allNumberArrays: [],
  resulContext: 0,
  newArrayOccurrences:[]
});

export interface IProviderProps {
  children: ReactNode;
}

export const LotteryProvider = ({ children }: IProviderProps) => {
  const [responses, setResponses] = useState<LotteryResult[]>([]);
  const [allNumberArrays, setAllNumberArrays] = useState<string[][]>([]);

  const initial = 1; // Defina o valor inicial desejado
  const context = 2840; // Defina o valor do concurso desejado
  const lastNumber = 2835; // Defina o valor do ultimo concurso
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
          console.log(data.numero);
          theBigArray.push(data.listaDezenas);
        } catch (err: any) {
          if (i > lastNumber) {
            console.log("Erro ao buscar status", err);
            console.log("Erro ao buscar os números", err.status);

            numbersMap.push({
              listaDezenas: [],
              contest: i,
            });
            theBigArray.push(["00", "00", "00", "00", "00", "00"]);
            i++;
          }
          // console.log(err.);
          

          i -= 1;
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

    const [newArrayOccurrences, setNewArrayOccurrences] = useState<
      TurnOccurrence[]
    >([]);
  
    const turns = Array.from({ length: 596 }, (_, i) => i + resulContext);
  
    function GetGroups(array: string[]) {
      const GroupArray: string[] = [];
      array?.forEach((e) => GroupArray.push(Math.ceil(+e / 5).toString()));
      return GroupArray;
    }
    function GetDifference(array: string[]) {
      const DifferenceArray: string[] = [];
      array?.forEach((e, i) => {
        if (typeof array[i + 1] === "string")
          DifferenceArray.push(Math.abs(+e - +array[i + 1]).toString());
      });
      return DifferenceArray;
    }
    function GetSum(array: string[]) {
  
      let SumArray: string[] = [];
      SumArray.push(array?.reduce((acc, cur) => (acc += +cur), 0).toString());
      SumArray.push(array?.reduce((acc, cur) => (acc += +cur[0]), 0).toString());
      SumArray.push(array?.reduce((acc, cur) => (acc += +cur[1]), 0).toString());
      SumArray.push(
        array?.reduce((acc, cur) => (acc += +cur[0] + +cur[1]), 0).toString()
      );
      return SumArray;
    }
    function ResponseSumDifferenceAndGroups(
      array: LotteryResult[],
      turns: number
    ) {
      const results: Array<Container> = [];
  
      for (let i = array.length - 1; i > 0; i -= turns) {
        if (results.length >= 9) break;
        const container: Container = {
          numbers: ["", "", "", "", "", ""],
          group: ["", "", "", "", "", ""],
          difference: ["", "", "", "", ""],
          sum: ["", "", "", ""],
          contest: array[i]?.contest,
        };
  
        // if (array[i]?.listaDezenas.length === 0) {
        //   results.push(container);
        //   continue;
        // }
  
        container.numbers = array[i]?.listaDezenas;
        container.group = GetGroups(array[i]?.listaDezenas);
        container.difference = GetDifference(array[i]?.listaDezenas);
        container.sum = GetSum(array[i]?.listaDezenas);
  
        if (container.numbers[0] !== "") {
          results.push(container);
        }
  
      }
  
      return results;
    }
  
    const functionMemoized = useCallback(
      (turn: number) => {
        return ResponseSumDifferenceAndGroups(responses, turn);
      },
      [responses]
    );
    useEffect(() => {
      const Occurrences = turns?.map((turn) => ({
        turn,
        result: functionMemoized(turn),
      }));
      setNewArrayOccurrences(Occurrences);
    }, [functionMemoized]);

  return (
    <LotteryContext.Provider value={{ responses, allNumberArrays, resulContext, newArrayOccurrences }}>
      {children}
    </LotteryContext.Provider>
  );
};

export default LotteryProvider;


