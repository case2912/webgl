var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl");
gl.clearColor(0,0,0,1);


var n = 1000.0;
var positions = [];

positions.push(-1);
positions.push(2);
positions.push(-5);
positions.push(-2.7);
positions.push(-1);
positions.push(-5);
positions.push(0.7);
positions.push(-1);
positions.push(-5);

positions.push(1);
positions.push(2);
positions.push(-10);
positions.push(-0.7);
positions.push(-1);
positions.push(-10);
positions.push(2.7);
positions.push(-1);
positions.push(-10);
var indicies = [];

for (var i = 0; i< positions.length/3; i++) {
    indicies.push(i);
   
};


var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies) , gl.STATIC_DRAW);


var posBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions) , gl.STATIC_DRAW);

var vShader = "attribute vec3 position;"
            +"varying vec4 vPosition;"
            +"uniform mat4 matP;"
            +"void main(void){"
            +"gl_Position=vPosition=matP*vec4(position,1);"
            +"}";
var v_shader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(v_shader,vShader);
gl.compileShader(v_shader);
if(!gl.getShaderParameter(v_shader,gl.COMPILE_STATUS)){
 console.error(gl.getShaderInfoLog(v_shader));
}

var fShader ="precision mediump float;"
            +"varying vec4 vPosition;"
            +"uniform float time;"
            +"void main(void){"
            +"gl_FragColor=vec4(1,1,1,1);"
            +"}";
var f_shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(f_shader,fShader);
gl.compileShader(f_shader);
if(!gl.getShaderParameter(f_shader,gl.COMPILE_STATUS)){
 console.error(gl.getShaderInfoLog(f_shader));
}

var program = gl.createProgram();
gl.attachShader(program,v_shader);
gl.attachShader(program,f_shader);
gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
 console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);
var posLocation = gl.getAttribLocation(program,"position");

gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation,3,gl.FLOAT,false,0,0);

var timelocation = gl.getUniformLocation(program, "time");
var mat4location = gl.getUniformLocation(program, "matP");
function initializeMatP(w, h, d, x, y, z){
    return new Float32Array([1/w,0,0,0,0,1/h,0,0,0,0,1/d,0, -x/w, -y/w, -z/w, 1]);
}
var mat = mat4.create();
mat4.perspective(mat,Math.PI/4,1.0,0.01,15);
gl.uniformMatrix4fv(mat4location, false, mat);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

var loop = function(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(timelocation,Date.now() % 1000);
        gl.drawElements(gl.TRIANGLES, indicies.length, gl.UNSIGNED_SHORT, 0);
        gl.finish();
        window.requestAnimationFrame(loop);
}
loop();