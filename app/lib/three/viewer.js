// The field-guide viewer: one model at a time on a turntable, with day, dusk
// and night lighting. Ported from the original site; the item list, info panel
// and buttons now live in Vue (components/showcase/*). Client-only.
import {THREE,V3,col,smooth,T,P,SPH,makeRenderer,fit,disposeTree,wheelZoomGuard,REDUCE} from './core.js'
import {MODELS} from './models.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {gsap} from 'gsap'
import {addToLoop,lowerPixelRatio} from './loop.js'

/** @typedef {'day'|'dusk'|'night'} LightMode */
/** @type {LightMode[]} */
export const LIGHT_MODES=['day','dusk','night']

/**
 * @typedef {Object} Viewer
 * @property {(item:import('../../data/catalog.js').CatalogItem, category:string) => Record<string,any>} show
 *   Swaps in a model and frames it. Returns the model's tally (extra stat rows).
 * @property {(mode:LightMode) => void} setLight
 * @property {(on:boolean) => void} setSpin
 * @property {() => void} dispose
 */

/**
 * Starts the viewer in `canvas`. Throws if WebGL is unavailable.
 * @param {HTMLCanvasElement} canvas
 * @param {{light?:LightMode, spin?:boolean}} [opts]
 * @returns {Viewer}
 */
