import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function App() {
  const [Items, setItems] = useState([]);
  const [currentView1, setCurrentView1] = useState(0);

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors1 },
    reset: reset1,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors2 },
    reset: reset2,
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors3 },
    reset: reset3,
  } = useForm();

  const [printJSON, setPrintJSON] = useState({});
  const [pendingUpdate, setPendingUpdate]= useState({});

  const onSubmit3 = async (data) => {
    const datajson = {
      id: parseInt(data.id, 10),
      price: parseFloat(data.price),
    };
    console.log(datajson);
    await searchItem(datajson)
    setPendingUpdate(datajson)
    // Call the create function to post data to the backend
  };

  const onSubmit2 = async (data) => {
    console.log("delete runs");
    const datajson = {
      id: data.searchid,
    };
    console.log(datajson);
    await searchItem(datajson)
    //deletor(datajson)
  };
  const onSubmit = (data) => {
    const datajson = {
      id: parseInt(data.id, 10),
      title: data.title,
      price: parseFloat(data.price),
      description: data.description,
      category: data.category,
      image: data.image,
      rating: { rate: parseFloat(data.rate), count: parseInt(data.count) },
    };
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
        console.log("Success:", data);
        alert(
          "Items updated successfully!, pls click the View All button to see your items"
        );
        reset3();
        setPrintJSON({})
        setPendingUpdate({})
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  let deletor = async (data) => {
    console.log(data);
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
        console.log("Success:", data);
        alert(
          "Items deleted successfully!, pls click the View All button to see your items"
        );
        reset2();
        setPrintJSON({})
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
        alert(
          "Items added successfully!, pls click the View All button to see your added items"
        );
        reset1();
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
            <p className="card-text">${item["price"]}</p>
            <p className="card-text">ID: {item["id"]}</p>
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
    return (
      <>
        <div className="container" style={{ paddingTop: "3rem" }}>
          <form onSubmit={handleSubmit3(onSubmit3)} className="container mt-5">
            {/* Form fields remain the same, but ensure names match the backend expectations */}
            <label htmlFor="id" style={{ paddingTop: "1rem" }}>
              ID:
            </label>
            <input {...register3("id")} type="text" className="form-control" />

            <label htmlFor="price" style={{ paddingTop: "1rem" }}>
              Price:
            </label>
            <input
              {...register3("price")}
              type="text"
              className="form-control"
            />
            <button type="submit" className="btn btn-primary ">
              Search
            </button>
          </form>

          <div className="container mt-5">
            {
              <>
                <div key={printJSON.title}>
                  <div className="col mb-4" key={printJSON.id}>
                    <div className="card shadow-sm">
                      <img src={printJSON.image} alt={printJSON.title} className="card-img-top" />
                      <div className="card-body">
                        <h5 className="card-title">{printJSON.title}</h5>
                        <p className="card-text">{printJSON.price}</p>
                        <p className="card-text">{printJSON.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary " onClick={()=>{update(pendingUpdate)}}>
                  update
                </button>
              </>
            }
          </div>
        </div>
      </>
    );
  };

  let searchItem = async (data) => {

    let getInputValue = (myItems) => {
      for (let i in myItems) {
        if (myItems[i].id === parseInt(data.id)) {
          return (myItems[i]);
        }
      }
      alert("item not found")
      return NaN
    }

    return await fetch("http://localhost:8081/").then((response) => {
      if (!response.ok) {
        throw new Error("err: ${response.status}");
      }
      response.json().then((data) => {
        let tmp = [];
        for (let i in data) {
          tmp.push(data[i]);
        }
        console.log(tmp);
        let res = getInputValue(tmp)
        console.log(res)
        if (res == NaN){
          alert('cant find it bro')
        }
        setPrintJSON(res)
      })
    });
  };

  let DeleteItems = () => {
    return (
      <>
        <div className="container" style={{ paddingTop: "3rem" }}>
          <form onSubmit={handleSubmit2(onSubmit2)} className="container mt-5">
            {/* Form fields remain the same, but ensure names match the backend expectations */}
            <label htmlFor="searchid" style={{ paddingTop: "1rem" }}>
              ID:
            </label>
            <input
              {...register2("searchid")}
              type="text"
              className="form-control"
            />

            <button type="submit" className="btn btn-primary ">
              Search
            </button>
          </form>
          <div className="container mt-5">
            {
              <>
                <div key={printJSON.title}>
                  <div className="col mb-4" key={printJSON.id}>
                    <div className="card shadow-sm">
                      <img src={printJSON.image} alt={printJSON.title} className="card-img-top" />
                      <div className="card-body">
                        <h5 className="card-title">{printJSON.title}</h5>
                        <p className="card-text">{printJSON.price}</p>
                        <p className="card-text">{printJSON.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary " onClick={()=>{deletor(printJSON)}}>
                  delete
                </button>
              </>
            }
          </div>
        </div>
      </>
    );
  };

  let CreateItems = () => {
    return (
      <>
        <div className="container" style={{ paddingTop: "3rem" }}>
          <form onSubmit={handleSubmit1(onSubmit)} className="container mt-5">
            {/* Form fields remain the same, but ensure names match the backend expectations */}
            <label htmlFor="id" style={{ paddingTop: "1rem" }}>
              ID:
            </label>
            <input {...register1("id")} type="text" className="form-control" />

            <label htmlFor="title" style={{ paddingTop: "1rem" }}>
              Title:
            </label>
            <input
              {...register1("title")}
              type="text"
              className="form-control"
            />

            <label htmlFor="price" style={{ paddingTop: "1rem" }}>
              Price:
            </label>
            <input
              {...register1("price")}
              type="text"
              className="form-control"
            />

            <label htmlFor="description" style={{ paddingTop: "1rem" }}>
              Description:
            </label>
            <textarea {...register1("description")} className="form-control" />

            <label htmlFor="category" style={{ paddingTop: "1rem" }}>
              Category:
            </label>
            <input
              {...register1("category")}
              type="text"
              className="form-control"
            />

            <label htmlFor="image" style={{ paddingTop: "1rem" }}>
              Image URL:
            </label>
            <input
              {...register1("image")}
              type="text"
              className="form-control"
            />

            <label htmlFor="rate" style={{ paddingTop: "1rem" }}>
              Rate:
            </label>
            <input
              {...register1("rate", { valueAsNumber: true })}
              type="text"
              className="form-control"
            />
            <label htmlFor="count" style={{ paddingTop: "1rem" }}>
              Count:
            </label>
            <input
              {...register1("count", { valueAsNumber: true })}
              type="text"
              className="form-control"
            />

            <button type="submit" className="btn btn-primary ">
              Add Product
            </button>
          </form>
        </div>
      </>
    );
  };


  return (
    <div>
      <section>
        <h1 style={{ textAlign: "center", padding: 5 }}>MAPPY Shop</h1>
        <div className="container">
          
          <button
            style={{marginRight: '2rem'}}
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
          style={{marginRight: '2rem'}}
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
          style={{marginRight: '2rem'}}
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
          style={{marginRight: '2rem'}}
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
