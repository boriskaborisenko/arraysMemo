var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'game',
    backgroundColor: '#eaefec',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            //gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);
let self;
let buffer = [];
let startBacks = [];
let startFronts = [];
let pairsOnLevel = 4;
let onNextLevel = 2;
let completePairs = 0;
const showCardsOnStart = 2000;
const coords = [
    {x: 180, y: 300},
    {x: 470, y: 300},
    {x: 760, y: 300},
    {x: 1050, y: 300},
    {x: 180, y: 710},
    {x: 470, y: 710},
    {x: 760, y: 710},
    {x: 1050, y: 710},
];

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

    const all = ['arcane', 'rager', 'mojo', 'wyrm'];
    const staticCards = ['arcane','rager','rager','arcane'];

function preload ()
{
    this.load.image('back', 'phaser/hs_back.png');
    this.load.image('arcane', 'phaser/hs_front.png');
    this.load.image('rager', 'phaser/hs_front2.png');
    this.load.image('mojo', 'phaser/hs_front3.png');
    this.load.image('wyrm', 'phaser/hs_front4.png');
}

function create ()
{
    
    self = this;
    this.cameras.main.setBounds(0, 0, 1000, 600);
    this.cameras.main.setZoom(0.5);
    this.cameras.main.centerOn(0, 0);

    

    //buildLevel(this, pairsOnLevel += onNextLevel);
    buildLevel(this, 4);
    
    
    
    
}



const buildLevel = (self, pairsNum) => {
    
    self.allcards = self.add.group(); 
    const randomCards = randomDuplicates(all, pairsNum);
    
    randomCards.map( (item, index) => {
        let onX = coords[index].x+333;
        let onY = coords[index].y+80;
        
        let back = self.add.image(Phaser.Math.Between(-2500, 2500), Phaser.Math.Between(-2500, 2500), 'back').setInteractive();
        let front = self.add.image(Phaser.Math.Between(-2500, 2500), Phaser.Math.Between(-2500, 2500), item);
        
        front.scaleX = 0.0;
        front.scaleY = 1.02;
        
        front.dataCard = item;
        back.dataCard = item;
        
        front.dataOpen = false;
        back.dataOpen = false;
        
        front.dataType = 'front';
        back.dataType = 'back';

        front.alpha = 0;
        back.alpha = 0;

        startBacks.push(back);
        startFronts.push(front);
        
        self.allcards.add(back);
        self.allcards.add(front);

        self.tweens.add({
            targets: [back, front],
            x: onX,
            y: onY,
            alpha:1,
            duration:1000
        });
        
        

        back.on('pointerdown', pointer => {
            let opencard = self.tweens.createTimeline();
        
            opencard.add({
                targets: back,
                scaleX: 0,
                scaleY: 1.02,
                duration: 250,
            });

            opencard.add({
                targets: front,
                scaleX: 1,
                scaleY: 1,
                duration: 250,
            });
                opencard.play();
                buffer.push(back.dataCard);
                back.dataOpen = true;
                front.dataOpen = true;
                checkBuffer(self);
            
        }, this);

        
    });
    
    setTimeout( () => { startShow(self) }, 1600);
    
}



const startShow = (self) => {
    let startFlipIn = self.tweens.createTimeline();
    startFlipIn.add({
        targets: startBacks,
        scaleX: 0,
        scaleY: 1.02,
        duration: 250,
    });
    startFlipIn.add({
        targets: startFronts,
        scaleX: 1,
        scaleY: 1,
        duration: 250,
    });
    startFlipIn.play();

    let startFlipOut = self.tweens.createTimeline();
    startFlipOut.add({
        targets: startFronts,
        scaleX: 0,
        scaleY: 1.02,
        duration: 250,
        delay: showCardsOnStart
    });
    startFlipOut.add({
        targets: startBacks,
        scaleX: 1,
        scaleY: 1,
        duration: 250,
    });
    startFlipOut.play();

    startBacks = [];
    startFronts = [];
}


const clearLevel = (self) => {
    let i = 0;
    while (i <= pairsOnLevel*2) {
        self.allcards.children.entries.map( item => item.destroy() );
        i++;
    }
    
    //setTimeout( () => { buildLevel(self, pairsOnLevel += onNextLevel) }, 2000 );
}



const endMoves = (self) => {
    console.log('end moves');
    setTimeout( () => {
        let endtext = self.add.text(400, 310, "Amazing!", { fontFamily: "Coiny", fontSize: 174, color: "#c51b7d" });
        endtext.setStroke('#de77ae', 16);
        endtext.setShadow(2, 2, "#333333", 2, true, true);
        endtext.alpha = 0;

        

        self.tweens.add({
            targets: endtext,
            alpha:1,
            duration:900
        });
        self.allcards.children.entries.map(item => {
            self.tweens.add({
                targets: item,
                props: {
                    x: { value: Phaser.Math.Between(-2500, 2500), duration: 1500, ease: 'Power2' },
                    y: { value: Phaser.Math.Between(-2500, 2500), duration: 1500, ease: 'Bounce.easeOut' }
                },
                delay: 50
            });
        });
        setTimeout( () => {
            self.tweens.add({
                targets: [ self.allcards.children.entries ],
                alpha:0,
                duration:900
            });
        }, 750);

        setTimeout( () => {
            clearLevel(self);
            self.tweens.add({
                targets: endtext,
                alpha:0,
                duration:900
            });
        }, 1200);

        setTimeout( () => {
            endtext.destroy();
            //buildLevel(self, pairsOnLevel += onNextLevel);
            buildLevel(self, 4);
        },2200);
        
    }, 520);
    
}

const checkBuffer = (self) => {
    if(buffer.length == 2 && buffer[0] == buffer[1]){
        completePairs += 1;
        buffer = [];
        if(completePairs == pairsOnLevel){
            completePairs = 0;
            console.log('level end');
            endMoves(self);
        }
    }
    
    if(buffer.length == 2 && buffer[0] != buffer[1]){
        console.log('NOT MATCH. CLOSE CARDS');
        let frontcards = [];
        let backcards = [];
        
        self.children.list.map(item => {
          if(item.dataCard === buffer[0] || item.dataCard === buffer[1]){
            if(item.dataOpen){
                if(item.dataType == 'front'){
                    frontcards.push(item);
                }
                
                if(item.dataType == 'back'){
                    backcards.push(item);
                }
                item.dataOpen = false;   
            }
          }
              
        });
        let closecard = self.tweens.createTimeline();
        closecard.add({
            targets: frontcards,
            scaleX: 0,
            scaleY: 1.02,
            duration: 250,
            delay:1000
        });
        closecard.add({
            targets: backcards,
            scaleX: 1,
            scaleY: 1,
            duration: 250,
        });
        closecard.play();
        buffer = [];
    }

    
}