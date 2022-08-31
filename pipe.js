class Pipe extends Drawable {
    constructor() {
        super("textures/marble.jpeg");
        let data = extractVertices("models/pipe.obj");
        this.vTexs = data.vTexs;
        this.vNormals = data.vNormals;
        this.vPositions = data.vPositions;
        this.bindVertices();
    }
}