// Personalize the site here before publishing.
const profile = { name: 'MOON', email: 'hello@example.com' };
const projects = [
 { title:'Chrome Universe', category:'3D EXPLORATION / ART DIRECTION', year:'2026', description:'빛이 표면에 닿는 순간을 탐구한 3D 콘셉트 작업입니다. 거울처럼 반사되는 금속과 부드러운 조명을 조합해, 차가운 재료에서 유기적인 움직임과 온도를 발견합니다. 이 영역에 실제 프로젝트의 배경, 제작 과정, 역할과 결과를 작성할 수 있습니다.' },
 { title:'Sensory Space', category:'WEB DESIGN / CREATIVE DEVELOPMENT', year:'2025', description:'디지털 공간을 감각적인 경험으로 확장하는 웹 디자인 콘셉트입니다. 유연한 타이포그래피와 절제된 색, 흐르는 듯한 인터랙션으로 탐색의 리듬을 설계했습니다. 실제 프로젝트 이미지와 설명으로 교체할 수 있습니다.' },
 { title:'Off the Grid', category:'BRAND IDENTITY / VISUAL SYSTEM', year:'2024', description:'정해진 틀에서 벗어나는 사고를 시각 언어로 표현한 브랜드 콘셉트입니다. 강한 타이포그래피와 확장 가능한 심볼을 중심으로 일관된 아이덴티티를 구성했습니다. 실제 클라이언트 작업이 아닌 포트폴리오 레이아웃 예시입니다.' }
];
document.querySelector('#contact-link').href=`mailto:${profile.email}`;
document.querySelector('#email-label').textContent=profile.email;
document.querySelector('#year').textContent=new Date().getFullYear();
function clock(){document.querySelector('#clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());}clock();setInterval(clock,60000);
const playlist=[
 {title:'Dark Carol Music Box',src:'./audio/dark-carol-music-box.mp3'},
 {title:'Lunar Wish (Cover)',src:'./audio/lunar-wish-cover.mp3'}
];
const audio=document.querySelector('#soundtrack-audio'),soundtrack=document.querySelector('.soundtrack'),trackTitle=document.querySelector('#track-title'),trackNumber=document.querySelector('#track-number'),soundToggle=document.querySelector('#sound-toggle'),soundNext=document.querySelector('#sound-next'),soundStatus=document.querySelector('#soundtrack-status');
const soundGate=document.querySelector('.sound-gate'),enterWithSound=document.querySelector('#enter-with-sound'),enterSilent=document.querySelector('#enter-silent');
const gatedContent=[document.querySelector('.skip'),document.querySelector('header'),document.querySelector('main'),document.querySelector('footer'),soundtrack];gatedContent.forEach(element=>{element.inert=true;});
let trackIndex=0;
audio.volume=.34;
function soundtrackUI(state,message=''){
 soundtrack.dataset.state=state;soundStatus.textContent=message;
 const playing=state==='playing';soundToggle.textContent=playing?'PAUSE':'PLAY';soundToggle.setAttribute('aria-label',playing?'배경 음악 일시정지':'배경 음악 재생');
}
function loadTrack(index,shouldPlay=false){
 trackIndex=(index+playlist.length)%playlist.length;const track=playlist[trackIndex];
 audio.src=track.src;trackTitle.textContent=track.title;trackNumber.textContent=`0${trackIndex+1} / 0${playlist.length}`;audio.load();
 soundtrackUI('loading','음악을 불러오는 중입니다.');if(shouldPlay)playSoundtrack();
}
async function playSoundtrack(){
 try{await audio.play();soundtrackUI('playing',`${playlist[trackIndex].title} 재생 중`);return true;}
 catch(error){soundtrackUI('blocked','PLAY를 눌러 음악을 시작해 주세요.');return false;}
}
function closeSoundGate(){soundGate.classList.add('is-leaving');document.body.classList.remove('sound-gated');gatedContent.forEach(element=>{element.inert=false;});setTimeout(()=>{soundGate.hidden=true;},650);}
enterWithSound.addEventListener('click',async()=>{if(await playSoundtrack())closeSoundGate();});
enterSilent.addEventListener('click',()=>{audio.pause();soundtrackUI('paused','음악 없이 입장했습니다.');closeSoundGate();});
soundToggle.addEventListener('click',()=>{if(audio.paused)playSoundtrack();else{audio.pause();soundtrackUI('paused','음악이 일시정지되었습니다.');}});
soundNext.addEventListener('click',()=>loadTrack(trackIndex+1,true));
audio.addEventListener('ended',()=>loadTrack(trackIndex+1,true));
audio.addEventListener('error',()=>soundtrackUI('error','음악 파일을 불러오지 못했습니다.'));
loadTrack(0);soundtrackUI('paused','ENTER WITH SOUND를 눌러 음악을 시작해 주세요.');enterWithSound.focus();
const dialog=document.querySelector('dialog');let opener;
document.querySelectorAll('.project').forEach(button=>button.addEventListener('click',()=>{opener=button;const p=projects[Number(button.dataset.project)];document.querySelector('#dialog-title').textContent=p.title;document.querySelector('#dialog-category').textContent=p.category;document.querySelector('#dialog-description').textContent=p.description;document.querySelector('#dialog-year').textContent=p.year;document.querySelector('#dialog-art').replaceChildren(button.querySelector('.project-art').cloneNode(true));dialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
async function initScene(){
 const THREE=await import('three');
 const [{EffectComposer},{RenderPass},{UnrealBloomPass},{OutputPass}]=await Promise.all([import('three/addons/postprocessing/EffectComposer.js'),import('three/addons/postprocessing/RenderPass.js'),import('three/addons/postprocessing/UnrealBloomPass.js'),import('three/addons/postprocessing/OutputPass.js')]);
 const host=document.querySelector('#scene'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,11);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x101112,1);scene.background=new THREE.Color(0x101112);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;host.appendChild(renderer.domElement);
 // Real HDR environment generated from luminous studio softboxes, entirely local.
 const studio=new THREE.Scene();studio.background=new THREE.Color('#171b20');
 function softbox(x,y,z,w,h,intensity,color){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);studio.add(m);}
 softbox(-5,3,4,2,9,5,'#e2efff');softbox(5,1,2,1.2,8,7,'#fffef0');softbox(0,6,-2,9,2,6,'#ffffff');softbox(0,-4,3,6,1,3,'#c7e3ce');softbox(-3,0,-5,2,8,4,'#7286bd');softbox(2,-2,5,.35,7,4,'#a599ff');softbox(-1,2,5,7,.22,7,'#ffffff');softbox(-2,1,7,3,5,2,'#e2eaff');
 const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromScene(studio,.05);scene.environment=env.texture;
 const sculpture=new THREE.Group();scene.add(sculpture);
 const metal=new THREE.MeshPhysicalMaterial({color:0xb4bfca,metalness:1,roughness:.15,clearcoat:1,clearcoatRoughness:.09,envMapIntensity:1.3});
 // True extruded glyph geometry: 文 (글월 문), 讚 (기릴 찬), 美 (아름다울 미).
 const {FontLoader}=await import('three/addons/loaders/FontLoader.js');
 const font=await new FontLoader().loadAsync('./fonts/moon-name.json?v=fused9');
 metal.roughness=.075;metal.envMapIntensity=1.55;metal.color.setHex(0xe5eaf3);
 // The material itself is opaque; screen blending and alpha masks must not reintroduce transparency.
 metal.transparent=false;metal.opacity=1;metal.transmission=0;metal.depthWrite=true;metal.side=THREE.DoubleSide;
 const letters=[];
 [...'文讚美'].forEach((char,i)=>{
   const letter=new THREE.Group();
   // Use the font's already-unified contours directly. Keeping the generated split
   // normals prevents front/side shading from bleeding across stroke junctions.
   const shapes=font.generateShapes(char,2.5);
   const geometry=new THREE.ExtrudeGeometry(shapes,{depth:.28,curveSegments:12,steps:1,bevelEnabled:true,bevelThickness:.032,bevelSize:.018,bevelSegments:6});
   geometry.computeBoundingBox();const box=geometry.boundingBox;
   geometry.translate(-(box.max.x+box.min.x)/2,-(box.max.y+box.min.y)/2,-.14);
   // One material over the entire closed glyph reads as a single cast object.
   letter.add(new THREE.Mesh(geometry,metal));

   letter.position.set((i-1)*2.68,[.20,0,-.14][i],i===1?.15:0);
   letter.rotation.set([-.018,.012,-.022][i],[.045,-.035,.04][i],0);
   sculpture.add(letter);letters.push(letter);
 });
 sculpture.rotation.set(.045,-.085,-.055);
 const rim=new THREE.PointLight(0xc8e7d5,35,20);rim.position.set(3,2,4);scene.add(rim);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.24,.5,1.15);composer.addPass(bloom);composer.addPass(new OutputPass());
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();sculpture.scale.setScalar((2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z*camera.aspect)/6.35);}new ResizeObserver(resize).observe(host);resize();
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true,px=0,py=0,time=0,last=performance.now(),mode=0;
 const motion=document.querySelector('#motion');function motionUI(){motion.textContent=paused?'▶':'Ⅱ';motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'3D 모션 재생':'3D 모션 일시정지');}motionUI();motion.addEventListener('click',()=>{paused=!paused;motionUI();});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{paused=e.matches;motionUI();});
 document.querySelector('#light').addEventListener('click',e=>{mode=(mode+1)%3;const colors=[0xb4bfca,0xc5d5aa,0xaebcdc];metal.color.setHex(colors[mode]);bloom.strength=[.3,.5,.18][mode];e.currentTarget.querySelector('span').textContent=`0${mode+1}`;e.currentTarget.setAttribute('aria-pressed',String(mode!==0));});
 window.addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*.4;py=(e.clientY/innerHeight-.5)*.25;},{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(host);
 renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(!paused){time+=dt;const ease=1-Math.exp(-dt*3);
   sculpture.rotation.y+=(-.20+Math.sin(time*.22)*.10+px*.65-sculpture.rotation.y)*ease;
   sculpture.rotation.x+=(.10+py*.5-sculpture.rotation.x)*ease;
   sculpture.position.y=Math.sin(time*.45)*.065;
   letters.forEach((letter,i)=>{letter.position.y=[.20,0,-.14][i]+Math.sin(time*.5+i*.8)*.035;});}composer.render();});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);document.querySelector('#scene-status').textContent='3D 화면을 다시 보려면 페이지를 새로고침해 주세요.';});
}
initScene().catch(error=>{console.error('3D scene unavailable:',error);document.querySelector('#scene-status').textContent='이 환경에서는 3D를 표시할 수 없습니다. 작업과 소개는 계속 확인할 수 있어요.';document.querySelectorAll('.scene-controls button').forEach(b=>b.disabled=true);});
