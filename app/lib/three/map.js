// The 3D world map: six regions around one creek, with drifting clouds.
// Ported from the original site; the region panel and marker buttons now live
// in Vue (components/world/*). Client-only.
import {THREE,V3,col,rng,fbm,smooth,P,plain,glowSprite,makeRenderer,fit,disposeTree,bakeStatic,MOBILE,REDUCE} from './core.js'
import {buildBarn,buildWell,buildTent,buildForge} from './models.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {gsap} from 'gsap'
import {addToLoop,lowerPixelRatio} from './loop.js'
import {REGIONS} from '../../data/regions.js'

/**
 * @typedef {Object} WorldMap
 * @property {(i:number) => void} flyTo   Flies the camera toward region i
 * @property {(els:HTMLElement[]) => void} setMarkers  Marker buttons to pin over each region, in REGIONS order
 * @property {() => void} dispose
 */

/**
 * Builds the map in `canvas`. Throws if WebGL is unavailable.
 * @param {HTMLCanvasElement} canvas
 * @returns {WorldMap}
 */
export function createWorldMap(canvas){
  const R=makeRenderer(canvas,{alpha:true});
  R.toneMappingExposure=1.05;
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(36,1,1,600);cam.position.set(70,95,110);
  const ctr=new OrbitControls(cam,canvas);ctr.target.set(0,0,0);ctr.enableDamping=true;ctr.enablePan=false;ctr.minDistance=70;ctr.maxDistance=220;ctr.maxPolarAngle=1.15;ctr.autoRotate=!REDUCE;ctr.autoRotateSpeed=.35;
  scene.add(new THREE.HemisphereLight(col(0xd8d2bc),col(0x20221c),.55));
  const sun=new THREE.DirectionalLight(col(0xffe2b8),2);sun.position.set(-60,90,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-90,right:90,top:90,bottom:-90,near:10,far:260});scene.add(sun);
  // game world -> map: x in [-62,113], z in [-78,76]
  const GX=x=>x/.7+24,GZ=z=>z/.8,MX=x=>(x-24)*.7,MZ=z=>z*.8;
  const RECT={meadow:{cx:8,cz:-25,hw:25,hh:20},grove:{cx:57,cz:-19,hw:17,hh:27},ridge:{cx:10,cz:-66,hw:45,hh:12},fields:{cx:5,cz:62,hw:38,hh:14},marsh:{cx:97,cz:20,hw:16,hh:26}};
  const sdR=(x,z,r)=>{const qx=Math.abs(x-r.cx)-r.hw,qz=Math.abs(z-r.cz)-r.hh;return Math.hypot(Math.max(qx,0),Math.max(qz,0))+Math.min(Math.max(qx,qz),0);};
  const segD=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);};
  const polyD=(x,z,pts)=>{let d=1e9;for(let i=0;i<pts.length-1;i++)d=Math.min(d,segD(x,z,pts[i],pts[i+1]));return d;};
  const creek=[];for(let i=0;i<=140;i++){const t=i/100;creek.push([-20+96*t,27+7*Math.sin(t*6)+6*t]);}
  const ponds=[[90,5,1],[102,18,1.3],[91,32,1.1],[106,-1,.9],[100,40,.8]];
  const creekD=(x,z)=>{let d=Math.min(polyD(x,z,creek),Math.hypot(x+20,z-27)-2.5);if(x>70)ponds.forEach(([px,pz,k])=>{d=Math.min(d,Math.hypot(x-px,z-pz)-2.5*k);});return d;};
  const PATHS=[[[-31,-11],[-23,-12.7],[-17,-18],[-10,-22]],[[-31,14.5],[-24.6,17.1],[-21,23]],[[30,-24],[41,-22]],[[-10,-22],[-2,-38],[4,-54]],[[41,-22],[68,-9],[84,6]],[[-21,23],[-15,38],[-6,49]],[[-31,-11],[-31,14.5]]];
  const pathD=(x,z)=>Math.min(...PATHS.map(p=>polyD(x,z,p)));
  function region(mx,mz){const x=GX(mx),z=GZ(mz);
    if(sdR(x,z,RECT.marsh)<0)return 'marsh';if(sdR(x,z,RECT.grove)<0)return 'grove';if(sdR(x,z,RECT.ridge)<0)return 'ridge';
    if(sdR(x,z,RECT.fields)<0)return 'fields';if(sdR(x,z,RECT.meadow)<0)return 'meadow';if(x<-30&&x>-66&&z>-24&&z<26)return 'farm';return 'wild';}
  function Hm(mx,mz){const x=GX(mx),z=GZ(mz);let h=(fbm(mx*.04+3,mz*.04)-.5)*2.4;
    const t=smooth(-50,-72,z);h+=t*(3+fbm(mx*.05,mz*.05)*13);
    h+=(1-smooth(0,10,sdR(x,z,RECT.grove)))*fbm(mx*.08,mz*.08)*2.5;
    const d=creekD(x,z);h-=(1-smooth(0,4.5,d))*2.4;
    const m=1-smooth(-4,10,sdR(x,z,RECT.marsh));h=h*(1-m*.7)-m*.3;
    if(region(mx,mz)==='farm')h*=.35;
    const e=Math.max(Math.abs(mx),Math.abs(mz));h-=smooth(60,70,e)*6;return h;}
  const S=140,geo=new THREE.PlaneGeometry(S,S,220,220);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,cols=[];
  const C={ridge:col(0x2e4228),wild:col(0x3a5230),farm:col(0x6c8a3f),meadow:col(0x7d9446),grove:col(0x45602f),fields:col(0xa49a42),marsh:col(0x56664d),path:col(0x7a6446),sand:col(0x8f8461),rock:col(0x6d6a60),edge:col(0x2a2620)};
  const tc=new THREE.Color();
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=Hm(x,z),gx=GX(x),gz=GZ(z),reg=region(x,z);p.setY(i,h);tc.copy(C[reg]);
    const n=fbm(x*.15,z*.15);tc.multiplyScalar(.8+n*.4);
    if(reg==='ridge'&&h>11)tc.lerp(C.rock,smooth(11,15,h));
    if(creekD(gx,gz)<4)tc.lerp(C.sand,.5);
    if(reg==='farm'&&gx>-52&&gx<-36&&gz>15&&gz<23)tc.copy(Math.floor(gx*.8)%2?col(0x5a4128):col(0x4d6a2c));
    if(pathD(gx,gz)<1.8)tc.lerp(C.path,.85);
    const e=Math.max(Math.abs(x),Math.abs(z));if(e>60)tc.lerp(C.edge,smooth(60,68,e));
    cols.push(tc.r,tc.g,tc.b);}
  geo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));geo.computeVertexNormals();
  const land=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:false}));land.receiveShadow=true;scene.add(land);
  const water=new THREE.Mesh(new THREE.PlaneGeometry(S-6,S-6),new THREE.MeshStandardMaterial({color:col(0x2f6f86),roughness:.15,metalness:.1,transparent:true,opacity:.85}));water.rotation.x=-Math.PI/2;water.position.y=-.9;scene.add(water);
  const r=rng(77),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new V3();
  const clear=(x,z)=>pathD(GX(x),GZ(z))<3||creekD(GX(x),GZ(z))<2.5;
  const pineGeo=new THREE.ConeGeometry(1,3.2,6);pineGeo.translate(0,1.9,0);const pines=new THREE.InstancedMesh(pineGeo,plain(0x1f3320,{flatShading:true}),1000);let n=0;
  for(let i=0;i<12000&&n<1000;i++){const x=(r()-.5)*120,z=(r()-.5)*120;const reg=region(x,z);const want={ridge:.85,wild:.32,meadow:.03,marsh:.04,grove:.05}[reg]||0;
    if(r()>want)continue;const h=Hm(x,z);if(h<-.6||Math.max(Math.abs(x),Math.abs(z))>60||clear(x,z))continue;
    sc.setScalar(.7+r()*.7);m4.compose(P(x,h,z),q,sc);pines.setMatrixAt(n++,m4);}
  pines.count=n;pines.castShadow=true;scene.add(pines);
  const oakTop=new THREE.IcosahedronGeometry(1.7,1);oakTop.translate(0,2.9,0);const oakTrunk=new THREE.CylinderGeometry(.22,.32,2.2,6);oakTrunk.translate(0,1.1,0);
  const oaks=new THREE.InstancedMesh(oakTop,plain(0x3d5a26,{flatShading:true}),160),trunks=new THREE.InstancedMesh(oakTrunk,plain(0x4a3524),160);n=0;
  for(let i=0;i<6000&&n<160;i++){const x=(r()-.5)*120,z=(r()-.5)*120;if(region(x,z)!=='grove'||r()>.5)continue;const h=Hm(x,z);if(clear(x,z))continue;
    sc.setScalar(.8+r()*.6);m4.compose(P(x,h,z),q,sc);oaks.setMatrixAt(n,m4);trunks.setMatrixAt(n++,m4);}
  oaks.count=trunks.count=n;oaks.castShadow=trunks.castShadow=true;scene.add(oaks,trunks);
  const flower=new THREE.InstancedMesh(new THREE.SphereGeometry(.35,6,4),plain(0xf2c230,{emissive:col(0x3a2800)}),1400);n=0;
  for(let i=0;i<9000&&n<1400;i++){const x=(r()-.5)*120,z=(r()-.5)*120;if(region(x,z)!=='fields'||Math.max(Math.abs(x),Math.abs(z))>58)continue;if(Math.sin(x*.9)<.2||clear(x,z))continue;
    m4.compose(P(x,Hm(x,z)+.6,z),q,sc.setScalar(1));flower.setMatrixAt(n++,m4);}flower.count=n;scene.add(flower);
  const wild=new THREE.InstancedMesh(new THREE.SphereGeometry(.22,5,3),plain(0xd9d2f0,{emissive:col(0x1a1630)}),400);n=0;
  for(let i=0;i<6000&&n<400;i++){const x=(r()-.5)*120,z=(r()-.5)*120;if(region(x,z)!=='meadow'||r()>.5||clear(x,z))continue;
    m4.compose(P(x,Hm(x,z)+.3,z),q,sc.setScalar(1));wild.setMatrixAt(n++,m4);}wild.count=n;scene.add(wild);
  const reed=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.08,1.6,4),plain(0x8a7a4a),900);n=0;
  for(let i=0;i<9000&&n<900;i++){const x=(r()-.5)*120,z=(r()-.5)*120;if(region(x,z)!=='marsh'||Math.max(Math.abs(x),Math.abs(z))>58)continue;const h=Hm(x,z);if(h>-.3||h<-1.6)continue;
    m4.compose(P(x,h+.6,z),q,sc.setScalar(1));reed.setMatrixAt(n++,m4);}reed.count=n;scene.add(reed);
  const put=(fn,gx,gz,s,ry)=>{const g=new THREE.Group(),x=MX(gx),z=MZ(gz);g.position.set(x,Hm(x,z),z);g.scale.setScalar(s);g.rotation.y=ry||0;scene.add(g);fn(g);bakeStatic(g);return g;};
  put(buildBarn,-56,-5,.45,Math.PI/2);put(buildWell,-40,-10.2,.6);put(buildTent,-44,-16.5,.4,.6);put(buildForge,-46,4,.32,-Math.PI/2);
  const mist=new THREE.Group();scene.add(mist);for(let i=0;i<10;i++){const s=glowSprite(0xc8d4cc,16+r()*12,.18);s.position.set(MX(84+r()*26),1+r()*2,MZ(-4+r()*46));mist.add(s);}
  const MP=(gx,y,gz)=>P(MX(gx),y,MZ(gz));
  const POS=REGIONS.map(g=>MP(...g.at));
  /** @type {HTMLElement[]} */
  let marks=[];
  const onStart=()=>{ctr.autoRotate=false;};ctr.addEventListener('start',onStart);
  // clouds drift over the map and throw soft shadows on the land
  const clouds=[];
  for(let i=0;i<(MOBILE?5:8);i++){const c=new THREE.Group(),cm=new THREE.MeshStandardMaterial({color:col(0xf4f1ea),roughness:1,flatShading:true,transparent:true,opacity:.9});
    const n=3+Math.floor(r()*3);for(let k=0;k<n;k++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(2+r()*2.4,0),cm);b.position.set((k-n/2)*2.7+r(),r()*1.3,(r()-.5)*2.6);b.scale.y=.62;b.castShadow=true;c.add(b);}
    c.position.set((r()-.5)*140,26+r()*8,(r()-.5)*110);c.userData={v:.8+r()*.9,m:cm};scene.add(c);clouds.push(c);}
  // fly the camera toward a picked region, keeping the whole map in context
  function flyTo(p){const to=P(p.x*.55,0,p.z*.55),off=cam.position.clone().sub(ctr.target);off.setLength(THREE.MathUtils.clamp(off.length(),95,140));
    if(!REDUCE){gsap.to(ctr.target,{x:to.x,y:0,z:to.z,duration:1.4,ease:'power2.inOut',overwrite:true});gsap.to(cam.position,{x:to.x+off.x,y:to.y+off.y,z:to.z+off.z,duration:1.4,ease:'power2.inOut',overwrite:true});}
    else{ctr.target.copy(to);cam.position.copy(to).add(off);}}
  const v=new V3();
  const stop=addToLoop(canvas,(t,dt)=>{fit(R,cam,canvas);ctr.update();mist.children.forEach((s,i)=>{s.position.x+=Math.sin(t*.2+i)*.01;});
    if(!REDUCE)clouds.forEach(c=>{c.position.x+=c.userData.v*dt;if(c.position.x>80)c.position.x=-80;c.userData.m.opacity=.9*(1-smooth(55,78,Math.abs(c.position.x)));});
    R.render(scene,cam);
    const w=canvas.clientWidth,h=canvas.clientHeight;POS.forEach((pos,i)=>{const m=marks[i];if(!m)return;v.copy(pos).project(cam);const vis=v.z<1&&Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05;m.style.display=vis?'':'none';
      m.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px) translate(-50%,-100%)`;});},{degrade:()=>lowerPixelRatio(R),onError:()=>dispose()});
  let disposed=false;
  function dispose(){if(disposed)return;disposed=true;stop();gsap.killTweensOf([ctr.target,cam.position]);ctr.removeEventListener('start',onStart);ctr.dispose();disposeTree(scene);R.dispose();}
  return {
    flyTo(i){ctr.autoRotate=false;flyTo(POS[i]);},
    setMarkers(els){marks=els;},
    dispose
  };
}
