import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import items from "./products.json";

const MainComponent = () => {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isSubmitClicked, setSubmitClicked] = useState(false);
    const [currentView1, setCurrentView1] = useState(1);
    const [formData, setFormData] = useState({});
    const [query, setQuery] = useState("");
    const [ProductsCategory, setProductsCategory] = useState(items);
    const changeView = () => {
        setCurrentView1((prevView) => (prevView % 2) + 1);
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

    //This function is used to register an input or select element to the React Hook Form. By registering an element, React Hook Form can track its value, validate it, and handle its submission. You typically use it like this: <input {...register("yourFieldName")} />. This way, the input's value is managed by React Hook Form.
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, // Extracting the reset function from useForm
    } = useForm();



    //observe every time the state variable cart changes, useEffect is called
    useEffect(() => {
        // the total is a function to count the prices are added  below
        total();
    }, [cart]);

    const addToCart = (el) => {
        //item => means we're defining a function that takes item as parameter
        //item represents an individual element in the cart array
        const exists = cart.find((item) => item.id === el.id);

        if (exists) {
        // If item exists, update quantity, must have ...item (all info inside item) to accumulate the quantity
        setCart(
            cart.map((item) =>
            item.id === el.id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
        } else {
        // Add new item into ...cart  with the ...el(all info) and also new data 'quantity' = 1
        setCart([...cart, { ...el, quantity: 1 }]);
        }
    };

    // fixing removing only one item from cart
    const removeFromCart = (el) => {
        const exists = cart.find((item) => item.id === el.id);

        if (exists && exists.quantity > 1) {
        // If more than one, decrease quantity
        setCart(
            cart.map((item) =>
            item.id === el.id ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
        } else {
        // Remove item completely if quantity is 1 remail the item id that are not the same as el.id
        setCart(cart.filter((item) => item.id !== el.id));
        }
    };

    // There, total is executed where the prices are added
    // and finally carTotal is updated. is being call in useeffect
    const total = () => {
        let totalVal = 0;
        for (let i = 0; i < cart.length; i++) {
        totalVal += cart[i].price * cart[i].quantity;
        }
        //setting the state
        setCartTotal(totalVal.toFixed(2));
    };

    //show the cart items in cart views
    const cartItems = cart.map((el) => {
        return (
        <div>
            <div className="col">
            <div className="card shadow-sm">
                <img
                src={el.image}
                style={{
                    width: "10rem",
                    paddingLeft: "3rem",
                    paddingTop: "3rem",
                    paddingBottom: "3rem",
                }}
                />
                <div className="card-body">
                <h4>{el.title}</h4>

                <div className="col">
                    ${el.price} <span className="close">&#10005;</span>
                    {el.quantity}
                </div>

                <div className="col">
                    <button
                    type="button"
                    variant="light"
                    onClick={() => removeFromCart(el)}
                    >
                    {" "}
                    -{" "}
                    </button>{" "}
                    <button
                    type="button"
                    variant="light"
                    onClick={() => addToCart(el)}
                    >
                    {" "}
                    +{" "}
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        );
    });

    //show listitem in browse view
    const listitem = ProductsCategory.map((el) => (
        <div className="col mb-4" key={el.id}>
        <div className="card shadow-sm">
            <img src={el.image}
            alt={el.title}
            className="card-img-top" // Bootstrap class for image stylingstyle={{ height: "250px", objectFit: "cover" }}
            />
            <div className="card-body">
            <h5 className="card-title">{el.title}</h5>
            <p className="card-text">${el.price}</p>
            <p className="card-text">{el.description}</p>
            <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => removeFromCart(el)}
                >
                    -
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => addToCart(el)}
                >
                    +
                </button>
                </div>
                <small className="text-muted">
                Qty: {cart.find((item) => item.id === el.id)?.quantity || 0}
                </small>
                <small className="text-muted">
                Total$:
                {cart.find((item) => item.id === el.id)?.quantity * el.price || 0}
                </small>
            </div>
            </div>
        </div>
        </div>
    ));

    //handle seach result
    const handleChange = (e) => {
        setQuery(e.target.value);
        console.log(
        "Step 6 : in handleChange, Target Value :",
        e.target.value,
        " Query Value :",
        query
        );
        const results = items.filter((eachProduct) => {
        if (e.target.value === "") return ProductsCategory;
        return eachProduct.title
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });

        setProductsCategory(results);
    };

    //function for reset whole cart
    const resetCart = () => {
        setCart([]);
    };

    //show the cart view with contact details
    function ShowCart() {
        console.log("runs");

        //When submit button, update the Hook with data from Form
        const onSubmit = (data) => {
        console.log(data); // log all data
        console.log(data.fullName); // log only fullname

        // update hooks
        setFormData(data); //setFormData update Hook FormData to contain the input data.
        setSubmitClicked(true); //condition goto Confirmation View
        setCurrentView1(3); //goto Confirmation View
        };

        if (cartItems.length === 0) {
        return (
            <h1 style={{ textAlign: "center", padding: 5 }}>
            There is nothing in cart
            </h1>
        );
        }

        //this show the contact details
        return (
        <div>
            <div className="container">
            PURCHASED
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {cartItems}
            </div>
            <button className="reset btn btn-primary" onClick={resetCart}>
                Reset
            </button>
            {/* payment */}
            <div style={{ paddingTop: "14rem" }}>
                <h2>Total : {cartTotal}</h2>
                <h2>Payment Information</h2>

                <div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="container mt-5"
                >
                    <div className="form-group">
                    <input
                        {...register("fullName", { required: true })}
                        placeholder="Full Name"
                        className="form-control"
                    />
                    {errors.fullName && (
                        <p className="text-danger">Full Name is required.</p>
                    )}
                    </div>
                    <div className="form-group">
                    <input
                        {...register("email", {
                        required: "Email is required", // Provide a message directly for the 'required' rule
                        pattern: {
                            value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // More specific pattern
                            message: "Invalid email format, ex:userEmail@gmail.com", // Custom message for pattern validation
                        },
                        })}
                        placeholder="Email"
                        className="form-control"
                    />
                    {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
                    )}
                    </div>

                    <div className="form-group">
                    <input
                        {...register("creditCard", { required: true })}
                        placeholder="Credit Card"
                        className="form-control"
                    />
                    {errors.creditCard && (
                        <p className="text-danger">Credit Card is required.</p>
                    )}
                    </div>

                    <div className="form-group">
                    <input
                        {...register("address", { required: true })}
                        placeholder="Address"
                        className="form-control"
                    />
                    {errors.address && (
                        <p className="text-danger">Address is required.</p>
                    )}
                    </div>

                    <div className="form-group">
                    <input
                        {...register("address2")}
                        placeholder="Address 2"
                        className="form-control"
                    />
                    </div>

                    <div className="form-group">
                    <input
                        {...register("city", { required: true })}
                        placeholder="City"
                        className="form-control"
                    />
                    {errors.city && (
                        <p className="text-danger">City is required.</p>
                    )}
                    </div>

                    <div className="form-group">
                    <input
                        {...register("state", { required: true })}
                        placeholder="State"
                        className="form-control"
                    />
                    {errors.state && (
                        <p className="text-danger">State is required.</p>
                    )}
                    </div>

                    <div className="form-group">
                    <input
                        {...register("zip", {
                        required: "Zip is required",
                        pattern: {
                            value: /^[0-9]{5}(-[0-9]{4})?$/,
                            message: "Invalid ZIP format,ex:50014",
                        },
                        })}
                        placeholder="Zip"
                        className="form-control"
                    />
                    {errors.zip && (
                        <p className="text-danger">{errors.zip.message}</p>
                    )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                    Submit
                    </button>
                </form>
                </div>
            </div>
            </div>
        </div>
        );
    }

    //show the final cart item in showConfirmation function

    const finalCartItem = cart.map((el) => {
        return (
        <div>
            <div className="col">
            <div className="card shadow-sm">
                <img
                src={el.image}
                style={{
                    width: "10rem",
                    paddingLeft: "3rem",
                    paddingTop: "3rem",
                    paddingBottom: "3rem",
                }}
                />
                <div className="card-body">
                <h4>{el.title}</h4>

                <div className="col">
                    ${el.price} <span className="close">&#10005;</span>
                    {el.quantity}
                </div>
                </div>
            </div>
            </div>
        </div>
        );
    });

    function ShowConfirmation() {
        return (
        <div className="container">
            {finalCartItem}<h1>Payment summary:</h1>
            <h3>FULLNAME:</h3>
            <p>{formData.fullName}</p>
            <h3>EMAIL:</h3>
            <p>{formData.email}</p>
            <h3>CREDITCARD:</h3>
            <p>{formData.creditCard}</p>
            <h3>ADDRESS:</h3>
            <p>{formData.address}</p>
            <p>{formData.address2}</p>
            <p>
            {formData.city},{formData.state} {formData.zip}{" "}
            </p>
            <button  className="btn btn-primary" onClick={updateHooks}>Confirm</button>
        </div>
        );
    }

    //for after confirm payment
    const updateHooks = () => {
        alert("Thank you of buying the products here, welcome again!");
        reset({
        fullName: "",
        email: "",
        creditCard: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        });

        setCurrentView1(1);
    };

    //show items is being call in return maincomponent, listitem show all items in browse view
    function ShowItems() {
        return (
        <>
            <div className="album py-5 bg-body-tertiary">
            <div className="container">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {listitem}
                </div>
            </div>
            </div>
        </>
        );
    }

    const Footer = () => {
        const people = [
        {
            name: 'Alex Wang',
            phone: '+1 (515) 815-4987',
            email: 'nawang2@iastate.edu',
            instagram: 'alx__wang',
        },
        {
            name: 'Belle Khor',
            phone: '+1 (515) 520-5750',
            email: 'belle27@iastate.edu',
            instagram: 'yiyunkhor',
        },
        ];
    
        return (
        <footer className="footer mt-5 py-5 text-light bg-dark">
        <div className="container">
            <div className="row ">
            <div className="d-flex flex-row px-3">
            {people.map((person) => (
                <div className="px-5" key={person.name} >
                <div className="d-flex">
                    <p className=" mb-0">{person.name}</p>
                </div>
                <p >{person.phone}</p>
                <p >{person.email}</p>
                <p >Instagram: {person.instagram}</p>
                </div>
            ))}
            </div>
            </div>
        </div>
        </footer>
        );
    };

    //mainComponenetReturn
    return (
        <div>
        <div>
            <main>
            <section>
                <h1 style={{ textAlign: "center", padding: 5 }}>MAPPY Shop</h1>
                <div className="container">
                <div className="totalPay" style={{ textAlign: "left", padding: 5 }}>
                    Total$:{cartTotal}
                </div>
                <button type="button" className="btn btn-primary" variant="light" onClick={changeView}>
                    {buttonContent}
                </button>
                </div>

            </section>

            <div className="py-10 container">
                {currentView1 === 1 && (
                <input type="search" value={query} onChange={handleChange} />
                )}
            </div>

            <div id="cart">
                {currentView1 === 1 && <ShowItems />}
                {currentView1 === 2 && <ShowCart />}
                {currentView1 === 3 && isSubmitClicked === true && (
                <ShowConfirmation />
                )}
            </div>
            </main>

            <Footer/>
        </div>
        </div>
    );
};

export default MainComponent;
