// The hero: a misty pine forest at dusk with a campfire, fireflies, an owl on a
// stump and a bunny hopping around camp. Ported from the original site.
// Client-only (see core.js).
import {THREE,V3,UP,col,rng,fbm,smooth,T,tex,M,P,mesh,beam,rock,makeRenderer,fit,disposeTree,bakeStatic,MOBILE,REDUCE} from './core.js'
import {buildCamp,buildBunny,buildOwl} from './models.js'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {addToLoop,lowerPixelRatio} from './loop.js'

/**
 * @typedef {Object} HeroOptions
 * @property {{v:number}} push        0 to 1 scroll push-in, tweened by the component's ScrollTrigger
 * @property {() => void} onFirstFrame Called once the first frame is on screen
 */

/**
 * Builds the forest and starts rendering it into `canvas`.
 * Throws if WebGL is unavailable.
 * @param {HTMLCanvasElement} canvas
 * @param {HeroOptions} opts
 * @returns {() => void} dispose
 */
export function createHeroScene(canvas,{push,onFirstFrame}){
  const R=makeRenderer(canvas);
  R.toneMappingExposure=1.05;R.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1.1:1.5));
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(48,1,.1,500);
  const horizon=col(0xb98c5e),fogC=col(0x6e6450);scene.fog=new THREE.FogExp2(fogC,.028);
  const sunDir=P(-.35,.22,-1).normalize();
  const sky=new THREE.Mesh(new THREE.SphereGeometry(300,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,
    uniforms:{top:{value:col(0x3c4a52)},hor:{value:horizon},fogc:{value:fogC},sun:{value:sunDir},sunc:{value:col(0xffc488)}},
    vertexShader:'varying vec3 vW;void main(){vW=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform vec3 top,hor,fogc,sun,sunc;varying vec3 vW;void main(){float h=vW.y;vec3 c=mix(hor,top,smoothstep(0.,.55,h));c=mix(fogc,c,smoothstep(-.05,.25,h));float s=max(dot(vW,sun),0.);c+=sunc*(pow(s,48.)*1.4+pow(s,6.)*.25);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'}));
  scene.add(sky);
  scene.add(new THREE.HemisphereLight(col(0xb0a58a),col(0x26241a),.55));
  const sun=new THREE.DirectionalLight(col(0xffc58a),2.1);sun.castShadow=true;sun.shadow.mapSize.setScalar(MOBILE?1024:2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:160});sun.shadow.bias=-.0006;
  scene.add(sun,sun.target);
  const H=(x,z)=>{const h=(fbm(x*.03,z*.03)-.5)*7+(fbm(x*.17+9,z*.17)-.5)*.7;const d=Math.hypot(x,z);return h*smooth(6,26,d)*(z>0?smooth(4,14,Math.abs(x)):1)+(z>0?h*.15:0);};
  const gg=new THREE.PlaneGeometry(260,260,200,200);gg.rotateX(-Math.PI/2);const gp=gg.attributes.position;for(let i=0;i<gp.count;i++)gp.setY(i,H(gp.getX(i),gp.getZ(i)));gg.computeVertexNormals();
  const ground=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({map:tex(T.ground,40,40),bumpMap:tex(T.ground,40,40),bumpScale:.06,roughness:1}));ground.receiveShadow=true;scene.add(ground);
  // trees
  const R0=rng(42),trees=[];
  const TREES=MOBILE?240:420;for(let i=0;i<4000&&trees.length<TREES;i++){const x=(R0()-.5)*220,z=(R0()-.5)*220-30;if(Math.hypot(x,z)<8)continue;if(z>-2&&z<40&&Math.abs(x)<9)continue;
    if(trees.some(t=>Math.hypot(t.x-x,t.z-z)<3.2))continue;trees.push({x,z,s:.8+R0()*.6,r:R0()*6.28});}
  const trunkGeo=new THREE.CylinderGeometry(.22,.42,19,8,1);trunkGeo.translate(0,9.5,0);
  const wind={value:0};const heroLeaf=M.leaf.clone();
  heroLeaf.onBeforeCompile=sh=>{sh.uniforms.uWind=wind;sh.vertexShader='uniform float uWind;\n'+sh.vertexShader.replace('#include <begin_vertex>',
    '#include <begin_vertex>\n  #ifdef USE_INSTANCING\n  vec3 ip=vec3(instanceMatrix[3]);\n  #else\n  vec3 ip=vec3(0.);\n  #endif\n  float hgt=max(position.y-6.,0.);\n  float sway=sin(uWind*1.2+ip.x*.21+ip.z*.17)+.4*sin(uWind*2.7+ip.z*.5);\n  transformed.x+=sway*.035*hgt;transformed.z+=cos(uWind*1.05+ip.x*.3)*.025*hgt;');};
  const fol=foliageGeo();const trunks=new THREE.InstancedMesh(trunkGeo,M.bark,trees.length),leaves=new THREE.InstancedMesh(fol,heroLeaf,trees.length);
  const mtx=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new V3(),tc=new THREE.Color();
  trees.forEach((t,i)=>{q.setFromAxisAngle(UP,t.r);sc.setScalar(t.s);mtx.compose(P(t.x,H(t.x,t.z)-.3,t.z),q,sc);trunks.setMatrixAt(i,mtx);leaves.setMatrixAt(i,mtx);
    tc.setHSL(.27+R0()*.05,.25+R0()*.15,.35+R0()*.25);leaves.setColorAt(i,tc);});
  trunks.castShadow=leaves.castShadow=true;trunks.receiveShadow=leaves.receiveShadow=true;scene.add(trunks,leaves);
  // ferns
  const fernMat=new THREE.MeshStandardMaterial({map:T.fern,alphaTest:.5,side:THREE.DoubleSide,roughness:.9});const fg=fernGeo();
  const ferns=new THREE.InstancedMesh(fg,fernMat,2600);let fi=0;const FERNS=MOBILE?1100:2600;for(let i=0;i<20000&&fi<FERNS;i++){const x=(R0()-.5)*120,z=(R0()-.5)*120-10;if(Math.hypot(x,z)<4.2)continue;if(fbm(x*.08,z*.08)<.45&&R0()<.7)continue;
    q.setFromAxisAngle(UP,R0()*6.28);sc.setScalar(.5+R0()*.9);mtx.compose(P(x,H(x,z),z),q,sc);ferns.setMatrixAt(fi,mtx);tc.setHSL(.22+R0()*.08,.35,.35+R0()*.3);ferns.setColorAt(fi,tc);fi++;}
  ferns.count=fi;ferns.receiveShadow=true;scene.add(ferns);
  // rocks and fallen logs
  const props=new THREE.Group();scene.add(props);
  for(let i=0;i<70;i++){const x=(R0()-.5)*100,z=(R0()-.5)*100-10;if(Math.hypot(x,z)<5)continue;rock(props,.3+R0()*1.2,x,H(x,z),z,i);}
  for(let i=0;i<18;i++){const x=(R0()-.5)*80,z=(R0()-.5)*80-15;if(Math.hypot(x,z)<7)continue;const a=R0()*6.28,l=3+R0()*6;
    beam(props,P(x,H(x,z)+.25,z),P(x+Math.cos(a)*l,H(x+Math.cos(a)*l,z+Math.sin(a)*l)+.25,z+Math.sin(a)*l),.32,.26,M.bark,9);}
  bakeStatic(props);
  // camp in the clearing
  const camp=new THREE.Group();camp.position.set(0,0,-1.5);camp.rotation.y=.25;scene.add(camp);const c=buildCamp(camp);bakeStatic(camp);
  // residents of the clearing: a bunny that hops about, an owl on a stump
  const bunny=new THREE.Group();bunny.scale.setScalar(1.6);scene.add(bunny);const bU=buildBunny(bunny).update;
  const bs={x:3,z:3.8,h:2.4,p:-1,next:1.2};bunny.position.set(bs.x,H(bs.x,bs.z),bs.z);bunny.rotation.y=bs.h;
  const owlG=new THREE.Group();owlG.position.set(-3.6,H(-3.6,3),3);owlG.rotation.y=-1.2;scene.add(owlG);
  mesh(owlG,new THREE.CylinderGeometry(.32,.42,.75,12),M.bark,0,.37,0);mesh(owlG,new THREE.CircleGeometry(.32,16),M.log,0,.751,0).rotation.x=-Math.PI/2;
  const owlIn=new THREE.Group();owlIn.position.y=.72;owlIn.scale.setScalar(1.7);owlG.add(owlIn);const oU=buildOwl(owlIn).update;bakeStatic(owlG);
  // fireflies
  const FN=MOBILE?40:90,fpos=new Float32Array(FN*3),fcol=new Float32Array(FN*3),fly=[];
  for(let i=0;i<FN;i++)fly.push({x:(R0()-.5)*24,z:(R0()-.5)*18+3,y:.3+R0()*2.4,k:R0()*6.28,s:.4+R0()*.6});
  const fgeo=new THREE.BufferGeometry();fgeo.setAttribute('position',new THREE.BufferAttribute(fpos,3));fgeo.setAttribute('color',new THREE.BufferAttribute(fcol,3));
  const flies=new THREE.Points(fgeo,new THREE.PointsMaterial({size:.32,map:T.glow,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(flies);
  // low ground mist
  const mistMat=new THREE.MeshBasicMaterial({map:T.glow,color:col(0xbdb39c),transparent:true,opacity:.16,depthWrite:false});const mist=[];
  for(let i=0;i<(MOBILE?8:16);i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mistMat);m.rotation.x=-Math.PI/2;m.scale.setScalar(12+R0()*14);
    m.position.set((R0()-.5)*50,.35+R0()*.9,6-R0()*40);m.position.y+=H(m.position.x,m.position.z);m.userData.k=R0()*6.28;scene.add(m);mist.push(m);}
  // light shafts
  const shaftMat=new THREE.MeshBasicMaterial({map:T.shaft,color:col(0xffd09a),transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false});
  const sq=new THREE.Quaternion().setFromUnitVectors(UP,sunDir);
  for(let i=0;i<14;i++){const g=new THREE.Group();g.position.set((R0()-.5)*50,8+R0()*6,-8-R0()*30);g.quaternion.copy(sq);
    for(let k=0;k<2;k++){const p=new THREE.Mesh(new THREE.PlaneGeometry(1.5+R0()*3,60),shaftMat);p.rotation.y=k*Math.PI/2;g.add(p);}scene.add(g);}
  // dust motes
  const DN=700,dp=new Float32Array(DN*3);for(let i=0;i<DN;i++){dp[i*3]=(R0()-.5)*30;dp[i*3+1]=R0()*8;dp[i*3+2]=(R0()-.5)*30;}
  const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(dp,3)),new THREE.PointsMaterial({color:col(0xffd8a8),size:.045,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(dust);
  let mx=0,my=0;const onMove=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;};if(!MOBILE)addEventListener('pointermove',onMove,{passive:true});
  const look=P(0,1.4,-2);let first=true;
  let composer=null;
  if(!MOBILE){try{
    const rt=THREE.WebGLMultisampleRenderTarget&&R.capabilities.isWebGL2?new THREE.WebGLMultisampleRenderTarget(2,2,{type:THREE.HalfFloatType}):undefined;
    composer=new EffectComposer(R,rt);composer.addPass(new RenderPass(scene,cam));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(256,256),.55,.6,.78));
    composer.addPass(new ShaderPass(GammaCorrectionShader));
  }catch(e){composer=null;}}
  let cw=0,ch=0;
  const stop=addToLoop(canvas,(t,dt)=>{
    fit(R,cam,canvas);if(composer&&(canvas.clientWidth!==cw||canvas.clientHeight!==ch)){cw=canvas.clientWidth;ch=canvas.clientHeight;composer.setSize(cw,ch);}
    wind.value=REDUCE?0:t;
    const tt=REDUCE?0:t;const cx=Math.sin(tt*.045)*5+mx*1.2,cz=17+Math.cos(tt*.035)*4-push.v*7;
    cam.position.set(cx,H(cx,cz)+1.9-my*.5+Math.sin(tt*.6)*.04+push.v*1.2,cz);cam.lookAt(look.x+mx*2,look.y-my,look.z);
    sun.position.copy(cam.position).addScaledVector(sunDir,80);sun.target.position.set(cam.position.x,0,cam.position.z-20);
    sky.position.copy(cam.position);
    c.update(t,dt);
    if(!REDUCE){bU(t);oU(t);
      // bunny hops: short arcs toward a wandering spot near the camp, then a pause
      if(bs.p<0&&t>bs.next){bs.p=0;const dx=3.2-bs.x,dz=3.6-bs.z;bs.h=Math.atan2(-dz,dx)+(Math.random()-.5)*2.4;}
      if(bs.p>=0){bs.p+=dt/.42;const st=Math.min(dt/.42,1)*.75;bs.x+=Math.cos(bs.h)*st;bs.z-=Math.sin(bs.h)*st;
        if(bs.p>=1){bs.p=-1;bs.next=t+(Math.random()<.6?.25:1.8+Math.random()*3);}}
      bunny.rotation.y+=((bs.h-bunny.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*8);
      bunny.position.set(bs.x,H(bs.x,bs.z)+(bs.p>=0?Math.sin(Math.PI*bs.p)*.28:0),bs.z);
      for(let i=0;i<FN;i++){const f=fly[i],b=Math.pow(Math.max(0,Math.sin(t*f.s*1.7+f.k*3)),3);
        fpos[i*3]=f.x+Math.sin(t*f.s*.5+f.k)*1.4;fpos[i*3+1]=f.y+Math.sin(t*f.s+f.k*2)*.4;fpos[i*3+2]=f.z+Math.cos(t*f.s*.4+f.k)*1.4;
        fcol[i*3]=b*.85;fcol[i*3+1]=b;fcol[i*3+2]=b*.3;}
      fgeo.attributes.position.needsUpdate=fgeo.attributes.color.needsUpdate=true;
      mist.forEach(m=>{m.position.x+=Math.sin(t*.07+m.userData.k)*.006;});}
    else if(!fcol[1]){for(let i=0;i<FN;i++){const f=fly[i];fpos.set([f.x,f.y,f.z],i*3);fcol.set([.4,.5,.15],i*3);}fgeo.attributes.position.needsUpdate=fgeo.attributes.color.needsUpdate=true;}
    if(!REDUCE){const a=dust.geometry.attributes.position;for(let i=0;i<DN;i++){let y=a.getY(i)+dt*.08*(1+(i%3));if(y>8)y=0;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(t*.3+i)*.003);}a.needsUpdate=true;}
    dust.position.set(cam.position.x,0,cam.position.z-10);
    if(composer)composer.render(dt);else R.render(scene,cam);
    if(first){first=false;firstTimer=setTimeout(onFirstFrame,200);}
  },{visible:true,degrade(){
    // first lower the resolution; at the floor, drop the bloom pass
    if(lowerPixelRatio(R)){if(composer)composer.setPixelRatio(R.getPixelRatio());return true;}
    if(composer){dropComposer();return true;}
    return false;
  },onError:()=>dispose()});
  /** Frees the bloom pipeline, passes included, and falls back to plain rendering. */
  function dropComposer(){composer.passes.forEach(p=>p.dispose&&p.dispose());composer.renderTarget1.dispose();composer.renderTarget2.dispose();composer=null;}
  let firstTimer=0;
  function foliageGeo(){const pos=[],uv=[],nor=[],idx=[];let v=0;const r=rng(7);
    function quad(base,dir,L,w,W){const tip=base.clone().addScaledVector(dir,L),hw=w.clone().multiplyScalar(W/2);
      [base.clone().sub(hw),base.clone().add(hw),tip.clone().sub(hw),tip.clone().add(hw)].forEach(p=>pos.push(p.x,p.y,p.z));
      uv.push(0,0,0,1,1,0,1,1);const n=dir.clone().multiplyScalar(.4).add(UP).normalize();for(let i=0;i<4;i++)nor.push(n.x,n.y,n.z);idx.push(v,v+2,v+1,v+1,v+2,v+3);v+=4;}
    for(let y=7.5;y<18.5;y+=.85){const t=(y-7.5)/11,L=(1-t)*3.4+.7,n=5+Math.floor(r()*3),off=r()*6.28;
      for(let k=0;k<n;k++){const a=off+k/n*6.28+r()*.4,e=-.25-r()*.35,dir=P(Math.cos(a)*Math.cos(e),Math.sin(e),Math.sin(a)*Math.cos(e)),base=P(Math.cos(a)*.15,y,Math.sin(a)*.15),side=P(-Math.sin(a),0,Math.cos(a));
        quad(base,dir,L,side,L*.6);quad(base,dir,L,new V3().crossVectors(side,dir).normalize(),L*.4);}}
    quad(P(0,18,0),UP,1.6,P(1,0,0),.9);quad(P(0,18,0),UP,1.6,P(0,0,1),.9);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setIndex(idx);return geo;}
  function fernGeo(){const pos=[],uv=[],nor=[],idx=[];let v=0;for(let k=0;k<7;k++){const a=k/7*6.28,e=.55,L=1,W=.32,dir=P(Math.cos(a)*Math.cos(e),Math.sin(e),Math.sin(a)*Math.cos(e)),w=P(-Math.sin(a),0,Math.cos(a)).multiplyScalar(W/2);
      const tip=dir.clone().multiplyScalar(L);tip.y-=.25;[w.clone().negate(),w.clone(),tip.clone().sub(w),tip.clone().add(w)].forEach(p=>pos.push(p.x,p.y,p.z));uv.push(0,0,1,0,0,1,1,1);for(let i=0;i<4;i++)nor.push(0,1,0);idx.push(v,v+1,v+2,v+1,v+3,v+2);v+=4;}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setIndex(idx);return geo;}

  let disposed=false;
  return dispose;
  function dispose(){
    if(disposed)return;disposed=true;
    stop();clearTimeout(firstTimer);removeEventListener('pointermove',onMove);
    if(composer)dropComposer();
    disposeTree(scene);R.dispose();
  }
}
