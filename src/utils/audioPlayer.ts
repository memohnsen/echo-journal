import { AudioPlayer, AudioStatus } from "expo-audio";

export const handlePlayback = (player: AudioPlayer, status: AudioStatus) => {
  if (status.playing) {
    player.pause();
  } else if (status.currentTime === status.duration) {
    player.seekTo(0);
    player.play();
  } else {
    player.play();
  }
};
