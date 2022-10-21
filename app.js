const { fork } = require('child_process')
const fs = require('fs')


async function main(){
    const grep = fork('test.js');
    // setTimeout(()=>grep.send("save"), 15000)
    
}

main()

