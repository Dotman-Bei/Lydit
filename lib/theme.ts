/** Runs before paint so a stored theme choice never flashes the wrong theme. */
export const themeScript = `try{var t=localStorage.getItem("lydit-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
