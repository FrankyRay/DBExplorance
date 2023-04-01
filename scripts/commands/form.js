import CustomCommand from "./CustomCommand";
import { system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";

CustomCommand.addCommand({
  name: "form",
  description: "Open example form",
  aliases: ["afd"],
  operator: false,
  arguments: [
    {
      name: "title",
      description: "Form title",
      type: "string",
    },
    {
      name: "body",
      description: "Form body/description",
      type: "string",
    },
    {
      name: "button",
      description: "Number of buttons",
      type: "number",
      options: {
        range: {
          min: 1,
        },
      },
      default: 2,
    },
  ],
  callback: (player, data) => {
    const form = new ActionFormData()
      .title(data.arguments.title)
      .body(data.arguments.body);

    for (let i = 0; i < data.arguments.button; i++) {
      form.button(`Button ${i + 1}`);
    }

    player.tell("Close chat ui to open form!");
    system.run(function openForm() {
      form.show(player).then((result) => {
        if (result.cancelationReason == FormCancelationReason.userBusy)
          system.run(openForm);
        else if (result.canceled) player.tell("Form closed");
        else player.tell(`You press button ${result.selection + 1}`);
      });
    });
  },
});
