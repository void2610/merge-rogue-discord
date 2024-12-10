import { useEffect } from "react";
import UnityComponent from "./UnityComponent";
import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
 let auth;

 const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

 useEffect(() => {
  setupDiscordSdk();
 }, []);

 async function setupDiscordSdk() {
  await discordSdk.ready();

  // Discordクライアントの認証
  const { code } = await discordSdk.commands.authorize({
   client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
   response_type: "code",
   state: "",
   prompt: "none",
   scope: ["identify", "guilds"],
  });

  // サーバーからaccess_tokenを取得
  const response = await fetch("/api/token", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
    code,
   }),
  });
  const { access_token } = await response.json();

  // access_tokenを用いた認証
  auth = await discordSdk.commands.authenticate({
   access_token,
  });

  if (auth == null) {
   console.log("Authenticate command failed");
   throw new Error("Authenticate command failed");
  }

  // チャンネル名の取得
  let activityChannelName = "Unknown";
  // Requesting the channel in GDMs (when the guild ID is null) requires
  // the dm_channels.read scope which requires Discord approval.
  if (discordSdk.channelId != null && discordSdk.guildId != null) {
   // Over RPC collect info about the channel
   const channel = await discordSdk.commands.getChannel({ channel_id: discordSdk.channelId });
   if (channel.name != null) {
    activityChannelName = channel.name;
   }
  }
  console.log(`[Debug]チャンネル:${activityChannelName}`);

  await discordSdk.commands.getInstanceConnectedParticipants();

  // ユーザー情報の取得
  const user: { global_name: string } = await fetch(`https://discord.com/api/users/@me`, {
   headers: {
    Authorization: `Bearer ${auth.access_token}`,
    "Content-Type": "application/json",
   },
  }).then((reply) => reply.json());

  console.log(`[Debug]名前:${user.global_name}`);

  // ユーザー名の設定
  //setUserName(user.global_name);
 }

 return <UnityComponent />;
}

export default App;
