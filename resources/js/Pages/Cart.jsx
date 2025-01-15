import React, { useState } from "react";
import { useCart } from "../CartContext";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";

export default function Cart() {
    const { cart, dispatch } = useCart();
    const { post } = useForm(); // Use Inertia's form submission
    const [message, setMessage] = useState("");

    const calculateTotal = () =>
        Object.values(cart).reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

    const handleOrder = () => {
        const cartItems = Object.entries(cart).map(([id, item]) => ({
            pizza_id: id,
            quantity: item.quantity,
        }));

        post(
            "/cart/order",
            { items: cartItems },
            {
                onSuccess: () => {
                    Object.keys(cart).forEach((id) =>
                        dispatch({ type: "REMOVE_FROM_CART", payload: { id } })
                    );
                    setMessage("Your order has been placed successfully.");
                },
                onError: () => {
                    setMessage("There was an issue placing your order.");
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Your Cart</h1>

                {message && (
                    <div className="my-4 p-4 text-green-600 bg-green-100 rounded">
                        {message}
                    </div>
                )}

                {Object.keys(cart).length > 0 ? (
                    <div>
                        {Object.entries(cart).map(([id, item]) => (
                            <div
                                key={id}
                                className="flex items-center gap-4 mt-4"
                            >
                                <h3 className="text-lg">{item.name}</h3>
                                <div className="flex items-center">
                                    <button
                                        onClick={() =>
                                            dispatch({
                                                type: "DECREMENT_QUANTITY",
                                                payload: { id },
                                            })
                                        }
                                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            dispatch({
                                                type: "INCREMENT_QUANTITY",
                                                payload: { id },
                                            })
                                        }
                                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        +
                                    </button>
                                </div>
                                <p>${item.price * item.quantity}</p>
                                <button
                                    onClick={() =>
                                        dispatch({
                                            type: "REMOVE_FROM_CART",
                                            payload: { id },
                                        })
                                    }
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <h2 className="mt-4 text-xl font-bold">
                            Total: ${calculateTotal().toFixed(2)}
                        </h2>

                        <button
                            onClick={handleOrder}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg"
                        >
                            Place Order
                        </button>
                    </div>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
