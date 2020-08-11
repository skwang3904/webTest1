 main();

 function main()
 {
    //loading
    //const canvas = document.querySelector("#glCanvas");
    const canvas = document.getElementById("glCanvas");
    console.log(canvas);
    const gl = canvas.getContext("webgl");
    console.log(gl); 

    const programID = createProgram(gl);
    const vbo = createVBO(gl);
    const vbe = createVBE(gl);


    drawGame(gl, programID, vbo, vbe);
 }

 function createProgram(gl)
 {
   const strVert = `
   #if GL_ES
   precision highp float;
   #endif

   attribute vec4 position;
   attribute vec4 color;
   varying vec4 vColor;

   void main()
   {
         vColor = color;
         gl_Position = position;
   }
   `;
   
   const strFrag = `
   #if GL_ES
   precision highp float;
   #endif

   varying vec4 vColor;

   void main()
   {
      gl_FragColor = vColor;
   }
   `;

   const vertID = createShader(gl,strVert, gl.VERTEX_SHADER);
   const fragID = createShader(gl,strFrag, gl.FRAGMENT_SHADER);
   const id = gl.createProgram();
   gl.attachShader(id,vertID);
   gl.attachShader(id,fragID);
   gl.linkProgram(id);
   gl.detachShader(id,vertID);
   gl.detachShader(id,fragID);

   gl.deleteShader(vertID);
   gl.deleteShader(fragID);

   var message = gl.getProgramInfoLog(id);
   if(message.length > 0)
   {
      alert(message);
      gl.deleteProgram(id);
   }
   
   return id;
 }

 function createShader(gl, str, flag)
 {
    const id = gl.createShader(flag);
    gl.shaderSource(id, str);
    gl.compileShader(id);
   
    var message = gl.getShaderInfoLog(id);
    if(message.length > 0)
    {
      //console.log(message);
      alert(message);
      gl.deleteShader(id);
    }

    return id;
 }

 function createVBO(gl)
 {
    const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

      var p = [
         -0.5,  0.5,  1,0,0,1,      0.5,  0.5,  0,1,0,1,
         -0.5, -0.5,  0,0,1,1,      0.5, -0.5,  1,1,1,1,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
 }

 function createVBE(gl)
 {
      const vbe = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbe);
      
      var indices = [0,1,2, 1,2,3];
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
      
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      return vbe;
 }


 var prevtime = 0;
 function drawGame(gl, programID, vbo, vbe)
 {
    //gl.clearColor(Math.random(), Math.random(), Math.random(), Math.random());
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   gl.useProgram(programID);

   gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
   const pID = gl.getAttribLocation(programID, "position");
   gl.enableVertexAttribArray(pID);
   gl.vertexAttribPointer(pID, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);

   const cID = gl.getAttribLocation(programID, "color");
   gl.enableVertexAttribArray(cID);
   gl.vertexAttribPointer(cID, 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT,  2 * Float32Array.BYTES_PER_ELEMENT);


   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbe);
   gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

   gl.bindBuffer(gl.ARRAY_BUFFER, null);
   gl.disableVertexAttribArray(pID);
   gl.disableVertexAttribArray(cID);
   

     //to do
     window.requestAnimationFrame(function (currtime) {
         var delta = (currtime - prevtime)/1000.0;
         prevtime = currtime;
         //console.log("시간 = %f", delta);

        
        drawGame(gl, programID, vbo, vbe);
     });
 }