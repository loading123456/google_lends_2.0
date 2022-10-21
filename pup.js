const { chromium } = require('playwright');
const fs = require('fs');

let outData = {}


(async () => {
    const browser = await chromium.launch({headless: true});
    await browser.newContext({locale: "vi-VI"})
    
    let page = await browser.contexts()[0].newPage()

    page.on('filechooser', async function onFilechooser(fileChooser) { 
      page.locator('[type="file"]').setInputFiles(`/home/nothing/Pictures/14.png`)

  })    
  let isLoad = false;
  let count = 0;
  const regex = /...wrb.fr.+generic.../g


  page.on('response', async res => {
      if(!isLoad){
          if(res.request().url().includes('https://lens.google.com/_/LensWebStandaloneUi/data/batchexecute?rpcids')){

            const txt = String(await res.body()).match(regex)[0]
           
            const arr1 = JSON.parse(txt)[0][2]
            const arr2 = JSON.parse(arr1)
            
            if(arr2.length == 29  ){
              isLoad = true;
              const arr3 = arr2[3][4][0][0];
              const arr3L = arr3.length;
              const arr4 = arr2[2][3][0];
              
              outData[imgPaths[pos]] = []

              for(let i=0; i<arr3L; i++){
                outData[imgPaths[pos]].push([arr3[i], arr2])
              }
              console.log(arr3.length)
     //         let outData = "14.png|||"
     
              // arr3.forEach(e1 => {
              //   e1[0].forEach(e2 => {
              //     e2[0].forEach(e3 => {
              //       outData +=  `${e3[0]}:::[${e3[1]}]`  + ';;;'

              //     })
              //   })
              // });
              // for (const key1 in arr3){
              //   for (const key2 in arr3[key1][0]){
              //     for (const key3 in arr3[key1][0][key2]){
              //       for (const key4 in arr3[key1][0][key2][0][key3]){
              //         fs.appendFileSync('test.txt', arr3[key1][0][key2][0][key3][key4] + '\n')
              //       }
              //     }
              //   }
              //   const arr4 = arr3[key1]
              //   if(arr4.length == 4){
              //     const arr5 = arr4[2][0][5][3][0][0][0]
              //     console.log(arr5.length)
                  
              //     for (const key2 in arr5){
              //       fs.appendFileSync('test.txt', arr5[key2][0] + ' ')
              //     }
              //     fs.appendFileSync('test.txt', '\n')
              //     // console.log(words.length)
              //   }
                
              // }
              console.log("Loaded!")
            }



          }

      }
  })

   
    await page.goto('https://lens.google.com/search?p=AS3Fu8oE8hH3kVQgGKvL2VGTBd0gKOksHGhVrXuVlfjme56XVGVtrKvgwtQyI1ckoInGcksBcV-gg1W7zwK4-_nrVqbR7mlORXE9YySTem2_nQWkDXtNQuKqgnkyQ_QhS8UmjvJTCMeAXAnR8_WSlrFgVaNwmSqSZvrpEfqPBjgWh7vYIsOzFDu6bAjtYZzb9Dh8n4H5W6oULo-hunGK5EPSMU-4PuUmW_TQPUkvRFqkUiQMiORWGxz2hITm6IsZLRd_m0N_LN4ROUjQJob1O_lrrndvH28fhyO-XIiuyhsFeGA%3D&s&ep=ccm#lns=W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsIkVrY0tKRGxsWVdaa016STRMVFk1WkRVdE5HUTNOeTA0WXpkbExUazVaV0k1TVRJeE56ZzVaQklmY3pkUmNrWkZVVVE1Wm5OaWQwMURZVjlYYUdaVlQxWmxNMWxHZEVoQ1p3PT0iXQ==')
    await page.click('[aria-haspopup="menu"]')
    await page.click('[aria-label="Máy tính"]')
  })();