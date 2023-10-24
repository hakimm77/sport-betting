const express = require("express");
const axios = require("axios");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const liveApiUrl =
  "https://api.americanwagering.com/regions/us/locations/co/brands/czr/sb/v3/sports/americanfootball/events/in-play/?competitionId=b7eda1b3-0170-4510-9616-1bce561d7aa7";
const scheduledApiUrl =
  "https://api.americanwagering.com/regions/us/locations/co/brands/czr/sb/v3/sports/americanfootball/events/schedule/?competitionIds=b7eda1b3-0170-4510-9616-1bce561d7aa7";
const allSportsApiUrl =
  "https://api.americanwagering.com/regions/us/locations/co/brands/czr/sb/v3/events/highlights/?competitionId=b7eda1b3-0170-4510-9616-1bce561d7aa7";

app.get("/test", async (req, res) => {
  await axios
    .get(liveApiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })
    .then((response) => {
      const data = response.data;
      let responseObj = { data: [] };
      const ncaafEvents = data?.competitions?.[0]?.events;

      if (!ncaafEvents) {
        return res.status(500).json({ error: "No live games now" });
      }

      ncaafEvents.forEach((event) => {
        const gameID = event.id;
        const isLive = event.active && event.started;
        const league = event.competitionName;
        const sport = league === "NCAAF" ? "college football" : "football";
        const sportsbook = "Caesars";
        const timestamp = new Date(event.startTime).getTime();

        event.markets?.forEach((market) => {
          if (market.selections && market.selections.length > 0) {
            const selectionName = market.selections[0].name?.trim();
            const betName = `${selectionName} ${market.line}`;
            const betPoints = market.line;
            const betPrice = market.selections[0].price?.a;
            const betType = market.templateName?.split("|")[1];

            if (selectionName && betType) {
              responseObj.data.push({
                bet_name: betName,
                bet_points: betPoints,
                bet_price: betPrice,
                bet_type: betType,
                game_id: gameID,
                id: `${gameID}: ${sportsbook}: ${betType
                  .toLowerCase()
                  .replace(/ /g, "_")}: ${betName
                  .toLowerCase()
                  .replace(/ /g, "_")}`,
                is_live: isLive,
                is_main: true,
                league: league,
                selection: selectionName,
                selection_points: betPoints,
                sport: sport,
                sportsbook: sportsbook,
                timestamp: timestamp,
              });
            }
          }
        });
      });

      res.json(responseObj);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch data." });
    });
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("request-live-events", async () => {
    await axios
      .get(liveApiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })
      .then((response) => {
        const data = response.data;
        let responseObj = { data: [] };
        const ncaafEvents = data?.competitions?.[0]?.events;

        if (!ncaafEvents) {
          return res.status(500).json({ error: "No live games now" });
        }

        ncaafEvents.forEach((event) => {
          const gameID = event.id;
          const isLive = event.active && event.started;
          const league = event.competitionName;
          const sport = league === "NCAAF" ? "college football" : "football";
          const sportsbook = "Caesars";
          const timestamp = new Date(event.startTime).getTime();

          event.markets?.forEach((market) => {
            if (market.selections && market.selections.length > 0) {
              const selectionName = market.selections[0].name?.trim();
              const betName = `${selectionName} ${market.line}`;
              const betPoints = market.line;
              const betPrice = market.selections[0].price?.a;
              const betType = market.templateName?.split("|")[1];

              if (selectionName && betType) {
                responseObj.data.push({
                  bet_name: betName,
                  bet_points: betPoints,
                  bet_price: betPrice,
                  bet_type: betType,
                  game_id: gameID,
                  id: `${gameID}: ${sportsbook}: ${betType
                    .toLowerCase()
                    .replace(/ /g, "_")}: ${betName
                    .toLowerCase()
                    .replace(/ /g, "_")}`,
                  is_live: isLive,
                  is_main: true,
                  league: league,
                  selection: selectionName,
                  selection_points: betPoints,
                  sport: sport,
                  sportsbook: sportsbook,
                  timestamp: timestamp,
                });
              }
            }
          });
        });

        socket.emit("update-live-events", responseObj);
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to fetch data." });
      });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
