// Every model in Wildwood, built from primitives in code (no model files).
// Ported from the original single-file site. Client-only (see core.js).
import {THREE,V3,UP,col,rng,smooth,T,tex,M,fur,plain,sh,mesh,beam,SPH,ell,P,log,box,rock,glowSprite,glint,makeSmoke,triPrism,gableRoof,makeFire,PUMPKIN_REF} from './core.js'
import {WPN,wRate} from '../../data/weapons.js'

// ---------- structures ----------
function buildCamp(g){
  // lean-to
  const lz=-1.8;beam(g,P(-1.9,0,lz),P(-1.9,2.1,lz),.09,.07,M.log);beam(g,P(1.9,0,lz),P(1.9,2.1,lz),.09,.07,M.log);
  log(g,4.4,.08,0,2.1,lz,'x');
  for(let i=0;i<11;i++){const x=-1.8+i*.36;beam(g,P(x,2.15,lz),P(x+(Math.random()-.5)*.1,0,lz-2.7),.05,.04,M.log,6);}
  const len=Math.hypot(2.15,2.7),cover=box(g,4.1,.1,len,plain(0x3a3324,{map:tex(T.ground,2,2)}),0,1.05,lz-1.35);cover.rotation.x=-Math.atan2(2.15,2.7);
  for(let i=0;i<10;i++){const card=sh(new THREE.Mesh(new THREE.PlaneGeometry(1.8,.9),M.leaf));card.position.set(-1.6+i*.36,1.15,lz-1.3);card.rotation.set(-Math.PI/2+Math.atan2(2.7,2.15)*0+.9,Math.PI/2+(Math.random()-.5)*.4,0);g.add(card);}
  box(g,1.6,.06,2,plain(0x5a4630),0,.03,lz-1.2);
  // fire pit
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;rock(g,.2+Math.random()*.06,Math.cos(a)*.75,.1,Math.sin(a)*.75+1.2,i+3);}
  mesh(g,new THREE.CircleGeometry(.65,16),M.ash,0,.02,1.2).rotation.x=-Math.PI/2;
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;beam(g,P(Math.cos(a)*.55,.05,1.2+Math.sin(a)*.55),P(0,.75,1.2),.06,.03,M.log,6);}
  const upd=makeFire(g,0,.05,1.2,1,true);
  log(g,2,.22,-.2,.22,3.4,'x');rock(g,.35,2.2,.2,2.2,21);
  // drying rack
  beam(g,P(2.4,0,-.4),P(2.4,1.6,-.4),.05,.04,M.log);beam(g,P(2.4,0,1),P(2.4,1.6,1),.05,.04,M.log);log(g,1.6,.035,2.4,1.55,.3,'z');
  for(let i=0;i<3;i++){beam(g,P(2.4,1.53,-.1+i*.4),P(2.4,1.15,-.1+i*.4),.006,.006,plain(0xcbb994));ell(g,fur(0x8a6a50),.06,.14,.03,2.4,1.05,-.1+i*.4);}
  return {update:upd,tally:{Logs:22,Stones:11,'Branch cover':10}};
}
function buildCabin(g){
  const W=8,D=6,r=.22,rows=11,st=.4;let logs=0;
  for(let i=0;i<rows;i++){const y=r+i*st;
    for(const z of [D/2,-D/2]){if(z>0&&i<6){log(g,(W/2+.4)-.7,r,-(W/2+.4+.7)/2,y,z,'x');log(g,(W/2+.4)-.7,r,(W/2+.4+.7)/2,y,z,'x');logs+=2;}else{log(g,W+.8,r,0,y,z,'x');logs++;}}
    for(const x of [W/2,-W/2]){const ys=y+st/2;if(x>0&&i>=3&&i<=5){log(g,(D/2+.4)-1,r,x,ys,-(D/2+.4+1)/2,'z');log(g,(D/2+.4)-1,r,x,ys,(D/2+.4+1)/2,'z');logs+=2;}else{log(g,D+.8,r,x,ys,0,'z');logs++;}}}
  const top=r+rows*st;
  for(const z of [D/2,-D/2]){mesh(g,triPrism(W,2.2,.3),M.plank,0,top,z);}
  gableRoof(g,W,D,top,2.3,.7,M.plank);log(g,D+1.6,.18,0,top+2.3,0,'z');logs++;
  box(g,1.4,2.5,.05,plain(0x0d0a08),0,1.25,D/2-.05);
  const door=box(g,1.35,2.4,.08,M.plank,-.7+.67*Math.cos(.7),1.2,D/2+.67*Math.sin(.7)*-1+.6);door.rotation.y=.7;
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.1),new THREE.MeshBasicMaterial({color:col(0xffa955)}));win.position.set(W/2-.25,r+4.5*st,0);win.rotation.y=Math.PI/2;g.add(win);
  const wg=glowSprite(0xffa040,4,.5);wg.position.set(W/2+.4,r+4.5*st,0);g.add(wg);
  let stones=0;for(let y=0;y<top+2.8;y+=.42){box(g,1.1+Math.random()*.15,.4,1.1+Math.random()*.15,M.stone,-W/2-.75,y+.2,-1.5);stones++;}
  box(g,W+.8,.18,2.2,M.plank,0,.09,D/2+1.3);beam(g,P(-W/2,0,D/2+2.2),P(-W/2,3,D/2+2.2),.12,.12,M.log);beam(g,P(W/2,0,D/2+2.2),P(W/2,3,D/2+2.2),.12,.12,M.log);
  const porch=box(g,W+1,.12,2.6,M.plank,0,3.2,D/2+1.4);porch.rotation.x=.18;
  for(let row=0;row<4;row++)for(let k=0;k<4-row;k++){log(g,1.4,.16,-W/2-1.6,.16+row*.29,1.2+(k-(3-row)/2)*.34,'z');logs++;}
  mesh(g,new THREE.CylinderGeometry(.42,.48,.6,12),M.log,W/2+2,.3,3.6);const ax=beam(g,P(W/2+2,.6,3.6),P(W/2+2.3,1.2,3.75),.025,.025,M.log,6);box(g,.06,.16,.24,M.steel,W/2+2.02,.62,3.62);
  const smoke=makeSmoke(g,-W/2-.75,top+3.1,-1.5,1.3,.4);
  return {update:smoke,tally:{}};
}
function buildTower(g){
  const H=9,c=[[-1,-1],[1,-1],[1,1],[-1,1]];const at=(i,y)=>{const k=2.2-(.4*y/H);return P(c[i][0]*k,y,c[i][1]*k);};let logs=0;
  c.forEach((_,i)=>{beam(g,at(i,0),at(i,H+1.2),.2,.16,M.log);logs++;});
  for(let i=0;i<4;i++){const j=(i+1)%4;for(const [a,b] of [[.5,4.5],[4.5,8.6]]){beam(g,at(i,a),at(j,b),.08,.08,M.log);beam(g,at(j,a),at(i,b),.08,.08,M.log);logs+=2;}beam(g,at(i,4.5),at(j,4.5),.09,.09,M.log);logs++;}
  box(g,4.6,.25,4.6,M.plank,0,H,0);
  for(let i=0;i<4;i++){const j=(i+1)%4;const a=at(i,H+1),b=at(j,H+1);a.multiplyScalar(1.02);b.multiplyScalar(1.02);a.y=b.y=H+1;beam(g,a,b,.07,.07,M.log);logs++;}
  c.forEach((_,i)=>{const p=at(i,H);beam(g,P(p.x,H,p.z),P(p.x*.95,H+3,p.z*.95),.1,.1,M.log);logs++;});
  const roof=mesh(g,new THREE.ConeGeometry(3.4,1.7,4),M.plank,0,H+3.85,0);roof.rotation.y=Math.PI/4;
  for(const x of [-.45,.45])beam(g,P(x,0,3.3),P(x,H+.2,2.05),.05,.05,M.log);
  for(let k=1;k<20;k++){const t=k/20;log(g,.9,.035,0,t*(H+.2),3.3-1.25*t,'x');}
  box(g,.22,.3,.22,M.dark,1.2,H+.28,1.2);const lg=glowSprite(0xffb050,2.2,.8);lg.position.set(1.2,H+.45,1.2);g.add(lg);
  const ll=new THREE.PointLight(col(0xffa040),1.2,8,2);ll.position.set(1.2,H+.6,1.2);g.add(ll);
  beam(g,P(0,H+4.4,0),P(0,H+6.4,0),.04,.035,M.log,6);mesh(g,new THREE.SphereGeometry(.07,10,8),plain(0xc9a24a,{metalness:1,roughness:.35}),0,H+6.45,0);
  const fg=new THREE.PlaneGeometry(1.5,.8,14,3);fg.translate(.75,0,0);const fx=Float32Array.from(fg.attributes.position.array);
  const flag=sh(new THREE.Mesh(fg,plain(0xa8402c,{side:THREE.DoubleSide,roughness:.9})));flag.position.set(.03,H+5.95,0);g.add(flag);
  return {update(t){const a=fg.attributes.position;for(let i=0;i<a.count;i++){const x=fx[i*3],y=fx[i*3+1];a.setZ(i,Math.sin(x*4-t*5+y*1.5)*.13*x);a.setY(i,y-x*x*.06);}a.needsUpdate=true;fg.computeVertexNormals();flag.rotation.y=Math.sin(t*.4)*.35;},tally:{}};
}
function buildBarn(g){
  const red=new THREE.MeshStandardMaterial({map:tex(T.planks,2,1),bumpMap:tex(T.planks,2,1),bumpScale:.03,roughness:.9,color:col(0xa6392d)});
  const trim=plain(0xe9e0cc,{roughness:.9});const W=7,D=10,H=4;
  box(g,W,H,D,red,0,H/2,0);mesh(g,triPrism(W,2.6,D-.02),red,0,H,0);
  gableRoof(g,W,D,H,2.6,.5,plain(0x3d3530,{map:tex(T.planks,1,2),roughness:.95}));
  box(g,3,3,.12,red,0,1.5,D/2+.04);
  for(const s of [-1,1]){beam(g,P(-1.45*s,.05,D/2+.12),P(1.45*s,2.95,D/2+.12),.06,.06,trim,4);}
  box(g,3.2,.16,.14,trim,0,3,D/2+.12);box(g,3.2,.16,.14,trim,0,.08,D/2+.12);box(g,.16,3,.14,trim,-1.55,1.5,D/2+.12);box(g,.16,3,.14,trim,1.55,1.5,D/2+.12);
  box(g,1.2,1,.1,plain(0x1a120c),0,4.8,D/2+.04);box(g,1.4,.12,.14,trim,0,5.35,D/2+.1);box(g,1.4,.12,.14,trim,0,4.28,D/2+.1);
  const hay=plain(0xd5b25a,{map:tex(T.fur,1,1)});
  [[W/2+1,0,2],[W/2+1,0,3.3],[W/2+1,1.05,2.65]].forEach(([x,y,z])=>{const m=mesh(g,new THREE.CylinderGeometry(.55,.55,1.2,16),hay,x,y+.55,z);m.rotation.x=Math.PI/2;m.rotation.z=Math.PI/2;});
  for(let i=0;i<7;i++){beam(g,P(-W/2-1.2+i*0,0,D/2+1-i*1.4),P(-W/2-1.2,1.1,D/2+1-i*1.4),.06,.06,trim,5);}log(g,8.4,.05,-W/2-1.2,.9,D/2-3.2,'z');log(g,8.4,.05,-W/2-1.2,.45,D/2-3.2,'z');
  // cupola and weathervane
  const ry=H+2.6,dk=plain(0x1a120c);box(g,1.2,1,1.2,red,0,ry+.3,0);box(g,.62,.5,1.22,dk,0,ry+.38,0);box(g,1.22,.5,.62,dk,0,ry+.38,0);
  for(const [x,z] of [[-.6,-.6],[.6,-.6],[.6,.6],[-.6,.6]])box(g,.08,1,.08,trim,x,ry+.3,z);
  const cap=mesh(g,new THREE.ConeGeometry(1.05,.75,4),plain(0x3d3530,{roughness:.95}),0,ry+1.17,0);cap.rotation.y=Math.PI/4;
  const iron=plain(0x2a2826,{metalness:.8,roughness:.45});beam(g,P(0,ry+1.5,0),P(0,ry+2.6,0),.025,.02,iron,6);
  for(const a of [0,Math.PI/2]){const c=box(g,.7,.025,.025,iron,0,ry+2.05,0);c.rotation.y=a;}
  const vane=new THREE.Group();vane.position.set(0,ry+2.4,0);g.add(vane);box(vane,1,.03,.03,iron,0,0,0);
  const hd=mesh(vane,new THREE.ConeGeometry(.07,.2,4),iron,.55,0,0);hd.rotation.z=-Math.PI/2;
  const fin=new THREE.Shape();fin.moveTo(0,0);fin.lineTo(-.32,.2);fin.lineTo(-.32,-.2);fin.closePath();const fm=mesh(vane,new THREE.ExtrudeGeometry(fin,{depth:.02,bevelEnabled:false}),iron,-.38,0,-.01);
  // door lantern
  box(g,.06,.06,.4,iron,2.05,3.45,D/2+.2);const lan=new THREE.Group();lan.position.set(2.05,3.15,D/2+.38);g.add(lan);
  box(lan,.22,.04,.22,iron,0,.17,0);box(lan,.2,.04,.2,iron,0,-.17,0);for(const [x,z] of [[-.09,-.09],[.09,-.09],[.09,.09],[-.09,.09]])box(lan,.025,.32,.025,iron,x,0,z);
  box(lan,.13,.24,.13,new THREE.MeshBasicMaterial({color:col(0xffc070)}),0,0,0);const lg=glowSprite(0xffa040,1.6,.7);lan.add(lg);
  const ll=new THREE.PointLight(col(0xffa040),.9,6,2);ll.position.set(0,0,.2);lan.add(ll);
  return {update(t){vane.rotation.y=Math.sin(t*.25)*.7+Math.sin(t*1.9)*.06;ll.intensity=.85+Math.sin(t*7)*.08;},tally:{}};
}
function buildWell(g){
  let stones=0;for(let l=0;l<4;l++){for(let i=0;i<14;i++){const a=(i+(l%2)*.5)/14*Math.PI*2;const s=box(g,.48,.26,.26,M.stone,Math.cos(a)*1.05,.13+l*.27,Math.sin(a)*1.05);s.rotation.y=-a+Math.PI/2;stones++;}}
  const water=new THREE.Mesh(new THREE.CircleGeometry(.9,24),plain(0x1d3a44,{roughness:.05,metalness:.2}));water.rotation.x=-Math.PI/2;water.position.y=.6;g.add(water);
  for(const x of [-1.1,1.1])beam(g,P(x,0,0),P(x,2.6,0),.09,.08,M.log);
  log(g,2.5,.06,0,2.1,0,'x');gableRoof(g,1.6,2.2,2.6,.8,.2,M.plank);
  beam(g,P(1.2,2.1,0),P(1.5,2.1,0),.025,.025,M.log);beam(g,P(1.5,2.1,0),P(1.5,1.8,0),.025,.025,M.log);
  beam(g,P(0,2.05,0),P(0,1.25,0),.01,.01,plain(0xbfae86));
  const bucket=mesh(g,new THREE.CylinderGeometry(.2,.16,.32,14),M.plank,0,1.1,0);
  // quest board
  for(const x of [2.2,3.6])beam(g,P(x,0,.4),P(x,2.2,.4),.06,.05,M.log);box(g,1.7,1.1,.08,M.plank,2.9,1.55,.42);
  const paper=plain(0xefe4c8,{roughness:1});[[2.5,1.75],[2.95,1.62],[3.35,1.78]].forEach(([x,y],i)=>{const n=box(g,.32,.4,.01,paper,x,y,.47);n.rotation.z=(i-1)*.08;box(g,.04,.04,.012,plain(0xc8321f),x,y+.17,.48);});
  return {tally:{Stones:stones,'Daily quests':3,'Quest rewards':'Coins, XP and a bonus gem'}};
}

