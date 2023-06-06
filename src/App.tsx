import "./App.css";
import NumberOfLuck from "./components/NuberOfLuck";
import SumDifferenceAndGroups from "./components/sumDifferenceAndGroups";
import { AppRouter } from "./routes/tables.routes";

function App() {

  return (
    <div className="App">
      <header className="App-header">

        <AppRouter/>
        {/* <SumDifferenceAndGroups context={2600} initial={1}></SumDifferenceAndGroups> */}
        {/* <NumberOfLuck context={2600} initial={1}></NumberOfLuck> */}
      </header>
    </div>
  );
}

export default App;
