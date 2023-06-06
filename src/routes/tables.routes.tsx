import { Routes, Route } from "react-router-dom";
import NumberOfLuck from "../components/NuberOfLuck";
import SumDifferenceAndGroups from "../components/sumDifferenceAndGroups";

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/555Tabelas"
        element={<SumDifferenceAndGroups context={2600} initial={1} />}
      />
      <Route
        path="/"
        element={<NumberOfLuck context={2600} initial={1} />}
      />
    </Routes>
  );
};
