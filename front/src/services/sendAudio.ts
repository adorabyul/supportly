const { FFmpeg } = await import('@ffmpeg/ffmpeg');
const { fetchFile } = await import('@ffmpeg/util');
const url = import.meta.env.VITE_BACKEND_URL;

export const sendAudio = async (audioBlob: Blob): Promise<string> => {
    const convertedAudio = await convertAudioToMp3(audioBlob);
    const audioFile = new File([convertedAudio], 'audio.mp3', {type: 'audio/mp3'})
    const formData = new FormData();
    formData.append('file', audioFile);
  
    try {
      const response = await fetch(`${url}/transcribe`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to send audio to the backend');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending audio:', error);
      throw error;
    }
  };


const convertAudioToMp3 = async (audioBlob: Blob): Promise<Blob> => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    const inputName = 'input.mp3';
    const outputName = 'output.mp3';

    const inputData = await fetchFile(audioBlob);
    await ffmpeg.writeFile(inputName, inputData);
    
    try {
      await ffmpeg.readFile(inputName);
      console.log("Input file exists in memory.");
  } catch {
      throw new Error("Input file was not written to FFmpeg.");
  }

    await ffmpeg.exec([
        '-i', inputName,
        '-ac', '1',
        '-ar', '16000',
        '-b:a', '128k',
        outputName
    ]);

    let data;
    try {
        data = await ffmpeg.readFile(outputName);
        console.log("Output file successfully created.");
    } catch {
        throw new Error("Output file was not created.");
    }

    return new Blob([data], { type: 'audio/mp3' });
};