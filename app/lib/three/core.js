// Shared three.js toolkit for every Wildwood scene: noise, procedural canvas
// textures, shared materials, mesh helpers, fire and smoke.
// Ported from the original single-file site. Client-only: this module touches
// `document` when it loads, so import it dynamically from onMounted.
import * as THREE from 'three'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** True on touch devices and narrow screens, where scenes use lighter settings. */
export const MOBILE = matchMedia('(pointer: coarse)').matches || innerWidth < 700
/** True when the visitor asked the OS for less motion. */
export const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches

const V3=THREE.Vector3, UP=new V3(0,1,0);
const col=h=>new THREE.Color(h).convertSRGBToLinear();
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash(x,y){const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s);}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y){let s=0,a=.5,f=1;for(let i=0;i<5;i++){s+=a*vnoise(x*f,y*f);f*=2.03;a*=.5;}return s;}
function smooth(a,b,x){const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);}

// ---------- procedural textures ----------
function ctex(w,h,draw,o){o=o||{};const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h,rng(o.seed||1));
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(o.srgb!==false)t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}
function shade(r,g,b,k){return `rgb(${r*k|0},${g*k|0},${b*k|0})`;}
const T={};
T.bark=ctex(256,512,(x,w,h,r)=>{x.fillStyle='#3a2f27';x.fillRect(0,0,w,h);
  for(let i=0;i<1400;i++){const px=r()*w,py=r()*h,len=20+r()*90,k=.55+r()*.9;x.strokeStyle=shade(74,60,48,k);x.globalAlpha=.35+r()*.5;x.lineWidth=1+r()*3.5;
    x.beginPath();x.moveTo(px,py);x.lineTo(px+(r()-.5)*4,py+len);x.stroke();}
  x.globalAlpha=.5;for(let i=0;i<160;i++){x.fillStyle=shade(20,16,12,1);x.fillRect(r()*w,r()*h,1+r()*2,6+r()*24);}
  x.globalAlpha=.18;for(let i=0;i<60;i++){x.fillStyle='#5d6b44';x.beginPath();x.arc(r()*w,r()*h,4+r()*14,0,7);x.fill();}});
T.wood=ctex(256,256,(x,w,h,r)=>{x.fillStyle='#7b5b3d';x.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){const px=r()*w,k=.6+r()*.7;x.strokeStyle=shade(123,92,62,k);x.globalAlpha=.3+r()*.4;x.lineWidth=.5+r()*2.2;x.beginPath();x.moveTo(px,0);x.bezierCurveTo(px+(r()-.5)*8,h*.3,px+(r()-.5)*8,h*.7,px+(r()-.5)*6,h);x.stroke();}
  x.globalAlpha=.6;for(let i=0;i<6;i++){const cx=r()*w,cy=r()*h;x.strokeStyle='#3d2b1b';for(let k=1;k<5;k++){x.lineWidth=1;x.beginPath();x.ellipse(cx,cy,k*2,k*5,0,0,7);x.stroke();}}},{seed:3});
T.planks=ctex(256,256,(x,w,h,r)=>{const n=6,bw=w/n;for(let i=0;i<n;i++){const k=.75+r()*.45;x.fillStyle=shade(120,88,58,k);x.fillRect(i*bw,0,bw,h);
  x.globalAlpha=.35;for(let j=0;j<60;j++){x.strokeStyle=shade(70,50,32,.8+r()*.5);x.lineWidth=.6+r();const px=i*bw+r()*bw;x.beginPath();x.moveTo(px,0);x.lineTo(px+(r()-.5)*3,h);x.stroke();}
  x.globalAlpha=1;x.fillStyle='#2a1d12';x.fillRect(i*bw,0,2,h);const cut=r()*h;x.fillRect(i*bw,cut,bw,2);
  x.fillStyle='#1d1d1d';x.fillRect(i*bw+bw/2-2,cut+8,3,3);x.fillRect(i*bw+bw/2-2,cut-11,3,3);}},{seed:5});
T.stone=ctex(256,256,(x,w,h,r)=>{x.fillStyle='#6d6b66';x.fillRect(0,0,w,h);
  for(let i=0;i<2600;i++){x.globalAlpha=.25+r()*.4;x.fillStyle=shade(110,108,102,.5+r()*.9);x.beginPath();x.arc(r()*w,r()*h,.5+r()*5,0,7);x.fill();}
  x.globalAlpha=.3;for(let i=0;i<40;i++){x.fillStyle='#55603f';x.beginPath();x.arc(r()*w,r()*h,3+r()*12,0,7);x.fill();}},{seed:7});
