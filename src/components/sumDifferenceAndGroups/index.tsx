import { useContext } from "react";
import "./style.css";
import { LotteryContext } from "../../Provider/Lottery";

function SumDifferenceAndGroups() {

  const { newArrayOccurrences } = useContext(LotteryContext)

  return (
    <section>
      {newArrayOccurrences?.map((elem) => (
        <table key={elem.turn}>
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
            {elem.result?.map((e, i) => (e.numbers.length !== 0 ?
              <tr key={i}>
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
              </tr> : null
            ))}
          </tbody>
        </table>
      ))}
    </section>
  );
}

export default SumDifferenceAndGroups;
