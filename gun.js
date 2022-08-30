class Gun extends Drawable {
    constructor(obj_file_name, texture_file_name) {
        super(texture_file_name);
        let data = extractVertices(obj_file_name);
        this.vTexs = data.vTexs;
        this.vNormals = data.vNormals;
        this.vPositions = data.vPositions;
    }
}