<script>
    var countdownNumberEl = document.getElementById('countdown-number');
    var countdown = 5;

    countdownNumberEl.textContent = countdown;

    setInterval(function() {
    countdown = --countdown <= 0 ? 5 : countdown;

    countdownNumberEl.textContent = countdown;
    }, 1000);
</script>

<div id="countdown">
    <div id="countdown-number"></div>
    <svg>
      <circle r="14" cx="17" cy="17"></circle>
    </svg>
  </div>

<style>

body {
  height: 100%;
  width: 100%;
}

#countdown {
  position: relative;
  margin: auto;
  height: 34px;
  width: 34px;
  text-align: center;
}

#countdown-number {
  color: #004A3D;
  display: inline-block;
  line-height: 34px;
}

svg {
  position: absolute;
  top: 0;
  right: 0;
  width: 34px;
  height: 34px;
  transform: rotateY(-180deg) rotateZ(-90deg);
}

svg circle {
  stroke-dasharray: 113px;
  stroke-dashoffset: 0px;
  stroke-linecap: round;
  stroke-width: 2px;
  stroke: #004A3D;
  fill: none;
  animation: countdown 5s linear infinite forwards;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 113px;
  }
}

</style>