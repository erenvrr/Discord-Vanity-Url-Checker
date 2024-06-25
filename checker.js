const request = require("request");
const delay = require("delay");

const tokens = [""];
const guildId = "";
const webhookUrl = "";
const vanityUrls = [""];

const headers = tokens.map((token) => ({
  "authorization": token,
  "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
}));

async function checkVanity(vanityUrl) {
  while (true) {
    try {
      const header = headers[Math.floor(Math.random() * headers.length)];
      if (vanityUrl === "") {
        console.log('\x1b[36m%s\x1b[0m', "> Vanity URL is empty, waiting for a new URL...");
      } else {
        request.get({
          url: `https://discord.com/api/v9/invites/${vanityUrl}?with_counts=true&with_expiration=true`,
          headers: header
        }, (error, response, body) => {
          if (response && response.statusCode == 404) {
            changeVanity(vanityUrl, header);
          }
        });
      }
      await delay(135);
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', "> Rate limited :(");
      await delay(50000);
    }
  }
}

function changeVanity(vanityUrl, header) {
  let date = Date.now();
  const payload = { "code": vanityUrl };
  for(let i = 0; i < 3; i++){
    request.patch({
      url: `https://discord.com/api/v10/guilds/${guildId}/vanity-url`,
      headers: header,
      json: payload
    }, (error, response, body) => {
      if (response && response.statusCode == 200) {
        successAction(vanityUrl, date);
      }
    });
  }
}

function successAction(vanityUrl, date) {
  console.log('\x1b[36m%s\x1b[0m', `> Vanity is swapped quited: ${vanityUrl}`);
  const elapsedTime = (Date.now() - date) / 10000;
  const data = {
    content: `Vanity Url Claimed! discord.gg/${vanityUrl} / ||@everyone||`,
    username: "erenvr"
  };
  request.post({
    url: webhookUrl,
    json: data
  });
}

vanityUrls.forEach((vanityUrl) => {
  checkVanity(vanityUrl);
});
