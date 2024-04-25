import React, { useState, useEffect } from "react";

function App() {
  const [Items, setItems] = useState([]);
  const [currentView1, setCurrentView1] = useState(0);
  useEffect(() => {
    loadAll();
  }, []);

  const changeView = (i) => {

    setCurrentView1(i);
};
  let buttonContent = "";
    switch (currentView1) {
        case 1:
        buttonContent = "Cart";
        break;
        case 2:
        buttonContent = "Browse";
        break;
        default:
        buttonContent = "Cart";
        break;
    }

  let loadAll = () => {
    fetch("http://localhost:8081/").then((response) => {
      if (!response.ok) {
        throw new Error("err: ${response.status}");
      }
      response.json().then((data) => {
        console.log(data);
        let tmp = [];
        for (let i of data) {
          tmp.push(i);
        }
        setItems(tmp);
      });
    });
  };

  let cardArray = Items.map((item) => (
    <div key={item["title"]}>
      <div className="col mb-4" key={item["id"]}>
        <div className="card shadow-sm">
          <img
            src={item["image"]}
            alt={item["title"]}
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{item["title"]}</h5>
            <p className="card-text">{item["price"]}</p>
            <p className="card-text">{item["description"]}</p>
          </div>
        </div>
      </div>
    </div>
  ));

  let ShowItems = () => {

    return (
      <>
        <div className="album py-5 bg-body-tertiary">
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {cardArray}
            </div>
          </div>
        </div>
      </>
    );
  };

  let UpdateItems = ()=>{
    return(<div>hello this is update</div>)
  }

  let DeleteItems = () =>{
    return (<div> hello this is delete</div>)
  }
  let CreateItems = () =>{
    return (<div> hello this is create</div>)
  }

  return (
    <div>
      <section>
        <h1 style={{ textAlign: "center", padding: 5 }}>MAPPY Shop</h1>
        <div className="container">

          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={()=>{changeView(1)}}
          >View all</button>
          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={()=>{changeView(2)}}
          >Update</button>
          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={()=>{changeView(3)}}
          >Delete</button>
          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={()=>{changeView(4)}}
          >Create</button>

        </div>
      </section>

      <div id="cart">
        {currentView1 === 1 && <ShowItems />}
        {currentView1 === 2 && <UpdateItems />}
        {currentView1 === 3 && <DeleteItems />}
        {currentView1 === 4 && <CreateItems />}
      </div>
    </div>
  );
}

export default App;
