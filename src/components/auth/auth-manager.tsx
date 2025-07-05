"use client"

import { useEffect } from "react";
import { useLensAuthStore } from "@/stores/auth-store";
import { fetchMeDetails, currentSession } from "@lens-protocol/client/actions";

export default function AuthManager() {
  const {
    client,
    sessionClient,
    setSessionClient,
    setCurrentProfile,
    setLoading,
    setError,
  } = useLensAuthStore();
  
  // 恢复 session
  useEffect(() => {
    async function resume() {
      setLoading(true);
      const resumed = await client.resumeSession();
      if (resumed.isOk()) {
        setSessionClient(resumed.value);
        // 获取账户详情
        const me = await fetchMeDetails(resumed.value);
        // console.log('xxxxx get session client & me-----', me)
        if (me.isOk()) setCurrentProfile(me.value?.loggedInAs?.account);
      } else {
        setSessionClient(null);
        setCurrentProfile(null);
      }
      setLoading(false);
    }
    resume();
  }, []);


  // session 失效自动检测
  useEffect(() => {
    if (!sessionClient) return;
    let timer: NodeJS.Timeout;
    async function checkSession() {
      if (!sessionClient) return;
      const result = await currentSession(sessionClient);
      if (result.isErr()) {
        setSessionClient(null);
        setCurrentProfile(null);
        setError("Session expired.");
      }
    }
    // 每10分钟检测一次
    timer = setInterval(checkSession, 10 * 60 * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [sessionClient]);

  return null;
}
