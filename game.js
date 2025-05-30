function checkOrientation() {
  const warning = document.getElementById("orientation-warning");
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
    
    // Cập nhật lại tỉ lệ camera và renderer
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Canh lại vị trí camera để nhìn thấy cầu thủ
    camera.position.set(player.position.x, 50, player.position.z + 60);
    camera.lookAt(player.position.x, 0, player.position.z);

    // Điều chỉnh UI joystick và nút bấm
    document.getElementById("joystick-container").style.left = "30px";
    document.querySelector(".buttons").style.right = "30px";
    document.querySelector(".buttons").style.bottom = "30px";
  }
}
