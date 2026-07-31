import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = ({ variant = 'full' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.02);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x3b82f6, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 2.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight2.position.set(-10, -10, -5);
    scene.add(pointLight2);

    // 1. Central Floating 3D Geometric Nodes
    const shapes = [];
    
    // Icosahedron (Main Core)
    const icoGeo = new THREE.IcosahedronGeometry(variant === 'hero' ? 3.5 : 2.5, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(variant === 'hero' ? 3 : 0, 0, 0);
    scene.add(icoMesh);
    shapes.push(icoMesh);

    // Inner Core Solid Mesh
    const innerGeo = new THREE.IcosahedronGeometry(variant === 'hero' ? 1.8 : 1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.1,
      metalness: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    icoMesh.add(innerMesh);

    // Surrounding Floating Polyhedrons
    const geometries = [
      new THREE.OctahedronGeometry(0.8),
      new THREE.TorusGeometry(0.9, 0.25, 16, 32),
      new THREE.TetrahedronGeometry(0.7)
    ];

    const extraMeshes = [];
    for (let i = 0; i < 8; i++) {
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0xa855f7,
        wireframe: i % 3 === 0,
        roughness: 0.3,
        metalness: 0.7
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 8) * Math.PI * 2;
      const dist = variant === 'hero' ? 6 : 5;
      mesh.position.set(
        (variant === 'hero' ? 3 : 0) + Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        (Math.random() - 0.5) * 4
      );
      scene.add(mesh);
      extraMeshes.push({ mesh, speed: (Math.random() * 0.02 + 0.005) * (i % 2 === 0 ? 1 : -1) });
    }

    // 2. Interactive Particle Starfield Grid
    const particleCount = variant === 'hero' ? 400 : 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i + 2] = (Math.random() - 0.5) * 30;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse interactive tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Main core rotation
      icoMesh.rotation.x = elapsedTime * 0.3;
      icoMesh.rotation.y = elapsedTime * 0.4;
      innerMesh.rotation.y = -elapsedTime * 0.6;

      // Orbiting extra meshes
      extraMeshes.forEach(({ mesh, speed }, idx) => {
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 1.5;
        mesh.position.y += Math.sin(elapsedTime * 2 + idx) * 0.005;
      });

      // Particle system movement
      particleSystem.rotation.y = elapsedTime * 0.03;

      // Parallax effect towards mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${
        variant === 'hero' ? 'opacity-90' : 'opacity-40'
      }`}
    />
  );
};

export default ThreeScene;
