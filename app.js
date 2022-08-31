var canvas;
var gl;
var sun;
var flashlight;
var globalCamera;
var robotCamera;
var skybox;
var robot;
var camera;
var cylinder;
var base;
var pyramid;
var ps;
var objects = [];
var shadowFrameBuffer;
var shadowRenderBuffer;

var sdtSize = 1024;
var maxDepth = 100.0;
var useCarCamera = false;
var rollAmt = 0;
var pitchAmt = 0;
var yawAmt = 0;
var forwardAmt = 0;
var rightAmt = 0;
var xclip = 0;
var yclip = 0;
var sunAngle = 0;

window.onload = () => {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2", {
        preserveDrawingBuffer: true
    });
    if (!gl) {
        alert("WebGL 2.0 isn't available");
    }

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.polygonOffset(1, 1);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

window.addEventListener("mousedown", (event) => {
    // Implementing picking
    xclip = 2 * (event.clientX / canvas.width) - 1.0;
    yclip = 1.0 - 2 * (event.clientY / canvas.height);
    var pfront = vec4(xclip, yclip, -1, 1);
    var pcam = mult(inverse(camera.getProjectionMatrix()), pfront);
    pcam[2] = -1;
    pcam[3] = 0;
    var pworld = mult(inverse(camera.getCameraMatrix()), pcam);
    var point = normalize(vec3(pworld[0], pworld[1], pworld[2]));
    var min_t = null;
    var min_object = null;
    objects.forEach((o) => {
        var t = o.testCollision(point);
        if (t !== null && (min_t === null || t < min_t)) {
            min_t = t;
            min_object = o;
        }
    });
    if (min_object !== null) {
        min_object.onPick();
    }
})

window.addEventListener("keydown", (event) => {
    if (!event.metaKey) {
        switch (event.code) {
            case "KeyS":
                forwardAmt = -1;
                break;
            case "KeyW":
                forwardAmt = 1;
                break;
            case "KeyA":
                rightAmt = -1;
                break;
            case "KeyD":
                rightAmt = 1;
                break;
            case "Space":
                useRobotCamera = !useRobotCamera;
                if (useRobotCamera) {
                    camera = robotCamera;
                } else {
                    camera = globalCamera;
                }
                break;
            case "KeyZ":
                if (event.shiftKey) {
                    rollAmt = 1; // Counterclockwise
                } else {
                    rollAmt = -1; // Clockwise
                }
                break;
            case "KeyX":
                if (event.shiftKey) {
                    pitchAmt = -1; // Up
                } else {
                    pitchAmt = 1; // Down
                }
                break;

            case "KeyC":
                if (event.shiftKey) {
                    yawAmt = 1; // Counterclockwise
                } else {
                    yawAmt = -1; // Clockwise
                }
                break;
        }
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyS":
        case "KeyW":
            forwardAmt = 0;
            break;
        case "KeyA":
        case "KeyD":
            rightAmt = 0;
            break;
        case "KeyZ": // z key
            rollAmt = 0;
            break;
        case "KeyX": // x key
            pitchAmt = 0;
            break;
        case "KeyC": // c key
            yawAmt = 0;
            break;
    }
})