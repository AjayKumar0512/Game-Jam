//utilities
const fs = require("fs");
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const path = require("path");
const GTTS = require("gtts");
const csv2json = require('csv2json');
const {
    Parser
} = require('json2csv');
const spawn = require("child_process").spawn;
const md5File = require("md5-file");
const readFile = (destination) => {
    return new Promise((resolve, reject) => {
        fs.readFile(destination, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};

const createDirectory = (path) => {
    return new Promise((resolve, reject) => {
        isPathExist(path).then((isFile) => {
            if (isFile) {
                //throw new Error("File url passed: ");
                reject("File url passed: ", path);
                return;
            }
            resolve();
        }).catch(err => {
            fs.mkdir(path, {
                recursive: true
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
};
const writeFile = (destination, data) => {
    return new Promise((resolve, reject) => {
        let dir = path.parse(destination).dir;
        createDirectory(dir).then(() => {

            fs.writeFile(destination, data, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });

        }).catch(err => {
            reject(err);
        });
    });
};

const isPathExist = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, function (err, stat) {
            if (err) {
                reject(err);
                return;
            }
            resolve(stat.isFile());
        });
    });
};

const isFile = (path) => {
    return new Promise((resolve, reject) => {
        isPathExist(path).then(isFile => {
            resolve(isFile);
        }).catch(err => {
            reject(err);
        });
    });
}
const isDirectory = (path) => {
    return new Promise((resolve, reject) => {
        isPathExist(path).then(isFile => {
            resolve(!isFile);
        }).catch(err => {
            reject(err);
        });
    });
}

const copyFile = (source, destination) => {
    return new Promise((resolve, reject) => {
        let dir = path.parse(destination).dir;
        createDirectory(dir).then(() => {
            fs.copyFile(source, destination, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        }).catch(err => {
            reject(err);
        });
    });
};

const readDirectory = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            files = files.filter(f => {
                let name = f.toLowerCase();
                return name != ".ds_store";
            });
            resolve(files);
        });
    });

};

const readDirectoryRecursive = (dir) => {
    return new Promise((resolve, reject) => {
        _readDirectoryRecursive(dir).then((files) => {
            files = files.map(file => {
                return file.substr(dir.length);
            }).filter(file => {
                return file != "";
            });
            resolve(files);
        }).catch(err => {
            console.log("error", err);
            reject(err);
        });
    });
}

const _readDirectoryRecursive = async function (dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? _readDirectoryRecursive(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

const copyDirectoryAs = (source, destination) => {
    return new Promise((resolve, reject) => {
        let promises = [];
        promises.push(readDirectoryRecursive(source));
        promises.push(createDirectory(destination));
        Promise.all(promises).then(values => {
            let files = values[0];
            let arr = [];
            files.forEach(file => {
                let fullPath = path.join(source, file);
                let fullDest = path.join(destination, file);
                arr.push(copyFile(fullPath, fullDest));
            });
            Promise.all(arr).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });

        }).catch(err => {
            reject(err);
        });
    });
};

const copyDirectory = (source, destinationRoot) => {
    console.log("copyDirectory to", source, destinationRoot);
    let destination = path.join(destinationRoot, path.parse(source).name);
    return copyDirectoryAs(source, destination);

};