function buildTent(g){
  const cloth=plain(0xcbb791,{map:tex(T.fur,2,2),roughness:1,side:THREE.DoubleSide});
  const W=3,H=2.2,D=3.6;
  for(const s of [-1,1]){const len=Math.hypot(W/2,H);const m=box(g,len,.03,D,cloth,s*W/4,H/2,0);m.rotation.z=s*-Math.atan2(H,W/2)+(s>0?Math.PI:0);}
  mesh(g,triPrism(W,H,.02),cloth,0,0,-D/2);
  const fl=new THREE.Group();fl.position.set(-W/4,0,D/2);g.add(fl);const flap=sh(new THREE.Mesh(triPrism(W/2,H,.02),cloth));flap.position.x=-W/4;fl.add(flap);fl.rotation.y=-1.1;
  for(const z of [-D/2-.05,D/2+.05])beam(g,P(0,0,z),P(0,H+.15,z),.04,.035,M.log);log(g,D+.4,.03,0,H+.05,0,'z');
  const rope=plain(0xbfae86);for(const [x,z] of [[-2.2,2.4],[2.2,2.4],[-2.2,-2.4],[2.2,-2.4]]){beam(g,P(0,H,Math.sign(z)*(D/2)),P(x,0,z),.008,.008,rope,4);mesh(g,new THREE.CylinderGeometry(.03,.01,.25,6),M.log,x,.1,z);}
  box(g,.9,.12,1.9,plain(0x7a3b2a,{map:tex(T.leather,1,2)}),.2,.06,-.2);
  for(let i=0;i<8;i++){const a=i/8*6.28;rock(g,.14,Math.cos(a)*.5+.2,.08,Math.sin(a)*.5+3.4,i+50);}
  const up=makeFire(g,.2,.05,3.4,.6,true);
  return {update:up,tally:{'Home level':'1 of 4',Cost:'Free','Next':'Log cabin, 150 coins'}};
}
function buildGates(g){
  let logs=0;
  for(const s of [-1,1])for(let i=0;i<9;i++){const x=s*(1.7+i*.5),h=3.2+Math.sin(i*2.3)*.25;beam(g,P(x,0,0),P(x,h,0),.24,.22,M.log);mesh(g,new THREE.ConeGeometry(.22,.5,9),M.log,x,h+.25,0);logs++;}
  for(const s of [-1,1]){beam(g,P(s*1.45,0,0),P(s*1.45,4.4,0),.28,.28,M.log);mesh(g,new THREE.ConeGeometry(.28,.55,9),M.log,s*1.45,4.67,0);}
  log(g,3.6,.18,0,4.1,0,'x');
  for(const s of [-1,1]){const d=new THREE.Group();d.position.set(s*1.3,0,0);d.rotation.y=s*.45;g.add(d);
    const pn=box(d,-1.2*s,2.8,.12,M.plank,-.62*s,1.5,0);for(const y of [.6,2.4])box(d,1.25,.16,.08,M.log,-.62*s,y,.1);
    const br=beam(d,P(-.05*s,.6,.1),P(-1.2*s,2.4,.1),.05,.05,M.log,5);
    const iron=M.dark;for(const y of [.6,2.4])box(d,.18,.2,.16,iron,-.12*s,y,0);}
  const fires=[];for(const s of [-1,1]){beam(g,P(s*1.45,3.05,.2),P(s*1.45,3.25,.48),.03,.03,M.dark,6);beam(g,P(s*1.45,3.1,.5),P(s*1.45,3.55,.5),.05,.035,M.log,7);
    mesh(g,new THREE.CylinderGeometry(.065,.05,.12,8),M.dark,s*1.45,3.55,.5);fires.push(makeFire(g,s*1.45,3.58,.5,.26));}
  for(let i=0;i<10;i++){const x=-2.4+i*.53,z=1.6+(i%2)*.35;const a=P(x,0,z),b=P(x,.9,z+.55);beam(g,a,b,.05,.04,M.log,6);const tip=mesh(g,new THREE.ConeGeometry(.05,.22,6),plain(0x6a6e72,{metalness:.9,roughness:.35}),b.x,b.y-.05,b.z);tip.quaternion.setFromUnitVectors(UP,new V3().subVectors(b,a).normalize());}
  return {update(t,dt){fires.forEach(f=>f(t,dt));},tally:{Gates:'Wooden, Iron, Stone','Gate HP':'12 / 25 / 45 a night','Spike traps':'1.5 or 2.5 damage'}};
}
function buildForge(g){
  box(g,6,.2,4.5,M.stone,0,.1,0);
  const fz=-1.2;for(let y=0;y<2.4;y+=.4)for(let i=0;i<4;i++){if(y<1.3&&i>0&&i<3)continue;box(g,.62,.38,1.3,M.stone,-2.4+i*.62,.4+y,fz);}
  box(g,1.24,.3,1.3,M.stone,-1.47,1.75,fz);
  for(let y=2.8;y<5;y+=.42)box(g,.8,.4,.8,M.stone,-2.1,y,fz);
  const glow=box(g,1.2,.9,.05,new THREE.MeshBasicMaterial({color:col(0xff7a2e)}),-1.47,.95,fz+.62);
  const up=makeFire(g,-1.47,.45,fz+.1,.55);
  for(const [x,z] of [[-3,1.9],[3,1.9],[-3,-2.1],[3,-2.1]])beam(g,P(x,.2,z),P(x,3.4,z),.11,.1,M.log);
  const awn=box(g,6.6,.12,4.9,M.plank,0,3.55,-.1);awn.rotation.x=-.1;
  const anvil=new THREE.Group();anvil.position.set(.9,.2,.4);g.add(anvil);const ir=plain(0x34363a,{metalness:.9,roughness:.4});
  mesh(anvil,new THREE.CylinderGeometry(.32,.38,.55,10),M.log,0,.27,0);box(anvil,.3,.25,.3,ir,0,.67,0);box(anvil,.75,.2,.32,ir,0,.88,0);const horn=mesh(anvil,new THREE.ConeGeometry(.1,.35,8),ir,.55,.88,0);horn.rotation.z=-Math.PI/2;
  const ham=new THREE.Group();ham.position.set(.85,1.05,.4);ham.rotation.z=.4;g.add(ham);beam(ham,P(0,0,0),P(.35,.05,0),.018,.018,M.log,6);box(ham,.07,.14,.07,ir,.36,.05,0);
  box(g,.2,2,2.4,M.plank,2.7,1.2,-.4);for(let i=0;i<3;i++){const k=box(g,.04,.5,.08,M.steel,2.58,1.6,-1.2+i*.7);box(g,.05,.16,.06,M.leather,2.58,1.28,-1.2+i*.7);}
  const barrel=mesh(g,new THREE.CylinderGeometry(.38,.34,.8,14),M.plank,-.3,.6,1.4);
  const fsm=makeSmoke(g,-2.1,4.9,fz,.9,.38);
  return {update(t,dt){up(t,dt);fsm(t,dt);},tally:{'Forges':'Knives and slings','Tiers':'5 for each weapon','Pays with':'Coins and enemy drops'}};
}

