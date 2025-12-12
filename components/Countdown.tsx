"use client";

import { useEffect, useState } from "react";

import { useLocaleHelpers } from "./LocaleProvider";

export default function Countdown({ until }: { until: number }) {
  const { formatCountdown } = useLocaleHelpers();

  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    return Math.max(0, Math.floor((until - Date.now()) / 1000));
  });

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsRemaining(Math.max(0, Math.floor((until - Date.now()) / 1000)));
    }, 1000);

    return () => clearInterval(id);
  }, [until]);

  return <span>{formatCountdown(secondsRemaining)}</span>;
}
