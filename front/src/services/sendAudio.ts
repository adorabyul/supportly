const url = import.meta.env.VITE_BACKEND_URL;

export const sendAudio = async (audioBlob: Blob): Promise<string> => {

    const audioFile = new File([audioBlob], 'audio.mp3', {type: 'audio/mp3'})
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