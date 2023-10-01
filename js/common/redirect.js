addCallback(() => {
  const args = getArgs();
  if (args.user) {
    window.location.href = args.homePageURL;
  }
});
