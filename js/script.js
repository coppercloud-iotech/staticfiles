function openNav() {
    document.getElementById("navbar").style.transform = "translateX(0)";
    document.getElementById("menuicon").style.display = "none";
    document.getElementById("closebtn").style.display = "block";
    document.getElementById("submainbody").style.marginLeft = "150px";
}

function closeNav() {
    document.getElementById("navbar").style.transform = "translateX(-100%)";
    document.getElementById("menuicon").style.display = "block";
    document.getElementById("closebtn").style.display = "none";
    document.getElementById("submainbody").style.marginLeft = "0";
}

/* black and white ux */
document.addEventListener('DOMContentLoaded', () => {
  function toggleMode() {
    const body = document.querySelector('body');
    const isNight = body.classList.contains('night');
    if (isNight) {
      body.classList.remove('night');
      body.classList.add('day');
      localStorage.setItem('mode', 'day');
    } else {
      body.classList.remove('day');
      body.classList.add('night');
      localStorage.setItem('mode', 'night');
    }
  }

  const switchInput = document.querySelector('#switch input');
  switchInput.addEventListener('change', toggleMode);

  const mode = localStorage.getItem('mode');
  if (mode === 'night') {
    document.querySelector('body').classList.add('night');
    switchInput.checked = true;
  } else {
    document.querySelector('body').classList.add('day');
    switchInput.checked = false;
  }
});
