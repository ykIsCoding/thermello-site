<template>
  <div class="canvas" ref="canvas"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import * as dat from "dat.gui";
//import { interpolate } from 'gsap/all';

const gui = new dat.GUI();

export default {
  computed: {
    getCurrentPage() {
      return this.$store.getters.getCurrentPage;
    },
  },
  watch: {
    learnMoreStage(v) {
      const learnMoreContent = [
        {
          heading: "3-Layered Vacuum Body",
          content: "Maintains Liquid temperature for up to 32 Hours!",
        },
        {
          heading: "Lightly Sand-blasted Stainless Steel Finishing",
          content:
            "Easy to grip and rust-resistant for long-lasting use. It can hold up to 120 degrees celsuis.",
        },
        {
          heading: "Toxic Free",
          content:
            "Made with Stainless Steel and silicone rubber. No harmful chemicals were used in flask material.",
        },
      ];
      this.$emit("send-learn-more-stage-content", learnMoreContent[v]);
      return v;
    },
    getCurrentPage(v) {
      this.page = v;
      if (v == "shop") {
        this.showShop();
      } else if (v == "learn-more") {
        this.showLearnMore();
      }
    },
  },
  data() {
    return {
      loading: false,
      page: "home",
      threejsProperties: null,
      selectedBottle: null,
      learnMoreStage: -1,
    };
  },
  mounted() {
    this.init();
    //this.loadGLTF()
  },
  emits: ["send-vb-to-hc", "send-learn-more-stage-content"],
  methods: {
    toggleLearnMoreStage() {
      if (this.learnMoreStage > 1) {
        this.learnMoreStage = 0;
      } else {
        this.learnMoreStage += 1;
      }
    },
    showLearnMore() {
      const { scene, renderer, camera,environment } = this.threejsProperties;
      //console.log(scene,'scene')
      //let blueBottle = scene.getObjectByName("blueGroup");
      let circle = document.getElementsByClassName("circle")[0]
      let tl = gsap.timeline()
      tl.to(scene.position,{
        x:2,
         duration:0.3,
         ease:"power3.out",
        onUpdate:()=>{
          renderer.render(scene,camera)
        }
      })
      tl.to(camera.position,{
        duration:0.3,
        z:20.5,
        y:9,
        ease:"power3.out",
        onUpdate:()=>{
          renderer.render(scene,camera)
        }
      }).to(circle,{
        duration:0.2,
        opacity:1,
        top:"90%",
        left:"54%",
        onComplete:()=>{
              circle.classList.add("blink-class")
        }
      })
      // blueBottle.traverse(c=>
      // (c instanceof THREE.Mesh)?
      // c.rotation.z+=1:null
      // )
      this.refreshObjects(scene, environment);
      renderer.render(scene, camera);
    },
    async init() {
      this.loading = true;
      //gsap.registerPlugin()
      var { scene, camera, renderer, gltfLoader, light, controls, composer,environment } =
        this;
      scene = new THREE.Scene();

      let cam1 = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cam1.position.set(0, 8, 20);
      cam1.updateProjectionMatrix();
      cam1.updateMatrixWorld();
      camera = cam1;
      //   camera = new THREE.ArrayCamera([cam1])
      //    cam2.position.set(0,8,16)
      //  cam2.updateMatrixWorld()

      //  camera = new THREE.ArrayCamera([cam2])
      //  camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
      
      // camera.position.z = 16;
      // camera.position.x = 0;
      // camera.position.y = 8;
      //camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
      //camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      const axesHelper = new THREE.AxesHelper(30);
      scene.add(axesHelper);

      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
      });

      //renderer = renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.physicallyCorrectLights = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      const rgbeloader = new RGBELoader();
      rgbeloader.load(
        "/photostudio.hdr",
        (hdri) => {
          const generator = new THREE.PMREMGenerator(renderer);
          const { texture } = generator.fromEquirectangular(hdri);
          scene.environment = texture;
          environment = texture
          // scene.background = texture;
          // console.log('Heyey',scene)
          this.refreshObjects(scene, texture);
          renderer.render(scene, camera);
        },
        null,
        (e) => console.log(e)
      );

      light = new THREE.AmbientLight(0x404040);
      light.intensity = 5;
      scene.add(light);

      const directionalLight = new THREE.DirectionalLight("#ffffff", 8);
      directionalLight.shadow.normalBias = 0.05;
      scene.position.set(0, 6, 5);
      scene.add(directionalLight);

      const floorGeometry = new THREE.PlaneGeometry(30, 5);
      const floorMaterial = new THREE.MeshPhongMaterial({
        shininess: 43.5,
        reflectivity: 0.574,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2;
      floor.receiveShadow = true;
      floor.castShadow = true;

      controls = new OrbitControls(camera, renderer.domElement);
      //console.log('h',floor)
      //scene.add(floor)
      //var centerGLTF = null;
      //var currentThis = this
      gltfLoader = new GLTFLoader();
      await gltfLoader.load(
        "./models/flask/thermalflask_all.glb",
        (gltf) => {
          //this.model = gltf.scene
          // console.log(gltf.scene);
          // var boundingBox=new THREE.Box3().setFromObject(gltf.scene)
          // var centerGLTF = boundingBox.getCenter(gltf.scene.position)
          controls.target.set(0, 8, 0);
          // controls.enablePan = false;
          controls.update();

          gltf.scene.castShadow = true;
          //gltf.scene.position.set(0, 0, 0);

          this.refreshObjects(gltf.scene, scene.environment);
          console.log(gltf.scene.children);

          //function to get children
          function getChildByName(name) {
            return gltf.scene.children.find((x) => x.name == name);
          }

          //group black
          const blackGroup = new THREE.Group();
          blackGroup.name = "blackGroup";
          blackGroup.add(getChildByName("cap_black"));
          blackGroup.add(getChildByName("bottle_black"));

          //group blue
          const blueGroup = new THREE.Group();
          blueGroup.name = "blueGroup";
          blueGroup.add(getChildByName("cap_blue"));
          blueGroup.add(getChildByName("bottle_blue"));

          //group pink
          const pinkGroup = new THREE.Group();
          pinkGroup.name = "pinkGroup";
          pinkGroup.add(getChildByName("cap_pink"));
          pinkGroup.add(getChildByName("bottle_pink"));

          scene.add(blueGroup);
          blueGroup.position.set(0, 0, 3);

          scene.add(pinkGroup);
          pinkGroup.position.set(0, 0, -3);

          scene.add(blackGroup);
          blackGroup.position.set(0, 0, 0);

          function setAxisToCenter(group) {
            console.log(group);

            group.children.map((child) => {
              if (child) {
                child.position.set(
                  group.position.x,
                  child.position.y,
                  group.position.z
                );
              }
            });

            // group.traverse(child=>{
            // child.position.set(groupCenter.x,child.position.y,groupCenter.z)
            //})

            // .setFromObject(group)
            // var center = bound.getCenter(new THREE.Vector3())
            // console.log(center)
          }

          setAxisToCenter(pinkGroup);
          setAxisToCenter(blackGroup);
          setAxisToCenter(blueGroup);
          console.log("pg", pinkGroup);
          console.log(scene.children);

          // pinkGroup.position.set(-3,0,-3)
          // console.log(bound.getSize(new THREE.Vector3()))

          //mainGroup.position.z+=(mainGroup.position.x-center.z)
          //mainGroup.name = "allGroups"
          //mainGroup.position.y+=(bound.getSize(new THREE.Vector3()).y)

          // console.log(allOrigin,bound.getSize(new THREE.Vector3()).length());

          renderer.render(scene, camera);
          this.loading = false;
          gsap.to(camera.position, {
          z: 21,
          x: 0,
          y: 8,
        duration: 0.3,
        ease: "power3.out",
        onUpdate:()=>{
          renderer.render(scene,camera)
        }
      });
        },
        () => null,
        () => null
      );
      //  this.renderer = renderer
      //  this.scene = scene
      // this.camera=camera
      gui.domElement.id = "gui";
      console.log(gui.domElement);
      gui.domElement.style.zIndex = 100;
      // gui.add( camera.position , 'z', -100, 100 ).step(5)
      // gui.add( camera.position , 'x', -100, 100 ).step(5)
      // gui.add( camera.position , 'y', -100, 100 ).step(5)
      composer = new EffectComposer(renderer);

      const ssaoPass = new SSAOPass(
        scene,
        camera,
        window.innerWidth,
        window.innerHeight
      );
      ssaoPass.kernelRadius = 16;
      composer.addPass(ssaoPass);

      // console.log("center",centerGLTF.z)
      //controls.target.set(centerGLTF.x,centerGLTF.y,centerGLTF.z);

      this.$refs.canvas.appendChild(renderer.domElement);
      renderer.render(scene, camera);
      this.threejsProperties = Object.freeze({
        scene,
        camera,
        renderer,
        gltfLoader,
        light,
        controls,
        composer,
        environment
      });

      this.setSelectedBottle("pinkGroup");
      this.frameRenderer();
      //   this.$store.dispatch("handleViewingBottleChange",'pinkGroup')
    },
    learnMoreStageAnimation(stage) {
      const { renderer, scene,environment,camera } = this.threejsProperties;
      let bg = scene.getObjectByName("blueGroup");
      let bgc = bg.children.find(x=>x.name.startsWith("cap"))
      let circletwo = document.getElementsByClassName("circle-2")[0]
     let circle = document.getElementsByClassName("circle")[0]
     circle.classList.remove("blink-class")
      switch (stage) {
        case 1: {
          gsap.timeline().to(camera.position,{
            duration:0.5,
            z:19,
            y:12,
            x:2,
            ease:"power3.out",
            onUpdate:()=>{
              renderer.render(scene,camera)
            }
          }).to(camera.rotation,{
            x:-Math.PI/9,
            duration:0.4,
             ease:"power3.out",
             onUpdate:()=>{
              renderer.render(scene,camera)
            }
          })
          gsap.to(circle,{
            duration:0.3,
            left:"50%",
            top:"75%",
            opacity:1,
            onComplete:()=>{
              circle.classList.add("blink-class")
            }
          })
          //bg.rotation.z+=Math.PI/4
          //  camera.position.y-=2
          // camera.position.x-=2
          // camera.position.z-=1
          break;
        }
        case 2: {
          console.log(bg.children,"bg")
          gsap.timeline().to(camera.position,{
            duration:0.5,
            z:22,
            y:12,
            ease:"power3.out",
            onUpdate:()=>{
              renderer.render(scene,camera)
            }
          }).to(
            camera.rotation,{
              duration:0.3,
              x:-Math.PI/11
            }
          ).to(bgc.rotation,{
            y:Math.PI/7,
            duration:0.2,
            ease:"power3.out",
            onUpdate:()=>{
              renderer.render(scene,camera)
            }
          }).to(
            bgc.position,{
              y:5.5,
              duration:0.2,
              ease:"power3.out",
              onUpdate:()=>{
              renderer.render(scene,camera)
            }
            }
          ).to(circletwo,{
            top:"35%",
            left:"50%",
            opacity:1,
            duration:0.2,
            ease:"power3.out",
            onComplete:()=>{
              circletwo.classList.add("blink-class")
            }
          }).to(circle,{
            left:"48%",
            opacity:1,
            duration:0.2,
            ease:"power3.out",
            onComplete:()=>{
              circle.classList.add("blink-class")
            }
          })
          break;
        }
        default:
          return;
      }
      console.log("heyyyyy");
      this.refreshObjects(scene, environment);
      //renderer.render(scene, camera);
    },
    refreshObjects(scene, env) {
       const { camera, renderer} = this.threejsProperties;
      scene.environment = env;
      scene.traverse((c) => {
        const textureLoader = new THREE.TextureLoader();
        const heightTexture = textureLoader.load("./models/flask/baHeight.jpg");
        heightTexture.flipY = false;
        const roughnessTexture = textureLoader.load(
          "./models/flask/all_roughness.jpg"
        );
        roughnessTexture.flipY = false;

        if (
          c instanceof THREE.Mesh &&
          c.material instanceof THREE.MeshStandardMaterial
        ) {
          c.material.envMap = env;
          c.material.needsUpdate = true;
          // console.log(c.material)
          c.material.envMapIntensity = 0.05;
          c.material.roughnessMap = roughnessTexture;
          c.material.heightMap = heightTexture;
          c.castShadow = true;
          c.receiveShadow = true;
          //console.log(c)
        }
      });
      renderer.render(scene, camera);
    },
    frameRenderer() {
      //requestAnimationFrame(this.frameRenderer);
      // const {scene,camera,renderer} = this.threejsProperties
      //renderer.render(scene,camera)
    },
    setSelectedBottle(x) {
      let item = this.threejsProperties.scene.getObjectByName(x);
      if (!item) return;
      item.position.x -= 1;
      if (this.selectedBottle) {
        this.threejsProperties.scene.getObjectByName(
          this.selectedBottle
        ).position.x += 1;
      }
      this.selectedBottle = x;

      this.$emit("send-vb-to-hc", this.selectedBottle);
    },
    showShop() {
      //  console.log("hey",this.threejsProperties)
      const { scene, camera, renderer, controls,environment } = this.threejsProperties;
      //let {camera} = this.threejsProperties
      // var cam2 = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 1000 );
      // cam2.position.set(3,8,16)
      // cam2.lookAt(0,8,0)
      //  cam2.updateProjectionMatrix()
      //    cam2.updateMatrixWorld()

      //   var cam3 = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 1000 );
      //  cam3.position.set(-3,8,16)
      //  cam3.lookAt(0,8,0)
      //  cam3.updateProjectionMatrix()
      //  cam3.updateMatrixWorld()

      // camera.cameras = [cam3,camera.cameras[0],cam2]
      // camera.updateProjectionMatrix();
      // let ncamera = new THREE.ArrayCamera([camera,cam1,cam2])
      // camera=ncamera

      // let dist = 8;
      let angle = Math.PI / 2;

      var timeline = gsap.timeline();
      timeline.to(
        ".homeleft",
        {
          x: "-70vw",
          overflowX: "hidden",
          duration: 0.4,
        },
        "one"
      );
      timeline.to(
        ".homeright",
        {
          x: "70vw",
          overflowX: "hidden",
          duration: 0.4,
        },
        "one"
      );

      //  var matrix = new THREE.Matrix4()
      //  matrix.makeRotationY(Math.PI / 2);
      timeline
        .to(
          scene.rotation,
          {
            y: Math.PI / 2,
            duration: 0.3,
            onUpdate:()=>renderer.render(scene,camera)
          },
          "one"
        )
        .to(camera.position, {
          z: 18,
          onUpdate:()=>renderer.render(scene,camera)
        });

      // Apply matrix like this to rotate the camera.
      //  camera.position.applyMatrix4(matrix);
      console.log(angle);

      const allGroup = scene.children.filter((x) => x.name.endsWith("Group"));
      console.log(allGroup.children);

      allGroup.map((grp) => {
        var DetectionPlaneGeometry = new THREE.PlaneGeometry(10, 8);
        var DetectionPlaneMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00,
          transparent: true,
          side: THREE.DoubleSide,
        });
        DetectionPlaneMaterial.opacity = 0;
        var DetectionPlaneMesh = new THREE.Mesh(
          DetectionPlaneGeometry,
          DetectionPlaneMaterial
        );
        DetectionPlaneMesh.position.set(
          grp.position.x,
          grp.position.y + 2.5,
          grp.position.z
        );
        DetectionPlaneMesh.rotation.x = 0;
        DetectionPlaneMesh.rotation.y = Math.PI / 2;
        DetectionPlaneMesh.name = grp.name;
        scene.add(DetectionPlaneMesh);

        grp.traverse((child) => {
          console.log("child", child);
          if (child instanceof THREE.Mesh && child.name.startsWith("Text")) {
            child.rotation.x = Math.PI / 2;
            child.material.envMap = environment;
          }
        });
      });
      this.refreshObjects(scene, environment);
      // console.log(scene.children);
      //   let dl = scene.children.find(x=>x.type == THREE.DirectionalLight)

      allGroup.map((g) =>
        g.children.map((c) => {
          //new THREE.Box3().setFromObject( c ).getCenter(c.position).multiplyScalar(-1);
          // console.log(individual)
          //  var axis = new THREE.Vector3(c.position );
          //  c.rotation.y=0.3
          //var sphereAxis = new THREE.AxesHelper(200);
          // sphereAxis.position.copy(axis);
          // c.add(sphereAxis);

          // var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0).normalize(), 0.05 );
          //c.applyQuaternion( quaternion )
          // c.rotateOnAxis(axis,-(Math.acos(camera.position.x / dist)-0.5))
          //  c.rotateY((0.5))

          console.log(c);
        })
      );

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      var hoveringOver = null;

      window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const intersectedObjects = raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length == 0) return;
        console.log("mm", intersectedObjects);
        hoveringOver = intersectedObjects.pop().object.name;
      });

      window.addEventListener(
        "click",
        (event) => {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          const intersectedObjects = raycaster.intersectObjects(scene.children);
          if (intersectedObjects.length == 0) return;

          // let name;

          // console.log(intersectedObjects)
          let rio = intersectedObjects.reverse();
          let last;
          if (hoveringOver) {
            last = rio.find((x) => x.object.name == hoveringOver);
          } else {
            last = rio.find((x) => x.object.type == "Mesh");
          }

          if (last) {
            last.object.traverseAncestors((a) => {
              if (a.name.endsWith("Group") && a.name != this.selectedBottle) {
                this.setSelectedBottle(a.name);
              }
            });
          }
        },
        false
      );

      function tick() {
        requestAnimationFrame(tick);

        raycaster.setFromCamera(mouse, camera);

        camera.lookAt(controls.target);
       // const {environment} = this.threejsProperties
        //  this.refreshObjects(scene, scene.environment);

        //NEED TO REFRESH MATERIAAL N ENV
       // this.refreshObjects(scene,environment)
        renderer.render(scene, camera);
      }
      tick();

      //.to(camera,{
      //rotateY:Math.acos(camera.position.x / dist)
      //})

      //  camera.position.x = dist * Math.sin(angle);
      //  camera.position.z = dist * Math.cos(angle);
      //  camera.rotation.y = Math.acos(camera.position.x / dist);

      // gui.add(camera,'position.x',0,100,1)
    },
  },
};
</script>
<style scoped>
#gui {
  z-index: 500;
}
</style>
