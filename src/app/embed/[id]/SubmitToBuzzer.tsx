'use server';

export async function submitToBuzzer(alertID: string, receipt: string) {
  const submit = (attempts: number) => {
    if (attempts > 5) return;

    console.log("Attempting to submit to buzzer. Attempts so far:", attempts);
    fetch(`https://buzzer.livepix.gg/alerts/${alertID}`, {
      method: "POST",
      headers: {
        "x-receipt": receipt
      }
    })
    .then(response => {
      if (response.status > 300)
        setTimeout(() => submit(attempts + 1), 1000);
    })
    .catch(() => {
      setTimeout(() => submit(attempts + 1), 1000);
    })
  }

  setTimeout(() => submit(0), 5000);
  setTimeout(() => submit(0), 30000);
}