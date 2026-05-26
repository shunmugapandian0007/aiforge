import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism";

import { FaArrowUp } from "react-icons/fa";

import {
    FiPlus,
    FiClock,
    FiSearch,
    FiImage,
    FiTrash2,
    FiLogOut,
    FiEdit2,
    FiSave,
    FiX,
    FiCopy,
    FiDownload,
    FiRefreshCw,
    FiThumbsUp,
    FiThumbsDown
}
from "react-icons/fi";

import "./BlogGenerator.css";

function BlogGenerator() {

    const [prompt, setPrompt] = useState("");

    const [messages, setMessages] = useState([]);

    const [searchOpen, setSearchOpen] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    const [editingProfile, setEditingProfile] = useState(false);

    const textareaRef = useRef(null);

    const chatEndRef = useRef(null);

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [userName, setUserName] = useState(
        currentUser?.name || "Guest"
    );

    const [editName, setEditName] = useState(
        currentUser?.name || ""
    );

    const historyKey =
        currentUser
            ? `aiforge-history-${currentUser.email}`
            : "aiforge-history-guest";

    const [history, setHistory] = useState(() => {

        const savedHistory =
            localStorage.getItem(historyKey);

        return savedHistory
            ? JSON.parse(savedHistory)
            : [];
    });

    useEffect(() => {

        localStorage.setItem(
            historyKey,
            JSON.stringify(history)
        );

    }, [history]);

    useEffect(() => {

        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const handleInput = (e) => {

        setPrompt(e.target.value);

        textareaRef.current.style.height = "auto";

        textareaRef.current.style.height =
            textareaRef.current.scrollHeight + "px";
    };

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        if(file){

            const imageUrl =
                URL.createObjectURL(file);

            setSelectedImage(imageUrl);
        }
    };

    const newChat = () => {

        setMessages([]);

        setPrompt("");

        setSelectedImage(null);

        const newHistory = {

            id: Date.now(),

            title: "New Chat",

            messages: []
        };

        setHistory((prev) => [

            newHistory,

            ...prev
        ]);
    };

    const logout = () => {

        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    const deleteHistory = (indexToDelete) => {

        const updatedHistory =
            history.filter(
                (_, index) => index !== indexToDelete
            );

        setHistory(updatedHistory);
    };

    const saveProfile = () => {

        setUserName(editName);

        const updatedUser = {
            ...currentUser,
            name: editName
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setEditingProfile(false);
    };

    const generateAI = async () => {

        if (!prompt.trim() && !selectedImage)
            return;

        const currentPrompt = prompt;

        const userMessage = {

            type: "user",

            text: currentPrompt,

            image: selectedImage
        };

        const updatedMessages = [
            ...messages,
            userMessage
        ];

        setMessages(updatedMessages);

        setPrompt("");

        setSelectedImage(null);

        textareaRef.current.style.height = "40px";

        try {

            const res = await axios.get(

                "http://127.0.0.1:8080/generate",

                {
                    params: {
                        prompt: currentPrompt
                    }
                }
            );

            let aiText =
                res.data.answer;

            const aiMessage = {

                type: "ai",

                text: aiText
            };

            const finalMessages = [

                ...updatedMessages,

                aiMessage
            ];

            setMessages(finalMessages);

            if(history.length === 0){

                const newHistory = {

                    id: Date.now(),

                    title:
                        currentPrompt.slice(0, 30),

                    messages: finalMessages
                };

                setHistory([newHistory]);
            }

            else{

                const updatedHistory = [...history];

                updatedHistory[0] = {

                    ...updatedHistory[0],

                    title:
                        updatedHistory[0].title ===
                        "New Chat"
                            ? currentPrompt.slice(0, 30)
                            : updatedHistory[0].title,

                    messages: finalMessages
                };

                setHistory(updatedHistory);
            }

        }

        catch(error) {

            console.log(error);

            setMessages((prev) => [

                ...prev,

                {

                    type: "ai",

                    text:
                        "Server Error 😢"
                }
            ]);
        }
    };

    const filteredChats = history.filter((chat) =>

        chat.title
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    return (

        <div className="main-layout">

            {
                searchOpen && (

                    <div className="modal-overlay">

                        <div className="search-modal">

                            <div className="search-top">

                                <input
                                    type="text"
                                    placeholder="Search chats..."
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    onClick={() =>
                                        setSearchOpen(false)
                                    }
                                >

                                    <FiX />

                                </button>

                            </div>

                            <div className="search-results">

                                {
                                    filteredChats.map(
                                        (chat,index)=>(

                                        <div
                                            key={index}
                                            className="search-item"

                                            onClick={() => {

                                                setMessages(
                                                    chat.messages
                                                );

                                                setSearchOpen(false);
                                            }}
                                        >

                                            <FiClock />

                                            {chat.title}

                                        </div>
                                    ))
                                }

                            </div>

                        </div>

                    </div>
                )
            }

            <div className="sidebar">

                <div className="sidebar-top">

                    <div className="logo">

                        <h2>AIForge</h2>

                    </div>

                    <button
                        className="sidebar-btn"
                        onClick={newChat}
                    >

                        <FiPlus />

                        New Chat

                    </button>

                    <button
                        className="sidebar-btn"
                        onClick={() =>
                            setSearchOpen(true)
                        }
                    >

                        <FiSearch />

                        Search Chats

                    </button>

                    <button className="sidebar-btn">

                        <FiClock />

                        History

                    </button>

                    <div className="history-list">

                        {
                            history.map((chat,index)=>(

                                <div
                                    key={index}
                                    className="history-item"
                                >

                                    <span
                                        onClick={() =>
                                            setMessages(
                                                chat.messages
                                            )
                                        }
                                    >

                                        {chat.title}

                                    </span>

                                    <button
                                        className="delete-history-btn"

                                        onClick={() =>
                                            deleteHistory(index)
                                        }
                                    >

                                        <FiTrash2 />

                                    </button>

                                </div>
                            ))
                        }

                    </div>

                </div>

                <div className="sidebar-bottom">

                    <div className="profile-card">

                        <div className="profile-top">

                            <div className="profile-avatar">

                                {
                                    userName
                                        .charAt(0)
                                        .toUpperCase()
                                }

                            </div>

                            <div className="profile-info">

                                {
                                    editingProfile ? (

                                        <div className="edit-profile-box">

                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e)=>
                                                    setEditName(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                className="save-btn"
                                                onClick={saveProfile}
                                            >

                                                <FiSave />

                                            </button>

                                        </div>

                                    ) : (

                                        <>
                                            <h3>
                                                {userName}
                                            </h3>

                                            <p>
                                                Premium User
                                            </p>
                                        </>
                                    )
                                }

                            </div>

                        </div>

                        <button
                            className="profile-action-btn"

                            onClick={() =>
                                setEditingProfile(
                                    !editingProfile
                                )
                            }
                        >

                            <FiEdit2 />

                            Edit Profile

                        </button>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >

                            <FiLogOut />

                            Logout

                        </button>

                    </div>

                </div>

            </div>

            <div className="chat-page">

                <div className="chat-container">

                    {
                        messages.length === 0 && (

                            <div className="empty-chat">

                                <h1>
                                    What can I help with?
                                </h1>

                            </div>
                        )
                    }

                    {
                        messages.map((msg,index)=>(

                            <div
                                key={index}

                                className={
                                    msg.type === "user"
                                        ? "user-wrapper"
                                        : "ai-wrapper"
                                }
                            >

                                <div
                                    className={
                                        msg.type === "user"
                                            ? "user-message"
                                            : "ai-message"
                                    }
                                >

                                    {
                                        msg.image && (

                                            <img
                                                src={msg.image}
                                                alt="uploaded"
                                                className="chat-upload-image"
                                            />
                                        )
                                    }

                                    <div className="message-content">

                                        <ReactMarkdown

                                            components={{

                                                code({

                                                    inline,

                                                    className,

                                                    children,

                                                    ...props

                                                }) {

                                                    const match =
                                                        /language-(\w+)/.exec(
                                                            className || ""
                                                        );

                                                    return !inline && match ? (

                                                        <div className="code-block-wrapper">

                                                            <div className="code-topbar">

                                                                <span>
                                                                    {match[1]}
                                                                </span>

                                                                <button

                                                                    className="copy-code-btn"

                                                                    onClick={() => {

                                                                        navigator.clipboard.writeText(
                                                                            String(children)
                                                                        );
                                                                    }}
                                                                >

                                                                    <FiCopy />

                                                                    Copy code

                                                                </button>

                                                            </div>

                                                            <SyntaxHighlighter

                                                                style={oneDark}

                                                                language={match[1]}

                                                                PreTag="div"

                                                                {...props}
                                                            >

                                                                {
                                                                    String(children)
                                                                    .replace(/\n$/, "")
                                                                }

                                                            </SyntaxHighlighter>

                                                        </div>

                                                    ) : (

                                                        <code
                                                            className={className}
                                                            {...props}
                                                        >

                                                            {children}

                                                        </code>
                                                    );
                                                }
                                            }}
                                        >

                                            {msg.text}

                                        </ReactMarkdown>

                                        {
                                            msg.type === "ai" && (

                                                <div className="chatgpt-actions">

                                                    <button

                                                        className="chat-action-btn"

                                                        onClick={() => {

                                                            navigator.clipboard.writeText(
                                                                msg.text
                                                            );
                                                        }}
                                                    >

                                                        <FiCopy />

                                                    </button>

                                                    <button

                                                        className="chat-action-btn"

                                                        onClick={() => {

                                                            const blob =
                                                                new Blob(
                                                                    [msg.text],
                                                                    {
                                                                        type:"text/plain"
                                                                    }
                                                                );

                                                            const url =
                                                                window.URL.createObjectURL(
                                                                    blob
                                                                );

                                                            const a =
                                                                document.createElement("a");

                                                            a.href = url;

                                                            a.download =
                                                                "aiforge-response.txt";

                                                            a.click();

                                                            window.URL.revokeObjectURL(url);
                                                        }}
                                                    >

                                                        <FiDownload />

                                                    </button>

                                                    <button
                                                        className="chat-action-btn"
                                                    >

                                                        <FiRefreshCw />

                                                    </button>

                                                    <button
                                                        className="chat-action-btn"
                                                    >

                                                        <FiThumbsUp />

                                                    </button>

                                                    <button
                                                        className="chat-action-btn"
                                                    >

                                                        <FiThumbsDown />

                                                    </button>

                                                </div>
                                            )
                                        }

                                    </div>

                                </div>

                            </div>
                        ))
                    }

                    <div ref={chatEndRef}></div>

                </div>

                <div className="input-section">

                    <div className="input-box">

                        <label className="image-upload-btn">

                            <FiImage />

                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageUpload}
                            />

                        </label>

                        {
                            selectedImage && (

                                <div className="input-image-preview">

                                    <img
                                        src={selectedImage}
                                        alt="preview"
                                    />

                                </div>
                            )
                        }

                        <textarea

                            ref={textareaRef}

                            placeholder="Ask anything..."

                            value={prompt}

                            onChange={handleInput}

                            rows="1"

                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter"
                                    &&
                                    !e.shiftKey
                                ) {

                                    e.preventDefault();

                                    generateAI();
                                }
                            }}
                        />

                        <button
                            onClick={generateAI}
                        >

                            <FaArrowUp />

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default BlogGenerator;