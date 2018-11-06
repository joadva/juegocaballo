
var AMOUNT_DIAMONDS = 30;//numero de elementos

GamePlayManager = {
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        this.flagFirstMouseDown = false;// para que no se mueva en direccion al :v mause
    },
    preload: function() {
        game.load.image('background', 'assets/images/background.png');
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2);
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
    },
    create: function() {
        //fondo
        game.add.sprite(0, 0, 'background');
        //caballo
        this.horse = game.add.sprite(0,0,'horse');
        this.horse.frame = 0; //decidir la imgaen
        this.horse.x = game.width/2;
        this.horse.y = game.height/2;
        this.horse.anchor.setTo(0.5);//su punto principal
        //this.horse.angle = 90; // para darle el angulo en grados
        //this.horse.scale.setTo(1,2);//escalar de nuevo la imagen              
        //this.horse.alpha = 0.5; //trasnparenta el 0 elimina la imagen :v
        
        //activar con un click
        game.input.onDown.add(this.onTap, this);//llamar funcion on tap
        //nicializar el array para los diamonds
        this.diamonds = []; //incializar vacio
        //crear el bucle para aparecer y desaparecer los diamonds
        for(var i=0; i<AMOUNT_DIAMONDS; i++){
            var diamond = game.add.sprite(100,100,'diamonds');//agregar los diamantes
            diamond.frame = game.rnd.integerInRange(0,3); //agregar el diseño aletorio
            diamond.scale.setTo( 0.30 + game.rnd.frac()); // el tamaño random del diamante
            diamond.anchor.setTo(0.5);
             //pocicionamiento de los diamantes en rango
            diamond.x = game.rnd.integerInRange(50, 1050);
            diamond.y = game.rnd.integerInRange(50, 600);
            
            this.diamonds[i] = diamond;
            var rectCurrenDiamond = this.getBoundsDiamond(diamond);
            var rectHorse = this.getBoundsDiamond(this.horse);
            
            while(this.isOverlapingOtherDiamond(i, rectCurrenDiamond) ||
             this.isRectanglesOverlapping(rectHorse, rectCurrenDiamond) ){
                diamond.x = game.rnd.integerInRange(50, 1050);
                diamond.y = game.rnd.integerInRange(50, 600);
                rectCurrenDiamond = this.getBoundsDiamond(diamond);
            }
        }
    },
    onTap:function(){
          this.flagFirstMouseDown = true; // active mover caballo 
    },
     // el arrea de los diamantes en rectangulo
    getBoundsDiamond:function(currentDiamond){
        return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width, currentDiamond.height);
    },
    
            //verifica rsi rectangulos colisionan
    isRectanglesOverlapping: function(rect1, rect2) {
        if(rect1.x> rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
            return false;
        }
        if(rect1.y> rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
            return false;
        }
        return true;
    },
    isOverlapingOtherDiamond:function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectanglesOverlapping(rect1, rect2)){
                return true;
            }
        }
        return false;
    },

    getBoundsHorse: function() {
     var x0 = this.horse.x - Math.abs(this.horse.width)/4;
     var width =  Math.abs(this.horse.width)/2;
     var y0 = this.horse.y - this.horse.height/2;
     var height = this.horse.height;
     
     return new Phaser.Rectangle(x0,y0,width,height);
    },
       //ver el rectanbgulo que marca el caballo
     render:function() {
       game.debug.spriteBounds(this.horse);
       for(var i=0; i<AMOUNT_DIAMONDS; i++){
        game.debug.spriteBounds(this.diamonds[i]);
    }
     },

    update: function() {
        if (this.flagFirstMouseDown) {
            
            //this.horse.angle +=1; //angulo gire desde su centro :v
            var pointerX = game.input.x; //darle la funcion al mause en X
            var pointerY = game.input.y; //darl la funcion al mause en Y 
             //verificar la lectura del mause 
            //console.log('x:'+pointerX);
            //console.log('y'+pointerY);
            var distanciaX = pointerX - this.horse.x;
            
            var distanciaY = pointerY - this.horse.y;
            
            if(distanciaX>0 ) {
                this.horse.scale.setTo(1,1);
                this.horse.frame = 0;
            }
            else {
                this.horse.scale.setTo(-1,1);
                this.horse.frame = 1;
            }
             //moverse en el mapa por la pocicion del mause
            this.horse.x += distanciaX * 0.02; // velocidad  se suma  la distancia por procentaje
            this.horse.y += distanciaY * 0.02;
            
            for(var i=0; i<AMOUNT_DIAMONDS; i++){
                var rectHorse = this.getBoundsHorse();
                var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);
                if (this.isRectanglesOverlapping(rectHorse,rectDiamond)){
                    console.log("COLISION")
                }
                
                }
            }
        }
    }

var game = new Phaser.Game(1136, 640, Phaser.CANVAS);
    
game.state.add("gameplay", GamePlayManager);
game.state.start("gameplay");