var scene,
    camera,
    controls,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    shadowLight,
    backLight,
    globallight,
    renderer,
    container,
    hunt,
    headDir;

//SCENE
var floor, frog1, fly;

//SCREEN VARIABLES

var HEIGHT,
    WIDTH,
    windowHalfX,
    windowHalfY,
    mousePos = {x:0,y:0};

//basic materials
var yellowMat = new THREE.MeshLambertMaterial ({
    color: 0xfdd276,
    shading:THREE.FlatShading
});
var deepGreenMat = new THREE.MeshLambertMaterial ({
    color: 0x16a085,
    shading:THREE.FlatShading
});
var redMat = new THREE.MeshLambertMaterial ({
    color: 0xad3525,
    shading:THREE.FlatShading
});

var greenMat = new THREE.MeshLambertMaterial ({
    color: 0x009432,
    shading:THREE.FlatShading
});
var pinkMat = new THREE.MeshLambertMaterial ({
    color: 0xe55d2b,
    shading:THREE.FlatShading
});

var whiteMat = new THREE.MeshLambertMaterial ({
    color: 0xffffff,
    shading:THREE.FlatShading
});

var purpleMat = new THREE.MeshLambertMaterial ({
    color: 0x451954,
    shading:THREE.FlatShading
});

var greyMat = new THREE.MeshLambertMaterial ({
    color: 0x653f4c,
    shading:THREE.FlatShading
});

var blackMat = new THREE.MeshLambertMaterial ({
    color: 0x302925,
    shading:THREE.FlatShading
});

function init(){
    scene = new THREE.Scene();
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane);
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 80;
    camera.lookAt(new THREE.Vector3(0, 30, 0));
    renderer = new THREE.WebGLRenderer({alpha: false, antialias: true });
    renderer.setClearColor( '#3498db', 0 );
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;
    headDir = false;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    /*
    controls = new THREE.OrbitControls( camera, renderer.domElement);
    //*/
}

function createFrog(){
    frog1 = new Frog();
    scene.add(frog1.threeGroup);
}

