import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorldComponent implements OnInit {

    /* Defining our variables
     * world and viewport are DOM elements, 
     * worldXAngle and worldYAngle are floats that hold the world rotations, 
     * d is an int that defines the distance of the world from the camera 
     */ 
    
    public world;
    public viewport;
    public worldXAngle:number = 0;
    public worldYAngle:number = 0;
    public d:number = 0;
    public p:number = 400;
    
    /*
    objects is an array of cloud bases
    layers is an array of cloud layers
    */
    public objects = [];
    public layers = [];
    public layersData = [];
    
    constructor() { }

    ngOnInit() {
        this.world = document.getElementById( 'world' );
        this.viewport = document.getElementById( 'viewport' );
        this.viewport.style.webkitPerspective = this.p;
        this.viewport.style.MozPerspective = this.p;
        this.viewport.style.oPerspective = this.p
        this.generate();
        //this.update();
    }
    
    //@HostListener('window:touchmove', ['$event'])
    @HostListener('window:mousemove', ['$event'])
    onMouseMove(e){
        console.log("Mouse movement deducted");
        this.worldYAngle = -( .5 - ( e.clientX / window.innerWidth ) ) * 180;
        this.worldXAngle = ( .5 - ( e.clientY / window.innerHeight ) ) * 180;
        this.updateView();
    }
    
    @HostListener('window:mousewheel', ['$event'])
    onContainerMouseWheel( event ) {
        console.log("Mousewheel movement deducted");
        event = event ? event : window.event;
        this.d = this.d - ( event.detail ? event.detail * -5 : event.wheelDelta / 8 );
        this.updateView();
        
    }
    
    
    
    /*
      Changes the transform property of world to be
      translated in the Z axis by d pixels,
      rotated in the X axis by worldXAngle degrees and
      rotated in the Y axis by worldYAngle degrees.
    */
    updateView() {
        //this.world.style.transform = 'translateZ( ' + this.d + 'px ) \ rotateX( ' + this.worldXAngle + 'deg) \ rotateY( ' + this.worldYAngle + 'deg)';
        let t = 'translateZ( ' + this.d + 'px ) rotateX( ' + this.worldXAngle + 'deg) rotateY( ' + this.worldYAngle + 'deg)';
        this.world.style.webkitTransform = t;
        this.world.style.MozTransform = t;
        this.world.style.oTransform = t;
    }
    
    /*
    Iterate layers[], update the rotation and apply the
    inverse transformation currently applied to the world.
    Notice the order in which rotations are applied.
    */
    //@HostListener('window:requestAnimationFrame', ['$event'])
    update(){

        console.log("Update called...");
        for( var j = 0; j < this.layers.length; j++ ) {
            let layer = this.layers[ j ];
            let layerData = this.layersData[ j ];
            layerData.a += layerData.speed;
            let t = 'translateX( ' + layerData.x + 'px ) '+
                    'translateY( ' + layerData.y + 'px ) '+
                    'translateZ( ' + layerData.z + 'px ) '+
                    'rotateY( ' + ( - this.worldYAngle ) + 'deg ) '+
                    'rotateX( ' + ( - this.worldXAngle ) + 'deg ) '+
                    'rotatez( ' + (  layerData.a ) + 'deg ) '+
                    'scale( ' + layerData.s + ')';
            layer.style.transform = t;
            layer.style.webkitTransform = t;
            layer.style.MozTransform = t;
            layer.style.oTransform = t;
        }
        requestAnimationFrame( this.update );
   
    }
    

    
    /*
        Clears the DOM of previous clouds bases 
        and generates a new set of cloud bases
    */
    generate() {
        this.objects = [];
        this.layers = [];
        if ( this.world.hasChildNodes() ) {
            while ( this.world.childNodes.length >= 1 ) {
                this.world.removeChild( this.world.firstChild );       
            } 
        }
        for( let j = 0; j < 5; j++ ) {
            this.objects.push( this.createCloud() );
        }
        
        //this.update();
    }
    
    /*
        Creates a single cloud base: a div in world
        that is translated randomly into world space.
        Each axis goes from -256 to 256 pixels.
    */
    createCloud() {
    
        let div = document.createElement( 'div'  );
        div.className = 'cloudBase';
        let t = 'translateX( ' + this.getRandomInt(-256, 256) + 'px )' + 
                'translateY( ' + this.getRandomInt(-256, 256) + 'px )' +
                'translateZ( ' + this.getRandomInt(-256, 256) + 'px )';
        div.style.transform = t;
        div.style.webkitTransform = t;
        //div.style.MozTransform = t;
        //div.style.oTransform = t;
        
        
        for( var j = 0; j < 5 + + Math.round( Math.random() * 10 ); j++ ) {
            let cloud = document.createElement( 'img' );
            /*cloud.src = 'assets/imgs/cloud.png';
            cloud.className = 'cloudLayer';*/
            
            cloud.style.opacity = "0";
            let r = Math.random();
            let src = 'assets/imgs/cloud.png';
            ( function( img ) { img.addEventListener( 'load', function() {
                img.style.opacity = ".8";
            } ) } )( cloud );
            cloud.setAttribute( 'src', src );
            cloud.className = 'cloudLayer';

            
            let cloudData = { 
                x: this.getRandomInt(-256, 256) * .2,
                y: this.getRandomInt(-256, 256) * .2,
                z: this.getRandomInt(-100, 100),
                a: this.getRandomInt(0, 360),
                s: this.getRandomInt(0.25, 1),
                speed: .1 * Math.random()
            };
            let t = 'translateX( ' + cloudData.x + 'px ) '+ 
                    'translateY( ' + cloudData.y + 'px ) '+ 
                    'translateZ( ' + cloudData.z + 'px ) '+ 
                    'rotateZ( ' + cloudData.a + 'deg ) '+
                    'scale( ' + cloudData.s + ' )';
            cloud.style.transform = t;
            //cloud.style.opacity = "0.8";
            cloud.style.webkitTransform = t;
            //cloud.style.MozTransform = t;
            //cloud.style.oTransform = t;
            
            div.appendChild( cloud );
            this.layers.push( cloud );
            this.layersData.push( cloudData );
            this.update();
        }
        
        this.world.appendChild( div );
        
        return div;
    }
    
    getRandomInt(min, max) {
        return (Math.random() * (max - min + 1)) + min;
    }

}