let PUMPKIN=null;
function pumpkinGeo(){if(PUMPKIN)return PUMPKIN;const geo=new THREE.SphereGeometry(1,32,20),p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),k=.88+.12*Math.sqrt(Math.abs(Math.sin(a*4)));
    p.setXYZ(i,x*k,y*.72-.14*Math.exp(-(x*x+z*z)*9)*Math.sign(y),z*k);}geo.computeVertexNormals();PUMPKIN_REF.geo=geo;return PUMPKIN=geo;}
function buildCrops(g){
  const R=rng(61),soil=plain(0x3a2a1c,{map:tex(T.ground,1,1),bumpMap:tex(T.ground,1,1),bumpScale:.05,roughness:1});
  const BW=2.5,BD=1.7,beds=[[-1.45,-1.05],[1.45,-1.05],[-1.45,1.05],[1.45,1.05]];
  beds.forEach(([x,z])=>{box(g,BW,.26,BD,soil,x,.13,z);
    for(const s of [-1,1]){box(g,BW+.16,.3,.08,M.plank,x,.15,z+s*(BD/2+.04));box(g,.08,.3,BD,M.plank,x+s*(BW/2+.04),.15,z);}
    for(let r=0;r<3;r++)box(g,BW-.25,.06,.24,soil,x,.28,z-BD/2+.35+r*.5);});
  const leaf=c=>plain(c,{roughness:.75,side:THREE.DoubleSide});
  // carrots
  const orange=plain(0xe0761e,{roughness:.6}),top=leaf(0x5f8a2e);
  for(let r=0;r<3;r++)for(let k=0;k<5;k++){const x=-2.45+k*.5+(R()-.5)*.08,z=-1.9+.35+r*.5;mesh(g,new THREE.CylinderGeometry(.045,.03,.07,10),orange,x,.32,z);
    for(let l=0;l<5;l++){const a=l/5*6.28+R(),stem=mesh(g,new THREE.ConeGeometry(.016,.32,4),top,x+Math.cos(a)*.03,.5,z+Math.sin(a)*.03);stem.rotation.set(Math.sin(a)*.35,0,-Math.cos(a)*.35);}}
  // berry bushes
  const bushM=plain(0x2f4a24,{flatShading:true,roughness:.85}),red=plain(0xb3263a,{roughness:.3}),blue=plain(0x37407e,{roughness:.3});
  [[.75,-1.15,.42],[1.55,-.95,.36],[2.25,-1.2,.4]].forEach(([x,z,r],i)=>{const geo=new THREE.IcosahedronGeometry(r,1),p=geo.attributes.position;
    for(let v=0;v<p.count;v++){const k=.82+R()*.3;p.setXYZ(v,p.getX(v)*k,p.getY(v)*k*.85,p.getZ(v)*k);}geo.computeVertexNormals();mesh(g,geo,bushM,x,.3+r*.7,z);
    for(let b=0;b<16;b++){const d=new V3(R()-.5,R()*.8,R()-.5).normalize();mesh(g,new THREE.SphereGeometry(.032,8,6),i===1?blue:red,x+d.x*r*.92,.3+r*.7+d.y*r*.8,z+d.z*r*.92);}});
  // mushrooms
  const stemM=plain(0xe9dfc8,{roughness:.8}),capR=plain(0xb8322a,{roughness:.5}),capB=plain(0x8a5a3a,{roughness:.6}),spot=plain(0xf3eee2);
  for(let i=0;i<8;i++){const x=-2.4+R()*1.9,z=.4+R()*1.3,s=.7+R()*.6,isRed=i%3!==2;mesh(g,new THREE.CylinderGeometry(.03*s,.04*s,.18*s,10),stemM,x,.3+.09*s,z);
    const cap=mesh(g,new THREE.SphereGeometry(.1*s,18,10,0,Math.PI*2,0,Math.PI/2),isRed?capR:capB,x,.3+.17*s,z);cap.scale.y=.75;
    if(isRed)for(let k=0;k<5;k++){const a=R()*6.28,e=.3+R()*.9;mesh(g,new THREE.SphereGeometry(.013*s,6,4),spot,x+Math.cos(a)*Math.cos(e)*.1*s,.3+.17*s+Math.sin(e)*.075*s,z+Math.sin(a)*Math.cos(e)*.1*s);}}
  // pumpkins on a vine
  const pM=plain(0xd9741f,{roughness:.5}),stalk=plain(0x5a5a2a,{roughness:.8}),vine=leaf(0x4d7a2a);
  const pumps=[[.8,.75,.28],[1.6,1.25,.36],[2.35,.7,.24]];
  pumps.forEach(([x,z,r])=>{const m=mesh(g,pumpkinGeo(),pM,x,.31+r*.62,z);m.scale.setScalar(r);m.rotation.y=R()*6;
    const st=beam(g,P(x,.31+r*1.3,z),P(x+.04,.31+r*1.3+.12,z+.02),.025,.018,stalk,6);});
  const vc=new THREE.CatmullRomCurve3(pumps.map(([x,z,r])=>P(x,.33,z+r*.9)).concat([P(2.6,.33,1.6)]));mesh(g,new THREE.TubeGeometry(vc,40,.015,5),vine);
  for(let i=0;i<9;i++){const pt=vc.getPoint(i/9),lf=mesh(g,new THREE.CircleGeometry(.13,7),vine,pt.x+(R()-.5)*.2,.36+R()*.06,pt.z+(R()-.5)*.25);lf.rotation.set(-Math.PI/2+(R()-.5)*.6,0,R()*6);}
  // watering can
  const can=new THREE.Group();can.position.set(0,0,2.45);can.rotation.y=-.6;g.add(can);const tin=plain(0x6a8a78,{metalness:.6,roughness:.45});
  mesh(can,new THREE.CylinderGeometry(.14,.16,.28,18),tin,0,.14,0);beam(can,P(.1,.08,0),P(.38,.32,0),.025,.014,tin,8);mesh(can,new THREE.CylinderGeometry(.04,.025,.05,10),tin,.39,.33,0).rotation.z=-.8;
  const hdl=mesh(can,new THREE.TorusGeometry(.11,.014,6,16,Math.PI),tin,-.02,.28,0);
  return {tally:{Plots:4,'In the rain':'Crops grow twice as fast'}};
}

