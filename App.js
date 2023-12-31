import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const idRef = useRef();
  const nameRef = useRef();
  const priceRef = useRef();
  const imageRef = useRef();
  const stockRef = useRef();
  const catIdRef = useRef();
  const isActiveRef = useRef();
  const [isUsd, setUsd] = useState(false);

  useEffect(() => {
    fetch("https://localhost:7049/api/Products")
      .then(res => res.json())
      .then(json => setProducts(json));
  }, []);

  function kustuta(index) {
    fetch("https://localhost:7049/api/Products/kustuta/" + index, {"method": "DELETE"})
      .then(res => res.json())
      .then(json => setProducts(json));
  }
  async function tellida(summ, index) {
    try {
      const response = await fetch(`https://localhost:7049/api/Products/pay/${summ}/${index}`);
      if (response.ok) {
        let payLink = await response.text();

        payLink = payLink.replace(/^"|"$/g, '');
        window.open(payLink, '_blank');
      } else {
        console.error('Payment failed.');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  }

  function lisa() {
    fetch(`https://localhost:7049/api/Products/lisa/${Number(idRef.current.value)}/${nameRef.current.value}/${imageRef.current.value}/${Number(priceRef.current.value)}/${isActiveRef.current.checked}/${Number(stockRef.current.value)}/${Number(catIdRef.current.value)}`, {"method": "POST"})
      .then(res => res.json())
      .then(json => setProducts(json));
  }

  function dollariteks() {
    const kurss = 1.1;
    setUsd(true);
    fetch("https://localhost:7049/api/Products/hind-dollaritesse/" + kurss, {"method": "PATCH"})
      .then(res => res.json())
      .then(json => setProducts(json));
  }

  function eurodeks() {
    const kurss = 0.9091;
    setUsd(false);
    fetch("https://localhost:7049/api/Products/hind-eurosse/" + kurss, {"method": "PATCH"})
      .then(res => res.json())
      .then(json => setProducts(json));
  }

  return (
    <div className="App">
      <label>ID</label> <br />
      <input ref={idRef} type="number" /> <br />
      <label>Name</label> <br />
      <input ref={nameRef} type="text" /> <br />
      <label>Price</label> <br />
      <input ref={priceRef} type="number" /> <br />
      <label>Stock</label> <br />
      <input ref={stockRef} type="number" /> <br />
      <label>Image</label> <br />
      <input ref={imageRef} type="text" /> <br />
      <label>Category Nr</label> <br />
      <input ref={catIdRef} type="number" /> <br />
      <label>Active</label> <br />
      <input ref={isActiveRef} type="checkbox" /> <br />
      <button onClick={() => lisa()} id='Lisa'>Lisa</button>
      <br/>
      <br/>
      {isUsd === false && <button onClick={() => dollariteks()} id='Dollar'>Muuda dollariteks</button>}
      {isUsd === true && <button onClick={() => eurodeks()} id='Dollar'>Muuda eurodeks</button>}
      <table>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category Nr</th>
            <th>Image</th>
            <th>Delete</th>
            <th>Buy</th>
          </tr>
      {products.map((product, index) => 
          <tr>
          <td>{product.id}</td>
          <td>{product.name}</td>
          <td>{product.price.toFixed(2)}</td>
          <td>{product.stock}</td>
          <td>{product.categoryId}</td>
          <td>{product.image}</td>
          <td><button onClick={() => kustuta(index)} id='X'>x</button></td>
          <td><button onClick={() => tellida(product.price.toFixed(2), index)} id='Pay'>Pay</button></td>
          </tr>
        )}
        </table>
    </div>
  );
}

export default App;
