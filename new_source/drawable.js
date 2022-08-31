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
        this.program = initShaders(gl, "/vshader_env_shadow.glsl", "/fshader_env_shadow.glsl");
        this.shadowProgram = initShaders(gl, "/vshader_shadow.glsl", "/fshader_shadow.glsl");

        this.modelMatrix = mat4();
        this.sizeMatrix = mat4();
        this.locationMatrix = mat4();
        this.rotationZMatrix = mat4();
        this.rotationYMatrix = mat4();
        this.rotationXMatrix = mat4();
        this.uTime = gl.getUniformLocation(this.program, "time");
        this.modelMatrixID = gl.getUniformLocation(this.program, "modelMatrix");
        this.cameraMatrixID = gl.getUniformLocation(this.program, "cameraMatrix");
        this.projectionMatrixID = gl.getUniformLocation(this.program, "projMatrix");
        this.lightMatrixID = gl.getUniformLocation(this.program, "lightCameraMatrix");
        this.lightProjMatrixID = gl.getUniformLocation(this.program, "lightProjMatrix");

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
        this.lightCutoffAngle1 = gl.getUniformLocation(this.program, "lightCutoffAngle1");
        this.lightType1 = gl.getUniformLocation(this.program, "lightType1");
        this.lightOff1 = gl.getUniformLocation(this.program, "lightOff1");

        this.lightPos2 = gl.getUniformLocation(this.program, "lightPos2");
        this.lightDir2 = gl.getUniformLocation(this.program, "lightDir2");
        this.lightDiff2 = gl.getUniformLocation(this.program, "lightDiffuse2");
        this.lightSpec2 = gl.getUniformLocation(this.program, "lightSpecular2");
        this.lightAmb2 = gl.getUniformLocation(this.program, "lightAmbient2");
        this.lightAlpha2 = gl.getUniformLocation(this.program, "lightAlpha2");
        this.lightCutoffAngle2 = gl.getUniformLocation(this.program, "lightCutoffAngle2");
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

        var texture_img = new Image();
        this.textureID = gl.createTexture();
        var self = this;
        texture_img.onload = function () {
            self.textureID = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, self.textureID);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, texture_img);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        //this.textureUnit = gl.getUniformLocation(this.program, "textureUnit");
        texture_img.src = texture_path;

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
    drawToShadowMap(projection) {
        gl.useProgram(this.shadowProgram);

        this.modelMatrixIDS = gl.getUniformLocation(
            this.shadowProgram,
            "modelMatrix"
        );
        this.cameraMatrixIDS = gl.getUniformLocation(
            this.shadowProgram,
            "cameraMatrix"
        );
        this.projectionMatrixIDS = gl.getUniformLocation(
            this.shadowProgram,
            "projMatrix"
        );
        this.maxDepth = gl.getUniformLocation(this.shadowProgram, "maxDepth");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vIDS);
        gl.vertexAttribPointer(this.aPositionS, 4, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(
            this.modelMatrixIDS,
            false,
            flatten(this.modelMatrix)
        );
        var camera_matrix = lookAt(vec3(sun.position[0], sun.position[1], sun.position[2]), vec3(0, 0, 0), vec3(0, 1, 0));
        gl.uniformMatrix4fv(this.cameraMatrixIDS, false, flatten(camera_matrix));
        gl.uniformMatrix4fv(this.projectionMatrixIDS, false, flatten(projection));
        gl.uniform1f(this.maxDepth, maxDepth);

        gl.enableVertexAttribArray(this.aPositionS);
        // this.checkForConflictingSamplers();
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
        gl.disableVertexAttribArray(this.aPositionS);
        gl.useProgram(this.program);
    }

    bindVertices() {
        this.vID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vPositions), gl.STATIC_DRAW);
        this.aPosition = gl.getAttribLocation(this.program, "aPosition");

        // Vertex normals
        this.nID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vNormals), gl.STATIC_DRAW);
        this.aNormal = gl.getAttribLocation(this.program, "aNormal");

        this.tID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vTexs), gl.STATIC_DRAW);
        this.aTexs = gl.getAttribLocation(this.program, "aTexs");

        this.vIDS = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vIDS);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vPositions), gl.STATIC_DRAW);
        this.aPositionS = gl.getAttribLocation(this.shadowProgram, "aPosition");
    }

    assignGouraudNormals() {
        var normalSum = [];
        var counts = [];

        for (var i = 0; i < this.numVertices; i++) {
            normalSum.push(vec3(0, 0, 0));
            counts.push(0);
        }

        for (var i = 0; i < this.numVertices; i++) {
            var count = 0;
            for (var j = 0; j < this.numVertices; j++) {
                if (
                    this.vPositions[i][0] == this.vPositions[j][0] &&
                    this.vPositions[i][1] == this.vPositions[j][1] &&
                    this.vPositions[i][2] == this.vPositions[j][2]
                ) {
                    count++;
                    normalSum[i] = add(normalSum[i], this.vNormals[j]);
                }
            }
            counts[i] = count;
        }

        for (var i = 0; i < this.numVertices; i++) {
            this.vNormals[i] = mult(1.0 / counts[i], normalSum[i]);
        }
    }

    draw() {
        this.time += 0.1;

        gl.useProgram(this.program);

        if (this.reflect) {
            this.createEnvironmentMap();
            gl.useProgram(this.program);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envTextureID);
        } else {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.textureID);
        }

        if (!this.reflect && this.shadow) {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, sun.depthTexture);
        }

        gl.uniform1i(this.textureSampler, 0);
        gl.uniform1i(this.textureUnit, 1);
        gl.uniform1i(this.depthTexture, 2);

        //point the attributes to the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.vertexAttribPointer(this.aPosition, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nID);
        gl.vertexAttribPointer(this.aNormal, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tID);
        gl.vertexAttribPointer(this.aTexs, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1i(this.textureSampler, 0);
        gl.uniform1f(this.useVertex, 0.0);
        gl.uniform1f(this.useDistort, useCarCamera);
        gl.uniform1f(this.useReflection, this.reflect);
        gl.uniform1f(this.uTime, this.time);
        // gl.uniform1f(this.hasShadow, this.shadow);

        //adding in sun and flashlight
        gl.uniform4fv(this.lightPos1, sun.position);
        gl.uniform4fv(this.lightDir1, sun.direction);
        gl.uniform4fv(this.lightDiff1, sun.diffuse);
        gl.uniform4fv(this.lightSpec1, sun.specular);
        gl.uniform4fv(this.lightAmb1, sun.ambient);
        gl.uniform1f(this.lightAlpha1, sun.alpha);
        gl.uniform1f(this.lightCutoffAngle1, sun.cutoffAngle);
        gl.uniform1i(this.lightType1, sun.type);
        gl.uniform1i(this.lightOff1, sun.off);

        gl.uniform4fv(this.lightPos2, flash.position);
        gl.uniform4fv(this.lightDir2, flash.direction);
        gl.uniform4fv(this.lightDiff2, flash.diffuse);
        gl.uniform4fv(this.lightSpec2, flash.specular);
        gl.uniform4fv(this.lightAmb2, flash.ambient);
        gl.uniform1f(this.lightAlpha2, flash.alpha);
        gl.uniform1f(this.lightCutoffAngle2, flash.cutoffAngle);
        gl.uniform1i(this.lightType2, flash.type);
        gl.uniform1f(this.lightOff2, flash.off);

        //material properties
        gl.uniform4fv(this.matSpec, this.specular);
        gl.uniform4fv(this.matDiff, this.diffuse);
        gl.uniform4fv(this.matAmb, this.ambient);
        gl.uniform1f(this.matAlpha, this.shininess);

        gl.uniformMatrix4fv(this.modelMatrixID, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(this.cameraMatrixID, false, flatten(cam.getCameraMatrix()));
        gl.uniformMatrix4fv(this.projectionMatrixID, false, flatten(cam.getProjectionMatrix()));
        var light_camera_matrix = lookAt(vec3(sun.position[0], sun.position[1], sun.position[2]), vec3(0, 0, 0), vec3(0, 1, 0));
        gl.uniformMatrix4fv(this.lightMatrixID, false, flatten(light_camera_matrix));
        var light_proj_matrix = perspective(90, canvas.width / canvas.height, 0.1, 100);
        gl.uniformMatrix4fv(this.lightProjMatrixID, false, flatten(light_proj_matrix));
        gl.uniform1f(this.maxDepthID, maxDepth);

        //enable and draw!
        gl.enableVertexAttribArray(this.aPosition);
        gl.enableVertexAttribArray(this.aNormal);
        gl.enableVertexAttribArray(this.aTexs);
        //this.checkForConflictingSamplers();
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
        gl.disableVertexAttribArray(this.aTexs);
        gl.disableVertexAttribArray(this.aNormal);
        gl.disableVertexAttribArray(this.aPosition);
        gl.bindTexture((this.reflect) ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D, null);

    }

    createEnvironmentMap() {
        var viewportParams = gl.getParameter(gl.VIEWPORT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.envFrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.envRenderBuffer);
        gl.viewport(0, 0, 256, 256);
        var proj_matrix = perspective(90, 1.0, 0.1, 100);
        var cam = new Camera();
        cam.eye = vec3(this.location[0], this.location[1], this.location[2]);
        for (var j = 0; j < 6; j++) {
            gl.useProgram(this.program);
            switch (j) {
                case 0: //-z
                    cam.u = vec3(-1, 0, 0);
                    cam.v = vec3(0, -1, 0);
                    cam.n = vec3(0, 0, 1);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, this.envTextureID, 0);
                    break;
                case 1: //+z
                    cam.u = vec3(1, 0, 0);
                    cam.v = vec3(0, -1, 0);
                    cam.n = vec3(0, 0, -1);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, this.envTextureID, 0);
                    break;
                case 2: //-y
                    cam.u = vec3(1, 0, 0);
                    cam.v = vec3(0, 0, -1);
                    cam.n = vec3(0, 1, 0);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, this.envTextureID, 0);
                    break;
                case 3: //+y
                    cam.u = vec3(1, 0, 0);
                    cam.v = vec3(0, 0, 1);
                    cam.n = vec3(0, -1, 0);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, this.envTextureID, 0);
                    break;
                case 4: //-x
                    cam.u = vec3(0, 0, 1);
                    cam.v = vec3(0, -1, 0);
                    cam.n = vec3(1, 0, 0);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, this.envTextureID, 0);
                    break;
                case 5: //+x
                    cam.u = vec3(0, 0, -1);
                    cam.v = vec3(0, -1, 0);
                    cam.n = vec3(-1, 0, 0);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, this.envTextureID, 0);
                    break;
            }
            cam.updateCamMatrix();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.disable(gl.DEPTH_TEST);
            skybox.render(cam, proj_matrix);
            gl.enable(gl.DEPTH_TEST);
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] != this) {
                    objects[i].render(cam.getCameraMatrix(), proj_matrix);
                }
            }
            gl.useProgram(this.program);
        }
        gl.viewport(
            viewportParams[0],
            viewportParams[1],
            viewportParams[2],
            viewportParams[3]
        );
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    updateModelMatrix() {
        var rotationMatrix = mult(this.rotationZMatrix, mult(this.rotationYMatrix, this.rotationXMatrix));
        this.modelMatrix = mult(this.locationMatrix, mult(this.sizeMatrix, rotationMatrix));
    }
    setLocation(x, y, z) {
        this.location = vec3(x, y, z);
        this.locationMatrix = translate(x, y, z);
        this.updateModelMatrix();
    }
    getLocation() {
        return this.location;
    }
    setSize(x, y, z) {
        this.sizeMatrix = scale(x, y, z);
        this.updateModelMatrix();
    }
    setZRotation(deg) {
        this.zrot = deg;
        this.rotationZMatrix = rotateZ(deg);
        this.updateModelMatrix();
    }
    setYRotation(deg) {
        this.yrot = deg;
        this.rotationYMatrix = rotateY(deg);
        this.updateModelMatrix();
    }
    setXRotation(deg) {
        this.xrot = deg;
        this.rotationXMatrix = rotateX(deg);
        this.updateModelMatrix();
    }
    updateRotationsDelta(x, y, z) {
        this.xrot += x;
        this.yrot += y;
        this.zrot += z;
        this.setXRotation(this.xrot);
        this.setYRotation(this.yrot);
        this.setZRotation(this.zrot);
    }
    onPick() {
        this.picked = true;
    }
}