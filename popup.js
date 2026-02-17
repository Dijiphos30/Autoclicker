let intervalId = null;

document.getElementById('start').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const selector = document.getElementById('selector').value;
  const interval = parseInt(document.getElementById('interval').value, 10) || 500;

  if (!selector) {
    alert('Enter a CSS selector first.');
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (selector, interval) => {
      if (window.__autoClickerInterval) clearInterval(window.__autoClickerInterval);
      window.__autoClickerInterval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) el.click();
      }, interval);
    },
    args: [selector, interval]
  });
});

document.getElementById('stop').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (window.__autoClickerInterval) {
        clearInterval(window.__autoClickerInterval);
        window.__autoClickerInterval = null;
      }
    }
  });
});
