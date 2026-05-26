import "./LandingPage.css";

import { Link } from "react-router-dom";

function LandingPage() {

    return (

        <div className="landing-container">

            {/* NAVBAR */}

            <nav className="navbar">

                <div className="logo">

                    AIForge

                </div>

                <div className="nav-buttons">

                    <Link to="/login">

                        <button className="login-btn">

                            Login

                        </button>

                    </Link>

                </div>

            </nav>

            {/* HERO SECTION */}

            <div className="hero-section">

                <div className="hero-badge">

                    ✨ AI Powered Assistant

                </div>

                <h1>

                    Your Intelligent AI Chat Assistant

                </h1>

                <p>

                    Ask questions, generate code,
                    solve problems, create content
                    and chat naturally with AI
                    in real-time.

                </p>

                <div className="hero-buttons">

                    <Link to="/login">

                        <button className="hero-btn">

                            Start Chatting

                        </button>

                    </Link>

                </div>

            </div>

        </div>

    );
}

export default LandingPage;