// ---------- weapons ----------
function buildKnife(g,t){
  const W=WPN.knife,L=1+t*.1;
  const s=new THREE.Shape();s.moveTo(0,-.017);s.lineTo(.14*L,-.019);s.quadraticCurveTo(.2*L,-.017,.235*L,.006);s.quadraticCurveTo(.2*L,.012,.17*L,.018);s.lineTo(0,.018);s.closePath();
  const geo=new THREE.ExtrudeGeometry(s,{depth:.003,bevelEnabled:true,bevelThickness:.0015,bevelSize:.0012,bevelSegments:2});geo.translate(0,0,-.0015);
  const bm=new THREE.MeshStandardMaterial({color:col(W.col[t]),metalness:t?.9:.55,roughness:t?.3-t*.03:.75,envMapIntensity:1.6});
  if(t===4){bm.emissive=col(0x6a4cff);bm.emissiveIntensity=.55;}
  if(t===3){bm.emissive=col(0x1a6a8a);bm.emissiveIntensity=.25;}
  mesh(g,geo,bm);
  const fm=bm.clone();fm.color.multiplyScalar(.5);fm.roughness=Math.min(1,bm.roughness+.2);box(g,.12*L,.0042,.0068,fm,.075*L,.003,0);
  const guard=t>=3?plain(0xc9a24a,{metalness:1,roughness:.3}):M.dark;
  box(g,.012,.055+t*.006,.018,guard,0,0,0);
  const grip=t===0?plain(0x8a7a5a,{map:tex(T.fur,1,2),roughness:1}):t===4?plain(0x1a1626,{roughness:.5}):M.leather;
  beam(g,P(-.005,0,0),P(-.12,0,0),.013,.014,grip,12);
  for(let i=0;i<6;i++){const tr=mesh(g,new THREE.TorusGeometry(.0145,.002,6,16),t===4?guard:grip,-.015-i*.018,0,0);tr.rotation.y=Math.PI/2;}
  mesh(g,new THREE.SphereGeometry(.017,16,12),guard,-.125,0,0);
  if(t===4){const gl=glowSprite(0x8a6cff,.35,.55);gl.position.set(.12,0,0);g.add(gl);}
  g.rotation.z=1.0;g.rotation.y=.3;
  return {tally:wRate('knife',t)};
}
function buildSlingshot(g,t){
  const wood=t===0?plain(0x7a5a3a,{map:tex(T.bark,1,1),roughness:1}):t>=3?plain(0x3a3c40,{metalness:.9,roughness:.35}):M.log;
  const r0=t===0?.009:.013;
  beam(g,P(0,0,0),P(0,.13,0),r0,r0*.92,wood);beam(g,P(0,.125,0),P(-.055,.23,0),r0*.85,r0*.7,wood);beam(g,P(0,.125,0),P(.055,.23,0),r0*.85,r0*.7,wood);
  if(t>0)for(let i=0;i<4;i++){const tr=mesh(g,new THREE.TorusGeometry(.0135,.0025,6,14),M.leather,0,.02+i*.022,0);tr.rotation.x=Math.PI/2;}
  const band=t===4?new THREE.MeshStandardMaterial({color:col(0x4fc3ff),emissive:col(0x2aa0ff),emissiveIntensity:1.4,roughness:.4}):plain(t===0?0x9a8a6a:0xb8692a,{roughness:.45});
  for(const sg of [-1,1]){const c=new THREE.CatmullRomCurve3([P(.055*sg,.225,0),P(.035*sg,.2,.05),P(.012*sg,.18,.1)]);mesh(g,new THREE.TubeGeometry(c,16,.0035,6),band);}
  box(g,.03,.022,.012,M.leather,0,.18,.105);rock(g,.011,0,.18,.112,4);
  if(t===4){for(const sg of [-1,1]){const gl=glowSprite(0x4fc3ff,.09,.8);gl.position.set(.055*sg,.23,0);g.add(gl);}}
  g.rotation.y=-.6;g.rotation.x=.2;
  return {tally:wRate('sling',t)};
}

