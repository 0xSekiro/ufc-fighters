const axios = require("axios");
const fs = require("fs");
const JSSoup = require("jssoup").default;
const axios_request_throttle = require("axios-request-throttle");

// rate limit axios requests to 1 per second
axios_request_throttle.use(axios, { requestsPerSecond: 1 });

// fighters array
let fighters = [];
const theUrl = "http://ufcstats.com/statistics/fighters?char=##&page=all";

// get fighters from page function
const getFighters = async (data, fileName) => {
  const soup = new JSSoup(data);
  const theBody = soup.find("tbody").nextElement.nextSiblings;
  for (i = 0; i < theBody.length; i++) {
    // the name = firstname + lastname
    const elFirst = theBody[i].nextElement;
    let firstname = check(elFirst.nextElement.string);
    let elLast = elFirst.nextSibling;
    let lastname = elFirst.nextSibling.nextElement.string._text;

    let name = `${firstname} ${lastname}`;

    // nickname
    let elNick = elLast.nextSibling;
    let nickname = check(elNick.nextElement.string);

    // height and weight
    const elHeight = elNick.nextSibling;
    const elWeight = elHeight.nextSibling;
    let height = elHeight.text.replace(/(\s|\\n|\.|\")/g, "") || "--";
    const weight = parseInt(elWeight.text.replace(/(\s|\\n|\.)/g, "")) || "--";

    // win and losses
    const elWins = elWeight.nextSibling.nextSibling.nextSibling;
    const win = parseInt(elWins.text.replace(/(\s|\\n|\.)/g, ""));
    const elLosses = elWins.nextSibling;
    const loss = parseInt(elLosses.text.replace(/(\s|\\n|\.)/g, ""));
    const elDraw = elLosses.nextSibling;
    const draw = parseInt(elDraw.text.replace(/(\s|\\n|\.)/g, ""));

    // is champion or not
    const elChamp = elDraw.nextSibling;
    let champion;
    if (elChamp.nextElement.name == "img") {
      champion = true;
    } else {
      champion = false;
    }

    const fighter = {
      name,
      nickname,
      height,
      weight,
      win,
      loss,
      draw,
      champion,
    };

    fighters.push(fighter);
  }
  fs.writeFileSync(fileName, JSON.stringify(fighters));
};

// get fighters from all pages || get all ufc fighters
const getPage = async (url) => {
  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const urlLetters = letters.map((el) => el.toLocaleLowerCase());
  urlLetters.forEach(async (el) => {
    const res = await axios.get(url.replace("##", el));
    getFighters(res.data, "fighters.json");
    console.log(`Done with ==> ${el}`);
  });
};

getPage(theUrl);

const check = (x) => {
  if (x) return x._text;
  return "--";
};
