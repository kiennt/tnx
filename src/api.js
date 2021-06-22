import myx from "./myx";

async function sendMessageToSlack(slackUrl, sections) {
  const blocks = [
    {
      type: "divider",
    },
    ...sections.map((line) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: line,
      },
    })),
  ];
  await myx.request({
    url: slackUrl,
    method: "POST",
    headers: {
      "User-Agent": "TiNi Extension",
      "Content-type": "application/json",
    },
    data: {
      blocks,
    },
  });
}

export async function sendToSlack(slackUrl, title, input, output, error) {
  const sections = [`*${title}`];
  if (input) {
    sections.push("Input");
    sections.push("```" + input + "```");
  }
  if (output) {
    sections.push("Output");
    sections.push("```" + output + "```");
  }
  if (error) {
    sections.push("Error");
    sections.push("```" + error + "```");
  }
  await sendMessageToSlack(slackUrl, sections);
}
