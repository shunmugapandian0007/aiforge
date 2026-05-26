import "./Register.css";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import axios from "axios";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const registerUser = async () => {

        const userData = {

            name,
            email,
            password
        };

        try {

            const res = await axios.post(

                "http://localhost:8080/register",

                userData
            );

            alert(res.data);

            if(

                res.data ===
                "User Registered Successfully"

            ){

                navigate("/login");
            }

        }

        catch (err) {

            console.log(err);

            alert("Register Failed");
        }
    };

    return (

        <div className="register-container">

            <div className="register-box">

                <h1>Create Account</h1>

                <p>

                    Start building AI content
                    with AIForge

                </p>

                <input
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button onClick={registerUser}>

                    Create Account

                </button>

                <p className="login-text">

                    Already have account?

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                    >

                        Go to Login

                    </span>

                </p>

            </div>

        </div>
    );
}

export default Register;