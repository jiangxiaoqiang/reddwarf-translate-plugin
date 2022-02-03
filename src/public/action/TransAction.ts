import type { MessageBase } from "@/model/message/MessageBase";
import { MessageType } from "@/model/message/MessageType";

export function doTranslate(transWord: string, messageType: MessageType){
    let transMe = MessageType[messageType];
      if (transWord && transWord.length > 0) {
        let message: MessageBase = {
          type: transMe,
          data: {
            word: transWord,
            from: "en",
            to: "zh",
          },
        };
        chrome.runtime.sendMessage(message, function (response) {});
      }
}

