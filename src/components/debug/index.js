import myx from "../../myx";
import * as api from "../../api";

Component({
  props: {
    slackUrl: "",
  },
  onInit() {
    this.loadData();
  },
  methods: {
    getDebugItem(item) {
      let subTitle;
      if (item.type === "myx.request") {
        subTitle = `${item.params.input.method} ${item.params.input.url}`;
      } else {
        subTitle = JSON.stringify(item.params.input || {});
      }

      let status;
      if (item.type.startsWith("myx")) {
        status = item.params.result
          ? "success"
          : item.params.error
          ? "failure"
          : "pending";
      } else {
        status = "success";
      }

      return {
        title: item.type,
        createdAt: new Date(item.createdAt).toISOString(),
        subTitle,
        latency: item.params.latency || 0,
        status,
      };
    },
    loadData() {
      const items = myx.data.map((item) => this.getDebugItem(item));
      this.setData({
        items,
      });
    },
    onClearLog() {
      myx.clearLog();
      this.loadData();
    },
    onClose() {
      this.setData({
        show: false,
      });
    },
    onTapItem(e) {
      const { index } = e.target.dataset;
      const myxItem = myx.data[index];
      const item = {
        ...this.data.items[index],
        input: JSON.stringify(myxItem.params.input),
        output: JSON.stringify(myxItem.params.result),
        error: JSON.stringify(myxItem.params.error),
      };
      this.setData({
        item,
        show: true,
      });
    },
    async onSendToSlack() {
      if (!this.props.slackUrl) {
        return;
      }

      this.setData({
        loading: true,
      });
      const { type, createdAt, latency, input, output, error } = this.data.item;
      try {
        await api.sendToSlack(
          slackUrl,
          `${type} - ${createdAt} - ${latency}`,
          input,
          output,
          error
        );
      } catch {
      } finally {
        this.setData({
          loading: false,
        });
      }
    },
  },
});
