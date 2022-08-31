class Gun extends Drawable {
    constructor() {
        super("textures/metal.jpg");
        let data = extractVertices("models/Portal_Gun.obj");
        this.vTexs = data.vTexs;
        this.vNormals = data.vNormals;
        this.vPositions = data.vPositions;
        this.numVertices = this.vPositions.length;
        this.bindVertices();
    }
}