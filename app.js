const { fork, spawn } = require('child_process')
const fs = require('fs')
let grep;

async function main(){
    grep = fork('test.js');

    setInterval(()=>{
        var prc = spawn('free',  []);

        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function (data) {
          const str = data.toString()
          const freeMemory = str.split(/\n/g)[1].split(/\s+/)[2];
          if(parseInt(freeMemory) < 1000000){
            grep.send('save')
          }
        console.log('Free memory: ', freeMemory); 
    });
    
    grep.on('message', data=>{
        if(data == 'finishSave'){
            
        }
    })

    },5000)
}

main()

