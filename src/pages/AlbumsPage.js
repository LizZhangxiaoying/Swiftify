import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { NavLink } from "react-router-dom";

const config = require("../config.json");

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  console.log(
    `Fetching from: http://${config.server_host}:${config.server_port}/albums`
  );

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/albums`)
      .then((res) => res.json())
      .then((resJson) => setAlbums(resJson));
  }, []);

  const format1 = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  };
  const format2 = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  };
  const format3 = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  };
  const format4 = { display: "grid", justifyContent: "space-evenly" };

  return (
    <Container style={format1}>
      {albums.map((album) => (
        <Box
          key={album.album_id}
          p={3}
          m={2}
          style={{
            background: "#c5cae9",
            borderRadius: "16px",
            border: "2px solid #000",
          }}
        >
          <img
            key={album.album_id}
            src={album.thumbnail_url}
            alt={`${album.title} album art`}
          />
          <h4>
            <NavLink to={`/albums/${album.album_id}`}>{album.title}</NavLink>
          </h4>
        </Box>
      ))}
    </Container>
  );
}
