/*global opera*/
/*jslint browser: true*/
var init = function () {
    "use strict";
    var playBtn, titleImg, launchGame;
    playBtn = document.getElementById("playBtn");
    titleImg = document.getElementById("titleImg");

    launchGame = function () {
        var isWii, canvas, loadingText, context, width, height, fps, fpsInterval, PillSec, PillInterval, preloader, PillTime, allLoaded, preloadList, preloadNum, preloadImg, rotation, moveX, moveY, mySin, mouseX, mouseY, remote, moveXabs, moveYabs, i, coeff, debug, thisRotation, thisMoveX, thisMoveY, Character, Pill, worm, myPill, lastPos, movePill, extendBody, main, loading, Worm, Item, Enemy, Macrophage, spawn, stage;
        stage = {
            enemyList: []
        };
        isWii = window.opera && opera.wiiremote ? true : false;
        canvas = document.getElementById("game");
        loadingText = document.getElementById("loading");
        loadingText.style.display = "block";
        playBtn.style.display = "none";
        titleImg.style.display = "none";
        context = canvas.getContext("2d");
        if (!isWii) {
            canvas.setAttribute("height", window.innerHeight);
            canvas.setAttribute("width", window.innerWidth);
        }
        width = canvas.getAttribute("width");
        height = canvas.getAttribute("height");
        fps = 24;
        fpsInterval = Math.round(1E3  / fps);
        PillSec = 10;
        PillInterval = PillSec * 1E3;
        preloadList = ["pill.png", "serpent.png", "tete.png", "serpent.png", "tail.png"];
        preloadNum = 0;
        preloadImg = new Image();
        rotation = 0;
        moveX = moveY = 0;
        mouseX = mouseY = 0;
        coeff = 13;
        debug = "";
        thisRotation = 0;
        preloadImg.src = "img/" + preloadList[preloadNum];
        preloadImg.onload = function () {
            preloadNum += 1;
            if (preloadNum === preloadList.length) {
                allLoaded = true;
            } else {
                preloadImg.src = "img/" + preloadList[preloadNum];
            }
        };
        Item = function () {
            this.x = 0;
            this.y = 0;
        };
        Character = function () {
            Item.call(this);
            this.lastX = 0;
            this.lastY = 0;
            this.centerX = 0;
            this.centerY = 0;
        };
        Enemy = function () {
            Character.call(this);
            this.img = new Image();
        };
        Macrophage = function () {
            Enemy.call(this);
            this.img.src = "img/macrophage/macrophage0001.png";
            this.anim.frame = 1;
            this.maxFrame = 50;
            this.anim.reverse = false;
        };
        Macrophage.prototype.anim = function () {
            var separator;
            if (this.anim.frame >= this.maxFrame) {
                this.anim.reverse = true;
            } else if (this.anim.frame <= 1) {
                this.anim.reverse = false;
            }
            if (this.anim.reverse) {
                this.anim.frame -= 1;
            } else {
                this.anim.frame += 1;
            }
            if (this.anim.frame < 10) {
                separator = "0";
            } else {
                separator = "";
            }
            this.img.src = "img/macrophage/macrophage00" + separator + this.anim.frame + ".png";
        };
        Worm = function () {
            Character.call(this);
            this.head = new Image();
            this.head.src = "img/tete.png";
            this.width = this.head.width;
            this.height = this.head.height;
            this.bodyLenght = 1;
        };
        Worm.prototype.BodyPart = function () {
            this.img = new Image();
            this.img.src = "img/serpent.png";
            this.width = this.img.width;
            this.height = this.img.height;
            this.x = 0;
            this.y = 0;
            this.lastX = 0;
            this.lastY = 0;
        };
        Pill = function () {
            Item.call(this);
            this.img = new Image();
            this.img.src = "img/pill.png";
        };
        spawn = function (EnemyType) {
            var enemy = new EnemyType();
            stage.enemyList.push(enemy);
        };
        //spawn(Macrophage);
        worm = new Worm();
        worm.body1 = new worm.BodyPart();
        myPill = new Pill();
        lastPos = function () {
            var ratio, lastMoveX, lastMoveY, lastMoveXabs, lastMoveYabs;
            for (i = 1; i <= worm.bodyLenght; i += 1) {
                if (i === 1) {
                    worm.body1.lastX = worm.body1.x;
                    worm.body1.lastY = worm.body1.y;
                    lastMoveX = worm.x - worm.lastX;
                    lastMoveY = worm.y - worm.lastY;
                    lastMoveXabs = Math.abs(lastMoveX);
                    lastMoveYabs = Math.abs(lastMoveY);
                    if (lastMoveXabs > lastMoveYabs) {
                        ratio = lastMoveY  / lastMoveX;
                        if (lastMoveX > coeff) {
                            worm.lastX = worm.x - coeff;
                            worm.lastY = worm.y - coeff * ratio;
                        } else {
                            if (lastMoveX < -coeff) {
                                worm.lastX = worm.x + coeff;
                                worm.lastY = worm.y + coeff * ratio;
                            }
                        }
                    } else {
                        if (lastMoveYabs > lastMoveXabs) {
                            ratio = lastMoveX  / lastMoveY;
                            if (lastMoveY > coeff) {
                                worm.lastY = worm.y - coeff;
                                worm.lastX = worm.x - coeff * ratio;
                            } else {
                                if (lastMoveY < -coeff) {
                                    worm.lastY = worm.y + coeff;
                                    worm.lastX = worm.x + coeff * ratio;
                                }
                            }
                        }
                    }
                    worm.body1.x = worm.lastX;
                    worm.body1.y = worm.lastY;
                } else {
                    worm["body" + i].lastX = worm["body" + i].x;
                    worm["body" + i].lastY = worm["body" + i].y;
                    lastMoveX = worm["body" + (i - 1)].x - worm["body" + (i - 1)].lastX;
                    lastMoveY = worm["body" + (i - 1)].y - worm["body" + (i - 1)].lastY;
                    lastMoveXabs = Math.abs(lastMoveX);
                    lastMoveYabs = Math.abs(lastMoveY);
                    if (lastMoveXabs > lastMoveYabs) {
                        ratio = lastMoveY  / lastMoveX;
                        if (lastMoveX > coeff) {
                            worm["body" + (i - 1)].lastX = worm["body" + (i - 1)].x - coeff;
                            worm["body" + (i - 1)].lastY = worm["body" + (i - 1)].y - coeff * ratio;
                        } else {
                            if (lastMoveX < -coeff) {
                                worm["body" + (i - 1)].lastX = worm["body" + (i - 1)].x + coeff;
                                worm["body" + (i - 1)].lastY = worm["body" + (i - 1)].y + coeff * ratio;
                            }
                        }
                    } else {
                        if (lastMoveYabs > lastMoveXabs) {
                            ratio = lastMoveX  / lastMoveY;
                            if (lastMoveY > coeff) {
                                worm["body" + (i - 1)].lastY = worm["body" + (i - 1)].y - coeff;
                                worm["body" + (i - 1)].lastX = worm["body" + (i - 1)].x - coeff * ratio;
                            } else {
                                if (lastMoveY < -coeff) {
                                    worm["body" + (i - 1)].lastY = worm["body" + (i - 1)].y + coeff;
                                    worm["body" + (i - 1)].lastX = worm["body" + (i - 1)].x + coeff * ratio;
                                }
                            }
                        }
                    }
                    worm["body" + i].x = worm["body" + (i - 1)].lastX;
                    worm["body" + i].y = worm["body" + (i - 1)].lastY;
                }
            }
        };
        movePill = function () {
            myPill.x = Math.random() * (width - myPill.img.width);
            myPill.y = Math.random() * (height - myPill.img.height);
        };
        extendBody = function () {
            worm.bodyLenght += 1;
            if (worm["body" + worm.bodyLenght] === undefined) {
                worm["body" + worm.bodyLenght] = new worm.BodyPart();
            }
        };
        movePill();
        main = function () {
            var anim = function () {
                var ratio;
                if (window.mozRequestAnimationFrame) {
                    window.mozRequestAnimationFrame(anim, canvas);
                } else {
                    window.setTimeout(anim, 41.6);
                }
                context.clearRect(0, 0, width, height);
                moveX = 0;
                moveY = 0;
                worm.centerX = worm.x + worm.head.width  / 2;
                worm.centerY = worm.y + worm.head.height  / 2;
                if (worm.centerX > myPill.x && worm.centerX < myPill.x + myPill.img.width && worm.centerY > myPill.y && worm.centerY < myPill.y + myPill.img.height) {
                    movePill();
                    extendBody();
                    lastPos();
                    clearInterval(PillTime);
                    PillTime = setInterval(movePill, PillInterval);
                }
                if (isWii) {
                    remote = opera.wiiremote.update(0);
                    mouseX = remote.dpdScreenX;
                    mouseY = remote.dpdScreenY;
                }
                moveX = (mouseX - worm.x)  / 4;
                moveY = (mouseY - worm.y)  / 4;
                moveXabs = Math.abs(moveX);
                moveYabs = Math.abs(moveY);
                if (moveXabs > moveYabs) {
                    ratio = moveY  / moveX;
                    if (moveX > 30) {
                        moveX = 30;
                        moveY = 30 * ratio;
                    } else {
                        if (moveX < -30) {
                            moveX = -30;
                            moveY = -30 * ratio;
                        }
                    }
                } else {
                    if (moveYabs > moveXabs) {
                        ratio = moveX  / moveY;
                        if (moveY > 30) {
                            moveY = 30;
                            moveX = 30 * ratio;
                        } else {
                            if (moveY < -30) {
                                moveY = -30;
                                moveX = -30 * ratio;
                            }
                        }
                    }
                }
                worm.lastX = worm.x;
                worm.lastY = worm.y;
                if (moveXabs > 5 || moveYabs > 5) {
                    worm.x += moveX;
                    worm.y += moveY;
                    lastPos();
                }
                if (worm.x < 0) {
                    worm.x = 0;
                }
                if (worm.x + worm.width > width) {
                    worm.x = width - worm.width;
                }
                if (worm.y < 0) {
                    worm.y = 0;
                }
                if (worm.y + worm.height > height) {
                    worm.y = height - worm.height;
                }
                //if (moveX !== 0 || moveY !== 0) { }
                if (moveX !== 0) {
                    mySin = moveX  / moveY;
                    rotation = Math.atan(mySin);
                    rotation = -rotation;
                    if (moveY > 0) {
                        rotation -= Math.PI;
                    }
                }
                context.drawImage(myPill.img, myPill.x, myPill.y);
                for (i = 0; i < stage.enemyList.length; i += 1) {
                    context.drawImage(stage.enemyList[i].img, stage.enemyList[i].x, stage.enemyList[i].y);
                    stage.enemyList[i].anim();
                }
                worm["body" + worm.bodyLenght].img.src = "img/tail.png";
                if (worm.bodyLenght > 1) {
                    worm["body" + (worm.bodyLenght - 1)].img.src = "img/serpent.png";
                }
                for (i = worm.bodyLenght; i > 0; i -= 1) {
                    thisMoveX = worm["body" + i].x - worm["body" + i].lastX;
                    thisMoveY = worm["body" + i].y - worm["body" + i].lastY;
                    if (thisMoveX !== 0) {
                        mySin = thisMoveX  / thisMoveY;
                        thisRotation = Math.atan(mySin);
                        thisRotation = -thisRotation;
                        if (thisMoveY > 0) {
                            thisRotation -= Math.PI;
                        }
                    }
                    context.save();
                    context.translate(worm["body" + i].x + worm["body" + i].img.width  / 2, worm["body" + i].y + worm["body" + i].img.height  / 2);
                    context.rotate(thisRotation);
                    context.drawImage(worm["body" + i].img, -(worm["body" + i].img.width  / 2), -(worm["body" + i].img.height  / 2));
                    context.restore();
                }
                context.save();
                context.translate(worm.x + worm.head.width  / 2, worm.y + worm.head.height  / 2);
                context.rotate(rotation);
                context.drawImage(worm.head, -(worm.head.width  / 2), -((3 * worm.head.height) / 4));
                context.restore();
                context.save();
                context.translate(10, 20);
                context.fillStyle = "Red";
                if (context.fillText) {
                    context.fillText(debug, 1, 1);
                }
                context.restore();
            };
            anim();
        };
        loading = function () {
            if (allLoaded) {
                loadingText.style.display = "none";
                canvas.style.display = "block";
                if (!isWii) {
                    document.onmousemove = function (event) {
                        mouseX = event.clientX - worm.width  / 2;
                        mouseY = event.clientY - worm.height  / 2;
                    };
                }
                main();
                PillTime = setInterval(movePill, PillInterval);
                clearInterval(preloader);
            }
        };

        preloader = setInterval(loading, fpsInterval);
    };
    playBtn.addEventListener("click", launchGame, false);
};

window.addEventListener("load", init, false);