// ---------- animals ----------
function quadruped(g,o){
  const F=fur(o.color),B=fur(o.belly||o.color),L=o.len,R=o.bodyR,H=o.legH,by=H+R*.75;
  const body=new THREE.Group();g.add(body);
  ell(body,F,L*.5,R,R*.88,0,by,0);ell(body,F,R*1.0,R*1.08,R*.92,L*.34,by+R*.05,0);ell(body,F,R*.95,R,R*.9,-L*.33,by,0);
  ell(body,B,L*.38,R*.55,R*.7,0,by-R*.45,0);
  const neckBase=P(L*.42,by+R*.35,0),hp=P(L*.5+o.neck*.55,by+R*.35+o.neck,0);beam(body,neckBase,hp,R*.62,o.headR*.75,F,14);
  const head=new THREE.Group();head.position.copy(hp);body.add(head);const hr=o.headR;
  ell(head,F,hr*1.15,hr,hr*.92,0,0,0);ell(head,B,o.snout,hr*.48,hr*.45,hr*.85,-hr*.25,0);
  ell(head,M.nose,hr*.16,hr*.13,hr*.17,hr*.85+o.snout*.95,-hr*.2,0);
  const eyes=[],ew=o.earW||hr*.35,eh=o.earH||hr*.8,inner=o.innerEar?fur(o.innerEar):B;
  for(const s of [-1,1]){const eg=new THREE.Group();eg.position.set(hr*.55,hr*.25,s*hr*.62);head.add(eg);eyes.push(eg);
    ell(eg,o.eyeMat||M.eye,hr*.13,hr*.13,hr*.1,0,0,0);if(!o.eyeMat)glint(eg,hr*.032,hr*.085,hr*.05,s*hr*.05);
    const ear=mesh(head,new THREE.ConeGeometry(ew,eh,10),F,-hr*.2,hr*.85,s*hr*.5);ear.rotation.x=s*.35;ear.rotation.z=-.15;ear.scale.z=.45;
    const ie=mesh(ear,new THREE.ConeGeometry(ew*.62,eh*.72,8),inner,ew*.42,-eh*.1,0);ie.scale.x=.45;}
  if(o.ruff){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const r=ell(body,F,R*.34,R*.2,R*.2,neckBase.x-R*.15,neckBase.y+Math.cos(a)*R*.46,Math.sin(a)*R*.5);r.rotation.x=a;r.rotation.z=.6;}
    for(const s of [-1,1]){const c=ell(head,F,hr*.42,hr*.26,hr*.2,-hr*.2,-hr*.4,s*hr*.62);c.rotation.x=s*-.6;c.rotation.z=.4;}}
  const legs=[];const hipY=by-R*.2;
  [[L*.3,1],[L*.3,-1],[-L*.3,1],[-L*.3,-1]].forEach(([x,s],i)=>{const hip=P(x,hipY,s*R*.55),knee=P(x+(i<2?.02:-.06)*L,H*.5,s*R*.55),foot=P(x,0,s*R*.55);
    beam(body,hip,knee,o.legR*1.4,o.legR,F,10);beam(body,knee,foot,o.legR,o.legR*.8,F,10);
    const hoof=mesh(body,new THREE.CylinderGeometry(o.legR*.85,o.legR*.95,o.legR*1.4,10),o.hoof||M.nose,foot.x,o.legR*.7,foot.z);});
  const tail=new THREE.Group();tail.position.set(-L*.55,by+R*.3,0);body.add(tail);
  const tm=ell(tail,o.tailMat||F,o.tailL*.5,o.tailR,o.tailR,-o.tailL*.45,0,0);tail.rotation.z=o.tailAng||-.9;
  return {body,head,tail,by,eyes,seed:Math.random()*5};
}
function blink(t,seed){return ((t+seed)%4.6)<.12?.12:1;}
function idleQuad(q,amp){return function(t){const b=blink(t,q.seed);q.eyes.forEach(e=>e.scale.y=b);q.body.scale.y=1+Math.sin(t*2.2)*.012*amp;q.head.rotation.y=Math.sin(t*.6)*.35*amp;q.head.rotation.z=Math.sin(t*.9)*.08;q.tail.rotation.y=Math.sin(t*3)*.35*amp;};}
function buildWolf(g,v){
  v=v===true?'alpha':v||'gray';
  const C={gray:[0x55575a,0xb9b4aa],alpha:[0x1e1e20,0x333131],ghost:[0xd8e2ea,0xf2f6fa],storm:[0x2c3550,0x5a6a9a]}[v];
  const eye={alpha:0xff2a10,ghost:0x9fe8ff,storm:0x6fd6ff}[v];
  const q=quadruped(g,{ruff:true,color:C[0],belly:C[1],len:1.2,bodyR:.2,legH:.55,legR:.036,neck:.2,headR:.12,snout:.22,earW:.055,earH:.16,tailL:.5,tailR:.07,tailAng:-1.15,
    eyeMat:eye?new THREE.MeshStandardMaterial({color:col(eye),emissive:col(eye),emissiveIntensity:2.5}):null});
  if(v==='alpha'){g.scale.setScalar(1.45);for(let i=0;i<9;i++){const sp=mesh(q.body,new THREE.ConeGeometry(.035,.14,6),fur(0x1d1d1f),.3-i*.08,q.by+.27,0);sp.rotation.z=.5;}}
  if(v==='storm'){g.scale.setScalar(1.35);for(let i=0;i<7;i++){const sp=mesh(q.body,new THREE.ConeGeometry(.03,.12,5),new THREE.MeshStandardMaterial({color:col(0x6fd6ff),emissive:col(0x3aa8ff),emissiveIntensity:1.2}),.26-i*.08,q.by+.26,0);sp.rotation.z=.5;}
    const gl=glowSprite(0x6fd6ff,1.6,.35);gl.position.y=.7;g.add(gl);}
  if(v==='ghost'){g.scale.setScalar(1.05);g.traverse(m=>{if(m.isMesh&&m.material!==M.eye){m.material=m.material.clone();if(m.material.emissive){m.material.emissive=col(0x9fc8e8);m.material.emissiveIntensity=.45;}m.material.transparent=true;m.material.opacity=.7;}});
    const gl=glowSprite(0xcfe6ff,2,.35);gl.position.y=.6;g.add(gl);}
  return {update:idleQuad(q,1)};
}
function buildFawn(g,spirit){
  const q=quadruped(g,{color:spirit?0xd8f0ff:0xa86f42,belly:spirit?0xffffff:0xe2cba8,len:.8,bodyR:.17,legH:.55,legR:.022,neck:.3,headR:.11,snout:.1,earW:.055,earH:.17,tailL:.12,tailR:.04,tailAng:.6,hoof:M.nose,innerEar:spirit?0xeaf6ff:0xe8b8a8});
  for(let i=0;i<22;i++){const a=Math.random()*Math.PI*2,b=Math.random()*.9,x=Math.cos(a)*.32*b,z=Math.sin(a)*.14*b;ell(q.body,fur(0xf3ead8),.022,.008,.018,x,q.by+.165*Math.cos(b*.9)+.01,z);}
  if(spirit){g.traverse(m=>{if(m.isMesh){m.material=m.material.clone();
    // only lit materials glow; the eye catchlights are MeshBasicMaterial, and giving one an
    // `emissive` colour makes three.js throw on every frame (it froze every 3D scene)
    if(m.material.emissive){m.material.emissive=col(0x6fc8ff);m.material.emissiveIntensity=.6;}m.material.transparent=true;m.material.opacity=.82;}});const gl=glowSprite(0x8fd8ff,2.2,.6);gl.position.y=.8;g.add(gl);}
  return {update:idleQuad(q,.8)};
}
function buildBoar(g,v){
  v=v===true?'king':v||'wild';const king=v==='king';
  const q=quadruped(g,{color:v==='mud'?0x5a4a3a:0x4a3628,belly:v==='mud'?0x7a6450:0x5c4636,len:1.05,bodyR:.3,legH:.28,legR:.05,neck:.04,headR:.2,snout:.2,earW:.07,earH:.13,tailL:.16,tailR:.025,tailAng:-1.3});
  for(let i=0;i<12;i++){const sp=mesh(q.body,new THREE.ConeGeometry(.04,king?.24:.12,5),fur(0x2a1e16),.38-i*.07,q.by+.3,0);sp.rotation.z=.6;}
  const tusk=plain(0xefe6cf,{roughness:.4});for(const s of [-1,1]){const c=new THREE.CatmullRomCurve3([P(.27,-.1,s*.08),P(.33,-.08,s*.12),P(.36,.02,s*.13)]);mesh(q.head,new THREE.TubeGeometry(c,10,king?.022:.014,6),tusk);}
  if(v==='mud'){g.scale.setScalar(1.15);const mud=plain(0x2e241a,{roughness:.6,metalness:.05});for(let i=0;i<16;i++){const a=Math.random()*6.28,x=(Math.random()-.5)*.8;ell(q.body,mud,.08+Math.random()*.06,.05,.06,x,q.by+Math.sin(a)*.22,Math.cos(a)*.24);}}
  if(king){g.scale.setScalar(1.8);const crown=new THREE.Group();crown.position.set(0,.2,0);q.head.add(crown);
    const gold=plain(0xd9a53a,{metalness:1,roughness:.3});mesh(crown,new THREE.CylinderGeometry(.1,.11,.06,10,1,true),gold);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;mesh(crown,new THREE.ConeGeometry(.025,.07,4),gold,Math.cos(a)*.1,.06,Math.sin(a)*.1);}}
  return {update:idleQuad(q,.6)};
}
function buildSquirrel(g){
  const F=fur(0x9a5530),W=fur(0xe8dcc8);const body=new THREE.Group();g.add(body);
  ell(body,F,.09,.12,.08,0,.14,0);ell(body,W,.05,.08,.055,.04,.13,0);
  for(const s of [-1,1]){ell(body,F,.07,.05,.04,-.01,.05,s*.06);ell(body,F,.06,.015,.025,.03,.008,s*.06);ell(body,F,.018,.05,.018,.07,.13,s*.035);}
  const head=new THREE.Group();head.position.set(.05,.28,0);body.add(head);
  ell(head,F,.065,.06,.058,0,0,0);ell(head,W,.03,.025,.03,.05,-.02,0);ell(head,M.nose,.008,.007,.01,.08,-.01,0);
  for(const s of [-1,1]){ell(head,M.eye,.014,.014,.01,.035,.02,s*.04);glint(head,.0042,.046,.027,s*.043);const ear=mesh(head,new THREE.ConeGeometry(.018,.05,6),F,-.01,.06,s*.03);ear.rotation.x=s*.2;}
  mesh(body,new THREE.SphereGeometry(.022,10,8),plain(0x7a4a22),.11,.12,0);mesh(body,new THREE.ConeGeometry(.024,.02,8),plain(0x5a3a1a),.11,.142,0);
  const tail=new THREE.Group();tail.position.set(-.08,.06,0);body.add(tail);
  const pts=[[0,0],[-.06,.08],[-.07,.18],[-.03,.27],[.03,.32]];pts.forEach(([x,y],i)=>ell(tail,F,.05+i*.006,.07,.045+i*.004,x,y,0));
  return {update(t){tail.rotation.z=Math.sin(t*3)*.12;head.rotation.y=Math.sin(t*1.7)*.5*Math.max(0,Math.sin(t*.8));body.position.y=Math.abs(Math.sin(t*5))*.003;}};
}
function buildFrog(g){
  const pad=new THREE.Mesh(new THREE.CircleGeometry(.32,24,.3,5.9),plain(0x3f6e2a,{side:THREE.DoubleSide}));pad.rotation.x=-Math.PI/2;pad.position.y=.005;sh(pad);g.add(pad);
  for(let i=0;i<6;i++){const pt=mesh(g,new THREE.ConeGeometry(.025,.07,5),plain(0xf3a6c8),-.2+Math.cos(i)*.03,.03,.12+Math.sin(i)*.03);pt.rotation.z=Math.cos(i*1.1)*.8;pt.rotation.x=Math.sin(i*1.1)*.8;}
  const G=new THREE.MeshStandardMaterial({color:col(0x5e8a3a),roughness:.35}),B=plain(0xd8d49a,{roughness:.5});const body=new THREE.Group();g.add(body);
  ell(body,G,.11,.065,.09,0,.07,0);ell(body,B,.08,.04,.07,.02,.045,0);
  const head=new THREE.Group();head.position.set(.08,.1,0);body.add(head);ell(head,G,.07,.045,.075,0,0,0);
  for(const s of [-1,1]){ell(head,G,.028,.028,.028,.02,.035,s*.045);ell(head,M.eye,.018,.02,.018,.034,.042,s*.05);glint(head,.0052,.049,.054,s*.057);
    ell(body,G,.07,.03,.035,-.05,.03,s*.075);ell(body,G,.06,.012,.022,-.01,.008,s*.11);ell(body,G,.015,.04,.015,.07,.035,s*.06);}
  for(let i=0;i<8;i++)ell(body,plain(0x3e6a26,{roughness:.4}),.012,.006,.012,-.04+Math.random()*.08,.13,(Math.random()-.5)*.1);
  return {update(t){body.scale.y=1+Math.sin(t*3)*.03;ell;}};
}
function buildDigger(g,tier){
  const eyeC=[0,0xffb347,0xd36bff,0xffe14a][tier];
  const q=quadruped(g,{color:0x4a4038,belly:0x6a5c4e,len:1,bodyR:.3,legH:.2,legR:.06,neck:.02,headR:.18,snout:.22,earW:.04,earH:.05,tailL:.12,tailR:.03,tailAng:-1.4,
    eyeMat:new THREE.MeshStandardMaterial({color:col(eyeC),emissive:col(eyeC),emissiveIntensity:2.4})});
  const claw=plain(0xe8e0d0,{roughness:.3});for(const s of [-1,1])for(let k=0;k<3;k++){const c=mesh(q.body,new THREE.ConeGeometry(.012,.07,5),claw,.36,.02,s*.165+(k-1)*.025);c.rotation.z=-Math.PI/2;}
  ell(q.head,fur(0xe8e0d0),.12,.03,.06,.08,.09,0);
  const dirt=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.1,.12,20),plain(0x3a2c1e,{map:tex(T.ground,1,1),roughness:1}));dirt.position.y=.06;sh(dirt);g.add(dirt);
  for(let i=0;i<8;i++)rock(g,.06+Math.random()*.06,Math.cos(i)*.8,.1,Math.sin(i)*.8,i+30);
  if(tier>=2)for(let i=0;i<5+tier;i++){const sp=rock(q.body,.05+tier*.012,.25-i*.09,q.by+.28,0,i+40);}
  if(tier===3){const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.07,0),new THREE.MeshStandardMaterial({color:col(0x9a6cff),emissive:col(0x7a4cff),emissiveIntensity:1.5,flatShading:true}));core.position.set(0,q.by+.42,0);q.body.add(core);
    const gl=glowSprite(0x9a6cff,.8,.6);gl.position.copy(core.position);q.body.add(gl);}
  q.body.position.y=.1;g.scale.setScalar([1,1.25,1.5,1.8][tier]);
  return {update:idleQuad(q,.5)};
}
function buildBunny(g){
  const F=fur(0x9c8370),W=fur(0xeee6da);const body=new THREE.Group();g.add(body);
  ell(body,F,.17,.15,.13,0,.15,0);ell(body,F,.1,.11,.1,.12,.2,0);ell(body,W,.1,.07,.09,.06,.1,0);
  for(const s of [-1,1]){ell(body,F,.1,.07,.05,-.06,.07,s*.1);ell(body,F,.08,.02,.03,-.02,.012,s*.1);ell(body,F,.025,.06,.025,.12,.06,s*.05);}
  const head=new THREE.Group();head.position.set(.2,.27,0);body.add(head);
  ell(head,F,.08,.07,.07,0,0,0);ell(head,W,.04,.03,.04,.06,-.02,0);ell(head,M.nose,.01,.008,.012,.1,-.005,0);
  const eyes=[],ears=[],wh=plain(0xf2ece0,{roughness:.6});
  for(const s of [-1,1]){const eg=new THREE.Group();eg.position.set(.04,.02,s*.05);head.add(eg);eyes.push(eg);ell(eg,M.eye,.017,.017,.012,0,0,0);glint(eg,.0048,.009,.007,s*.006);
    const e=new THREE.Group();e.position.set(-.02,.05,s*.03);e.rotation.x=s*.2;e.rotation.z=-.25;head.add(e);ears.push(e);
    ell(e,F,.02,.1,.032,0,.1,0);ell(e,fur(0xd9a99a),.008,.08,.022,.012,.1,0);
    for(let k=0;k<3;k++)beam(head,P(.092,-.012,s*.018),P(.11,-.022+k*.016,s*.085),.0011,.0007,wh,3);}
  const tail=new THREE.Group();tail.position.set(-.17,.18,0);body.add(tail);ell(tail,W,.045,.045,.045,0,0,0);
  const seed=Math.random()*5;
  return {update(t){body.scale.y=1+Math.sin(t*4)*.015;head.rotation.z=Math.sin(t*1.3)*.08;head.position.y=.27+Math.abs(Math.sin(t*6))*.004;
    const b=blink(t,seed);eyes.forEach(e=>e.scale.y=b);
    ears.forEach((e,i)=>{const tw=Math.pow(Math.max(0,Math.sin(t*1.1+i*2.4)),24);e.rotation.x=(i?1:-1)*(.2+tw*.35);});}};
}
function buildOwl(g){
  log(g,1,.05,0,.02,0,'x');const body=new THREE.Group();body.position.y=.05;g.add(body);const F=fur(0x7a634c),C=fur(0xd8c8ac);
  ell(body,F,.12,.17,.11,0,.17,0);ell(body,C,.07,.12,.06,.05,.15,0);
  const wings=[];for(const s of [-1,1]){const w=ell(body,fur(0x5e4a38),.05,.14,.1,-.02,.16,s*.09);w.rotation.x=s*.15;wings.push(w);}
  const head=new THREE.Group();head.position.y=.37;body.add(head);ell(head,F,.11,.095,.11,0,0,0);
  const eyes=[];
  for(const s of [-1,1]){mesh(head,new THREE.CylinderGeometry(.045,.045,.01,20),C,.09,.005,s*.045).rotation.z=Math.PI/2;
    const eg=new THREE.Group();eg.position.set(.096,.008,s*.045);head.add(eg);eyes.push(eg);
    const iris=mesh(eg,new THREE.CylinderGeometry(.024,.024,.012,18),new THREE.MeshStandardMaterial({color:col(0xf2a21c),emissive:col(0x3a2000),roughness:.15}),0,0,0);iris.rotation.z=Math.PI/2;
    mesh(eg,new THREE.CylinderGeometry(.012,.012,.014,12),M.eye,.004,0,0).rotation.z=Math.PI/2;glint(eg,.0045,.012,.008,s*.006);
    const tuft=mesh(head,new THREE.ConeGeometry(.02,.07,6),F,-.01,.09,s*.06);tuft.rotation.x=s*.3;}
  const beak=mesh(head,new THREE.ConeGeometry(.012,.04,6),plain(0x3a3026),.105,-.03,0);beak.rotation.z=Math.PI*.6;
  for(const s of [-1,1])for(let k=0;k<3;k++)beam(body,P(.03,.02,s*.04),P(.06,0,s*.04+(k-1)*.015),.004,.003,plain(0x3a3026),4);
  const seed=Math.random()*5;
  return {update(t){head.rotation.y=Math.sin(t*.5)*.9*Math.max(0,Math.sin(t*.25));const b=blink(t*.8,seed);eyes.forEach(e=>e.scale.y=b);
    const f=Math.pow(Math.max(0,Math.sin(t*.9)),30)*.55;wings.forEach((w,i)=>{w.rotation.x=(i?1:-1)*(.15+f);});}};
}

/**
 * Builders keyed by the `model` field in data/catalog.js. Each one fills the
 * group it is given and returns `{update?(t,dt), tally?}`.
 * @type {Record<string,(g:THREE.Group,variant?:any)=>{update?:Function,tally?:Record<string,any>}>}
 */
export const MODELS={
  knife:buildKnife,sling:buildSlingshot,
  bunny:buildBunny,squirrel:buildSquirrel,frog:buildFrog,fawn:buildFawn,owl:buildOwl,wolf:buildWolf,boar:buildBoar,digger:buildDigger,
  barn:buildBarn,crops:buildCrops,tent:buildTent,cabin:buildCabin,well:buildWell,forge:buildForge,gates:buildGates,tower:buildTower
};
export {buildCamp,buildBunny,buildOwl,buildBarn,buildWell,buildTent,buildForge}
