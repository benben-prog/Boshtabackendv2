const parentServ = require("./parent.service");
const parentCont = require("./parent.controller");

const test = async () => {
  const std = await parentServ.getPerentTokenByParentPhone("01094012094");

  console.log(std);
};

test();
