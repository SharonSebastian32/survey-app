import DynamicForm from "../src/Components/Home/Form/DynamicForm";
import Home from "../src/Components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form/:formId" element={<DynamicForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
