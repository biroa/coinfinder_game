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
        spritesNum = 10,
        spriteStorage = [];

    /**
     * Instantiate the sprite and store in the array
     */
    function createSprite() {
        var spriteIndex,
            spriteImage;

        spriteIndex = spriteStorage.length;
        spriteImage = new Image();
        spriteStorage[spriteIndex] = sprite({
            context: canvas.getContext("2d"),
            width: 1000,
            height: 100,
            image: spriteImage,
            numberOfFrames: 10,
            ticksPerFrame: i,
            angle: (2 * Math.PI) * Math.random(),
            velocity: (10 * Math.random()) - 5
        });

        // Set X,Y position of the currrent indexed coin object
        // Set the scale ratio of the coin randomly
        spriteStorage[spriteIndex].scaleRatio = Math.random() * 0.5 + 0.5;

        console.log(canvas.width,spriteStorage[spriteIndex].getFrameWidth(), spriteStorage[spriteIndex].scaleRatio);
        spriteStorage[spriteIndex].x = Math.random() * (canvas.width - spriteStorage[spriteIndex].getFrameWidth() * spriteStorage[spriteIndex].scaleRatio);
        spriteStorage[spriteIndex].y = Math.random() * (canvas.height - spriteStorage[spriteIndex].height * spriteStorage[spriteIndex].scaleRatio);

        spriteImage.src = "sprite/coin-sprite-animation.png";
    }

    /**
     *
     * @param options
     * @return {{}}
     */
    function sprite(options) {

        //Init scope
        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1,
            angle = options.angle,
            velocity = options.velocity;


        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.x = 0;
        that.y = 0;
        that.image = options.image;
        that.scaleRatio = 1;
        that.angle = options.angle;
        that.velocity = velocity;

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

            // Draw the animation
            that.context.drawImage(
                that.image,
                frameIndex * that.width / numberOfFrames, //Where to start clipping on X coordinate line
                0, //Where to start clipping on Y coordinate line
                that.width / numberOfFrames, // Width of the clipped image
                that.height, // Height of the clipped image
                that.x, //Coordinates X
                that.y, //Coordinates Y
                that.width / numberOfFrames * that.scaleRatio, // Image width
                that.height * that.scaleRatio); // Image height
        };
        //Image length division by the number of frames on the image
        that.getFrameWidth = function () {
            return that.width / numberOfFrames;
        };

        that.move = function() {
            // add horizontal increment to the x pos
            // add vertical increment to the y pos

            // v    = //floatNum: 0.1-6.9
            //angle = floatNum: -4.0-4.9
            that.x += that.velocity * Math.cos(that.angle);
            that.y -= that.velocity * Math.sin(that.angle);
        };

        return that;
    }

    function testCollisionWithWalls(obj) {
        var spriteRadius = 100;
        // left
        if (obj.x < -spriteRadius) {
            obj.x = -spriteRadius;
            obj.angle = -obj.angle + Math.PI;
        }
        // right
        if (obj.x > canvas.width + spriteRadius) {
            obj.x = canvas.width + spriteRadius;
            obj.angle = -obj.angle + Math.PI;
        }
        // up
        if (obj.y < -spriteRadius) {
            obj.y = -spriteRadius;
            obj.angle = -obj.angle;
        }
        // down
        if (obj.y > canvas.height + spriteRadius) {
            obj.y = canvas.height - spriteRadius;
            obj.angle =-obj.angle;
        }
    }
    
    function gameLoop() {
        var i;
        window.requestAnimationFrame(gameLoop);

        // Clear the canvas
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        for (i = 0; i < spriteStorage.length; i += 1) {
            spriteStorage[i].update();
            spriteStorage[i].render();
            spriteStorage[i].move();
            testCollisionWithWalls(spriteStorage[i]);
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
