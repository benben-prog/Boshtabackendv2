const parentServ = require('./parent.service');
const parentCont = require("./parent.controller");

const test = async()=> {
    const std = parentCont.getPerentTokenByParentPhone("01000159084");
    console.log("Student From test",std);
}

test();