T.ground=ctex(512,512,(x,w,h,r)=>{x.fillStyle='#2f2a1f';x.fillRect(0,0,w,h);
  for(let i=0;i<260;i++){x.globalAlpha=.25+r()*.3;x.fillStyle=r()<.5?'#3d4a26':'#4a3b28';x.beginPath();x.arc(r()*w,r()*h,8+r()*40,0,7);x.fill();}
  for(let i=0;i<9000;i++){const px=r()*w,py=r()*h,a=r()*Math.PI,l=3+r()*7;x.globalAlpha=.5+r()*.5;x.strokeStyle=r()<.6?shade(120,80,45,.6+r()*.7):shade(80,90,50,.6+r()*.6);x.lineWidth=.8;
    x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}},{seed:9});
T.branch=ctex(256,128,(x,w,h,r)=>{x.clearRect(0,0,w,h);x.lineCap='round';
  const twig=(x0,y0,x1,y1,s)=>{x.strokeStyle='#3b2c1f';x.lineWidth=2*s;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();
    const n=60*s;for(let i=0;i<n;i++){const t=i/n,px=x0+(x1-x0)*t,py=y0+(y1-y0)*t,len=(1-t*.6)*20*s;
      for(const sg of [-1,1]){const a=Math.atan2(y1-y0,x1-x0)+sg*(.9+r()*.4);x.strokeStyle=shade(38,62,34,.6+r()*.8);x.lineWidth=1.3;
        x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*len,py+Math.sin(a)*len);x.stroke();}}};
  twig(6,64,250,64,1.4);for(let k=0;k<5;k++){const t=.2+k*.14,px=6+244*t;twig(px,64,px+60*(1-t),64+(k%2?-1:1)*(30+r()*12),.75);}},{seed:11});
T.fern=ctex(128,256,(x,w,h,r)=>{x.clearRect(0,0,w,h);x.strokeStyle='#4b5e2a';x.lineWidth=2;x.beginPath();x.moveTo(64,256);x.quadraticCurveTo(60,120,64,6);x.stroke();
  for(let i=0;i<34;i++){const t=i/34,py=250-t*240,len=(Math.sin(t*Math.PI)*.85+.15)*52;
    for(const s of [-1,1]){x.fillStyle=shade(70,100,40,.65+r()*.6);x.beginPath();x.ellipse(64+s*len/2,py-4,len/2,4.5,s*-.25,0,7);x.fill();}}},{seed:13});
T.fur=ctex(256,256,(x,w,h,r)=>{x.fillStyle='#c2c2c2';x.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){const px=r()*w,py=r()*h,a=1.3+(r()-.5)*.6,l=3+r()*8;x.globalAlpha=.35+r()*.4;x.strokeStyle=shade(198,198,198,.6+r()*.6);x.lineWidth=.8;
    x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}},{seed:15});
T.leather=ctex(128,128,(x,w,h,r)=>{x.fillStyle='#4a3020';x.fillRect(0,0,w,h);for(let i=0;i<8;i++){x.fillStyle=i%2?'#3a2418':'#56392a';x.fillRect(0,i*16,w,16);
  x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,i*16,w,2);}for(let i=0;i<800;i++){x.globalAlpha=.2;x.fillStyle=r()<.5?'#000':'#7a5440';x.fillRect(r()*w,r()*h,1,1);}},{seed:17});
T.glow=ctex(128,128,(x,w,h)=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h);},{srgb:false});
T.shaft=ctex(64,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
  const v=x.createLinearGradient(0,0,0,h);v.addColorStop(0,'rgba(0,0,0,1)');v.addColorStop(.25,'rgba(0,0,0,0)');v.addColorStop(.75,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,1)');
  x.globalCompositeOperation='destination-out';x.fillStyle=v;x.fillRect(0,0,w,h);},{srgb:false});
function tex(t,rx,ry){const c=t.clone();c.needsUpdate=true;c.repeat.set(rx,ry);return c;}

