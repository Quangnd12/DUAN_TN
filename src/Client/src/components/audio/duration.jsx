
export const Durations = async (songsList, api) => {
  const fetchDurationPromises = songsList.map((value) => 
    new Promise((resolve) => {
      const audio = new Audio(`${api}/${value.audio_file}`);
      audio.addEventListener('loadedmetadata', () => {
        resolve({ id: value.id, duration: audio.duration });
      });
    })
  );

  const durations = await Promise.all(fetchDurationPromises);
  return durations.reduce((acc, { id, duration }) => {
    acc[id] = duration;
    return acc;
  }, {});
};
