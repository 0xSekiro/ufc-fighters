exports.getFighter = (data) => {
  return (req, res) => {
    const name = req.params.name
      .toLowerCase()
      .split("_")
      .map((el) => {
        const el2 = el[0].toUpperCase() + el.slice(1);
        return el2;
      })
      .join(" ");
    const fighter = searchForFighter(data, name);
    if (!fighter) {
      res.status(404).json({
        status: "fail",
        message: "Fighter not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        fighter,
      });
    }
  };
};

const searchForFighter = (arrOfObjs, fighterName) => {
  let fighter;
  for (let i = 0; i < arrOfObjs.length; i++) {
    if (arrOfObjs[i].name == fighterName) {
      fighter = arrOfObjs[i];
      break;
    }
  }
  return fighter;
};