// ---------- shared materials & helpers ----------
const M={};
M.bark=new THREE.MeshStandardMaterial({map:tex(T.bark,2,3),bumpMap:tex(T.bark,2,3),bumpScale:.06,roughness:.95});
M.log=new THREE.MeshStandardMaterial({map:tex(T.wood,1,2),bumpMap:tex(T.wood,1,2),bumpScale:.03,roughness:.85,color:col(0xd8c3a5)});
M.plank=new THREE.MeshStandardMaterial({map:tex(T.planks,1,1),bumpMap:tex(T.planks,1,1),bumpScale:.03,roughness:.85});
M.stone=new THREE.MeshStandardMaterial({map:tex(T.stone,1,1),bumpMap:tex(T.stone,1,1),bumpScale:.08,roughness:.95});
M.leather=new THREE.MeshStandardMaterial({map:tex(T.leather,1,2),roughness:.7});
M.steel=new THREE.MeshStandardMaterial({color:col(0xd4d7db),metalness:.9,roughness:.32,envMapIntensity:1.6});
M.dark=new THREE.MeshStandardMaterial({color:col(0x2b2b2b),metalness:.8,roughness:.4});
M.ash=new THREE.MeshStandardMaterial({color:col(0x1a1612),roughness:1});
M.leaf=new THREE.MeshStandardMaterial({map:tex(T.branch,1,1),alphaTest:.45,side:THREE.DoubleSide,roughness:.85});
M.eye=new THREE.MeshStandardMaterial({color:col(0x0a0806),roughness:.08});
M.nose=new THREE.MeshStandardMaterial({color:col(0x1c1715),roughness:.35});
const furCache={};
function fur(hex){return furCache[hex]||(furCache[hex]=new THREE.MeshStandardMaterial({map:tex(T.fur,2,2),bumpMap:tex(T.fur,3,3),bumpScale:.006,roughness:1,envMapIntensity:.45,color:col(hex)}));}
function plain(hex,o){return new THREE.MeshStandardMaterial(Object.assign({color:col(hex),roughness:.8},o||{}));}
function sh(m){m.castShadow=m.receiveShadow=true;return m;}
function mesh(g,geo,mat,x,y,z){const m=sh(new THREE.Mesh(geo,mat));m.position.set(x||0,y||0,z||0);g.add(m);return m;}
function beam(g,a,b,r1,r2,mat,seg){const d=new V3().subVectors(b,a),len=d.length();const m=sh(new THREE.Mesh(new THREE.CylinderGeometry(r2==null?r1:r2,r1,len,seg||9),mat));
  m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(UP,d.normalize());g.add(m);return m;}
const SPH=new THREE.SphereGeometry(1,28,18);
function ell(g,mat,sx,sy,sz,x,y,z){const m=mesh(g,SPH,mat,x,y,z);m.scale.set(sx,sy,sz);return m;}
function P(x,y,z){return new V3(x,y,z);}
function log(g,len,r,x,y,z,axis){const h=len/2,a=axis==='x'?P(h,0,0):axis==='z'?P(0,0,h):P(0,h,0);return beam(g,P(x,y,z).sub(a),P(x,y,z).add(a),r,r,M.log,10);}
function box(g,w,h,d,mat,x,y,z){return mesh(g,new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
function rock(g,r,x,y,z,seed){const geo=new THREE.IcosahedronGeometry(r,1);const p=geo.attributes.position,R=rng(seed||1);
  for(let i=0;i<p.count;i++){const k=.75+R()*.45;p.setXYZ(i,p.getX(i)*k,p.getY(i)*k*.75,p.getZ(i)*k);}geo.computeVertexNormals();return mesh(g,geo,M.stone,x,y,z);}
function glowSprite(hex,size,opacity){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:T.glow,color:col(hex),transparent:true,opacity:opacity==null?1:opacity,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.setScalar(size);return s;}
const GLINT=new THREE.MeshBasicMaterial({color:0xffffff});
// small white catchlight that makes an eye read as wet and alive
function glint(g,r,x,y,z){const m=new THREE.Mesh(SPH,GLINT);m.scale.setScalar(r);m.position.set(x,y,z);g.add(m);return m;}
// soft smoke column; returns an update(t,dt)
const SMOKE_N=MOBILE?7:12;
function makeSmoke(g,x,y,z,scale,opacity){scale=scale||1;const grp=new THREE.Group();grp.position.set(x,y,z);g.add(grp);const puffs=[];
  for(let i=0;i<SMOKE_N;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:T.glow,color:col(0x9a958c),transparent:true,opacity:0,depthWrite:false}));grp.add(s);puffs.push({s,l:i/SMOKE_N,k:Math.random()*6.28});}
  const top=opacity==null?.32:opacity;
  return function(t,dt){puffs.forEach(p=>{p.l+=dt*.12;if(p.l>1)p.l-=1;const l=p.l;
    p.s.position.set(Math.sin(t*.5+p.k)*.25*scale*l+l*l*.9*scale,l*4.2*scale,Math.cos(t*.4+p.k)*.2*scale*l);
    p.s.scale.setScalar((.35+l*1.9)*scale);p.s.material.opacity=top*Math.sin(Math.PI*Math.min(1,l*1.4))*(1-l*.5);});};}
