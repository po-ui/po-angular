import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  // @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  // private renderer!: THREE.WebGLRenderer;
  // private camera!: THREE.PerspectiveCamera;
  // private scene!: THREE.Scene;
  // private cylinder!: THREE.Mesh;
  // private frameId?: number;
  // ngAfterViewInit() {
  //   this.initScene();
  //   this.startAnimationLoop();
  //   window.addEventListener('resize', this.onResize);
  // }
  // private initScene() {
  //   const container = this.containerRef.nativeElement;
  //   // Renderer
  //   this.renderer = new THREE.WebGLRenderer({ antialias: true });
  //   this.renderer.setSize(container.clientWidth, container.clientHeight);
  //   container.appendChild(this.renderer.domElement);
  //   // Cena
  //   this.scene = new THREE.Scene();
  //   // Câmera
  //   this.camera = new THREE.PerspectiveCamera(
  //     60,
  //     container.clientWidth / container.clientHeight,
  //     0.1,
  //     100
  //   );
  //   this.camera.position.z = 6;
  //   // Luzes
  //   const light = new THREE.DirectionalLight(0xffffff, 1.2);
  //   light.position.set(3, 3, 5);
  //   this.scene.add(light);
  //   const ambient = new THREE.AmbientLight(0x404040);
  //   // this.scene.background = new THREE.Color(0xffffff);
  //   this.scene.add(ambient);
  //   // Geometria do cilindro (boca larga)
  //   const geometry = new THREE.CylinderGeometry(
  //     1.3,   // raio do topo
  //     1.3,   // raio da base — igual ao topo
  //     1.5,   // altura
  //     6,     // lados — 6 = hexágono
  //     1,     // segmentos verticais
  //     false  // openEnded = false → com tampa e fundo
  //   );
  //   const material = new THREE.MeshStandardMaterial({
  //     color: 0x55aaff,
  //     metalness: 0.4,
  //     roughness: 0.25,
  //   });
  //   this.cylinder = new THREE.Mesh(geometry, material);
  //   this.scene.add(this.cylinder);
  // }
  // private startAnimationLoop = () => {
  //   const animate = (time: number) => {
  //     // Rotação em dois eixos
  //     this.cylinder.rotation.y = Math.sin(time * 0.001) * 0.6;  // eixo vertical
  //     this.cylinder.rotation.x = Math.sin(time * 0.001) * 0.6; // balanço lateral
  //     //this.cylinder.rotation.z += 0.02;  // eixo vertical
  //     // this.cylinder.rotation.x = Math.sin(time * 0.001) * 0.6; // balanço lateral
  //     this.renderer.render(this.scene, this.camera);
  //     this.frameId = requestAnimationFrame(animate);
  //   };
  //   this.frameId = requestAnimationFrame(animate);
  // };
  // private onResize = () => {
  //   const container = this.containerRef.nativeElement;
  //   this.camera.aspect = container.clientWidth / container.clientHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(container.clientWidth, container.clientHeight);
  // };
  // ngOnDestroy() {
  //   cancelAnimationFrame(this.frameId!);
  //   window.removeEventListener('resize', this.onResize);
  //   this.renderer.dispose();
  // }
}
