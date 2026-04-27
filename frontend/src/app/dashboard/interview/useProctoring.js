import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export const useProctoring = (videoRef, sessionId, onViolation, isActive) => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const objectModelRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
            try {
                // Ensure backend is ready
                await tf.setBackend('webgl');
                await tf.ready();
                
                const [objModel] = await Promise.all([
                    cocoSsd.load(),
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                objectModelRef.current = objModel;
                setModelsLoaded(true);
                console.log('Proctoring & Object Models Loaded Successfully');
            } catch (err) {
                console.error('Failed to load models:', err);
            }
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (!modelsLoaded || !videoRef.current) return;

        let interval;
        const runDetection = async () => {
            if (videoRef.current.readyState < 2) return;

            // Face Detection
            const detections = await faceapi.detectAllFaces(
                videoRef.current, 
                new faceapi.TinyFaceDetectorOptions()
            );

            if (detections.length > 1) {
                onViolation('multi_face', 'high');
            } else if (detections.length === 0) {
                onViolation('no_face', 'medium');
            }

            // Object/Gadget Detection
            if (objectModelRef.current) {
                const predictions = await objectModelRef.current.detect(videoRef.current);
                const forbidden = ['cell phone', 'laptop', 'tablet', 'book', 'remote', 'mouse'];
                const detectedGadget = predictions.find(p => forbidden.includes(p.class) && p.score > 0.4);
                
                if (detectedGadget) {
                    console.warn('Forbidden object detected:', detectedGadget.class);
                    onViolation('gadget_detected', 'high', { object: detectedGadget.class });
                }
            }
        };

        interval = setInterval(runDetection, 1000); // Check every second
        return () => clearInterval(interval);
    }, [modelsLoaded, videoRef, sessionId, isActive]);

    // Tab monitoring
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onViolation('tab_switch', 'high');
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);
};
