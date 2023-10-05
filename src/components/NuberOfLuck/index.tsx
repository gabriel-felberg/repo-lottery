import { useState, useEffect, useCallback, useContext } from "react";
import "./style.css";
import { LotteryContext } from "../../Provider/Lottery";

// interface LotteryNumber {
//   context: number;
//   initial: number;
// }

interface Occurrence {
  repeat: number;
  number: string;
}

interface TurnOccurrence {
  [key: string]: number;
}

function NumberOfLuck() {
  const [newArrayOccurrences, setNewArrayOccurrences] = useState<TurnOccurrence[]>([]);
  const [newArrayOccurrences2, setNewArrayOccurrences2] = useState<TurnOccurrence[]>([]);

  const {allNumberArrays} = useContext(LotteryContext)

  const arrayOfNumbersStartingFrom31: string[] = Array.from({ length: 30 }, (_, i) => (i + 31).toString().padStart(2, "0"));
  const arrayOfNumbersStartingFrom01: string[] = Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const turns = Array.from({ length: 596 }, (_, i) => i + 5);
  const repeats = Array.from({ length: 11 }, (_, i) => i + 3);


  const countOccurrencesMemoized = useCallback(
    (value: string, turn: number) => {
      return CountOccurrences(allNumberArrays, value, turn);
    },
    [allNumberArrays]
  );

  useEffect(() => {
    const newArrayOccurrences = turns.map((turn) => getOccurrencesForNumbers(arrayOfNumbersStartingFrom01, turn));
    setNewArrayOccurrences(FormatTable(newArrayOccurrences, 1, 30));
  }, [countOccurrencesMemoized]);

  useEffect(() => {
    const newArrayOccurrences2 = turns.map((turn) => getOccurrencesForNumbers(arrayOfNumbersStartingFrom31, turn));
    setNewArrayOccurrences2(FormatTable(newArrayOccurrences2, 31, 60));
  }, [countOccurrencesMemoized]);

  function CountOccurrences(array: string[][], OneresponsesOfNumbers: string, turn: number) {
    let count = 0;
    let maxCount = 0;
    const arr: { numbers: string[]; contest: number; turn: number }[] = [];

    for (let i = array.length - 1; i >= 0; i -= turn) {
      if (array[i].includes(OneresponsesOfNumbers)) {
        arr.push({ numbers: array[i], contest: i, turn });
      }

      if (array[i].includes(OneresponsesOfNumbers)) {
        count++;
        if (count > maxCount) {
          maxCount = count;
        }
      } else {
        count = 0;
      }
    }

    if (maxCount < 3) {
      maxCount = 0;
    }

    return { repeat: maxCount, number: OneresponsesOfNumbers };
  }

  function getOccurrencesForNumbers(numbers: string[], turn: number) {
    return numbers.map((number) => countOccurrencesMemoized(number, turn));
  }

  function FormatTable(array: Occurrence[][], init: number, and: number) {
    const numbers: { [key: string]: number }[] = [{}];

    for (let i = init; i <= and; i++) {
      numbers[0][i.toString().padStart(2, "0")] = 0;
    }

    array.forEach((turn) => {
      turn.forEach(({ repeat, number }) => {
        if (repeat >= numbers[0][number]) {
          numbers[0][number] = repeat;
        }
      });
    });

    return numbers;
  }

  return (
    <section className="flex">
      <div>
        <table>
          <thead>
            <tr>
              <th>Núm.</th>
              {repeats.map((repeat) => (
                <th key={repeat}>{repeat} (x)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arrayOfNumbersStartingFrom01.map((number) => (
              <tr key={number}>
                <td>{number}</td>
                {repeats.map((repeat) => {
                  const occurrence = newArrayOccurrences.find((occurrence) => occurrence[number] === repeat);
                  return <td key={`${number}-${repeat}`}>{occurrence ? "X" : "-"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Núm.</th>
              {repeats.map((repeat) => (
                <th key={repeat}>{repeat} (x)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arrayOfNumbersStartingFrom31.map((number) => (
              <tr key={number}>
                <td>{number}</td>
                {repeats.map((repeat) => {
                  const occurrence = newArrayOccurrences2.find((occurrence) => occurrence[number] === repeat);
                  return <td key={`${number}-${repeat}`}>{occurrence ? "X" : "-"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default NumberOfLuck;