import React, { useRef, useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import styled from 'styled-components';
import editImage from 'services/api'; // Assuming this is a function that fetches and returns an image

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  width: 100%;
  text-align: center;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #6200ea; // Same primary color for consistency
  border-radius: 4px 0 0 4px; // Rounded corners, with only left corners rounded
  outline: none;
  transition: border-color 0.3s ease;
  width: 400px;
  margin-right: 5px;

  &:focus {
    border-color: #3700b3; // Darker shade for focus effect
  }
`;


const InputContainer = styled.div`
  padding: 20px;
  margin: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CanvasContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const StyledButton = styled.button`
  background-color: #6200ea; // Primary color
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #3700b3; // Darker shade for hover effect
    transform: scale(1.05); // Slightly enlarges the button on hover
  }

  &:active {
    background-color: #03dac5; // Different color for active state
    transform: scale(0.95); // Slightly shrinks the button when active
  }

  &:focus {
    outline: none; // Removes the default outline
    box-shadow: 0 0 0 3px rgba(98, 0, 234, 0.5); // Adds a custom focus outline
  }

  &:disabled {
    background-color: #cccccc; // Disabled state color
    cursor: not-allowed;
    transform: none; // No scaling effect
  }
`;


const DEFAULT_OBJECT_URL = "https://www.celebrity-cutouts.com/wp-content/uploads/2019/11/bono-black-outfit-cardboard-cutout.png";
const DEFAULT_BACKGROUND_URL = "https://images.unsplash.com/photo-1571674285171-5d8f38aec0b4?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const CanvasEditor: React.FC = () => {
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BACKGROUND_URL);
  const [objectUrl, setObjectUrl] = useState(DEFAULT_OBJECT_URL);
  const [background, setBackground] = useState<HTMLImageElement | null>(null);
  const [object, setObject] = useState<HTMLImageElement | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectRef = useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 100, height: 100 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('apiKey');
      if (storedApiKey) {
        setTempApiKey(storedApiKey)
        setApiKey(storedApiKey);
      }
    }
  }, []);

  const loadImages = async () => {
    // Load background image
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = backgroundUrl;
    await new Promise((resolve) => {
      bgImg.onload = () => {
        setBackground(bgImg);
        resolve(null);
      };
    });

    // Load object image
    const response = await editImage(objectUrl, apiKey);
    if (response.ok && response.data) {
      const blobUrl = URL.createObjectURL(response.data);
      const objImg = new Image();
      objImg.src = blobUrl;
      objImg.onload = () => {
        setObject(objImg);
        setAspectRatio(objImg.width / objImg.height);
        objectRef.current = { x: 0, y: 0, width: 300, height: 300 / aspectRatio };
      };
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context && background) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      if (object) {
        const obj = objectRef.current;
        context.drawImage(object, obj.x, obj.y, obj.width, obj.height);
        context.strokeStyle = 'red';
        context.strokeRect(obj.x, obj.y, obj.width, obj.height);

        // Draw resize handle
        context.fillStyle = 'white';
        context.fillRect(obj.x + obj.width - 10, obj.y + obj.height - 10, 10, 10);
      }
    }
  };

  useEffect(() => {
    if (background && object) {
      drawCanvas();
    }
  }, [background, object]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !object) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const obj = objectRef.current;
    const isInsideObject =
      x > obj.x && x < obj.x + obj.width && y > obj.y && y < obj.y + obj.height;

    const isOnResizeHandle =
      x > obj.x + obj.width - 10 && y > obj.y + obj.height - 10 && x < obj.x + obj.width && y < obj.y + obj.height;

    if (isInsideObject && !isOnResizeHandle) {
      setDragging(true);
    } else if (isOnResizeHandle) {
      setResizing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging && !resizing) return;

    const canvas = canvasRef.current;
    if (!canvas || !object) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const obj = objectRef.current;

    if (dragging) {
      obj.x = x - obj.width / 2;
      obj.y = y - obj.height / 2;
    } else if (resizing) {
      const newWidth = x - obj.x;
      const newHeight = newWidth / aspectRatio;

      obj.width = newWidth;
      obj.height = newHeight;
    }

    drawCanvas();
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'canvas.png');
        }
        },'image/png');
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempApiKey(e.target.value);
  };

  const addApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('apiKey', tempApiKey);
  };

  return (
    <Container>
      <InputContainer>
        <StyledInput
          type="text" 
          value={backgroundUrl} 
          onChange={(e) => setBackgroundUrl(e.target.value)} 
          placeholder="Enter background image URL" 
        />
        <StyledInput
          type="text" 
          value={objectUrl} 
          onChange={(e) => setObjectUrl(e.target.value)} 
          placeholder="Enter object image URL" 
        />
        <StyledButton onClick={loadImages}>Load Images</StyledButton>
      </InputContainer>
      <InputContainer>
        <StyledInput
          type="text" 
          value={tempApiKey} 
          onChange={handleApiKeyChange} 
          placeholder="Enter API Key" 
        />
        <StyledButton onClick={addApiKey}>Add API Key</StyledButton>
      </InputContainer>
      <CanvasContainer>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{ border: '1px solid grey' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </CanvasContainer>
      <StyledButton onClick={downloadCanvas}>Download</StyledButton>
    </Container>
  );
};

export default CanvasEditor;

