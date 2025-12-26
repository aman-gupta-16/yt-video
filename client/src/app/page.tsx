"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("http://localhost:4000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch video");
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1>Video Downloader</h1>

      <input
        type="text"
        placeholder="Paste YouTube / Instagram URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 20,
          marginBottom: 10,
        }}
      />

      <button
        onClick={handleDownload}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? "Fetching..." : "Get Download Links"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: 30 }}>
          <h3>{data.title}</h3>

          {data.thumbnail && (
            <img
              src={data.thumbnail}
              alt="thumbnail"
              style={{ width: "100%", marginBottom: 20 }}
            />
          )}

          <ul>
            {data.formats.map((f: any, i: number) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <a href={f.url} target="_blank" rel="noreferrer">
                  Download {f.quality || "video"}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