const moveFile = (source, destination) => {
    return new Promise((resolve, reject) => {
        let parse = path.parse(destination);
        createDirectory(parse.dir).then(() => {
            renameFile(source, destination).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
};
const renameFile = (source, destination) => {
    return new Promise((resolve, reject) => {
        fs.rename(source, destination, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};
const renameDirectory = (source, destination) => {
    return renameFile(source, destination);
};
const removeFile = (file) => {
    return new Promise((resolve, reject) => {
        isFile(file).then(() => {
            fs.unlink(file, (err) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve();
            });
        }).catch(err => {
            console.log("removeFile : ", file, err)
            //not exist
            resolve();
            //reject(err);
        });
    });
};
const removeDirectory = (dir) => {
    return new Promise((resolve, reject) => {
        isDirectory(dir).then(() => {
            console.log("removing ", dir);
            fs.rmdir(dir, {
                recursive: true
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        }).catch(err => {
            //not exist
            resolve();
            //reject(err);
        });
    });
};

const getHashCode = (string) => {
    var hash = 0;
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

const getHashOfFile = (file) => {
    //return md5File.sync(filePath).substr(0, 8);
    return md5File(file);
};

const mergeJSONObjects = (objA, objB) => { //objB is new object to merge in existing objA
    if (typeof (objA) != typeof (objB) || Array.isArray(objB) || typeof (objB) != 'object') {
        //console.log("Cannot merge"); // overriding new object here
        return objB;
    }
    for (let key in objB) {
        if (!objA[key]) {
            objA[key] = JSON.parse(JSON.stringify(objB[key]));
            continue;
        }
        objA[key] = mergeJSONObjects(objA[key], objB[key]);
    }
    return objA;
}

const resizeAssetsToHalf = (sourceDir) => {
    return new Promise((resolve, reject) => {
        var workerProcess = spawn('bash', ['generate-non-retina.sh', sourceDir]);
        workerProcess.on('close', function (code) {
            if (code == 0) {
                console.log("Resizing success for:", sourceDir);
                resolve();
                return;
            }
            console.log("ERROR:Resizing script failed for:", sourceDir);
            reject("Resizing script failed for:" + sourceDir);
        });
    });

};
const resizeFilesToHalf = (files) => {
    return new Promise((resolve, reject) => {
        //let filesAsString = files.join(" ");
        let arr = ["generate-non-retina_file.sh"];
        arr = arr.concat(files);
        var workerProcess = spawn('bash', arr);
        workerProcess.on('close', function (code) {
            if (code == 0) {
                console.log("Resizing success for:", files);
                resolve();
                return;
            }
            console.log("ERROR:Resizing script failed for:", files);
            reject("Resizing script failed for:" + JSON.stringify(files));
        });
        workerProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        workerProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    });

};
const saveTextGTTS = (obj, destination) => {
    //return su.writeFile(path.join(destination, `${obj.hash}.mp3`), "{}");
    return new Promise((resolve, reject) => {
        let text = obj.text;
        let name = obj.hash;
        var gtts = new GTTS(text, 'en');
        gtts.save(path.join(destination, `${name}.mp3`), function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

const convertCsvToJson = (csv_file) => {
    return new Promise((resolve, reject) => {

        let streamData = fs.createReadStream(csv_file).pipe(csv2json());
        let chunks = [];
        streamData.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        streamData.on('error', (err) => reject(err));
        streamData.on('end', () => {
            let string = Buffer.concat(chunks).toString('utf8');
            resolve(JSON.parse(string));
        });
    });
};

const convertJsonToCsvFromData = (json_data) => {
    return new Promise((resolve, reject) => {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(json_data);
        resolve(csv);
    });
};

module.exports.getHashCode = getHashCode;
module.exports.getHashOfFile = getHashOfFile;
module.exports.readFile = readFile;
module.exports.readDirectory = readDirectory;
module.exports.readDirectoryRecursive = readDirectoryRecursive;
module.exports.writeFile = writeFile;
module.exports.copyFile = copyFile;
module.exports.copyDirectory = copyDirectory;
module.exports.copyDirectoryAs = copyDirectoryAs;
module.exports.renameFile = renameFile;
module.exports.moveFile = moveFile;
module.exports.isPathExist = isPathExist;
module.exports.renameDirectory = renameDirectory;
module.exports.createDirectory = createDirectory;
module.exports.removeDirectory = removeDirectory;
module.exports.removeFile = removeFile;
module.exports.mergeJSONObjects = mergeJSONObjects;
module.exports.resizeAssetsToHalf = resizeAssetsToHalf;
module.exports.resizeFilesToHalf = resizeFilesToHalf;
module.exports.saveTextGTTS = saveTextGTTS;
module.exports.convertCsvToJson = convertCsvToJson;
module.exports.convertJsonToCsvFromData = convertJsonToCsvFromData;