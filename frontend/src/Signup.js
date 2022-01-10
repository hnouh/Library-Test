import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import jwt from "jwt-decode";
import FormLabel from "react-bootstrap/esm/FormLabel";
import { Image } from "cloudinary-react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setAuthName] = useState("");
  const [nationality, setNationality] = useState("");
  const [authorImage, setAuthImage] = useState("");
  const [imagePubId, setImagePubId] = useState("");
  const [imageVersion, setImageVersion] = useState();
  const [imageFormat, setImageFormat] = useState("");
  const [imageAfterUpload, setImageAfterUpload] = useState("");

  // const [bookImage, setBookImage] = useState("");
  // const [title, setBookTitle] = useState("");
  // const [pages, setPages] = useState();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  let navigate = useNavigate();

  const uploadImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", authorImage);
    formData.append("upload_preset", "ujphls8v");
    axios
      .post("https://api.cloudinary.com/v1_1/dgjqxzhje/image/upload", formData)
      .then((res) => {
        console.log(res.data);
        setImagePubId(res.data.public_id);
        setImageVersion(res.data.version);
        setImageFormat(res.data.format) 
        setImageAfterUpload(res.data.secure_url)
      })
  };

  function signupAuthor(e) {
    e.preventDefault();
    // setEmailError("");
    // setPasswordError("");  
        axios
        .post("/signup", { email, password, name, nationality, authorImage:imageAfterUpload })
        .then((res) => {
          console.log(res.data);
          if (res.data.errors) {
            console.log(res.data.errors);
  
            setEmailError(res.data.errors.email);
            setPasswordError(res.data.errors.password);
          }
          if (res.data.author) {
            const token = res.data.token;
            const authorSign = jwt(token); // decode your token here
            localStorage.setItem("token", token);
            navigate("/");
          }
        })

    
  }

  return (
    <>
      <Form>
        <h2>Sign up</h2>
        <Form.Control
          placeholder="author name"
          onChange={(e) => setAuthName(e.target.value)}
        ></Form.Control>
        <Form.Control
          placeholder="author nationality"
          onChange={(e) => setNationality(e.target.value)}
        ></Form.Control>
        {/* <Form.Control placeholder="author image" onChange={(e) => setAuthImage(e.target.value)}></Form.Control> */}
        <FormLabel>author image</FormLabel>
        <Form.Control
          onChange={(e) => setAuthImage(e.target.files[0])}
          type="file"
        ></Form.Control>
        <button className="btn btn-success" onClick={(e) => uploadImage(e)}>Upload image</button>

        <Image
          style={{width : 200}}
          cloudName="dgjqxzhje"
          publicId={`https://res.cloudinary.com/dgjqxzhje/image/upload/v${imageVersion}/${imagePubId}.${imageFormat}`}
        />
        <Form.Control
          type="text"
          name="email"
          placeholder="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Control>
        <div className="email error">{emailError}</div>
        <Form.Control
          type="password"
          name="password"
          placeholder="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Control>
        <div className="password error">{passwordError}</div>
        {/* <input placeholder="book title" onChange={(e) => setBookTitle(e.target.value)}></input>
        <input placeholder="book pages" onChange={(e) => setPages(e.target.value)}></input>
        <input placeholder="book image" onChange={(e) => setBookImage(e.target.value)}></input> */}
        <button className="btn btn-success" onClick={(e) => signupAuthor(e)}>
          Sign up
        </button>
      </Form>
    </>
  );
}

export default Signup;