function triPrism(w,h,d){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});geo.translate(0,0,-d/2);return geo;}
function gableRoof(g,W,D,y,rise,over,mat){const E=P(-W/2-over,y-.25,0),R=P(0,y+rise,0),len=E.distanceTo(R)+.15,ang=Math.atan2(R.y-E.y,R.x-E.x);
  for(const s of [-1,1]){const m=box(g,len,.16,D+over*2,mat,s*(E.x+R.x)/2,(E.y+R.y)/2,0);m.rotation.z=s*ang;}}

// ---------- fire ----------
function makeFire(g,x,y,z,scale,smoke){scale=scale||1;const grp=new THREE.Group();grp.position.set(x,y,z);g.add(grp);
  const flames=[];const mats=[[0xff6a1a,.55,1],[0xffa040,.7,.7],[0xffe0a0,.85,.4]];
  mats.forEach(([c,o,s],i)=>{for(let k=0;k<3;k++){const m=new THREE.Mesh(new THREE.ConeGeometry(.22*s*scale,.9*s*scale+.2*scale,8,1,true),new THREE.MeshBasicMaterial({color:col(c),transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
    m.position.set((k-1)*.08*scale*(1-i*.3),.35*s*scale,(k%2-.5)*.08*scale);grp.add(m);flames.push(m);}});
  const glow=glowSprite(0xff8a3a,3.2*scale,.9);glow.position.y=.4*scale;grp.add(glow);
  const light=new THREE.PointLight(col(0xff8a3a),2.2,14*scale,2);light.position.y=.8*scale;grp.add(light);
  const N=60,pos=new Float32Array(N*3),life=new Float32Array(N);for(let i=0;i<N;i++){life[i]=Math.random();}
  const emb=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(pos,3)),new THREE.PointsMaterial({color:col(0xffa050),size:.05*scale,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));grp.add(emb);
  const sm=smoke?makeSmoke(grp,0,1.1*scale,0,scale*.8):null;
  return function(t,dt){if(sm)sm(t,dt);flames.forEach((f,i)=>{const k=1+Math.sin(t*9+i*1.7)*.18+Math.sin(t*23+i)*.08;f.scale.set(1,k,1);f.rotation.y=t*(.5+i*.1);});
    light.intensity=2.1+Math.sin(t*11)*.35+Math.sin(t*27)*.2;glow.material.opacity=.75+Math.sin(t*13)*.1;
    for(let i=0;i<N;i++){life[i]+=dt*(.35+(i%5)*.06);if(life[i]>1)life[i]-=1;const l=life[i];pos[i*3]=Math.sin(i*12.9+l*4)*.3*scale*l;pos[i*3+1]=l*2.6*scale;pos[i*3+2]=Math.cos(i*7.3+l*3)*.3*scale*l;}
    emb.geometry.attributes.position.needsUpdate=true;};}

// ---------- renderer helpers ----------
function makeRenderer(canvas,o){const r=new THREE.WebGLRenderer(Object.assign({canvas,antialias:true},o||{}));r.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1.5:1.75));
  r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;return r;}
function fit(r,cam,canvas){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;if(canvas.width!==Math.round(w*r.getPixelRatio())||canvas.height!==Math.round(h*r.getPixelRatio())){r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}}

/**
 * Frees the GPU resources an object tree owns. Shared geometry, materials and
 * textures (the toolkit's own, and three.js's shared sprite quad) are skipped so
 * other models and scenes keep using them without re-uploading.
 * @param {THREE.Object3D} root
 */
function disposeTree(root){
  const sharedMats=[GLINT,...Object.values(M),...Object.values(furCache)];
  const shared=new Set(sharedMats);
  const sharedTex=new Set(Object.values(T));
  // the shared materials' own maps (clones made by tex()) are shared too, and cloned
  // materials (ghost wolf, Spirit Fawn) still point at them
  sharedMats.forEach(m=>Object.values(m).forEach(v=>{if(v&&v.isTexture)sharedTex.add(v);}));
  root.traverse(o=>{
    if(o.geometry&&!o.isSprite&&o.geometry!==SPH&&o.geometry!==PUMPKIN_REF.geo)o.geometry.dispose();
    const mats=Array.isArray(o.material)?o.material:o.material?[o.material]:[];
    mats.forEach(m=>{if(shared.has(m))return;Object.values(m).forEach(v=>{if(v&&v.isTexture&&!sharedTex.has(v))v.dispose();});m.dispose();});
  });
}

