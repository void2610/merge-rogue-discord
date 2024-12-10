import { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityComponent = () => {
 // UnityContextを準備、表示するUniyアプリを指定
 const { unityProvider, isLoaded } = useUnityContext({
  loaderUrl: "Build/merge-rogue.loader.js",
  dataUrl: "Build/merge-rogue.data",
  frameworkUrl: "Build/merge-rogue.framework.js",
  codeUrl: "Build/merge-rogue.wasm",
 });

 // useEffectの対象にisLoadedを含めない場合
 // 環境によってはsendMessageが動作しない問題がある
 useEffect(() => {
  if (isLoaded) {
   // Unityアプリに対してメッセージを送信
   // sendMessage("オブジェクト名", "関数名", 引数)
   //    sendMessage("Canvas", "SetText", props.userName);
  }
 }, [isLoaded]);

 return <Unity id="unity-canvas" unityProvider={unityProvider} />;
};

export default UnityComponent;
