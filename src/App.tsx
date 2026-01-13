import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutineList from "./components/RoutineList";
import TimerView from "./components/Timer";
import RoutineEditor from "./components/RoutineEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoutineList />} />
        <Route path="/routine/:id" element={<TimerView />} />
        <Route path="/routine/:id/edit" element={<RoutineEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
