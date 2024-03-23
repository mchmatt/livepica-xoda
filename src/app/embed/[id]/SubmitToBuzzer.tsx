"use server";

export async function submitToBuzzer(alertID: string, receipt: string) {
  try {
    await fetch(`https://buzzer.livepix.gg/alerts/${alertID}`, {
      method: "POST",
      headers: {
        "X-Receipt": receipt
      }
    });
    return true;
  }
  catch(e) {
    console.error(e);
    return false;
  }
}