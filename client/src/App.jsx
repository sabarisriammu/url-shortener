import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";

import Register from "./Register";
function App() {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [urls, setUrls] = useState([]);
    const [expiresAt, setExpiresAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
);
const [showRegister, setShowRegister] = useState(false);
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

   const fetchMyUrls = async () => {
    try {
     

        if (!token) {
            setUrls([]);
            return;
        }

        const response = await fetch(`${API_URL}/api/urls/my`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("MY URLS ERROR:", data);

            setUrls([]);
            return;
        }

        if (Array.isArray(data)) {
            setUrls(data);
        } else {
            setUrls([]);
        }

    } catch (error) {
        console.error("FETCH URLS ERROR:", error);
        setUrls([]);
    } finally {
        setFetching(false);
    }
};

    useEffect(() => {
        fetchMyUrls();
    }, []);

    const handleShorten = async () => {

        if (!url.trim()) {
            alert("Please enter a URL");
            return;
        }

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {
            alert("Please enter a valid URL");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = awaitfetch(`${API_URL}/api/urls`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                   body: JSON.stringify({
    originalUrl: url,
    expiresAt: expiresAt || null
})
                }
            );

            const data = await response.json();

            setShortUrl(data.shortUrl);
setUrl("");
setExpiresAt("");

fetchMyUrls();

        } catch (error) {
            console.error("SHORTEN ERROR:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    const copyUrl = async (shortCode) => {
   const shortUrl = `${API_URL}/${shortCode}`;

    try {
        await navigator.clipboard.writeText(shortUrl);

        alert("Short URL copied successfully!");

    } catch (error) {
        console.error("Clipboard API failed:", error);

        const textArea = document.createElement("textarea");

        textArea.value = shortUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);

        textArea.select();
        document.execCommand("copy");

        document.body.removeChild(textArea);

        alert("Short URL copied successfully!");
    }
};
const deleteUrl = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this URL?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/urls/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to delete URL");
            return;
        }

        alert("URL deleted successfully!");

        await fetchMyUrls();

    } catch (error) {
        console.error("DELETE ERROR:", error);
        alert("Something went wrong");
    }
};


if (!isLoggedIn) {

    if (showRegister) {
        return (
            <Register
                onRegister={() => setShowRegister(false)}
            />
        );
    }

    return (
        <Login
            onLogin={() => setIsLoggedIn(true)}
            onRegister={() => setShowRegister(true)}
        />
    );
}
    return (
        <div className="dashboard">

            <header className="navbar">
                <div className="logo">
                    <span>🔗</span> Shortly
                </div>

                <button
    className="logout-btn"
    onClick={() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }}
>
    Logout
</button>
            </header>

            <main className="main-content">

                <section className="hero">
                   <p className="badge">
    ✨ Smart links. Powerful analytics.
</p>

<h1>
    Shorten your URLs.
    <br />
    <span>Understand every click.</span>
</h1>

<p className="subtitle">
    Create branded short links, track performance,
    and manage everything from one powerful dashboard.
</p>
                </section>

                <section className="shortener-card">

                    <div className="input-wrapper">
                        <span>🔗</span>

                        <input
                            type="text"
                            placeholder="Paste your long URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
<div className="expiry-wrapper">
    <label>Expiry Date (Optional)</label>

    <input
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
    />
</div>
                    <button
                        className="shorten-btn"
                        onClick={handleShorten}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Shorten URL →"}
                    </button>

                </section>

                {shortUrl && (
                    <div className="success-box">
                        <span>✓</span>

                        <div>
                            <small>Your shortened URL</small>

                            <a
                                href={shortUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {shortUrl}
                            </a>
                        </div>
                    </div>
                )}

               <section className="analytics-grid">

    <div className="analytics-card primary">
        <div className="analytics-top">
            <div className="analytics-icon">
                🔗
            </div>

            <span className="analytics-label">
                Total Links
            </span>
        </div>

        <h2>{urls.length}</h2>

        <p>Links created from your account</p>

        <div className="analytics-line">
            <span style={{ width: "75%" }}></span>
        </div>
    </div>


    <div className="analytics-card">
        <div className="analytics-top">
            <div className="analytics-icon">
                👆
            </div>

            <span className="analytics-label">
                Total Clicks
            </span>
        </div>

        <h2>
            {urls.reduce(
                (total, item) => total + item.clicks,
                0
            )}
        </h2>

        <p>Total visits across all links</p>

        <div className="analytics-line">
            <span style={{ width: "60%" }}></span>
        </div>
    </div>


    <div className="analytics-card">
        <div className="analytics-top">
            <div className="analytics-icon">
                📈
            </div>

            <span className="analytics-label">
                Avg. Clicks
            </span>
        </div>

        <h2>
            {urls.length === 0
                ? 0
                : (
                    urls.reduce(
                        (total, item) =>
                            total + item.clicks,
                        0
                    ) / urls.length
                ).toFixed(1)}
        </h2>

        <p>Average engagement per link</p>

        <div className="analytics-line">
            <span style={{ width: "45%" }}></span>
        </div>
    </div>


    <div className="analytics-card">
        <div className="analytics-top">
            <div className="analytics-icon">
                ⚡
            </div>

            <span className="analytics-label">
                Active Links
            </span>
        </div>

        <h2>
            {urls.filter(
                (item) =>
                    !item.expiresAt ||
                    new Date(item.expiresAt) > new Date()
            ).length}
        </h2>

        <p>Currently active short links</p>

        <div className="analytics-line">
            <span style={{ width: "85%" }}></span>
        </div>
    </div>

</section>

                <section className="links-section">

                    <div className="section-header">
                        <div>
                            <h2>My Links</h2>
                            <p>Manage your shortened URLs</p>
                        </div>
                    </div>

                    {fetching ? (
                        <div className="empty-state">
                            Loading your links...
                        </div>
                    ) : urls.length === 0 ? (
                        <div className="empty-state">
                            <div>🔗</div>
                            <h3>No links yet</h3>
                            <p>
                                Create your first shortened URL above.
                            </p>
                        </div>
                    ) : (
                        <div className="links-list">

                            {urls.map((item) => (
                                <div
                                    className="link-card"
                                    key={item._id}
                                >
                                    <div className="link-info">

                                        <div className="link-icon">
                                            🔗
                                        </div>

                                        <div>
                                            <a
                                               href={`${API_URL}/${item.shortCode}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="short-link"
                                            >
                                                {API_URL.replace(/^https?:\/\//, "")}/{item.shortCode}
                                            </a>

                                            <p>
                                                {item.originalUrl}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="link-stats">
                                        <div>
                                            <strong>
                                                {item.clicks}
                                            </strong>
                                            <span>Clicks</span>
                                        </div>
                                        <div>
    <strong>
        {item.expiresAt
            ? new Date(item.expiresAt) < new Date()
                ? "Expired"
                : new Date(item.expiresAt).toLocaleDateString()
            : "Never"}
    </strong>

    <span>Expires</span>
</div>
<button
    className="copy-btn"
    onClick={() => copyUrl(item.shortCode)}
>
    📋 Copy
</button>
<button
    className="delete-btn"
    onClick={() => deleteUrl(item._id)}
>
    🗑️ Delete
</button>
                                        <div>
                                            <strong>
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleDateString()}
                                            </strong>
                                            <span>Created</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default App;