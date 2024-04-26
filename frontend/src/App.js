import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function App() {
  const [Items, setItems] = useState([]);
  const [currentView1, setCurrentView1] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm();


  const onSubmit = data => {

    const datajson={
      id: parseInt(data.id, 10),
      title: data.title,
      price:parseFloat(data.price),
      description: data.description,
      category: data.category,
      image: data.image,
      rating: { rate: parseFloat(data.rate), count: parseInt(data.count) }
    }
     console.log(datajson);

    // Call the create function to post data to the backend
    create(datajson);
    
  };

  const changeView = (i) => {
    setCurrentView1(i);
    if (i === 1) {
      loadAll();
    }
    
  };

  let loadAll = async () => {
    await fetch("http://localhost:8081/").then((response) => {
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

  let update = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:8081/updateRobot/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const result = await response.json();
        console.log("Update result:", result);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  let deletor = async (data) => {
    try {
      const response = await fetch(`http://localhost:8081/delete/${data.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const result = await response.json();
        console.log("delete result:", result);
      }
    } catch (error) {
      console.error("delete failed:", error);
    }
  };

  let create = async (data) => {
    fetch("http://localhost:8081/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);

        //set the current view to 1 after adding the items
        setCurrentView1(1);
        //additem
        // setItems([...Items, { ...data}]);

       
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add items");
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

  let UpdateItems = () => {
    const item = {
      id: 0,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: { rate: 3.9, count: 120 },
    };

    let original = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops";
    return (
      <button
        onClick={() => {
          update(item);
        }}
      >
        hello this is update
      </button>
    );
  };

  let DeleteItems = () => {
    const item = {
      id: 0,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: { rate: 3.9, count: 120 },
    };

    return (
      <button
        onClick={() => {
          deletor(item);
        }}
      >
        hello this is delete
      </button>
    );
  };


  let CreateItems = () => {
    // const data = {
    //   id: 0,
    //   title: 'CREATE 2',
    //   price: 99,
    //   description: 'TESITING CREATE',
    //   category: "TESTING CREATE",
    //   image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    //   rating: { rate: 3.9, count: 120 }
    // }
    return (
      <>
      <div className="container" style={{ paddingTop: "3rem" }}>
      <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">

        {/* Form fields remain the same, but ensure names match the backend expectations */}
        <label htmlFor="id" style={{ paddingTop: "1rem" }}>ID:</label>
        <input {...register('id')} type="text" className="form-control" />

        <label htmlFor="title" style={{ paddingTop: "1rem" }}>Title:</label>
        <input {...register('title')} type="text" className="form-control" />

        <label htmlFor="price" style={{ paddingTop: "1rem" }}>Price:</label>
        <input {...register('price')} type="text" className="form-control" />

        <label htmlFor="description" style={{ paddingTop: "1rem" }}>Description:</label>
        <textarea {...register('description')} className="form-control" />

        <label htmlFor="category" style={{ paddingTop: "1rem" }}>Category:</label>
        <input {...register('category')} type="text" className="form-control" />

        <label htmlFor="image" style={{ paddingTop: "1rem" }}>Image URL:</label>
        <input {...register('image')} type="text" className="form-control" />

        <label htmlFor="rate" style={{ paddingTop: "1rem" }}>Rate:</label>
        <input {...register('rate', { valueAsNumber: true })} type="text" className="form-control" />
        <label htmlFor="count" style={{ paddingTop: "1rem" }}>Count:</label>
        <input {...register('count', { valueAsNumber: true })} type="text" className="form-control" />

        <button type="submit" className="btn btn-primary ">Add Product</button>
      </form>
    </div>
    </>
    );
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
            onClick={() => {
              changeView(1);
            }}
          >
            View all
          </button>
          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={() => {
              changeView(2);
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={() => {
              changeView(3);
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-primary"
            variant="light"
            onClick={() => {
              changeView(4);
            }}
          >
            Create
          </button>
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
