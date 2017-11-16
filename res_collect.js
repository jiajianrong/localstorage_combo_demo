var fs = require('fs')
var _ = require('lodash')



var ROOT_PATH = __dirname + '/demo-proj'// + '/xyk_m'  // '/pic2.58.com'
var RE = /.*demo\-proj/                 // /.*xyk\_m/    // /.*pic2\.58\.com/

var all_res = {}



function print() { console.log.apply(null, arguments) }
function printObj(o) { for (var k in o) console.log(k)  }



function isDir(path) {
    var stats = fs.lstatSync(path);
    return stats.isDirectory()
}

function collect(f) {
    var c = fs.readFileSync(f, 'utf8');
    all_res[f] = c;
}


function readDir(path) {
    var files = fs.readdirSync(path);
    
    files.forEach(function(f){
        
        f = path + '/' + f
        
        if (isDir(f)) {
            readDir(f)
        } else {
            collect(f)
        }
    })
    return files;
}


function correct(res) {
    return _.mapKeys( res, function(v,k) {
        return k.replace( RE, '' )
    } )
}


// ------
// 主流程
// ------
readDir(ROOT_PATH)
all_res = correct(all_res)
print('\nfollowing resources are ready\n')
printObj(all_res)


module.exports = all_res