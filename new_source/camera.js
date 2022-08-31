class Camera {
    constructor(at, up) {
        this.camMatrix = mat4();
        this.r = 5;
        this.h = 5;
        this.t = 0;
        this.eye = vec3(this.r * Math.sin(this.t), this.h, this.r * Math.cos(this.t));
        this.n = normalize(subtract(this.eye, at));
        this.u = normalize(cross(up, this.n));
        this.v = cross(this.n, this.u);
        this.updateCamMatrix();
    }

    moveN(amt) {
        this.eye = add(this.eye, mult(-amt, this.n));
        this.updateCamMatrix();
    }

    moveU(amt) {
        this.eye = add(this.eye, mult(-amt, this.u));
        this.updateCamMatrix();
    }

    updateCamMatrix() {
        this.camMatrix = lookAt(this.eye, subtract(this.eye, this.n), this.v);
    }
}
