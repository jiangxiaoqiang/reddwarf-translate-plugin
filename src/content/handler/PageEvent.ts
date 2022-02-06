import { 
  addTransShowElement, 
  closePopupWindow, 
  hideTransButton, 
  showTranslateButton 
} from "@/public/action/TransAction";
import { TransGlobal } from "@/model/immutable/TransGlobal";

const selection = getSelection();

export async function firstMouseUp(e: MouseEvent) {
  if (selection && selection.toString().trim().length > 0) {
    removeFirstMouseUp();
    saveTransWord(selection.toString().trim(), e);
  }
}

export async function mouseClick(e: MouseEvent) {
  processDocumentClick(e);
}

function processDocumentClick(clickEvent: MouseEvent) {
  let clickTarget: HTMLElement | null = clickEvent.target as HTMLElement;
  let isClicked = isPopupClicked(clickTarget);
  let translateBtn = document.getElementById("translate-panel");
  if(!isClicked&&translateBtn?.style.visibility == "visible") {
    closePopupWindow();
  }

  function isPopupClicked(clickTarget: HTMLElement): boolean {
    const popupContainer = document.querySelector('#pop-container') as HTMLDivElement;
    return isAncestorOf(popupContainer, clickTarget);
  }

  function isAncestorOf(parentElement: HTMLElement, childElement: HTMLElement) {
    let traversalElement: HTMLElement | null = childElement;

    let isParent = false;

    if (traversalElement) {
      while (traversalElement) {
        if (traversalElement === parentElement) {
          isParent = true;
          break;
        } else {
          traversalElement = traversalElement.parentElement;
        }
      }
    }
    return isParent;
  }
}


function saveTransWord(transWord: string, e: MouseEvent) {
  chrome.storage.local.set({
    reddwarfTranslateWord: "reddwarf-translate-word"
  }, function () {
    addTransShowElement(transWord.toLowerCase());
    showTranslateButton(e);
    delay(2000, null).then(() => {
      hideTransButton();
    }).then(() => {
      addFirstMouseUp();
    })
  });
}

function delay(time: number, value: any) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, value), time)
  });
}

export function noop() { }

export function removeFirstMouseUp() {
  document.removeEventListener(TransGlobal.MOUSE_UP, firstMouseUp);
  return noop;
}

export function addFirstMouseUp() {
  document.addEventListener(TransGlobal.MOUSE_UP, firstMouseUp);
}
