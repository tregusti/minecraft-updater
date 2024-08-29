export default {
  title: 'Floodgate',
  info: async () => {
    const url = `https://ci.opencollab.dev/job/GeyserMC/job/Floodgate/job/master/lastSuccessfulBuild/`
    const res = await fetch(url)
    const html = await res.text()
    const jar = /"(artifact\/.*?floodgate-spigot.jar)"/.exec(html)[1]
    const build = /Build #(\d+)/.exec(html)[1]
    return {
      url: url + jar,
      filename: `Floodgate-Spigot-${build}.jar`,
    }
  },
}
