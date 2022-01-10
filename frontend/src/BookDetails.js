import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Loader from "react-loader-spinner";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export default function BookDetails() {
  const [book, setBook] = useState();
  const { authorId, bookId } = useParams();
  const [loading, setLoading] = useState(true);

  console.log(authorId)
  console.log(bookId)
  useEffect(() => {
    axios.get(`/book/${authorId}/${bookId}`).then((res) => {
      console.log(res.data[0][0]);
      setBook(res.data[0][0]);
      setLoading(false)
    });
  }, []);
  
  if (loading) {
    return (
     <div> 
     <Loader
        type="TailSpin"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={5000} //3 secs
      />
      <p>loading...</p>
      </div>
    );
  }
  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.bookImage} />
      <h3>pages: {book.pages}</h3>
      <h5>price: {book.price}</h5>
    </div>
  );
}
