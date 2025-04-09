export const getCookie = (key: string): string | undefined => {
    if (typeof document === "undefined") return undefined;
  
    const cookies = document.cookie;
    const cookie = cookies
      .split("; ")
      .find((row) => row.startsWith(`${key}=`));
  
    return cookie?.split("=")[1];
  };