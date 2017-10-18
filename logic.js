(function (window) {
    window.onload = function() {

        setLayerOne();
        setLayerTwo();
        setLayerThree();
        setLayerFour();

    };
}(window));

function setLayerOne() {
    var bgImage,
        ctx,
        width,
        height,
        layer1;
    layer1 = document.querySelector("#background");
    bgImage = document.getElementById("bgImage");
    ctx = layer1.getContext("2d");
    width = layer1.width;
    height = layer1.height;
    ctx.drawImage(bgImage, 0, 0);
}

function setLayerTwo() {
    var canvas = document.getElementById("sprite"),
        spritesNum = 4,
        spriteStorage = [];

    function createSprite() {
        var spriteIndex,
            spriteImage;

        spriteIndex = spriteStorage.length;
        spriteImage = new Image();
        spriteImage.src = "sprite/coin-sprite-animation.png";
        spriteStorage[spriteIndex] = sprite({
            context: canvas.getContext("2d"),
            width: 1000,
            height: 100,
            image: spriteImage,
            numberOfFrames: 10,
            ticksPerFrame: i
        });

        // Set X,Y position of the currrent indexed coin object
        spriteStorage[spriteIndex].x = Math.random() * (canvas.width - spriteStorage[spriteIndex].getFrameWidth() * spriteStorage[spriteIndex].scaleRatio);
        spriteStorage[spriteIndex].y = Math.random() * (canvas.height - spriteStorage[spriteIndex].height * spriteStorage[spriteIndex].scaleRatio);
        // Set the scale ratio of the coin randomly
        spriteStorage[spriteIndex].scaleRatio = Math.random() * 0.5 + 0.5;
    }

    function sprite(options) {

        //Init scope
        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;

        //Sprite update itself
        that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

                tickCount = 0;

                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };
        //Sprite render itself
        that.render = function () {

            // Clear the canvas
            that.context.clearRect(0, 0, that.width, that.height);

            // Draw the animation
            that.context.drawImage(
                that.image,
                frameIndex * that.width / numberOfFrames,//Where to start clipping on X coordinate line
                0, //Where to start clipping on Y coordinate line
                that.width / numberOfFrames,
                that.height,
                0,
                0,
                that.width / numberOfFrames,
                that.height);
        };
        //Image length division by the number of frames on the image
        that.getFrameWidth = function () {
            return that.width / numberOfFrames;
        };

        return that;
    }

    function gameLoop() {
        var i;
        window.requestAnimationFrame(gameLoop);
        for (i = 0; i < spriteStorage.length; i += 1) {
            spriteStorage[i].update();
            spriteStorage[i].render();
        }
    }

    //spriteImage.addEventListener("load", gameLoop);


    for (i = 0; i < spritesNum; i += 1) {
        createSprite();
    }
    console.log(spriteStorage);
    gameLoop();
}

function setLayerThree() {
    var ctx,
        layer3,
        layer4
        width = 1200,
        height = 478,
        radius = 60;
    layer3 = document.querySelector("#light");
    ctx = layer3.getContext("2d");
    document.onmousemove = mouseMove;
    document.onmousedown = mouseOut;

    /**
     * @param mouseX
     * @param mouseY
     */
    function drawCircle(mouseX, mouseY){
        // Clear the background
        ctx.clearRect(0, 0, layer3.width, layer3.height);
        // Establish the circle path
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle="#000000";
        ctx.fillRect(0, 0, layer3.width, layer3.height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(mouseX, mouseY, radius, 0 , 2 * Math.PI, false);
        ctx.strokeStyle="#000000";
        ctx.fillStyle="#000000";
        ctx.stroke();
        ctx.fill();

    }

    function gameLoop() {
        // Draw a circle in the center initially,
        // so the program hints at what it does before any mouse interaction
        drawCircle(layer3.width / 2, layer3.height / 2);
    }

    /**
     * @param e
     */
    function mouseMove(e) {
        drawCircle(e.clientX, e.clientY);
    }

    /**
     *
     * @param e
     */
    function mouseOut(e) {
        ctx.clearRect(0, 0, layer3.width, layer3.height);
    }


    layer3.addEventListener("load", gameLoop);
}

function setLayerFour() {
    layer4 = document.querySelector("#hand");
    ctx = layer4.getContext("2d");
    img = new Image();
    img.src = 'sprite/flashlight_small.png'
    img.addEventListener('load', drawImage);
    function drawImage() {
        ctx.drawImage(img, 0, 0);
    }

    var box = $('.box');
    box.off('click');
    var boxCenter=[box.offset().left+box.width()/2, box.offset().top+box.height()/2];

    $(document).mousemove(function(e){

            var angle = Math.atan2(e.pageX - boxCenter[0], -(e.pageY - boxCenter[1])) * (180 / Math.PI);
        if (angle <= 90 && angle >= -90) {
            box.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
            box.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
            box.css({'transform': 'rotate(' + angle + 'deg)'});
        }

    });
}
