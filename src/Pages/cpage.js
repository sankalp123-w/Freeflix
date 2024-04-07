import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../components/ContentModal/ContentModal.css";
import Carousel from "../components/Carousel/Carousel";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../config/config";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "90%",
    height: "80%",
    backgroundColor: "#39445a",
    border: "1px solid #282c34",
    borderRadius: 10,
    color: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
  },
  iframeContainer: {
    position: "relative",
    paddingTop: "56.25%", // Aspect ratio 16:9
    width: "100%",
    height: 0,
    overflow: "hidden",
    border: "4px solid white", // White border around iframe
    boxSizing: "border-box", // Ensure border is included in size calculation
    transition: "height 0.5s ease", // Smooth transition for height change
    marginBottom: "20px", // Add margin at the bottom
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
  watchNowButton: {
    marginTop: 10,
    marginLeft: 10, // Adjusted margin-left for the buttons
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
  loader: {
    marginTop: 10,
    marginLeft: 10,
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
  itachiEyes: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: "20px",
    fontWeight: "bold",
    animation: "$blink 2s infinite",
  },
  "@keyframes blink": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
}));

function Cpage() {
  const classes = useStyles();

  const [content, setContent] = useState({});
  const [video, setVideo] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [watchValue, setWatchValue] = useState(0);
  const [valc, setValc] = useState(0);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  let { media_type, id } = useParams();

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
    if (data.seasons) setSeasons(data.seasons);
    setLoading(false); // Set loading to false after data is fetched
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWatchNow = () => {
    setVideo(`https://vidsrc.to/embed/movie/${id}`);
  };

  const handleSelectSeason = (e) => {
    setWatchValue(e.target.value);
    setValc(1);
  };

  const list = [];
  if (media_type === "tv" && valc) {
    for (let i = 0; i < seasons[watchValue - 1]?.episode_count; i++) {
      list.push(
        <li key={i}>
          <button
            onClick={() => {
              setVideo(`https://vidsrc.to/embed/tv/${id}/${watchValue}/${i + 1}`);
            }}
          >
            Ep{i + 1}
          </button>
        </li>
      );
    }
  }

  return (
    <div className={classes.paper}>
      <div className="ContentModal">
        <img
          src={content.poster_path ? `${img_500}/${content.poster_path}` : unavailable}
          alt={content.name || content.title}
          className="ContentModal__portrait"
        />
        <img
          src={content.backdrop_path ? `${img_500}/${content.backdrop_path}` : unavailableLandscape}
          alt={content.name || content.title}
          className="ContentModal__landscape"
        />
        <div className="ContentModal__about">
          <span className="ContentModal__title">
            {content.name || content.title} ({(content.first_air_date || content.release_date || "-----").substring(0, 4)})
          </span>
          {content.tagline && <i className="tagline">{content.tagline}</i>}
          <span className="ContentModal__description">{content.overview}</span>
          <div>
            <Carousel id={id} media_type={media_type} />
          </div>
          <div className={classes.iframeContainer}>
            {video && <iframe src={video} allow="autoplay; fullscreen" allowFullScreen={true} className={classes.iframe}></iframe>}
          </div>
        </div>
      </div>
      <div className="buttonContainer">
        {media_type === "tv" && (
          <>
            <select onChange={handleSelectSeason}>
              <option value="none" hidden>Select Season</option>
              {seasons.map((season, index) => (
                <option key={index} value={index + 1}>{season.name}</option>
              ))}
            </select>
            {loading ? (
              <div>
                <div className={classes.loader} style={{ visibility: video ? "hidden" : "visible" }}>
                  Loading...
                </div>
                <div className={classes.itachiEyes} style={{ visibility: video ? "hidden" : "visible" }}>
                  👀
                </div>
              </div>
            ) : (
              <ul className='pokedex'>{list}</ul>
            )}
          </>
        )}
        {media_type !== "tv" && (
          <button className={classes.watchNowButton} onClick={handleWatchNow}>
            Watch Now!
          </button>
        )}
      </div>
    </div>
  );
}

export default Cpage;