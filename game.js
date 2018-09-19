var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'game',
    backgroundColor: '#eaefec',
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);
let self;
let buffer = [];

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
    const randomCards = randomDuplicates(all,4);
    const staticCards = ['arcane','rager','rager','arcane'];

   
    let startBacks = [];
    let startFronts = [];
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
    
    randomCards.map( (item, index) => {
        //let onX = 180+(index*290);
        //let onY = 300;
        let onX = coords[index].x;
        let onY = coords[index].y;
        
        let back = this.add.image(onX, onY, 'back').setInteractive();
        let front = this.add.image(onX, onY, item);
        
        front.scaleX = 0.0;
        front.scaleY = 1.02;
        
        front.dataCard = item;
        back.dataCard = item;
        
        front.dataOpen = false;
        back.dataOpen = false;
        
        front.dataType = 'front';
        back.dataType = 'back';

        startBacks.push(back);
        startFronts.push(front);
        
        
        


        back.on('pointerdown', function (pointer) {
        let opencard = this.tweens.createTimeline();
    
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

        
    } );

    
    let startFlipIn = this.tweens.createTimeline();
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

    let startFlipOut = this.tweens.createTimeline();
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
    
    
}



const checkBuffer = (self) => {
    if(buffer.length == 2 && buffer[0] == buffer[1]){
        console.log('match pair');
        buffer = [];
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