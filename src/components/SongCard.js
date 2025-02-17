import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Modal } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { NavLink } from "react-router-dom";

import { formatDuration } from "../helpers/formatter";
const config = require("../config.json");

export default function SongCard({ songId, handleClose }) {
  const [songData, setSongData] = useState({});
  const [albumData, setAlbumData] = useState({});

  const [barRadar, setBarRadar] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/song/${songId}`)
      .then((res) => res.json())
      .then((SongResJson) => {
        setSongData(SongResJson);
        fetch(
          `http://${config.server_host}:${config.server_port}/album/${SongResJson.album_id}`
        )
          .then((res) => res.json())
          .then((albumResJson) => setAlbumData(albumResJson));
      });
  }, [songId]);

  const chartData = [
    { name: "Danceability", value: songData.danceability },
    { name: "Energy", value: songData.energy },
    { name: "Valence", value: songData.valence },
  ];

  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        p={3}
        style={{
          background: "white",
          borderRadius: "16px",
          border: "2px solid #000",
          width: 600,
        }}
      >
        <h1>{songData.title}</h1>
        <h2>
          Album:&nbsp;
          <NavLink to={`/albums/${albumData.album_id}`}>
            {albumData.title}
          </NavLink>
        </h2>
        <p>Duration: {formatDuration(songData.duration)}</p>
        <p>Tempo: {songData.tempo} bpm</p>
        <p>Key: {songData.key_mode}</p>
        <ButtonGroup>
          <Button disabled={barRadar} onClick={handleGraphChange}>
            Bar
          </Button>
          <Button disabled={!barRadar} onClick={handleGraphChange}>
            Radar
          </Button>
        </ButtonGroup>
        <div style={{ margin: 20 }}>
          {
            // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar ? (
              <ResponsiveContainer height={250}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 40 }}
                >
                  <XAxis type="number" domain={[0, 1]} />
                  <YAxis type="category" dataKey="name" />
                  <Bar dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer height={250}>
                <RadarChart outerRadius={90} data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar
                    name="Song Attribute"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )
          }
        </div>
        <Button
          onClick={handleClose}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
