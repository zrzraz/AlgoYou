// service_worker.js (MV3)
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ events: [] });
});

// handle small event messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'EVENT') {
    const ev = message.payload || {};
    ev.loggedAt = Date.now();
    chrome.storage.local.get({ events: [] }, (res) => {
      const events = res.events || [];
      events.push(ev);
      chrome.storage.local.set({ events }, () => sendResponse({ status: 'ok' }));
    });
    return true; // indicate async sendResponse
  } else if (message && message.type === 'CLEAR') {
    chrome.storage.local.set({ events: [] }, () => sendResponse({ status: 'cleared' }));
    return true;
  }
});
