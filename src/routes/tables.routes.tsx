import { Routes, Route } from "react-router-dom";
import NumberOfLuck from "../components/NuberOfLuck";
import SumDifferenceAndGroups from "../components/sumDifferenceAndGroups";


export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/555Tabelas"
        element={<SumDifferenceAndGroups />}
      />
      <Route
        path="/"
        element={<NumberOfLuck />}
      />
    </Routes>
  );
};
