import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';

const WebARViewer = ({ imageUrl, onClose }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const shirtImageRef = useRef(new Image());

  useEffect(() => {
    // Pre-load the garment image
    shirtImageRef.current.src = imageUrl;
    shirtImageRef.current.crossOrigin = "anonymous";
  }, [imageUrl]);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    let camera = null;
    if (webcamRef.current && webcamRef.current.video) {
      camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current && webcamRef.current.video) {
             await pose.send({image: webcamRef.current.video});
          }
        },
        width: 640,
        height: 480
      });
      camera.start().then(() => setIsModelLoading(false));
    }

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, []);

  const onResults = (results) => {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);

    // Only draw the garment if we detect a pose
    if (results.poseLandmarks) {
      // Draw skeletal tracking for debug/cool factor (optional)
      // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#8b5cf6', lineWidth: 2});
      
      // Get Shoulder landmarks (11 = left shoulder, 12 = right shoulder)
      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];
      const leftHip = results.poseLandmarks[23];
      const rightHip = results.poseLandmarks[24];
      
      // Convert normalized coordinates to pixel scale
      const lsX = leftShoulder.x * videoWidth;
      const lsY = leftShoulder.y * videoHeight;
      const rsX = rightShoulder.x * videoWidth;
      const rsY = rightShoulder.y * videoHeight;

      // Calculate the center point between shoulders to pin the collar
      const centerX = (lsX + rsX) / 2;
      const midShoulderY = (lsY + rsY) / 2;

      // Calculate T-Shirt Width based on shoulder joints
      const shoulderDist = Math.sqrt(Math.pow(rsX - lsX, 2) + Math.pow(rsY - lsY, 2));
      const shirtWidth = shoulderDist * 2.2; 
      
      // Baseline height estimate
      let shirtHeight = shirtWidth * 1.25;

      // Advanced Body Mapping: Measure true spine/torso length if hip landmarks are sufficiently visible
      if (leftHip && rightHip && leftHip.visibility > 0.2 && rightHip.visibility > 0.2) {
          const lhY = leftHip.y * videoHeight;
          const rhY = rightHip.y * videoHeight;
          const midHipY = (lhY + rhY) / 2;
          
          const trueTorsoLength = Math.abs(midHipY - midShoulderY);
          // Scale it to naturally drape ~35% past the waistline to emulate an untucked T-shirt
          shirtHeight = trueTorsoLength * 1.35;
      }
      
      // Calculate rotation angle of the shoulders
      // lsX is greater than rsX on screen, so dx is positive.
      const angle = Math.atan2(lsY - rsY, lsX - rsX);

      // --- NEW: 3D YAW / DEPTH CALCULATION ---
      // Pose landmarks include 'z' for depth relative to the camera.
      // We can use the difference in Z between shoulders to estimate how much the torso is turned sideways.
      const dz = leftShoulder.z - rightShoulder.z;
      // dx in screen space (normalized to video dimensions for ratio)
      const dxNorm = leftShoulder.x - rightShoulder.x;
      
      // Calculate the Yaw angle (rotation around the Y axis). We multiply dz by a sensitivity factor to exaggerate the depth slightly for better visual feedback.
      const yawAngle = Math.atan2(dz * 2.5, dxNorm);
      
      // The cosine of the yaw angle gives us the perfect horizontal squish factor.
      // When facing perfectly forward (dz = 0), yaw = 0, cos(0) = 1 (100% width).
      // When turned sideways, yaw approaches PI/2, cos approaches 0.
      const scaleX = Math.abs(Math.cos(yawAngle));

      // Draw the T-Shirt Image
      if (shirtImageRef.current.complete) {
        canvasCtx.translate(centerX, midShoulderY);           // Move to center of collar
        canvasCtx.rotate(angle);                              // Rotate to match shoulder tilt (Z axis)
        canvasCtx.scale(scaleX, 1);                           // Squish horizontally based on body turn (Y axis)
        
        // Draw the image centered horizontally, offsetting upwards slightly (~8%) so the virtual collar aligns perfectly with the physical neck base.
        canvasCtx.drawImage(
          shirtImageRef.current, 
          -shirtWidth / 2, 
          -shirtHeight * 0.08,  
          shirtWidth, 
          shirtHeight
        );
      }
    }
    canvasCtx.restore();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '2rem', right: '3rem', background: 'white', color: 'black', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '2rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 10000 }}
      >
        Close WebAR
      </button>

      {cameraError ? (
        <div style={{ position: 'absolute', zIndex: 10, backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '400px', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--danger-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              <line x1="12" y1="15" x2="12" y2="17"></line>
            </svg>
          </div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Camera Access Blocked</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We need camera access to show you the virtual try-on. Please click the <strong>lock icon (🔒)</strong> in your browser's address bar, allow camera permissions, and refresh the page.
          </p>
          <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>Return to Product</button>
        </div>
      ) : isModelLoading ? (
        <div style={{ position: 'absolute', zIndex: 10, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
           <h3>Initializing AI Tracking...</h3>
           <p style={{ color: '#a1a1aa' }}>Please stand back from the camera</p>
        </div>
      ) : null}

      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', display: cameraError ? 'none' : 'block' }}>
        <Webcam
          ref={webcamRef}
          onUserMediaError={(err) => {
            console.error("Webcam Access Denied:", err);
            setCameraError(true);
            setIsModelLoading(false);
          }}
          style={{ width: '100%', height: 'auto', display: 'block', transform: 'scaleX(-1)' }} // Mirror view for usability
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }} // Mirror canvas to match
        />
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'white' }}>
        <p style={{ margin: 0 }}>Ensure your shoulders are visible in the frame.</p>
        <p style={{ margin: 0, color: 'var(--accent-color)', fontSize: '0.85rem' }}>Powered by MediaPipe Vision</p>
      </div>
    </div>
  );
};

export default WebARViewer;
