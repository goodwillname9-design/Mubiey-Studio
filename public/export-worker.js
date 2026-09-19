importScripts('engine.js');
onmessage=e=>{try{const {buffer,width,height,settings}=e.data;const output=gradePixels(new ImageData(new Uint8ClampedArray(buffer),width,height),settings);postMessage({buffer:output.data.buffer,width,height},[output.data.buffer])}catch(error){postMessage({error:'Export failed. Try a smaller resolution.'})}};
