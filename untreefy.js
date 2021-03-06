let fs = require("fs");
let path = require("path");
let uniqid = require("uniqid");
module.exports.untreefyFn = function () {
    let src = arguments[0];
    let dest = arguments[1];
    let root = {};
    untreefy(src, dest, root);
    // console.log(root);
    fs.writeFileSync(path.join(dest, "metadata.json"), JSON.stringify(root));
}
// ??
function checkWhetherFile(src) {
    return fs.lstatSync(src).isFile()
}
function getContent(src) {
    return fs.readdirSync(src);
}

function untreefy(src, dest, obj) {
    // checkwhether file or directory
    if (checkWhetherFile(src) == true) {
        // console.log(toprint + " *");
        // copy with newname
        let oldName = path.basename(src);
        let newName = uniqid();
        obj.newName = newName;
        obj.oldName = oldName;
        obj.isFile = true
        let destPath = path.join(dest, newName);
        fs.copyFileSync(src, destPath);
        console.log(`File ${oldName} from src copied to ${destPath}`);
    } else {
        // directory // print
        // console.log(toprint);
        // get childrens
        obj.isFile = false;
        obj.name = path.basename(src);
        obj.children = [];
        let childNames = getContent(src);
        // console.log(childNames);
        for (let i = 0; i < childNames.length; i++) {
            let childPath = path.join(src, childNames[i]);
            // let cToprint = path.join(toprint, childNames[i]);
            let chobj = {};
            untreefy(childPath, dest, chobj);
            obj.children.push(chobj);
        }
    }
}