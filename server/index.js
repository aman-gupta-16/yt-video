import express from "express";
import cors from "cors";
import ytdlp from "youtube-dl-exec";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  const { url } = req.body;

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      formats: info.formats
        .filter(f => f.url && f.ext === "mp4")
        .map(f => ({
          quality: f.format_note,
          url: f.url
        }))
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

app.listen(4000, () => console.log("Server running on 4000"));
