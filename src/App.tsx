import "./App.css";
import NumberOfLuck from "./components/NuberOfLuck";
import SumDifferenceAndGroups from "./components/sumDifferenceAndGroups";


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <NumberOfLuck context={2565} initial={1}></NumberOfLuck>
      </header>
    </div>
  );
}

export default App;
