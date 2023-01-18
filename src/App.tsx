import { Route, Routes } from "react-router-dom";
import Dashboard from "./component/Dashboard";
import GithubAccess from "./component/GithubAccess";
import Layout from "./component/Layout";

function App() {
  return (
    <div>
      <Layout/>
       <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/github" element={<GithubAccess/>}/>
        </Routes>
    </div>
  );
}

export default App;
