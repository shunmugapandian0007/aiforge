import "./Login.css";

import { useNavigate}
from "react-router-dom";

import { useState }
from "react";

import axios from "axios";

import {
    GoogleAuthProvider,
    signInWithPopup
}
from "firebase/auth";

import { auth }
from "../firebase";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const loginUser = async () => {

        const userData = {

            email,
            password
        };

        try {

            const res = await axios.post(

                "http://localhost:8080/login",

                userData
            );

            if(

                res.data.message ===
                "Login Success"

            ){

                localStorage.setItem(

                    "user",

                    JSON.stringify({

                        name:
                            res.data.user.name,

                        email:
                            res.data.user.email
                    })
                );

                alert("Login Success");

                navigate("/blog");
            }

            else{

                alert(res.data.message);
            }
        }

        catch (err) {

            console.log(err);

            alert("Login Failed");
        }
    };

    const googleLogin = async () => {

        try{

            const provider =
                new GoogleAuthProvider();

            const result =
                await signInWithPopup(
                    auth,
                    provider
                );

            const user = result.user;

            localStorage.setItem(

                "user",

                JSON.stringify({

                    name:
                        user.displayName,

                    email:
                        user.email,

                    photo:
                        user.photoURL
                })
            );

            alert(
                "Google Login Success"
            );

            navigate("/blog");
        }

        catch(err){

            console.log(err);

            alert(
                "Google Login Failed"
            );
        }
    };

    return (

        <div className="login-container">

            <div className="login-box">

                <h1>

                    Welcome Back

                </h1>

                <p>

                    Login to continue using AIForge

                </p>

                <input
                    type="email"

                    placeholder="Enter Email"

                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"

                    placeholder="Enter Password"

                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <button
                    className="login-btn"

                    onClick={loginUser}
                >

                    Login

                </button>

                <button
                    className="google-btn"

                    onClick={googleLogin}
                >

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"

                        alt="google"
                    />

                    Continue with Google

                </button>

                <div className="forgot-password">

                    Forgot Password?

                </div>

                {/* <p className="register-link">

                    Don't have account?

                    <Link to="/register">

                        Go to Register

                    </Link>

                </p> */}

            </div>

        </div>
    );
}

export default Login;