Frog = function(){
    this.handHeight = 10;
    this.bodyHeight = 50;
    this.armHeight = 40 ;
    this.eyeBallMoveX = 0;
    this.eyeBallMoveY= 0;
    this.targetFly = new THREE.Vector3(0,0,120);
    this.isHunting = false;
    this.isBlinking = false;
    this.shouldersPosition = new THREE.Vector3(0,30, 0);
    this.threeGroup = new THREE.Group();


    var skewMatrixBody = new THREE.Matrix4();
    skewMatrixBody.set(   1,    0,    0,    0,
        0,    1,    0,    0,
        0,    0.20,    1,    0,
        0,    0,    0,    1  );



    //head
    this.head = new THREE.Group();

    var faceGeom = new THREE.SphereGeometry( 30, 32, 32 );
    faceGeom.computeVertexNormals();
    this.face = new THREE.Mesh(faceGeom,greenMat);
    this.face.geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 0.6, 1 ) );
    // this.face.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, this.bodyHeight + 0.5 * 30, 0 ) );
    // this.face.geometry.applyMatrix(skewMatrixBody);

    // Eyes
    // var eyeGeom = new THREE.BoxGeometry(12,12, 1);
    var eyeGeom = new THREE.CircleGeometry(10,32);
    this.rightEye = new THREE.Mesh(eyeGeom, whiteMat);
    this.rightEye.position.set(-12,15, 25);
    // this.rightEye.position.set(0,15, 25);
    this.rightEye.rotation.y = -Math.PI/8;

    this.leftEye = this.rightEye.clone();
    this.leftEye.position.x = -this.rightEye.position.x;
    this.leftEye.rotation.y = Math.PI/8;

    //Eyeball
    var irisGeom = new THREE.CircleGeometry(4,32);
    this.rightIris = new THREE.Mesh(irisGeom, blackMat);
    this.rightIris.position.x = 2;
    this.rightIris.position.y = -2;
    this.rightIris.position.z = .5;

    this.leftIris = this.rightIris.clone();
    this.leftIris.position.x = -this.rightIris.position.x;

    this.rightEye.add(this.rightIris);
    this.leftEye.add(this.leftIris);

    //mouth
    var mouthGeom = new THREE.TorusGeometry( 12, 1, 2, 10, Math.PI*0.8 );
    mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
    mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI*0.1));
    this.mouth = new THREE.Mesh(mouthGeom, blackMat);
    this.mouth.position.y = 5;
    this.mouth.position.z = 30;

    //huntmouth
    var huntmouthGeom = new THREE.CircleGeometry( 4,32);
    // huntmouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    this.huntmouth = new THREE.Mesh(huntmouthGeom, blackMat);
    this.huntmouth.position.y = -5;
    this.huntmouth.position.z = 0;

    //tongue
    var tongueGeom = new THREE.BoxGeometry(3,3,1);
    this.tongue = new THREE.Mesh(tongueGeom, pinkMat);
    this.tongue.position.y = -5;
    this.tongue.position.x = 0;

    //头部组装
    this.head.add(this.face);
    this.head.add(this.rightEye);
    this.head.add(this.leftEye);
    this.head.add(this.mouth);
    this.head.add(this.huntmouth);
    this.head.add(this.tongue);


    this.head.position.y = this.bodyHeight+20;
    this.head.position.z = -5;

    // body

    this.body = new THREE.Group();

    var torsoGeom = new THREE.CylinderGeometry(19, 26 ,this.bodyHeight,4);
    this.torso = new THREE.Mesh(torsoGeom,greenMat);
    // this.torso.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/4));
    this.torso.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-this.bodyHeight/2,0));



    // neck

    var neckGeom = new THREE.CylinderGeometry(16,12, 17, 3);
    neckGeom.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/3));
    neckGeom.applyMatrix(new THREE.Matrix4().makeScale(1,1,.3));
    this.neck = new THREE.Mesh(neckGeom, greenMat);
    this.neck.position.set(0,0,1);

    // shoulders
    this.rightShoulder = new THREE.Group();
    this.leftShoulder = new THREE.Group();

    this.rightShoulder.position.set(-6, this.shouldersPosition.y, 0);
    this.leftShoulder.position.set(6, this.shouldersPosition.y, 0);

    //arms
    var armGeom = new THREE.CylinderGeometry(5, 6, this.armHeight+5,4);
    armGeom.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/4));
    armGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 25));

    this.torso.add(this.neck);
    this.torso.geometry.applyMatrix(skewMatrixBody);
    this.neck.geometry.applyMatrix(skewMatrixBody);

    this.rightArm = new THREE.Mesh(armGeom,greenMat);
    this.rightArm.position.x = -3;
    this.rightShoulder.add(this.rightArm);
    this.armVertices = [0,1,2,3,4,10];
    this.leftArm = this.rightArm.clone();
    for(var i = 0; i < this.armVertices.length; i++){
        var tvInit = this.rightArm.geometry.vertices[this.armVertices[i]];
        this.rightArm.geometry.vertices[this.armVertices[i]].x = tvInit.x + 10;
        this.rightArm.geometry.vertices[this.armVertices[i]].z = tvInit.z - 10;
    }
    for(var i = 0; i < this.armVertices.length; i++){
        var tvInit = this.leftArm.geometry.vertices[this.armVertices[i]];
        this.leftArm.geometry.vertices[this.armVertices[i]].x = tvInit.x - 10;
        this.leftArm.geometry.vertices[this.armVertices[i]].z = tvInit.z - 10;
    }
    this.leftArm.position.x = -this.rightArm.position.x;
    this.leftShoulder.add(this.leftArm);



    var kneeDis = 8;
    // knees
    var kneeGeom = new THREE.BoxGeometry(7, 22, 22);
    kneeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,15,0));

    this.rightKnee = new THREE.Mesh(kneeGeom, greenMat);
    this.rightKnee.rotation.y = -Math.PI/6;
    this.rightKnee.position.x = -kneeDis-10;
    this.rightKnee.position.z = kneeDis+2;

    this.leftKnee = this.rightKnee.clone();
    this.leftKnee.rotation.y = -this.rightKnee.rotation.y;
    this.leftKnee.position.x = -this.rightKnee.position.x;

    // Feet
    var legGeom = new THREE.BoxGeometry(9,6,4);
    this.rightLeg = new THREE.Mesh(legGeom, deepGreenMat);
    this.rightLeg.position.set(0,2,12);
    this.rightKnee.add(this.rightLeg);

    this.leftLeg = this.rightLeg.clone();
    this.leftKnee.add(this.leftLeg);


    //组装
    this.body.add(this.torso);
    this.body.position.y = this.bodyHeight;

    this.threeGroup.add(this.head);
    this.threeGroup.add(this.body);
    this.threeGroup.add(this.rightShoulder);
    this.threeGroup.add(this.leftShoulder);
    this.threeGroup.add(this.rightKnee);
    this.threeGroup.add(this.leftKnee);

    this.threeGroup.traverse( function ( object ) {
        if ( object instanceof THREE.Mesh ) {
            object.castShadow = true;
            object.receiveShadow = true;
        }});

}

