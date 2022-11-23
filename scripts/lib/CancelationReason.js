import { FormCancelationReason } from "@minecraft/server-ui";

export default function CancelReason(reason) {
  if (reason == FormCancelationReason.userBusy)
    return "[UserBusy] There's another UI open right now";
  else if (reason == FormCancelationReason.userClosed)
    return "[UserClosed] The user close the form";
  else return "The reason is unknown";
}
