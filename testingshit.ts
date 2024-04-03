/*

const getReqHeaders = {
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en",
  Origin: "https://sportsbook.fanduel.com",
  Referer: "https://sportsbook.fanduel.com/",
  "Sec-Ch-Ua":
    '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Linux"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  "X-Sportsbook-Region": "NJ",
};

const postReqHeaders = {
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en",
  "Content-Type": "application/json",
  Origin: "https://sportsbook.fanduel.com",
  Referer: "https://sportsbook.fanduel.com/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  "X-Application": "FhMFpcPWXMeyZxOx",
};

const liveOddsLink = `https://smp.co.sportsbook.fanduel.com/api/sports/fixedodds/readonly/v1/getMarketPrices?priceHistory=1`;
const liveDataLink = `https://ips.sportsbook.fanduel.com/inplayservice/v1.0/livedata?channel=WEB&dataEntries=FULL_DETAILS,MEDIA_TYPES&_ak=FhMFpcPWXMeyZxOx&eventIds=33149174`;


app.get("/liveData", async (req, res) => {
  try {
    const response = await axios.get(liveDataLink, {
      proxy: {
        protocol: "http",
        host: "dc.pr.oxylabs.io",
        port: 10000,
        username: "Rivka_datacenter",
        password: "putmaf-heCgu1-mersas",
      },
      headers: getReqHeaders,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/liveOdds", async (req, res) => {
  try {
    const response = await axios.post(
      liveOddsLink,
      {
        marketIds: [
          "708.86527257",
          "708.86527256",
          "708.86674681",
          "708.86527205",
          "708.86527206",
          "708.86676451",
        ],
      },
      {
        proxy: {
          protocol: "http",
          host: "dc.pr.oxylabs.io",
          port: 10000,
          username: "Rivka_datacenter",
          password: "putmaf-heCgu1-mersas",
        },
        headers: postReqHeaders,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


*/
