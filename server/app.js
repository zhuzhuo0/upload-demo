const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data');
const imagePath = path.join(__dirname, 'image');
const docsPath = path.join(__dirname, '../', 'docs');

delDir(docsPath);
fs.mkdirSync(docsPath);

let files = fs.readdirSync(dataPath);
files.forEach(file => {
    let fileData = fs.readFileSync(path.join(dataPath, file), {
        encoding: 'utf8'
    }).toString();
    // 处理文档
    let dirName = file.replace('.txt', '');
    fs.mkdirSync(path.join(docsPath, dirName));
    fs.writeFileSync(path.join(docsPath, dirName,file), fileData, {
        encoding: 'utf8'
    });
    // 图片处理
    let images = fileData.match(/{[^]*}/g).map(str => str.slice(1, str.length - 1));
    if (images && images.length > 0) {
        fs.mkdirSync(path.join(docsPath, dirName, 'images'));
        images.forEach(img => {
            let imageData = fs.readFileSync(path.join(imagePath,img));
            fs.writeFileSync(path.join(docsPath,dirName,'images',img),imageData);
        })
    }
})

/** 
 * 递归删除文件夹及内部文件
 * @params {String} 目标路径
 */
function delDir(dirPath) {
    let files = [];
    if (fs.existsSync(dirPath)) {
        files = fs.readdirSync(dirPath);
        files.forEach(target => {
            let targetPath = path.join(dirPath, target);
            if (fs.statSync(targetPath).isDirectory()) {
                delDir(targetPath);
            } else {
                fs.unlinkSync(targetPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}