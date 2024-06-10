<template>
  <div class="credits">
    <p>Data last updated on 12 May 2024</p>
    <p>
      Project enabled by the research of the
      <a
        class="footer-link"
        href="http://nmscd.com/Atlas-Insight-Initiative/"
        target="_blank"
        rel="noopener noreferrer"
        >Atlas Insight Initiative</a
      >
    </p>
  </div>
</template>

<style scoped lang="scss">
.credits {
  padding-block-start: 2rem;
  padding-block-end: 1rem;

  & > p {
    font-size: initial;
  }

  .footer-link {
    color: lightgray;

    &:hover {
      color: white;
    }
  }
}
</style>
