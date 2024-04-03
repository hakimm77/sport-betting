const express = require("express");
const axios = require("axios");
const cors = require("cors");

const userAgentList = [
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
  "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
];

const marketsHeaders = (id) => {
  const randomUserAgentIdx = Math.floor(Math.random() * userAgentList.length);

  return {
    authority: "sbapi.co.sportsbook.fanduel.com",
    method: "GET",
    path: `/api/in-play?timezone=America%2FDenver&eventTypeId=${id}&includeRacing=true&includeTabs=true&_ak=FhMFpcPWXMeyZxOx`,
    scheme: "https",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en",
    Origin: "https://co.sportsbook.fanduel.com",
    Referer: "https://co.sportsbook.fanduel.com/",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": userAgentList[randomUserAgentIdx],
  };
};

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

const sports = [
  { sport: "Basketball", name: "nba", id: 7522, competitionId: 10547864 },
  { sport: "Basketball", name: "ncaab", id: 7522, competitionId: 10861937 },
  { sport: "Hockey", name: "nhl", id: 7524, competitionId: 12550521 },
  { sport: "Baseball", name: "mlb", id: 7511, competitionId: 11196870 },
];

const liveOddsLink = `https://smp.co.sportsbook.fanduel.com/api/sports/fixedodds/readonly/v1/getMarketPrices?priceHistory=1`;
const marketsLink = (id) =>
  `https://sbapi.co.sportsbook.fanduel.com/api/in-play?timezone=America%2FDenver&eventTypeId=${id}&includeRacing=true&includeTabs=true&_ak=FhMFpcPWXMeyZxOx`;

const liveOddsHeaders = {
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en",
  "Content-Type": "application/json",
  Origin: "https://sportsbook.fanduel.com",
  Referer: "https://sportsbook.fanduel.com/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent": userAgentList[Math.floor(Math.random() * userAgentList.length)],
  "X-Application": "FhMFpcPWXMeyZxOx",
};

app.get("/getOdds", async (req, res) => {
  const { sport } = req.query;

  // const obj = {
  //   708.86611194: {
  //     away: "San Francisco Giants",
  //     home: "Los Angeles Dodgers",
  //     status: "OPEN",
  //     betType: "MONEY_LINE",
  //     id: "708.86611194",
  //     gameId: 33156930,
  //   },
  //   708.86666398: {
  //     away: "San Francisco Giants",
  //     home: "Los Angeles Dodgers",
  //     status: "OPEN",
  //     betType: "MATCH_HANDICAP_(2-WAY)",
  //     id: "708.86666398",
  //     gameId: 33156930,
  //   },
  //   708.86666393: {
  //     away: "Over",
  //     home: "Under",
  //     status: "OPEN",
  //     betType: "TOTAL_POINTS_(OVER/UNDER)",
  //     id: "708.86666393",
  //     gameId: 33156930,
  //   },
  //   708.86702156: {
  //     away: "Grand Canyon Antelopes",
  //     home: "Arizona State Sun Devils",
  //     status: "OPEN",
  //     betType: "MONEY_LINE",
  //     id: "708.86702156",
  //     gameId: 33159096,
  //   },
  // };

  const obj = {}; //get it from getMarkets

  let marketIds = Object.keys(obj);

  try {
    const response = await axios.post(
      liveOddsLink,
      {
        marketIds: marketIds,
      },
      {
        proxy: {
          protocol: "http",
          host: "dc.pr.oxylabs.io",
          port: 10000,
          username: "Rivka_datacenter",
          password: "putmaf-heCgu1-mersas",
        },
        headers: liveOddsHeaders,
      }
    );

    const marketsArray = (await response.data) || [];
    let betsArray = [];

    await marketsArray.forEach((market) => {
      const objItem = obj[market.marketId];

      betsArray.push({
        bet_name: `|${objItem.away}| |${objItem.home}|`,
        bet_price: [
          market.runnerDetails[0].winRunnerOdds.americanDisplayOdds
            .americanOdds,
          market.runnerDetails[1].winRunnerOdds.americanDisplayOdds
            .americanOdds,
        ],
        bet_type: objItem.betType,
        game_id: objItem.gameId,
        id: `${objItem.gameId}:Funduel_Sportsbook:${objItem.betType}`,
        is_live: market.inplay,
        is_main: true,
        league: sports.find((item) => item.id === sport).name, //sports.find where id and then within the object sport.name
        // selection: "|Brooklyn Nets|",
        // selection_points: 0,
        sport: sports.find((item) => item.id === sport).sport, //sports.find where id and then within the object sport.sport
        sportsbook: "Funduel_Sportsbook",
        timestamp: Date.now(),
      });
    });

    res.json(betsArray);
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getMarkets", async (req, res) => {
  const { sport } = req.query;

  try {
    const response = await axios.get(marketsLink(Number(sport)), {
      proxy: {
        protocol: "http",
        host: "dc.pr.oxylabs.io",
        port: 10000,
        username: "Rivka_datacenter",
        password: "putmaf-heCgu1-mersas",
      },
      headers: marketsHeaders(Number(sport)),
    });

    const marketsResponse = await response.data.attachments["markets"];
    let marketsObject = {};

    Object.keys(marketsResponse).forEach((marketKey) => {
      const obj = {
        away: marketsResponse[marketKey].runners[0].runnerName,
        home: marketsResponse[marketKey].runners[1].runnerName,
        status: marketsResponse[marketKey].marketStatus,
        betType: marketsResponse[marketKey].marketType,
        id: marketsResponse[marketKey].marketId,
        gameId: marketsResponse[marketKey].eventId,
      };

      marketsObject[marketsResponse[marketKey].marketId] = obj;
    });

    res.json(marketsObject);
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