export function createViewer(canvas,opts={}){
  const R=makeRenderer(canvas,{alpha:true});
  R.toneMappingExposure=1.1;
  const scene=new THREE.Scene();
  // environment for metals
  const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();const sg=new THREE.SphereGeometry(10,32,16),cs=[];const sp=sg.attributes.position;
  for(let i=0;i<sp.count;i++){const y=sp.getY(i)/10;const c=new THREE.Color().lerpColors(col(0x3a3c38),col(0xd8d2c4),smooth(-.4,.7,y));cs.push(c.r,c.g,c.b);}sg.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));
  es.add(new THREE.Mesh(sg,new THREE.MeshBasicMaterial({side:THREE.BackSide,vertexColors:true})));
  const pan=new THREE.Mesh(new THREE.PlaneGeometry(6,3),new THREE.MeshBasicMaterial({color:new THREE.Color(6,5.4,4.6),side:THREE.DoubleSide}));pan.position.set(4,6,4);pan.lookAt(0,0,0);es.add(pan);
  const pan2=pan.clone();pan2.material=new THREE.MeshBasicMaterial({color:new THREE.Color(1.5,2,3),side:THREE.DoubleSide});pan2.position.set(-6,3,-3);pan2.lookAt(0,0,0);es.add(pan2);
  const ENV={day:pm.fromScene(es,.03).texture},cs0=cs.slice();
  function envVariant(k,c1,c2){const a=sg.attributes.color;for(let i=0;i<cs0.length;i++)a.array[i]=cs0[i]*k;a.needsUpdate=true;pan.material.color.setRGB(...c1);pan2.material.color.setRGB(...c2);return pm.fromScene(es,.03).texture;}
  ENV.dusk=envVariant(.55,[6,3,1.3],[.7,.65,1.1]);ENV.night=envVariant(.12,[.6,.75,1.5],[.15,.2,.55]);
  scene.environment=ENV.day;
  const cam=new THREE.PerspectiveCamera(32,1,.01,200);const ctr=new OrbitControls(cam,canvas);ctr.enableDamping=true;ctr.enablePan=false;const unguard=wheelZoomGuard(ctr,canvas);ctr.autoRotate=!REDUCE;ctr.autoRotateSpeed=.8;ctr.maxPolarAngle=Math.PI*.49;
  const hemi=new THREE.HemisphereLight(col(0xc8c0ac),col(0x1a1d1a),.35);scene.add(hemi);
  const key=new THREE.DirectionalLight(col(0xffe2c0),2.2);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0004;scene.add(key,key.target);
  const rim=new THREE.DirectionalLight(col(0x8fb4ff),1.2);scene.add(rim);
  const lamp=new THREE.PointLight(col(0xffa050),0,10,2);scene.add(lamp);
  // lighting presets: day shows true colours, dusk is the campfire hour, night shows what glows
  const LIGHTS={day:{exp:1.1,hemi:[0xc8c0ac,0x1a1d1a,.35],key:[0xffe2c0,2.2],kp:[2.5,4,2],rim:[0x8fb4ff,1.2],lamp:0,floor:0x22261f},
    dusk:{exp:1.05,hemi:[0xd8a080,0x1a1410,.3],key:[0xff9a55,2.6],kp:[3.6,1.5,1.4],rim:[0x8a86c8,.9],lamp:0,floor:0x2a221c},
    night:{exp:1.2,hemi:[0x5a6a9a,0x05060a,.22],key:[0x9ab4ff,1.1],kp:[-1.5,4,2],rim:[0x6a8aff,1.3],lamp:.9,floor:0x15181e}};
  let mode=LIGHTS[opts.light]?opts.light:'day',curRad=1;
  const floor=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshStandardMaterial({roughness:1,envMapIntensity:.25,color:col(0x22261f),alphaMap:T.glow,transparent:true,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  let cur=null,upd=null;
  function applyLight(){const L=LIGHTS[mode],r=curRad;R.toneMappingExposure=L.exp;
    hemi.color.copy(col(L.hemi[0]));hemi.groundColor.copy(col(L.hemi[1]));hemi.intensity=L.hemi[2];
    key.color.copy(col(L.key[0]));key.intensity=L.key[1];key.position.set(L.kp[0]*r,L.kp[1]*r,L.kp[2]*r);
    rim.color.copy(col(L.rim[0]));rim.intensity=L.rim[1];rim.position.set(-r*3,r*2,-r*3);
    lamp.intensity=L.lamp;lamp.distance=r*5;lamp.position.set(r*1.6,r*.5,r*1.4);
    floor.material.color.copy(col(L.floor));scene.environment=ENV[mode];}
  function show(it,c){
    if(cur){gsap.killTweensOf(cur.children[0].scale);scene.remove(cur);disposeTree(cur);}
    const outer=new THREE.Group(),g=new THREE.Group();outer.add(g);const res=MODELS[it.model](g,it.variant)||{};upd=res.update||null;
    outer.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(outer),size=box.getSize(new V3()),center=box.getCenter(new V3());
    const float=c==='weapons'?size.y*.25+Math.max(size.x,size.z)*.1:0;g.position.set(-center.x,-box.min.y+float,-center.z);
    scene.add(outer);cur=outer;
    const rad=Math.max(size.length()/2,.05),asp=canvas.clientWidth&&canvas.clientHeight?canvas.clientWidth/canvas.clientHeight:1,vh=THREE.MathUtils.degToRad(cam.fov/2),half=Math.min(vh,Math.atan(Math.tan(vh)*asp)),dist=rad/Math.sin(half)*1.05;
    ctr.target.set(0,size.y/2+float,0);const dir=P(.85,.42,1).normalize();cam.position.copy(ctr.target).addScaledVector(dir,dist);
    cam.near=dist*.01;cam.far=dist*20;cam.updateProjectionMatrix();ctr.minDistance=dist*.45;ctr.maxDistance=dist*2.2;
    floor.scale.setScalar(rad*4);
    curRad=rad;key.target.position.set(0,0,0);Object.assign(key.shadow.camera,{left:-rad*2.2,right:rad*2.2,top:rad*2.2,bottom:-rad*2.2,near:rad*.3,far:rad*12});key.shadow.camera.updateProjectionMatrix();
    applyLight();
    canvas.setAttribute('aria-label','3D model of the '+it.name);
    if(!REDUCE){g.scale.multiplyScalar(.001);gsap.to(g.scale,{x:1,y:1,z:1,duration:.7,ease:'back.out(1.6)'});}
    return res.tally||{};
  }
  ctr.autoRotate=opts.spin!==undefined?opts.spin:!REDUCE;
  const stop=addToLoop(canvas,(t,dt)=>{fit(R,cam,canvas);ctr.update();if(upd&&!REDUCE)upd(t,dt);R.render(scene,cam);},{degrade:()=>lowerPixelRatio(R),onError:()=>dispose()});
  let disposed=false;
  function dispose(){if(disposed)return;disposed=true;stop();if(cur)gsap.killTweensOf(cur.children[0].scale);unguard();ctr.dispose();disposeTree(scene);disposeTree(es);Object.values(ENV).forEach(t=>t.dispose());pm.dispose();R.dispose();}
  return {
    show,
    setLight(m){if(LIGHTS[m]){mode=m;applyLight();}},
    setSpin(on){ctr.autoRotate=on;},
    dispose
  };
}
