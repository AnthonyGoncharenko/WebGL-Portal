class Drawable {
    constructor(texture_path) {
        this.location = vec3(0, 0, 0);
        this.xrot = 0;
        this.yrot = 0;
        this.zrot = 0;
        this.time = 0.0;
        this.pickable = false;
        this.picked = false;
        this.canDelete = false;
        this.reflect = false;
        this.shadow = true;
        //  Load shaders and initialize attribute buffers
        this.program = initShaders(gl, "/vshader.glsl", "/fshader.glsl");
        this.shadowProgram = initShaders(gl, "/vshader_shadow.glsl", "/fshader_shadow.glsl");

        this.modelMatrix = mat4();
        this.sizeMatrix = mat4();
        this.locationMatrix = mat4();
        this.rotationZMatrix = mat4();
        this.rotationYMatrix = mat4();
        this.rotationXMatrix = mat4();
        this.uTime = gl.getUniformLocation(this.program, "time");
        this.modelMatrixID = gl.getUniformLocation(this.program, "modelMatrix");
        this.cameraMatrixID = gl.getUniformLocation(
            this.program,
            "cameraMatrix"
        );
        this.projectionMatrixID = gl.getUniformLocation(
            this.program,
            "projMatrix"
        );
        this.lightMatrixID = gl.getUniformLocation(
            this.program,
            "lightCameraMatrix"
        );
        this.lightProjMatrixID = gl.getUniformLocation(
            this.program,
            "lightProjMatrix"
        );

        this.specular = vec4(0.8, 0.8, 0.8, 1.0);
        this.diffuse = vec4(0.9, 0.9, 0.9, 1.0);
        this.ambient = vec4(0.8, 0.8, 0.8, 1.0);
        this.shininess = 80.0;

        this.useVertex = gl.getUniformLocation(this.program, "useVertex");
        this.useDistort = gl.getUniformLocation(this.program, "useDistort");
        this.useReflection = gl.getUniformLocation(this.program, "useReflection");
        // this.hasShadow = gl.getUniformLocation(this.program, "hasShadow");

        this.lightPos1 = gl.getUniformLocation(this.program, "lightPos1");
        this.lightDir1 = gl.getUniformLocation(this.program, "lightDir1");
        this.lightDiff1 = gl.getUniformLocation(this.program, "lightDiffuse1");
        this.lightSpec1 = gl.getUniformLocation(this.program, "lightSpecular1");
        this.lightAmb1 = gl.getUniformLocation(this.program, "lightAmbient1");
        this.lightAlpha1 = gl.getUniformLocation(this.program, "lightAlpha1");
        this.lightCutoffAngle1 = gl.getUniformLocation(
            this.program,
            "lightCutoffAngle1"
        );
        this.lightType1 = gl.getUniformLocation(this.program, "lightType1");
        this.lightOff1 = gl.getUniformLocation(this.program, "lightOff1");

        this.lightPos2 = gl.getUniformLocation(this.program, "lightPos2");
        this.lightDir2 = gl.getUniformLocation(this.program, "lightDir2");
        this.lightDiff2 = gl.getUniformLocation(this.program, "lightDiffuse2");
        this.lightSpec2 = gl.getUniformLocation(this.program, "lightSpecular2");
        this.lightAmb2 = gl.getUniformLocation(this.program, "lightAmbient2");
        this.lightAlpha2 = gl.getUniformLocation(this.program, "lightAlpha2");
        this.lightCutoffAngle2 = gl.getUniformLocation(
            this.program,
            "lightCutoffAngle2"
        );
        this.lightType2 = gl.getUniformLocation(this.program, "lightType2");
        this.lightOff2 = gl.getUniformLocation(this.program, "lightOff2");

        this.matDiff = gl.getUniformLocation(this.program, "matDiffuse");
        this.matSpec = gl.getUniformLocation(this.program, "matSpecular");
        this.matAmb = gl.getUniformLocation(this.program, "matAmbient");
        this.matAlpha = gl.getUniformLocation(this.program, "matAlpha");

        this.textureUnit = gl.getUniformLocation(this.program, "textureUnit");
        this.textureSampler = gl.getUniformLocation(this.program, "textureID");
        this.depthTexture = gl.getUniformLocation(this.program, "depthTexture");
        this.maxDepthID = gl.getUniformLocation(this.program, "maxDepth");
        var TEXTURE = new Image();
        this.textureID = gl.createTexture();
        var self = this;
        TEXTURE.onload = function () {
            self.textureID = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, self.textureID);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, TEXTURE);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        //this.textureUnit = gl.getUniformLocation(this.program, "textureUnit");
        TEXTURE.src = texture_path;

        this.envTextureID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envTextureID);
        gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        this.envFrameBuffer = gl.createFramebuffer();
        this.envFrameBuffer.width = 256;
        this.envFrameBuffer.height = 256;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.envFrameBuffer);
        this.envRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.envRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 256, 256);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.envRenderBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, this.envTextureID, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, this.envTextureID, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, this.envTextureID, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, this.envTextureID, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, this.envTextureID, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, this.envTextureID, 0);
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) console.log(status);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); //restore to window frame/depth buffer
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
}