import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import AuthContext from './store/auth-context'
import {useContext} from 'react'
import { useTranslation } from "react-i18next";

function Signin() { 
  const ctx = useContext(AuthContext)
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  function signinAuthor(e) {
    e.preventDefault();
    axios.post("/signin", { email, password }).then((res) => {
      console.log(res.data);
      if (res.data.author) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        ctx.setIsLogged(true)
        navigate("/"); 
      }
    });
  }

  return (
    <>
      <Form onSubmit={(e) => signinAuthor(e)}>
        <h2>{t("Login")}</h2>
        <Form.Control
          type="text"
          name="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Control>
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Control>
        <button className="btn btn-success" >{t("Login")}</button>
      </Form>
    </>
  );
}

export default Signin;
