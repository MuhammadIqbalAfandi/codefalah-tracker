const trackerDataChangedEvent = "tracker-data-changed";
const trackerDataChangedStorageKey = "codefalah-tracker-last-change";

export function notifyTrackerDataChanged() {
  const changeToken = String(Date.now());

  window.localStorage.setItem(trackerDataChangedStorageKey, changeToken);
  window.dispatchEvent(
    new CustomEvent(trackerDataChangedEvent, {
      detail: changeToken,
    }),
  );
}

export function subscribeToTrackerDataChanges(onChange: () => void) {
  function handleCustomEvent() {
    onChange();
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === trackerDataChangedStorageKey) {
      onChange();
    }
  }

  window.addEventListener(trackerDataChangedEvent, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(trackerDataChangedEvent, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
