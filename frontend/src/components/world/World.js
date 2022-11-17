import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import UserAPI from "../../api/UserAPI";
import BoardAPI from "../../api/BoardAPI";

function World() {
  const [progress, setProgress] = useState();

  const { unityProvider, addEventListener, removeEventListener, sendMessage } =
    useUnityContext({
      loaderUrl: "Build/build.loader.js",
      dataUrl: "Build/build.data",
      frameworkUrl: "Build/build.framework.js",
      codeUrl: "Build/build.wasm",
    });

  function handleClickSpawnEnemies() {
    console.log("asdfsadf");
    sendMessage("QuestManager", "setProgress", progress);
  }

  const loadData = useCallback(async () => {
    console.log("start");
    const response = await UserAPI.mypage();
    setProgress(response.data.body.missionProgress);
<<<<<<< HEAD

=======
    // handleClickSpawnEnemies()
>>>>>>> 00eaa9916bca5d2786386ec19ad95bde6dd1e6c3
  }, []);

  const saveProgress = useCallback(async (progress) => {
    console.log("saveProgress", progress);
    const body = {
      progress: progress,
    };
    const response = await UserAPI.progress(body);
    setProgress(response.data.body.progress);
    // handleClickSpawnEnemies()
  }, []);

  useEffect(() => {
    addEventListener("GameStart", loadData);
    addEventListener("MissionClear", saveProgress);

    return () => {
      removeEventListener("GameStart", loadData);
      removeEventListener("MissionClear", saveProgress);
    };
<<<<<<< HEAD
  }, [addEventListener, removeEventListener, loadData,saveProgress]);
  
  return (

      <Fragment>
        <button onClick={handleClickSpawnEnemies}>버튼</button>
        {progress}
        {handleClickSpawnEnemies()}
        <Unity style={{width:'100%', height:'100%', justifySelf:'center',alignSelf:'center',}} unityProvider={unityProvider}/>
      
      </Fragment>

    

=======
  }, [addEventListener, removeEventListener, loadData, saveProgress]);
  return (
    <Fragment>
      <button onClick={() => sendMessage("PlayerFPS3", "Checked")}>버튼</button>
      {progress}
      <Unity
        style={{
          width: "100vw",
          height: "100vh",
          justifySelf: "center",
          alignSelf: "center",
        }}
        unityProvider={unityProvider}
      />
      {handleClickSpawnEnemies()}
    </Fragment>
>>>>>>> 00eaa9916bca5d2786386ec19ad95bde6dd1e6c3
  );
}

export default World;
