import { Route, Routes } from "react-router-dom";
import GithubAccess from "./component/GithubAccess";
import Layout from "./component/Layout";

function App() {
  return (
    <div className="App">
      <Layout/>
       <Routes>
          <Route path="/github" element={<GithubAccess/>}/>
        </Routes>
        <Layout/>       
    </div>
  );
}

export default App;
