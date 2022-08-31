var canvas;
var gl;
var sphere;
var plane;
var cube;
var pyramid;
var sun;
var sunAngle;
var flash;
var toggleFlash;
var vertexShade;
var cam;

const sqrt2 = Math.sqrt(2);

const vShader = 'vShader.glsl';
const fShader = 'fShader.glsl';

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1, 1);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.enable(gl.DEPTH_TEST);

    vertexShade = true;
    sunAngle = 0;
    console.log('here 2')
    cam = new Camera(vec3(0, 4, 4), vec3(0, 0, -1));
    sun = new Light();
    sun.setLocation(10, 0, 0, 1);
    sun.setAmbient(1, 1, 1);
    flash = new Light();
    flash.setLocation(0, 5, 5);
    flash.setDirection(0, -sqrt2 / 2, -sqrt2 / 2);
    flash.setAmbient(0.2, 0.2, 0.2);
    flash.setSpecular(1, 1, 1);
    flash.setDiffuse(1, 0, 1);
    flash.turnOn();
    console.log('here')
    sphere = new Sphere();
    // plane = new Plane(cam, 1, vShader, fShader);
    // cube = new Cube(cam, vShader, fShader)
    // pyramid = new Pyramid();
    render();
};

function render() {
    setTimeout(function () {
        requestAnimationFrame(render);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        sunAngle += .1;
        sun = new Light();
        sun.setLocation(10 * Math.cos(sunAngle), 10 * Math.sin(sunAngle), 0);
        sphere.draw();
        // plane.draw();
        // cube.draw();
        // pyramid.draw();
    }, 100);
}

document.addEventListener('keyup', event => {
    console.log(event.code);
    switch (event.code) {
        case 'KeyA':
            cam.moveU(1);
            break;
        case 'KeyW':
            cam.moveN(1);
            break;
        case 'KeyS':
            cam.moveN(-1);
            break;
        case 'KeyD':
            cam.moveU(-1);
            break;
        case 'Space':
            if (flash.on) {
                flash.turnOff();
            } else {
                flash.turnOn();
            }
            console.log(flash.on);
            break;
    }
    cam.updateCamMatrix();
});
