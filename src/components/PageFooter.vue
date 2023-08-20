<template>
  <footer class="footer">
    <div class="credits">
      <p>Data last updated on 1 August 2023</p>
      <p>
        Project enabled by the research of the
        <a
          href="http://nmscd.com/Atlas-Insight-Initiative/"
          target="_blank"
          rel="noopener noreferrer"
          >Atlas Insight Initiative</a
        >
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  padding: 3rem;
  margin-block-start: 3rem;
  margin-inline: auto;
  width: 100%;
  text-align: center;
  background-color: hsla(0, 0, 50%, 0.1);
}

.credits {
  & > p {
    font-size: initial;
  }
}
</style>
