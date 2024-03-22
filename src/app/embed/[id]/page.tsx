import LivePixPubSubWidget from "./LivePixPubSubWidget";
import MessageQueueProcessor from "./MessageQueueProcessor";

async function getPubSubAuth(id: string) {
  const res = await fetch(`https://webservice.livepix.gg/pubsub/widget/${id}`)
  if (!res.ok)
    throw new Error('Failed to fetch data');
 
  return res.json();
}
 
export default async function Page({ params, searchParams }: any) {
  const data = await getPubSubAuth(params.id);
  return <div>
    <MessageQueueProcessor/>
    <LivePixPubSubWidget token={data.token}/>
  </div>
}