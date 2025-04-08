import * as THREE from 'three';

const geo = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color : 0x00d000});

export class World extends THREE.Group {
    constructor(size={width:32, height:16}) {
        super();
        this.size = size;
    }

    generate() {
        this.clear();
        
        const maxCount = this.size.width * this.size.width * this.size.height;
        const mesh = new THREE.InstancedMesh(geo, boxMaterial, maxCount);
        mesh.count = 0;

        const matrix = new THREE.Matrix4();
        for (let x =0; x < this.size.width; x++) {
            for (let y=0; y < this.size.height; y++) {
                for(let z=0; z< this.size.width; z++) {
                    matrix.setPosition(x+0.5,y+0.5,z+0.5);
                    mesh.setMatrixAt(mesh.count++, matrix);
                }
            }
        }

        this.add(mesh);
    }
}