Frog.prototype.traceMouse = function(pos){
    var mDir = pos.clone().sub(this.shouldersPosition.clone());
    mDir.y += 20;
    this.lookAt(pos);
}

Frog.prototype.eyetrace = function(pos){
    this.eyeBallMoveX = pos.x * 0.08;
    this.eyeBallMoveY = -pos.y * 0.1 + 5;

    this.rightIris.position.x = 2 + (this.eyeBallMoveX>0?this.eyeBallMoveX/2:this.eyeBallMoveX);
    this.rightIris.position.y =  - this.eyeBallMoveY;
    this.leftIris.position.x = -2 + (this.eyeBallMoveX<0?this.eyeBallMoveX/2:this.eyeBallMoveX);
    this.leftIris.position.y =  - this.eyeBallMoveY;
    this.rightIris.geometry.verticesNeedUpdate = true;
    this.leftIris.geometry.verticesNeedUpdate = true;
}

Frog.prototype.lookAt = function(v){
    if (!this.oldTargetLookPos)this.oldTargetLookPos = new THREE.Vector3();
    this.newTargetLookPos = v.clone();
    this.lookPos = this.oldTargetLookPos.clone().add(this.newTargetLookPos.sub(this.oldTargetLookPos).multiplyScalar(.15));
    this.head.lookAt(this.lookPos);
    this.oldTargetLookPos = this.lookPos;
}

Frog.prototype.blk = function(pos){
    if (!this.isBlinking && Math.random()>.99){
        this.isBlinking = true;
        this.blink();
    }
}

Frog.prototype.blink = function(){
    _this = this;
    TweenMax.to (this.rightEye.scale, .07, {y:0, yoyo:true, repeat:1});
    TweenMax.to (this.leftEye.scale, .07, {y:0, yoyo:true, repeat:1, onComplete:function(){
            _this.isBlinking = false;
        }});
}
Frog.prototype.hunt = function(pos, fly){
    this.targetFly = pos;
    // console.log(pos);
    if(!this.isHunting){
        this.isHunting = true;
        this.lip();
    }
}
Frog.prototype.lip = function(){
    _this = this;
    this.mouth.position.z = 0;
    this.huntmouth.position.z = 30;
    this.mouth.geometry.verticesNeedUpdate = true;
    this.huntmouth.geometry.verticesNeedUpdate = true;
    var cur_fly = this.targetFly.clone();
    cur_fly.z = 120;
    var tonguePos = new THREE.Vector3();
    tonguePos.x = this.head.position.x;
    tonguePos.y = this.head.position.y + this.tongue.position.y;
    tonguePos.z = this.head.position.z;

    this.tongue.geometry.verticesNeedUpdate = true;

    var distance = cur_fly.sub(tonguePos).length();
    TweenMax.to (fly.flybody.position, .2, {x : fly.flybody.position.x, y:fly.flybody.position.y * 0.97, delay:.3, onComplete:function(){}})
    TweenMax.to (this.tongue.position, .3, {z:(distance-1)/2, yoyo:true, repeat:1});
    TweenMax.to (this.tongue.scale, .3, {z:distance-1, yoyo:true, repeat:1, onComplete:function(){
            _this.isHunting = false;
            hunt = false;
            headDir = false;
            _this.mouth.position.z = 30;
            _this.huntmouth.position.z = 0;
            _this.mouth.geometry.verticesNeedUpdate = true;
            _this.huntmouth.geometry.verticesNeedUpdate = true;
        }});
    // console.log(fly);
    TweenMax.to (fly.flybody.position, .3, {x : tonguePos.x, y:tonguePos.y, z:tonguePos.z, delay:.35, onComplete:function(){}})
}

