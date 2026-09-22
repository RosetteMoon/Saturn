import * as THREE from 'three';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

/** A closed extrusion with a raised, smoothly crowned front on every stroke.
 * Distance is measured against ALL contours, including counters; x/y never move.
 * This preserves the exact holes while rounding the visible face in real geometry.
 */
export function createDomedType(shapes) {
  const depth = .40, bevel = .055, frontZ = depth + bevel;
  const shell = new THREE.ExtrudeGeometry(shapes, {
    depth, curveSegments: 8, steps: 1,
    bevelEnabled: true, bevelThickness: bevel, bevelSize: .010, bevelSegments: 10,
  });
  const positions = [];
  const shellPos = shell.getAttribute('position');
  // Replace the flat forward cap, retaining the back, sides and rounded edge.
  for (let i = 0; i < shellPos.count; i += 3) {
    if ([0, 1, 2].every(k => shellPos.getZ(i + k) > frontZ - 1e-5)) continue;
    for (let k = 0; k < 3; k++) positions.push(shellPos.getX(i+k), shellPos.getY(i+k), shellPos.getZ(i+k));
  }
  const segments = [];
  for (const shape of shapes) {
    for (const contour of [shape, ...shape.holes]) {
      const points = contour.getPoints(8);
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i+1], dx = b.x-a.x, dy = b.y-a.y;
        const length2 = dx*dx+dy*dy;
        if (length2 > 1e-14) segments.push([a.x,a.y,dx,dy,length2]);
      }
    }
  }
  const flat = new THREE.ShapeGeometry(shapes, 8);
  const cap = new TessellateModifier(.045, 10).modify(flat);
  const capPos = cap.getAttribute('position');
  const heights = new Map();
  for (let i = 0; i < capPos.count; i++) {
    const x = capPos.getX(i), y = capPos.getY(i);
    const key = `${Math.round(x*1e6)},${Math.round(y*1e6)}`;
    let z = heights.get(key);
    if (z === undefined) {
      let distance2 = Infinity;
      for (const [ax,ay,dx,dy,length2] of segments) {
        const t = Math.max(0, Math.min(1, ((x-ax)*dx+(y-ay)*dy)/length2));
        const ex = x-ax-t*dx, ey = y-ay-t*dy;
        distance2 = Math.min(distance2, ex*ex+ey*ey);
      }
      const distance = Math.sqrt(distance2);
      z = frontZ + .17 * (1 - Math.exp(-distance/.085));
      heights.set(key,z);
    }
    positions.push(x,y,z);
  }
  const raw = new THREE.BufferGeometry();
  raw.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  const geometry = mergeVertices(raw, 1e-5);
  geometry.computeVertexNormals();
  // Smooth the densely tessellated crown normals to avoid tiny metallic facets.
  const normals=geometry.getAttribute('normal'), index=geometry.index.array;
  const adjacency=Array.from({length:normals.count},()=>new Set());
  for(let i=0;i<index.length;i+=3){
    const a=index[i],b=index[i+1],c=index[i+2];
    adjacency[a].add(b).add(c);adjacency[b].add(a).add(c);adjacency[c].add(a).add(b);
  }
  for(let pass=0;pass<6;pass++){
    const next=new Float32Array(normals.array.length);
    for(let i=0;i<normals.count;i++){
      let x=normals.getX(i)*2,y=normals.getY(i)*2,z=normals.getZ(i)*2;
      for(const j of adjacency[i]){x+=normals.getX(j);y+=normals.getY(j);z+=normals.getZ(j);}
      const length=Math.hypot(x,y,z)||1;
      next[i*3]=x/length;next[i*3+1]=y/length;next[i*3+2]=z/length;
    }
    normals.array.set(next);
  }
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  geometry.translate(-(box.max.x+box.min.x)/2,-(box.max.y+box.min.y)/2,-depth/2);
  shell.dispose();flat.dispose();cap.dispose();raw.dispose();
  return geometry;
}
