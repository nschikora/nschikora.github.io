/*

*/


var app

var tree
var cloud1
var cloud2
var groundFront
var groundBack
var sky
var logo
var slogan

var screenSizes = {
    fourk: 2560,
    largeLaptop: 1440,
    laptop: 1024,
    tablet: 768,
    mobile: 425
}

function update() {
    var bannerWrapper = document.querySelector("#banner-wrapper");
    app.renderer.resize(bannerWrapper.clientWidth, bannerWrapper.clientHeight);
    draw();
}

function draw() {

    var screenSize;

    if( app.renderer.width >= screenSizes.fourk )
        screenSize = screenSizes.fourk;

    if( app.renderer.width <= screenSizes.largeLaptop )
        screenSize = screenSizes.largeLaptop;

    if( app.renderer.width <= screenSizes.laptop )
        screenSize = screenSizes.laptop;

    if( app.renderer.width <= screenSizes.tablet )
        screenSize = screenSizes.tablet;

    if( app.renderer.width <= screenSizes.mobile )
        screenSize = screenSizes.mobile;

    //Place the sky in the top left corner
    sky.x = 0;
    sky.y = 0;
    sky.width = app.renderer.width;
    sky.height = app.renderer.height;


    //Place the ground in the back
    var groundBackInitialRatio = groundBack.height / groundBack.width;
    groundBack.width = app.renderer.width;
    groundBack.height = app.renderer.width * groundBackInitialRatio;
    groundBack.x = -1;
    groundBack.y = app.renderer.height - groundBack.height;


    //Place the logo
    var logoInitialRatio = logo.height / logo.width;
    logo.width = app.renderer.width * 0.2;
    logo.height = logo.width * logoInitialRatio;
    logo.x = app.renderer.width * 0.76;
    logo.y = app.renderer.height - groundBack.height;


    //Setup the position of the tree
    /*
    var treeInitialRatio = tree.width / tree.height;
    tree.x = app.renderer.width * 0.55;
    tree.height = app.renderer.height * 0.45;
    tree.y = app.renderer.height - tree.height - groundBack.height*0.3;
    tree.width = tree.height * treeInitialRatio;
    */
    tree.scale.set(0.25);
    console.log(tree)
    tree.x = app.renderer.width * 0.6;
    tree.y = app.renderer.height - tree.height - groundBack.height*0.3;


    //Place the ground in the front
    var groundFrontInitialRatio = groundFront.height / groundFront.width;
    groundFront.width = app.renderer.width;
    groundFront.height = app.renderer.width * groundFrontInitialRatio;
    groundFront.x = 0;
    groundFront.y = app.renderer.height - groundFront.height;


    //Place the clouds
    var cloud1InitialRatio = cloud1.height / cloud1.width;
    cloud1.width = app.renderer.width * 0.2;
    cloud1.height = cloud1.width * cloud1InitialRatio;
    cloud1.x = app.renderer.width * 0.1;
    cloud1.y = app.renderer.height * 0.1;


    var cloud2InitialRatio = cloud2.height / cloud2.width;
    cloud2.width = app.renderer.width * 0.2;
    cloud2.height = cloud2.width * cloud2InitialRatio;
    cloud2.x = app.renderer.width * 0.4;
    cloud2.y = app.renderer.height * 0.15;

    var sloganInitialRatio = slogan.height / slogan.width;
    slogan.width = screenSize <= screenSizes.tablet ? app.renderer.width - 50 : tree.x - 50;
    slogan.height = slogan.width * sloganInitialRatio;
    slogan.y = screenSize <= screenSizes.tablet ? app.renderer.height * 0.35 : app.renderer.height * 0.5;
    slogan.x = -slogan.width;
}

function init() {
    app = new PIXI.Application(1920, 1080, {transparent: true});
    app.renderer.autoResize = true;
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;

    var bannerWrapper = document.querySelector("#banner-wrapper");
    app.renderer.resize(bannerWrapper.clientWidth, bannerWrapper.clientHeight);

    var bannerWrapper = document.querySelector('#banner-wrapper');
    bannerWrapper.appendChild(app.view);


    PIXI.loader.add([
        {name: 'tree', url: 'img/Baum.svg'},
        {name: 'cloud1', url: 'img/Wolke1.svg'},
        {name: 'cloud2', url: 'img/Wolke2.svg'},
        {name: 'groundFront', url: 'img/BodenVorne.svg'},
        {name: 'groundBack', url: 'img/BodenHinten.svg'},
        {name: 'sky', url: 'img/Himmel.svg'},
        {name: 'logo', url: 'logo.png'},
        {name: 'slogan', url: 'img/Spruch.svg'}
    ]).load(function(loader, resources) {
        // This creates a texture
        tree = new PIXI.Sprite(resources.tree.texture);
        cloud1 = new PIXI.Sprite(resources.cloud1.texture);
        cloud2 = new PIXI.Sprite(resources.cloud2.texture);
        groundFront = new PIXI.Sprite(resources.groundFront.texture);
        groundBack = new PIXI.Sprite(resources.groundBack.texture);
        sky = new PIXI.Sprite(resources.sky.texture);
        logo = new PIXI.Sprite(resources.logo.texture);
        slogan = new PIXI.Sprite(resources.slogan.texture);

        draw();

        //Add a night overlay that faded when the sun rises

        var p = new PIXI.Graphics();
        p.beginFill(0x000000);
        p.lineStyle(0x000000);
        p.drawRect(0, 0, app.renderer.width, app.renderer.height);
        p.endFill();
        var t = PIXI.RenderTexture.create(p.width, p.height);
        app.renderer.render(p, t);
        var nightOverlay = new PIXI.Sprite(t);

        //Adjust a paramter so that the night overlay is really faded after the sun rose
        var dLogoMovement = (logo.y - app.renderer.height * 0.15)
        var movementFadeRatio = 1/dLogoMovement;

        app.stage.addChild(sky);
        app.stage.addChild(logo);
        app.stage.addChild(groundBack);
        app.stage.addChild(tree);
        app.stage.addChild(groundFront);
        app.stage.addChild(cloud1);
        app.stage.addChild(cloud2);
        app.stage.addChild(slogan);
        app.stage.addChild(nightOverlay);


        // Listen for frame updates
        app.ticker.add(function() {
            if(logo.y > app.renderer.height * 0.15)
                logo.y -= 10;
            if(nightOverlay.alpha > 0)
                nightOverlay.alpha -= 10*movementFadeRatio;
            if(logo.y <= app.renderer.height * 0.15 && slogan.x < 25)
                slogan.x += 30;
        });
    });
}



window.onload = init
window.onresize = update