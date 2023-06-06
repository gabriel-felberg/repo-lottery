import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import "./style.css";

interface LotteryResult {
  listaDezenas: string[];
  contest: number;
}

interface LotteryNumber {
  context: number;
  initial: number;
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

function SumDifferenceAndGroups({ context, initial }: LotteryNumber) {
  const [responses, setResponses] = useState<LotteryResult[]>(
    [] as LotteryResult[]
  );
  const [newArrayOccurrences, setNewArrayOccurrences] = useState<
    TurnOccurrence[]
  >([]);

  const turns = Array.from({ length: 596 }, (_, i) => i + 5);

  useEffect(() => {
    let retries: number = 0;
    const numbersMap: LotteryResult[] = [];
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
        } catch (err) {
          if (retries <= 3) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 400 * retries));
            i--;
          } else {
            console.log("Erro ao buscar os números", err);
            numbersMap.push({
              listaDezenas: [],
              contest: i,
            });
          }
        }
        if (i === context) break;
      }
      setResponses(numbersMap);
    }
    fetchNumbers();
  }, [context, initial]);
  function checkContest(contestNumber: number, results: LotteryResult[]) {
    const found = results.some((result) => result.contest === contestNumber);
    if (!found) {
      results.unshift({
        listaDezenas: [],
        contest: contestNumber,
      });
    }
  }
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
      if (results.length >= 10) break;
      const container: Container = {
        numbers: ["", "", "", "", "", ""],
        group: ["", "", "", "", "", ""],
        difference: ["", "", "", "", ""],
        sum: ["", "", "", ""],
        contest: array[i]?.contest,
      };

      if (array[i]?.listaDezenas.length === 0) {
        results.push(container);
        continue;
      }

      container.numbers = array[i]?.listaDezenas;
      container.group = GetGroups(array[i]?.listaDezenas);
      container.difference = GetDifference(array[i]?.listaDezenas);
      container.sum = GetSum(array[i]?.listaDezenas);

      results.push(container);
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
    <section>
      {newArrayOccurrences?.map((elem) => (
        <table>
          <thead>
            <tr className="box">
              <th className="contest">{elem.turn}</th>
              <th colSpan={6}>RESULTADOS</th>
              <th rowSpan={2} colSpan={5}>
                Diferenças/Sorteio
              </th>
              <th colSpan={6}>Grupos</th>
              <th colSpan={4}>Somas</th>
            </tr>
            <tr>
              <th>Conc.</th>
              <th>1*</th>
              <th>2*</th>
              <th>3*</th>
              <th>4*</th>
              <th>5*</th>
              <th>6*</th>
              <th>1*</th>
              <th>2*</th>
              <th>3*</th>
              <th>4*</th>
              <th>5*</th>
              <th>6*</th>
              <th>Som</th>
              <th>S1</th>
              <th>S2</th>
              <th>S12</th>
            </tr>
          </thead>
          <tbody>
            {elem.result?.map((e) => (e.numbers.length !== 0 ?
              <tr>
                <td>{e.contest}</td>
                {e.numbers?.map((number) => (
                  <td className="bloco">{number}</td>
                ))}
                {e.difference?.map((difference) => (
                  <td className="bloco">{difference}</td>
                ))}
                {e.group?.map((group) => (
                  <td className="bloco">{group}</td>
                ))}
                {e.sum?.map((sum) => (
                  <td className="bloco">{sum}</td>
                ))}
              </tr>: null
            ))}
          </tbody>
        </table>
      ))}
    </section>
  );
}

export default SumDifferenceAndGroups;
