const { chromium } = require('playwright');
const fs = require('fs');

let imgPaths = []
let outData = {};
let pageId = 0;
let status ;
let finishPages = 0;
const pages = 3;
const regex = /...wrb.fr.+generic.../g;


(async () => {
    console.time("answer time");
    imgPaths = fs.readdirSync('images');
    if(fs.existsSync('status.txt')){
        status = JSON.parse(fs.readFileSync('status.txt'));
        outData = JSON.parse(fs.readFileSync('result.txt'));
    } else{
        status = [...Array(pages).keys()];
    }

    createPages();
})();


async function createPages(){
    const browser = await chromium.launch({headless: true});
    await browser.newContext({locale: "vi-VI"})

    for(let pageId=0; pageId<pages; pageId++){
        console.log("Page: ",pageId, " open")
        let isLoad = false;

        const page = await browser.contexts()[0].newPage()
        
        page.on('filechooser',function onFilechooser(fileChooser) { 
            if(status[pageId] < imgPaths.length){
                page.locator('[type="file"]').setInputFiles(`images/${imgPaths[status[pageId]]}`)
            } else{
                isFinish();
            }
        })   

        page.on('response', async res => {
            if(!isLoad){
                if(res.request().url().includes('https://lens.google.com/_/LensWebStandaloneUi/data/batchexecute?rpcids')){
                  const txt = String(await res.body()).match(regex)[0]
                  const arr1 = JSON.parse(txt)[0][2]
                  const arr2 = JSON.parse(arr1)
      
                  if(arr2.length == 29){
                    isLoad = true;
                    const arr3 = arr2[3][4][0][0];
                    const arr3L = arr3.length;
                    const arr4 = arr2[2][3][0];
                    const step = arr4.length - arr3L;
                    outData[imgPaths[status[pageId]]] = [];
      
                    for(let i=0; i<arr3L; i++){
                        outData[imgPaths[status[pageId]]].push([arr3[i], arr4[step+i][2][0][5][3][1]])
                    }
                    console.log("   Page: ", pageId, " - Image: ", imgPaths[status[pageId]], ' status: ',status[pageId])
                    status[pageId] += pages;
                    if(status[pageId] < imgPaths.length){
                        isLoad = false;
                        page.locator('[type="file"]').setInputFiles(`images/${imgPaths[status[pageId]]}`);
                    } 
                    else{
                        isFinish();
                    }
                  }
                }
      
            }
        })

        await page.goto('https://lens.google.com/search?p=AS3Fu8oE8hH3kVQgGKvL2VGTBd0gKOksHGhVrXuVlfjme56XVGVtrKvgwtQyI1ckoInGcksBcV-gg1W7zwK4-_nrVqbR7mlORXE9YySTem2_nQWkDXtNQuKqgnkyQ_QhS8UmjvJTCMeAXAnR8_WSlrFgVaNwmSqSZvrpEfqPBjgWh7vYIsOzFDu6bAjtYZzb9Dh8n4H5W6oULo-hunGK5EPSMU-4PuUmW_TQPUkvRFqkUiQMiORWGxz2hITm6IsZLRd_m0N_LN4ROUjQJob1O_lrrndvH28fhyO-XIiuyhsFeGA%3D&s&ep=ccm#lns=W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsIkVrY0tKRGxsWVdaa016STRMVFk1WkRVdE5HUTNOeTA0WXpkbExUazVaV0k1TVRJeE56ZzVaQklmY3pkUmNrWkZVVVE1Wm5OaWQwMURZVjlYYUdaVlQxWmxNMWxHZEVoQ1p3PT0iXQ==')
        await page.click('[aria-haspopup="menu"]')
        await page.click('[aria-label="Máy tính"]')
    }
}

function isFinish(){
    finishPages += 1;
    if(finishPages==pages){
        console.log("End")
        saveData();
    }
}

function saveData(){
    fs.writeFileSync('result.txt', JSON.stringify(outData))
    fs.writeFileSync('status.txt', JSON.stringify(status))
    console.timeEnd("answer time");
    process.exit()
}







process.on('message',(data)=>{
    console.log(data)
    if(data=='save'){
        saveData()
    }
})