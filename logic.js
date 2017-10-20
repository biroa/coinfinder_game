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
        topCanvas = document.getElementById("light"),
        spritesNum = 10,
        spriteStorage = [],
        score = 0;

    /**
     * @description Instantiate the sprite and store in the array
     * @return undefined
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

        // Set X,Y position of the current indexed sprite object
        // Set the scale ratio of the sprite randomly
        spriteStorage[spriteIndex].scaleRatio = Math.random() * 0.5 + 0.5;
        spriteStorage[spriteIndex].x = Math.random() * (canvas.width - spriteStorage[spriteIndex].getFrameWidth() * spriteStorage[spriteIndex].scaleRatio);
        spriteStorage[spriteIndex].y = Math.random() * (canvas.height - spriteStorage[spriteIndex].height * spriteStorage[spriteIndex].scaleRatio);

        spriteImage.src = "sprite/coin-sprite-animation.png";
    }

    /**
     * @description Create the sprite
     * @param options
     * @return {Object} that
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

        /**
         * @description Sprite update itself
         * @return undefined
         */
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
        /**
         * @description Sprite render itself
         * @return undefined
         */
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
        /**
         * @description Image length division by the number of frames on the image
         * @return {number}
         */
        that.getFrameWidth = function () {
            return that.width / numberOfFrames;
        };
        /**
         * @description Move the coins
         * @return undefined
         */
        that.move = function () {
            // add horizontal increment to the x pos
            // add vertical increment to the y pos

            // velocity    = //floatNum: 0.1-6.9
            //angle = floatNum: -4.0-4.9
            that.x += that.velocity * Math.cos(that.angle);
            that.y -= that.velocity * Math.sin(that.angle);
        };

        return that;
    }

    /**
     * @description Check collision with walls. Walls are beyond the edges of the image .
     * @param {object} obj
     */
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

    /**
     * @description return the canvas position calculating in the offset
     * @param element
     * @return {{x: (Number|number), y: (Number|number)}}
     */
    function getElementPosition (element) {
        // retrieve the current position of an element relative to the document
        var parentOffset,
            pos = {
                x: element.offsetLeft,
                y: element.offsetTop
            };

        if (element.offsetParent) {
            // element.offsetParent =  is an object reference to the element in which the current element is offset.
            parentOffset = getElementPosition(element.offsetParent);
            pos.x += parentOffset.x;
            pos.y += parentOffset.y;
        }
        return pos;
    }

    /**
     * @description We destroy the clicked sprite.
     * @param sprite
     * @return undefined
     */
    function destroySprite (sprite) {

        var i;

        for (i = 0; i < spriteStorage.length; i += 1) {
            if (spriteStorage[i] === sprite) {
                spriteStorage[i] = null;
                spriteStorage.splice(i, 1);
                break;
            }
        }
    }


    /**
     * @description Return the distance between the coordinates based on distance formula
     * @param {float} p1
     * @param {float} p2
     * @return {number}
     */
    function distance (p1, p2) {

        var dx = p1.x - p2.x,
            dy = p1.y - p2.y;

        return Math.sqrt(dx * dx + dy * dy);
    }


    /**
     * @description Click or Touch a sprite on the stage
     * @param {event} e
     * @return undefined
     */
    function tap(e) {

        var i,
            loc = {},
            dist,
            spritesToDestroy = [],
            pos = getElementPosition(canvas),
            tapX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX,
            tapY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
            // offsetWidth = width + padding + border; (margin not included)
            canvasScaleRatio = canvas.width / canvas.offsetWidth;

        loc.x = (tapX - pos.x) * canvasScaleRatio;
        loc.y = (tapY - pos.y) * canvasScaleRatio;

        for (i = 0; i < spriteStorage.length; i += 1) {
            // Distance between tap and sprite
            dist = distance({
                x: (spriteStorage[i].x + spriteStorage[i].getFrameWidth() / 2 * spriteStorage[i].scaleRatio),
                y: (spriteStorage[i].y + spriteStorage[i].getFrameWidth() / 2 * spriteStorage[i].scaleRatio)
            }, {
                x: loc.x,
                y: loc.y
            });

            // Check for tap collision with sprite
            if (dist < spriteStorage[i].getFrameWidth() / 2 * spriteStorage[i].scaleRatio) {
                spritesToDestroy.push(spriteStorage[i]);
            }

        }

        //Destroy tapped sprites
        for (i = 0; i < spritesToDestroy.length; i += 1) {
            //Size related points if we need it
            //score += parseInt(spritesToDestroy[i].scaleRatio * 10, 10);
            score += 1;
            destroySprite(spritesToDestroy[i]);
            setTimeout(createSprite, 1000);
        }

        if (spritesToDestroy.length) {
            document.getElementById("score").innerHTML = score;
        }

        }


    /**
     * @description basic game loop
     * @return undefined
     */
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

    for (i = 0; i < spritesNum; i += 1) {
        createSprite();
    }
    gameLoop();
    topCanvas.addEventListener("touchstart", tap);
    topCanvas.addEventListener("mousedown", tap);
}

function setLayerThree() {
    var ctx,
        layer3,
        radius = 60;
    layer3 = document.querySelector("#light");
    ctx = layer3.getContext("2d");
    layer3.addEventListener("mousemove", mouseMove);
    //layer3.addEventListener("mouseout", mouseOut);

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

    function moveTheTorchByMouse(e){
        var angle = Math.atan2(e.pageX - boxCenter[0], -(e.pageY - boxCenter[1])) * (180 / Math.PI);
        if (angle <= 90 && angle >= -90) {
            box.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
            box.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
            box.css({'transform': 'rotate(' + angle + 'deg)'});
        }
    }
    
    // listen any touch event
    document.addEventListener('mousemove', moveTheTorchByMouse, true);
}
