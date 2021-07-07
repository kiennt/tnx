import myx from "tiki-miniapp-tnx/src/myx";

Page({
  async onLoad() {
    // any API which is call by myx will be log in debug
    const systemInfo = await myx.getSystemInfo();
    const data = await myx.request({
      url: 'https://gist.githubusercontent.com/kiennguyentiki/6e0059226b0ad244de49a177edba722d/raw/test.json',
      method: 'GET'
    })
  
    // you also could call myx.debug to send log into debug screen
    myx.debug(`debug information ${JSON.stringify(systemInfo)}`);
  },
  goToDebug() {
    my.navigateTo({ url: "pages/debug/index" });
  }
});