Fly = function(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.oldx = 0;
    this.oldy = 0;
    this.isRootNode = false;
    this.constraints = [];
    this.vertex = null;

    var stringMat = new THREE.LineBasicMaterial({
        color: 0x630d15,
        linewidth: 3
    });
    this.threeGroup = new THREE.Group();

    var flyBodyGeom = new THREE.BoxGeometry(2,2,2);
    this.flybody = new THREE.Mesh(flyBodyGeom,stringMat);
    this.flybody.position.z = 120;


    this.threeGroup.add(this.flybody);
}
Fly.prototype.update = function(posX, posY, posZ){
    this.flybody.position.x = posX;
    this.flybody.position.y = posY;
    this.flybody.position.z = posZ;
    this.flybody.geometry.verticesNeedUpdate = true;
}

function createFloor(){
    floor = new THREE.Mesh(new THREE.CircleGeometry(80,32), new THREE.MeshBasicMaterial({color: '#C4E538'}));
    floor.applyMatrix( new THREE.Matrix4().makeTranslation(0,0,-20))
    floor.rotation.x = -Math.PI/2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
}

function createFly(){
    fly = new Fly();
    scene.add(fly.threeGroup);
}

function createLights() {
    globallight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)


    shadowLight = new THREE.DirectionalLight(0xffffff, .8);
    shadowLight.position.set(200, 200, 200);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = .2;
    shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

    backLight = new THREE.DirectionalLight(0xffffff, .4);
    backLight.position.set(-100, 100, 100);
    backLight.shadowDarkness = .1;
    backLight.castShadow = true;
    backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

    scene.add(backLight);
    scene.add(globallight);
    scene.add(shadowLight);
}

function render(){
    //controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
    mousePos = {x:event.clientX, y:event.clientY};
}
function handleMouseDown() {
    if(!hunt){
        hunt = true;
    }
}
function handleMouseUp(event) {
    // hunt = false;
}


function loop(){
    renderer.render(scene, camera);
    var vector = new THREE.Vector3();
    vector.set(
        ( mousePos.x / window.innerWidth ) * 2 - 1,
        - ( mousePos.y / window.innerHeight ) * 2  + 1,
        0.1 );
    vector.unproject( camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = (115 - camera.position.z) / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    if(hunt){
        // console.log("hunting");
        if(!headDir){
            frog1.targetFly.x = pos.x;
            frog1.targetFly.y = pos.y;
            frog1.targetFly.z = pos.z;
            console.log(pos);
            frog1.traceMouse(pos);
            frog1.eyetrace(pos);
            headDir = true;
        }else{
            frog1.hunt(frog1.targetFly,fly);
        }
    }else{
        // console.log("not Hunting");
        fly.update(pos.x,pos.y,pos.z);
        frog1.blk();
        frog1.traceMouse(pos);
        frog1.eyetrace(pos);
    }
    requestAnimationFrame(loop);
}
init();
createLights();
createFloor();
createFrog();
createFly();
render();
loop();