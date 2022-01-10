import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Authors from "./Authors";
import AuthDetails from "./AuthDetails";
import BookDetails from "./BookDetails";
import Signup from "./Signup";
import Signin from "./Signin";
import Navigation from "./Navigation";
import AuthContext from "./store/auth-context";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogged, setIsLogged] = useState(false);

  if (!token) {
    return ( 
      <AuthContext.Provider value={{ isLogged: isLogged, setIsLogged }} >
        <Navigation />
        <Routes>
          <Route exact path="/" element={<Authors />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Signin" element={<Signin />} />
        </Routes>
        </AuthContext.Provider  > 
    );
  }
  return ( 
      <AuthContext.Provider value={{ isLogged: isLogged, setIsLogged }}>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Authors />} />
        <Route path="/AuthDetails/:id" element={<AuthDetails />} />
        <Route path="/BookDetails/:authorId/:bookId" element={<BookDetails />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
      </Routes>
      </AuthContext.Provider  > 
  );
}

export default App;
