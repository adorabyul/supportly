export const sendAudio = async (audioBlob: Blob): Promise<string> => {

    const audioFile = new File([audioBlob], 'audio.wav', {type: 'audio/wav'})
    const formData = new FormData();
    formData.append('audio', audioFile);
  
    try {
      const response = await fetch('http://localhost:3000/transcribe', {
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