/**
 * Merges the static meshes under `root` into one mesh per material, so a prop
 * built from hundreds of small parts costs a handful of draw calls. Anything
 * inside a nested Group (fires, a weathervane, an animated animal) is left
 * alone, because it may move. Call once, after the props are built and placed.
 * @param {THREE.Object3D} root
 */
function bakeStatic(root){
  root.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),m4=new THREE.Matrix4();
  /** @type {Map<string,{mat:THREE.Material,cast:boolean,recv:boolean,geos:THREE.BufferGeometry[]}>} */
  const buckets=new Map(),merged=new Set();
  const walk=o=>{o.children.forEach(c=>{
    if(c.isGroup)return;
    if(c.isMesh&&!c.isInstancedMesh&&!Array.isArray(c.material)){
      const key=c.material.uuid+(c.castShadow?'c':'')+(c.receiveShadow?'r':'');
      let b=buckets.get(key);if(!b)buckets.set(key,b={mat:c.material,cast:c.castShadow,recv:c.receiveShadow,geos:[]});
      const g=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();
      Object.keys(g.attributes).forEach(k=>{if(k!=='position'&&k!=='normal'&&k!=='uv')g.deleteAttribute(k);});
      if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
      if(!g.attributes.normal)g.computeVertexNormals();
      g.clearGroups();g.applyMatrix4(m4.multiplyMatrices(inv,c.matrixWorld));b.geos.push(g);merged.add(c);
    }
    walk(c);
  });};
  walk(root);
  merged.forEach(c=>{[...c.children].forEach(k=>{if(!merged.has(k))root.attach(k);});if(c.parent)c.parent.remove(c);});
  buckets.forEach(b=>{
    if(!b.geos.length)return;
    const geo=b.geos.length>1?BufferGeometryUtils.mergeBufferGeometries(b.geos):b.geos[0];
    if(b.geos.length>1)b.geos.forEach(g=>g.dispose());
    const mesh=new THREE.Mesh(geo,b.mat);mesh.castShadow=b.cast;mesh.receiveShadow=b.recv;root.add(mesh);
  });
}
/** Holder so models.js can register its cached pumpkin geometry as shared. */
const PUMPKIN_REF={geo:null};

/**
 * Lets the mouse wheel scroll the page over a 3D scene. The scene only zooms
 * while Ctrl or Cmd is held (a trackpad pinch counts, since it arrives as a
 * Ctrl+wheel). A plain wheel shows a short hint instead.
 * Runs on the parent in the capture phase, before OrbitControls sees the event,
 * and leaves `enableZoom` alone so touch pinch keeps working.
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void} Removes the listener and the hint
 */
function wheelZoomGuard(canvas){
  const host=canvas.parentElement;if(!host)return()=>{};
  const tip=document.createElement('div');tip.className='zoom-tip';tip.setAttribute('aria-hidden','true');
  tip.textContent=/Mac|iPhone|iPad/.test(navigator.platform)?'Hold ⌘ and scroll to zoom':'Hold Ctrl and scroll to zoom';
  host.appendChild(tip);
  let timer=0;
  /** @param {WheelEvent} e */
  const onWheel=(e)=>{
    if(e.ctrlKey||e.metaKey){
      tip.classList.remove('on');
      // Over an overlay (buttons, map markers) the event would miss the canvas
      // and zoom the browser page instead, so pass it on to the canvas.
      if(e.target!==canvas){e.preventDefault();canvas.dispatchEvent(new WheelEvent('wheel',e));}
      return;
    }
    // Plain wheel: keep it from OrbitControls so the page scrolls as usual.
    e.stopPropagation();
    tip.classList.add('on');clearTimeout(timer);timer=setTimeout(()=>tip.classList.remove('on'),1400);
  };
  host.addEventListener('wheel',onWheel,{capture:true,passive:false});
  return()=>{clearTimeout(timer);host.removeEventListener('wheel',onWheel,{capture:true});tip.remove();};
}

export {THREE,V3,UP,col,rng,fbm,smooth,T,tex,M,fur,plain,sh,mesh,beam,SPH,ell,P,log,box,rock,glowSprite,glint,makeSmoke,triPrism,gableRoof,makeFire,makeRenderer,fit,disposeTree,bakeStatic,wheelZoomGuard,PUMPKIN_REF}
