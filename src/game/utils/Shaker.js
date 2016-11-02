import animate;

var TAU = 2 * Math.PI;
var sin = Math.sin;
var cos = Math.cos;
var random = Math.random;

exports = function (view, ttl, magnitude)
{
    var dt = ttl / 16;
    var m = magnitude;
    var vs = view.style;
    var x = vs.x;
    var y = vs.y;
    var s = vs.scale;
    var ax = vs.anchorX;
    var ay = vs.anchorY;
    vs.anchorX = vs.width / 2;
    vs.anchorY = vs.height / 2;
    var r1 = TAU * random();
    var r2 = TAU * random();
    var r3 = TAU * random();
    var r4 = TAU * random();
    var r5 = TAU * random();
    var r6 = TAU * random();
    var r7 = TAU * random();
    var r8 = TAU * random();
    var r9 = TAU * random();
    var r10 = TAU * random();
    var r11 = TAU * random();
    var r12 = TAU * random();
    var r13 = TAU * random();
    var r14 = TAU * random();

    animate(view)
      .then({ scale: s * (1 + 0.05 * m) }, dt, animate.easeIn)
      .then({ x: x + 14 * m * cos(r1), y: y + 14 * m * sin(r1), scale: s * (1 + 0.046 * m) }, dt, animate.easeOut)
      .then({ x: x + 13 * m * cos(r2), y: y + 13 * m * sin(r2), scale: s * (1 + 0.042 * m) }, dt, animate.easeInOut)
      .then({ x: x + 12 * m * cos(r3), y: y + 12 * m * sin(r3), scale: s * (1 + 0.038 * m) }, dt, animate.easeInOut)
      .then({ x: x + 11 * m * cos(r4), y: y + 11 * m * sin(r4), scale: s * (1 + 0.034 * m) }, dt, animate.easeInOut)
      .then({ x: x + 10 * m * cos(r5), y: y + 10 * m * sin(r5), scale: s * (1 + 0.030 * m) }, dt, animate.easeInOut)
      .then({ x: x + 9 * m * cos(r6), y: y + 9 * m * sin(r6), scale: s * (1 + 0.026 * m) }, dt, animate.easeInOut)
      .then({ x: x + 8 * m * cos(r7), y: y + 8 * m * sin(r7), scale: s * (1 + 0.022 * m) }, dt, animate.easeInOut)
      .then({ x: x + 7 * m * cos(r8), y: y + 7 * m * sin(r8), scale: s * (1 + 0.018 * m) }, dt, animate.easeInOut)
      .then({ x: x + 6 * m * cos(r9), y: y + 6 * m * sin(r9), scale: s * (1 + 0.014 * m) }, dt, animate.easeInOut)
      .then({ x: x + 5 * m * cos(r10), y: y + 5 * m * sin(r10), scale: s * (1 + 0.010 * m) }, dt, animate.easeInOut)
      .then({ x: x + 4 * m * cos(r11), y: y + 4 * m * sin(r11), scale: s * (1 + 0.008 * m) }, dt, animate.easeInOut)
      .then({ x: x + 3 * m * cos(r12), y: y + 3 * m * sin(r12), scale: s * (1 + 0.006 * m) }, dt, animate.easeInOut)
      .then({ x: x + 2 * m * cos(r13), y: y + 2 * m * sin(r13), scale: s * (1 + 0.004 * m) }, dt, animate.easeInOut)
      .then({ x: x + 1 * m * cos(r14), y: y + 1 * m * sin(r14), scale: s * (1 + 0.002 * m) }, dt, animate.easeInOut)
      .then({ x: x, y: y, anchorX: ax, anchorY: ay, scale: s }, dt, animate.easeIn);

};