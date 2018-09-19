const path = 'icons/';
const levelObj = {
    chrome:{
        url:path+'Chrome.png',
        param:'param'
    },
    excel:{
        url:path+'Excel.png',
        param:'param'
    },
    firefox:{
        url:path+'Firefox.png',
        param:'param'
    },
    itunes:{
        url:path+'iTunes.png',
        param:'param'
    },
    launchpad:{
        url:path+'Launchpad.png',
        param:'param'
    },
    opera:{
        url:path+'Opera.png',
        param:'param'
    },
    safari:{
        url:path+'Safari.png',
        param:'param'
    },
    time:{
        url:path+'Timemachine.png',
        param:'param'
    },
    torrent:{
        url:path+'uTorrent.png',
        param:'param'
    },
    word:{
        url:path+'Word.png',
        param:'param'
    },

}

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

const randomDuplicates = (array, how) => 
 shuffleArray(array).slice(0, how).reduce(
    (res, current, index, array) => {
        return shuffleArray(res.concat([current, current]));
    }, 
[]);

const clickOnCell = (cell) => {
   if(action){
        const selVal = cell.target.className.split(' ')[0];
        if(!cell.target.parentNode.classList.contains('flipped')){
            cell.target.parentNode.className += ' flipped'; 
            checkBuffer(selVal);
            
        }
    }
}

const checkBuffer = (val) => {
    if(buffer.length < 2){
        buffer.push(val)
    }
    
    if(buffer.length == 2){
        if(buffer[0] === buffer[1]){
            action = false;
            setTimeout(()=>{ action = true }, 500);
            buffer = [];
            checkLevel();
        }else{
            action = false; 
            setTimeout(()=>{ 
                buffer.map(item => {
                    [...document.getElementsByClassName(`${item} card flipped`)].forEach(item=>{
                        item.classList.toggle('flipped');
                    })
                });
                buffer = [];
                action = true;
            }, 1200);
        }
    }
}

const buildLevel = (levelData) => {
    levelData.map(item => {
        game.innerHTML += `<div class="onecard"><div class="${item} card flipped"><div class="${item} front"></div><div class="${item} back" style="background: #fff url(${levelObj[item].url}) center center no-repeat; background-size:60%;"></div></div></div>`
    });

    [...document.getElementsByClassName('card')].forEach(anchor=>{
        anchor.onclick = (anchor) => {
            clickOnCell(anchor);
        }
    });

    console.log('start level')
    action = false; 
    setTimeout(()=>{ 
        [...document.getElementsByClassName(`card flipped`)].forEach(item=>{
            item.classList.toggle('flipped');
        });
        action = true;
     }, 2500);
}

const checkLevel = () => {
    
        if(document.getElementsByClassName('card').length == document.getElementsByClassName('card flipped').length){
            startlevel = startlevel+addToLevel;
            if(startlevel < endlevel){
                    console.log('end level')
                    action = false;
                    setTimeout(()=>{ 
                        game.innerHTML = '';
                        buildLevel(randomDuplicates(level, startlevel));
                        action = true 
                    }, 2500);
                
            }else{
                game.innerHTML = '<div style="color:orange; font-weight:bold;">GAME OVER</div>';
            }
        }
    
}


const game = document.getElementById('game');
let action = true;
let buffer = [];
let startlevel = 2;
const addToLevel = 2;
const endlevel = 11;

const level = Object.keys(levelObj);
buildLevel(randomDuplicates(level, startlevel));



