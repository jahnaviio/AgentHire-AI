import React, { useEffect, useRef, useState } from "react";

interface DigitalHumanAvatarProps {
  id: string; // "ira" | "nick" | "john" | "maya"
  name: string;
  isSpeaking: boolean;
  mood: string; // "serious" | "thoughtful" | "smiling" | "nodding" | "surprised" | "neutral"
}

export default function DigitalHumanAvatar({ id, name, isSpeaking, mood }: DigitalHumanAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blinkActive, setBlinkActive] = useState(false);
  const [gazeOffset, setGazeOffset] = useState({ x: 0, y: 0 });
  const [facialJitter, setFacialJitter] = useState({ x: 0, y: 0 });
  const [nodOffset, setNodOffset] = useState(0);

  // Blinking loop (natural human intervals)
  useEffect(() => {
    let blinkTimeout: any;
    const triggerBlink = () => {
      setBlinkActive(true);
      setTimeout(() => setBlinkActive(false), 140); // Natural 140ms eyelid closure
      const randomInterval = 2800 + Math.random() * 3500;
      blinkTimeout = setTimeout(triggerBlink, randomInterval);
    };
    blinkTimeout = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Subtle posture movements: breathing + soft drifting look
  useEffect(() => {
    const jitterInterval = setInterval(() => {
      // Natural human focus drift
      setGazeOffset({
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 2,
      });
      // Soft posture sways
      setFacialJitter({
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.0,
      });
    }, 3100);

    return () => clearInterval(jitterInterval);
  }, []);

  // Head nodding loop
  useEffect(() => {
    if (mood === "nodding" || mood === "smiling" || (isSpeaking && Math.random() > 0.6)) {
      let step = 0;
      const interval = setInterval(() => {
        step += 0.25;
        setNodOffset(Math.sin(step) * 3); // realistic gentle head nodding frequency
      }, 60);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setNodOffset(0);
      }, 1200);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        setNodOffset(0);
      };
    }
  }, [mood, isSpeaking]);

  // High-Fidelity Rendering Pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let waveCycle = 0;

    const render = () => {
      waveCycle += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      // 1. CLEAN STAGE OVERALL
      ctx.clearRect(0, 0, w, h);

      // 2. BLURRED VIRTUAL OFFICE BACKPLAY BACKGROUND (Simulation of high-end camera Depth of Field)
      ctx.save();
      
      // We will draw a professional studio background: wall, windows, a virtual office light pane
      // Ambient Wall Gradient
      const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
      wallGrad.addColorStop(0, "rgb(23, 28, 41)");
      wallGrad.addColorStop(1, "rgb(8, 10, 16)");
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft blurred light source (Virtual corporate office lamp)
      const lightGrad = ctx.createRadialGradient(w * 0.8, h * 0.3, 10, w * 0.75, h * 0.3, w * 0.6);
      lightGrad.addColorStop(0, "rgba(59, 130, 246, 0.15)"); // Cool cyan accent glow
      lightGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, w, h);

      // Enable blur filter ONLY for background elements to create realistic bokeh/focus drop-off
      ctx.filter = "blur(12px)";

      // Draw blurred corporate office window panes
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(w * 0.08, h * 0.1, w * 0.25, h * 0.5);
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(w * 0.36, h * 0.1, w * 0.12, h * 0.5);

      // Blurred warm white board or shelf lines
      ctx.strokeStyle = "rgba(219, 234, 254, 0.05)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w, h * 0.55);
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w, h * 0.72);
      ctx.stroke();

      // Blurred potted green office plant details in the corner
      ctx.fillStyle = "rgba(16, 185, 129, 0.06)"; // Plant leaf group 1
      ctx.beginPath();
      ctx.arc(w * 0.9, h * 0.65, 35, 0, Math.PI * 2);
      ctx.arc(w * 0.85, h * 0.73, 28, 0, Math.PI * 2);
      ctx.fill();

      // Restore filter to normal immediately so the presenter avatar is sharp
      ctx.filter = "none";
      ctx.restore();

      // Dynamic offsets for human sways
      const breathScale = 1 + Math.sin(waveCycle / 1.3) * 0.007; // Natural 0.7% chest expansion
      const mouthScale = isSpeaking ? 0.32 + Math.abs(Math.sin(waveCycle * 2.8)) * 0.85 : 0.04;
      
      const cx = w / 2 + facialJitter.x;
      // Introduce micro head-tilts based on mood
      let targetTilt = 0;
      if (mood === "thoughtful") targetTilt = -0.015;
      else if (mood === "smiling") targetTilt = 0.008;

      const cy = h / 2 + facialJitter.y + nodOffset - 8;

      // Draw active speaker glowing ring (Subtle green professional signal)
      if (isSpeaking) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(cx, cy + 10, h * 0.36, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. SHOULDER & BUSINESS ATTIRE (Sophisticated shading)
      ctx.save();
      ctx.translate(cx, cy + h * 0.35);
      ctx.scale(breathScale, breathScale);

      // Blazer Jacket body
      const jacketGrad = ctx.createLinearGradient(-120, 0, 120, 120);
      if (id === "ira" || id === "maya") {
        jacketGrad.addColorStop(0, "rgb(48, 25, 69)"); // Premium Plum/Eggplant Blazer
        jacketGrad.addColorStop(0.5, "rgb(32, 17, 48)");
        jacketGrad.addColorStop(1, "rgb(15, 23, 42)");
      } else {
        jacketGrad.addColorStop(0, "rgb(20, 35, 64)"); // Executive Dark Charcoal Navy Suit
        jacketGrad.addColorStop(0.5, "rgb(14, 25, 48)");
        jacketGrad.addColorStop(1, "rgb(4, 6, 12)");
      }

      ctx.fillStyle = jacketGrad;
      ctx.beginPath();
      ctx.moveTo(-115, 130);
      ctx.quadraticCurveTo(-90, 8, -55, 3); // Left shoulder roll
      ctx.lineTo(55, 3);
      ctx.quadraticCurveTo(90, 8, 115, 130); // Right shoulder roll
      ctx.closePath();
      ctx.fill();

      // Sharp shadow folds on suit shoulders
      ctx.strokeStyle = "rgba(0,0,0,0.22)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-85, 45);
      ctx.quadraticCurveTo(-55, 25, -50, 4);
      ctx.moveTo(85, 45);
      ctx.quadraticCurveTo(55, 25, 50, 4);
      ctx.stroke();

      // Crisp White Button-Down Shirt
      ctx.fillStyle = "rgb(248, 250, 252)";
      ctx.beginPath();
      ctx.moveTo(-28, 3);
      ctx.lineTo(0, 44);
      ctx.lineTo(28, 3);
      ctx.lineTo(20, -5);
      ctx.lineTo(-20, -5);
      ctx.closePath();
      ctx.fill();

      // Shirt collar buttons and line
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.lineTo(0, 44);
      ctx.stroke();

      // Professional Red/Silver stripe tie for men, golden necklace pendant for women
      if (id === "nick" || id === "john") {
        // Red Silk Tie with corporate diagonal stripe patterns
        ctx.fillStyle = "rgb(180, 29, 29)"; // Deep burgundy
        ctx.beginPath();
        ctx.moveTo(-5.5, 18);
        ctx.lineTo(5.5, 18);
        ctx.lineTo(8, 85);
        ctx.lineTo(0, 102);
        ctx.lineTo(-8, 85);
        ctx.closePath();
        ctx.fill();

        // Silver Stripes on Tie
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, 32); ctx.lineTo(3, 44);
        ctx.moveTo(-7, 52); ctx.lineTo(5, 68);
        ctx.moveTo(-8, 72); ctx.lineTo(7, 90);
        ctx.stroke();
      } else {
        // Golden Corporate Pendant / Necklace for Ira & Maya
        ctx.strokeStyle = "rgb(217, 119, 6)"; // Rich gold
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -3, 24, 0, Math.PI);
        ctx.stroke();

        ctx.fillStyle = "rgb(245, 158, 11)"; // Sapphire diamond set in gold
        ctx.beginPath();
        ctx.arc(0, 21, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Smooth lapel linings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-55, 3);
      ctx.lineTo(-22, 55);
      ctx.lineTo(0, 55);
      ctx.lineTo(22, 55);
      ctx.lineTo(55, 3);
      ctx.stroke();

      ctx.restore();

      // 4. NECK WITH SOFT NATURAL SHADING (Realistic shadow under jaw)
      const baseSkin = (id === "ira" || id === "maya") ? { h: "rgb(255, 233, 219)", s: "rgb(235, 191, 166)" } : { h: "rgb(248, 222, 203)", s: "rgb(214, 178, 152)" };
      
      ctx.fillStyle = baseSkin.h;
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy + 30);
      ctx.lineTo(cx - 15, cy + 76);
      ctx.lineTo(cx + 15, cy + 76);
      ctx.lineTo(cx + 18, cy + 30);
      ctx.closePath();
      ctx.fill();

      // Throat Shadow (gives 3D rounded depth)
      const neckShadowGrad = ctx.createLinearGradient(cx, cy + 30, cx, cy + 76);
      neckShadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.22)"); // Bold neck shadow under chin
      neckShadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = neckShadowGrad;
      ctx.fillRect(cx - 17, cy + 30, 34, 46);

      // Collarbone shadow lines
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy + 68);
      ctx.quadraticCurveTo(cx, cy + 74, cx + 15, cy + 68);
      ctx.stroke();

      // 5. COMPLEX 3D FACE STRUCTURE (Contoured jaw and cheekbone shaders)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(targetTilt);

      // Cheek and jaw paths
      const faceGrad = ctx.createRadialGradient(0, -6, 8, 0, 18, 62);
      faceGrad.addColorStop(0, baseSkin.h);
      faceGrad.addColorStop(0.85, baseSkin.s);
      faceGrad.addColorStop(1, "rgb(180, 140, 115)"); // Outer boundary outline shadow
      
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      // Eye Socket shadow sinks
      ctx.fillStyle = "rgba(0, 0, 0, 0.035)";
      ctx.beginPath();
      ctx.ellipse(-17, -8, 12, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(17, -8, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Warm blush under eyes for photorealistic skin circulation glow
      ctx.fillStyle = (id === "ira" || id === "maya") ? "rgba(225, 29, 72, 0.08)" : "rgba(220, 38, 38, 0.04)";
      ctx.beginPath();
      ctx.arc(-26, 6, 11, 0, Math.PI * 2);
      ctx.arc(26, 6, 11, 0, Math.PI * 2);
      ctx.fill();

      // Realistic Ears matching skin grading
      ctx.fillStyle = baseSkin.s;
      // Left Ear
      ctx.beginPath();
      ctx.ellipse(-53, -2, 7, 13, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-53, -2, 5, 0, Math.PI * 2);
      ctx.stroke();

      // Right Ear
      ctx.beginPath();
      ctx.ellipse(53, -2, 7, 13, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(53, -2, 5, 0, Math.PI * 2);
      ctx.stroke();

      // 3D Nose Bridge & Realistic Tip representation
      ctx.strokeStyle = "rgba(0, 0, 0, 0.09)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -22); // Start at brow intercept
      ctx.lineTo(-1, 3);
      ctx.quadraticCurveTo(-1.5, 8, 4, 8); // Side contour nostril lift
      ctx.stroke();

      // Soft white nose highlight to simulate professional studio key light
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.beginPath();
      ctx.ellipse(2, -4, 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nostril dimples
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.beginPath();
      ctx.arc(-4, 7, 1.2, 0, Math.PI * 2);
      ctx.arc(4, 7, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // 6. MULTI-LAYERED STYLED HAIR (Volumetric curls with specular gloss)
      const hairGrad = ctx.createLinearGradient(-60, -60, 60, 20);
      if (id === "ira" || id === "maya") {
        // Brunette with soft blonde caramel highlights
        hairGrad.addColorStop(0, "rgb(44, 28, 20)"); // Dark wood base
        hairGrad.addColorStop(0.5, "rgb(74, 48, 30)"); // Rich chocolate
        hairGrad.addColorStop(1, "rgb(108, 72, 45)"); // Soft glow highlights
      } else {
        // Tech Male dark obsidian / ash parts
        hairGrad.addColorStop(0, "rgb(25, 25, 25)");
        hairGrad.addColorStop(0.5, "rgb(41, 41, 41)");
        hairGrad.addColorStop(1, "rgb(55, 55, 55)");
      }

      ctx.fillStyle = hairGrad;

      if (id === "ira" || id === "maya") {
        // Back hair layers draping beautifully behind/beside neck
        ctx.beginPath();
        // Left cascading waves
        ctx.moveTo(-52, -10);
        ctx.bezierCurveTo(-78, 30, -62, 115, -45, 126);
        ctx.lineTo(-18, 126);
        ctx.bezierCurveTo(-46, 68, -44, 15, -35, -10);
        ctx.closePath();
        ctx.fill();

        // Right cascading waves
        ctx.beginPath();
        ctx.moveTo(52, -10);
        ctx.bezierCurveTo(78, 30, 62, 115, 45, 126);
        ctx.lineTo(18, 126);
        ctx.bezierCurveTo(46, 68, 44, 15, 35, -10);
        ctx.closePath();
        ctx.fill();

        // Crown volume circle atop face
        ctx.beginPath();
        ctx.arc(0, -22, 54, 0, Math.PI * 2);
        ctx.fill();

        // Elegantly swept side bangs & high forehead fringe details
        ctx.beginPath();
        ctx.moveTo(-54, -20);
        ctx.quadraticCurveTo(0, -62, 54, -20);
        ctx.quadraticCurveTo(34, -14, 25, -24);
        ctx.quadraticCurveTo(0, -38, -25, -24);
        ctx.closePath();
        ctx.fill();

        // Soft individual highlight strands
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(-22, -35, 45, Math.PI * 0.9, Math.PI * 1.4);
        ctx.arc(22, -35, 45, Math.PI * 1.6, Math.PI * 2.15);
        ctx.stroke();
      } else {
        // Male POMPADOUR Executive Trim (Nick & John)
        ctx.beginPath();
        ctx.arc(0, -24, 52, Math.PI * 0.95, Math.PI * 2.05); // Thick pompadour base
        ctx.quadraticCurveTo(44, 4, 51, 8);
        ctx.lineTo(46, -15);
        ctx.quadraticCurveTo(0, -42, -46, -15);
        ctx.lineTo(-51, 8);
        ctx.quadraticCurveTo(-44, 4, -48, -15);
        ctx.closePath();
        ctx.fill();

        // Fine side-burn details
        ctx.beginPath();
        ctx.rect(-50, -4, 4.2, 18);
        ctx.rect(46, -4, 4.2, 18);
        ctx.fill();

        // Elegant stubble jaw shadow coating for Nick and John (Extremely tech-smart vibe)
        const beardGrad = ctx.createRadialGradient(0, 18, 10, 0, 18, 48);
        beardGrad.addColorStop(0, "rgba(42, 38, 35, 0.28)"); // Soft shadows representing trimmed facial stubble
        beardGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = beardGrad;
        ctx.beginPath();
        ctx.arc(0, 15, 45, 0, Math.PI);
        ctx.fill();
      }

      // 7. REALISTIC EYES WITH DOUBLE REFLECTIONS & ATTENTIVE EYEPATH
      const eyeY = -8;
      const eyeSpacing = 16.5;

      // Eyebrows matching styled hair body
      ctx.strokeStyle = (id === "ira" || id === "maya") ? "rgb(66, 45, 34)" : "rgb(32, 28, 25)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      // Raise brows on surprised mood or tilting
      const browLift = mood === "surprised" ? -4 : (mood === "thoughtful" ? -1.5 : 0);
      ctx.moveTo(-eyeSpacing - 8, eyeY - 9 + browLift);
      ctx.quadraticCurveTo(-eyeSpacing, eyeY - 13 + browLift, -eyeSpacing + 6, eyeY - 9 + browLift);
      ctx.moveTo(eyeSpacing - 6, eyeY - 9 + browLift);
      ctx.quadraticCurveTo(eyeSpacing, eyeY - 13 + browLift, eyeSpacing + 8, eyeY - 9 + browLift);
      ctx.stroke();

      // Left & Right Scleras (Eyeball globes with 3D shadow curves)
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.beginPath();
      ctx.ellipse(-eyeSpacing, eyeY, 7.8, 5.5, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeSpacing, eyeY, 7.8, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shadow overlay on scleras for volumetric eye depth
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.beginPath();
      ctx.ellipse(-eyeSpacing, eyeY, 7.8, 4.5, 0, Math.PI, Math.PI * 2);
      ctx.ellipse(eyeSpacing, eyeY, 7.8, 4.5, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      // Irises with complex multi-tone radial iris details
      const eyeFocusX = gazeOffset.x;
      const eyeFocusY = gazeOffset.y + (mood === "thoughtful" ? -2 : 0); // look upper thoughtful in pause

      const leftIrisGrad = ctx.createRadialGradient(-eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 0.5, -eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 5);
      const rightIrisGrad = ctx.createRadialGradient(eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 0.5, eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 5);

      if (id === "ira" || id === "maya") {
        // Captivating realistic blue/green gradient eyes
        leftIrisGrad.addColorStop(0, "rgb(15, 68, 102)");
        leftIrisGrad.addColorStop(0.5, "rgb(41, 126, 175)");
        leftIrisGrad.addColorStop(1, "rgb(15, 52, 77)");

        rightIrisGrad.addColorStop(0, "rgb(15, 68, 102)");
        rightIrisGrad.addColorStop(0.5, "rgb(41, 126, 175)");
        rightIrisGrad.addColorStop(1, "rgb(15, 52, 77)");
      } else {
        // Captivating warm deep chocolate hazel eyes
        leftIrisGrad.addColorStop(0, "rgb(32, 21, 15)");
        leftIrisGrad.addColorStop(0.65, "rgb(101, 62, 38)");
        leftIrisGrad.addColorStop(1, "rgb(22, 14, 10)");

        rightIrisGrad.addColorStop(0, "rgb(32, 21, 15)");
        rightIrisGrad.addColorStop(0.65, "rgb(101, 62, 38)");
        rightIrisGrad.addColorStop(1, "rgb(22, 14, 10)");
      }

      ctx.fillStyle = leftIrisGrad;
      ctx.beginPath();
      ctx.arc(-eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = rightIrisGrad;
      ctx.beginPath();
      ctx.arc(eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Dark pupils
      ctx.fillStyle = "rgb(10, 10, 10)";
      ctx.beginPath();
      ctx.arc(-eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 2.2, 0, Math.PI * 2);
      ctx.arc(eyeSpacing + eyeFocusX, eyeY + eyeFocusY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // DOUBLE Glass reflections (Mirror glass sheen - gives extreme photorealistic live look)
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"; // High specular gloss
      ctx.beginPath();
      ctx.arc(-eyeSpacing + eyeFocusX - 1.4, eyeY + eyeFocusY - 1.4, 0.9, 0, Math.PI * 2);
      ctx.arc(eyeSpacing + eyeFocusX - 1.4, eyeY + eyeFocusY - 1.4, 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // Soft background bounce shadow
      ctx.beginPath();
      ctx.arc(-eyeSpacing + eyeFocusX + 1.6, eyeY + eyeFocusY + 1.2, 0.6, 0, Math.PI * 2);
      ctx.arc(eyeSpacing + eyeFocusX + 1.6, eyeY + eyeFocusY + 1.2, 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Eyelid line stroke (Delicate line overlays)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-eyeSpacing - 8, eyeY);
      ctx.quadraticCurveTo(-eyeSpacing, eyeY - 6.5, -eyeSpacing + 8, eyeY);
      ctx.moveTo(eyeSpacing - 8, eyeY);
      ctx.quadraticCurveTo(eyeSpacing, eyeY - 6.5, eyeSpacing + 8, eyeY);
      ctx.stroke();

      // Active blinks rendering (Smooth coverage slide)
      if (blinkActive) {
        ctx.fillStyle = baseSkin.s;
        ctx.beginPath();
        ctx.ellipse(-eyeSpacing, eyeY, 8.2, 5.9, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeSpacing, eyeY, 8.2, 5.9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(79, 55, 41, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-eyeSpacing - 8, eyeY);
        ctx.lineTo(-eyeSpacing + 8, eyeY);
        ctx.moveTo(eyeSpacing - 8, eyeY);
        ctx.lineTo(eyeSpacing + 8, eyeY);
        ctx.stroke();
      }

      // 8. REALISTIC RED GLOSS LIP CONTUR & SPEAKING LIP CONTROLLER
      ctx.restore();
      ctx.save();
      ctx.translate(cx, cy + 18);
      ctx.rotate(targetTilt);

      // Lip Base gloss paint gradient
      const lipGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      if (id === "ira" || id === "maya") {
        lipGrad.addColorStop(0, "rgb(190, 55, 75)"); // Elegant Crimson lipstick gloss
        lipGrad.addColorStop(0.5, "rgb(225, 65, 88)");
        lipGrad.addColorStop(1, "rgb(190, 55, 75)");
      } else {
        lipGrad.addColorStop(0, "rgb(170, 78, 65)"); // Subtle rosewood skin lip finish
        lipGrad.addColorStop(0.5, "rgb(195, 96, 82)");
        lipGrad.addColorStop(1, "rgb(170, 78, 65)");
      }

      ctx.fillStyle = lipGrad;
      const lipW = 14.5 + (mood === "smiling" ? 2 : 0) + (isSpeaking ? 1 : 0);
      const lipH = 4.2 * mouthScale;

      ctx.beginPath();
      // Rounded cupids-bow top lip
      ctx.moveTo(-lipW, 0);
      ctx.bezierCurveTo(-lipW / 2, -lipH - 1.5, 0, -lipH - 2.5, 0, -lipH - 0.5);
      ctx.bezierCurveTo(0, -lipH - 2.5, lipW / 2, -lipH - 1.5, lipW, 0);
      // Fuller lower lip roll curves
      ctx.bezierCurveTo(lipW / 2, lipH + 4.5, -lipW / 2, lipH + 4.5, -lipW, 0);
      ctx.closePath();
      ctx.fill();

      // Mouth interior depth cavity and beautiful white teeth
      if (isSpeaking && mouthScale > 0.38) {
        // Deep internal shadow
        ctx.fillStyle = "rgb(64, 12, 16)";
        ctx.beginPath();
        ctx.ellipse(0, 1.0, lipW - 2.5, lipH, 0, 0, Math.PI * 2);
        ctx.fill();

        // High gloss white teeth bar visible during speech
        ctx.fillStyle = "rgb(248, 250, 252)";
        ctx.fillRect(-lipW + 5.5, -0.4, (lipW - 5.5) * 2, 1.3);
      }

      // Small lip corner dimples if smiling
      if (mood === "smiling") {
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(-lipW - 1, -1.8, 2.5, Math.PI * 0.4, Math.PI * 1.1);
        ctx.arc(lipW + 1, -1.8, 2.5, Math.PI * -0.1, Math.PI * 0.6);
        ctx.stroke();
      }

      ctx.restore();

      // Final restore on trans/tilt
      ctx.restore();

      // Re-queue animation frames
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [id, isSpeaking, mood, blinkActive, gazeOffset, facialJitter, nodOffset]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-center bg-slate-950 shadow-inner">
      {/* High-definition studio scanline layer simulating premium Webrtc video capture hardware */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(59,130,246,0.015),rgba(0,255,0,0.005),rgba(239,68,68,0.015))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-25" />
      
      {/* High-contrast lens vignette effect */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_55%,rgba(0,0,0,0.72)_100%)] pointer-events-none z-10" />

      <canvas
        ref={canvasRef}
        width={480}
        height={360}
        className="w-full h-full object-cover relative z-0 filter brightness-[1.03] contrast-[1.02] saturate-[1.05]"
      />
      
      {/* Absolute top watermarks indicating elite high-fidelity real-time presenter streams */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-300 backdrop-blur pointer-events-none z-10 uppercase tracking-widest font-extrabold shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Hires Live: 1080p Ultra
      </div>

      <div className="absolute bottom-3 left-3 bg-slate-950/85 border border-slate-800/80 px-2.5 py-0.5 rounded text-[10px] font-mono text-slate-300 font-bold z-10 uppercase shadow-lg select-none">
        {name}
      </div>
    </div>
  );
}
