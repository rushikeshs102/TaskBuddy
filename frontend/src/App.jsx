import SignIn from "./component/Signin";
import SignUp from "./component/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Alltask from "./component/Alltask";
import Completetask from "./component/Completetask";
import Incompletetask from "./component/Incompletetask";
import Imptask from "./component/Imptask";

function App() {
  return (
    <div className="relative">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}>
            <Route index element={<Alltask />} />
            <Route path="/imptask" element={<Imptask />} />
            <Route path="/completetask" element={<Completetask />} />
            <Route path="/incompletetask" element={<Incompletetask />} />
          </Route>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
