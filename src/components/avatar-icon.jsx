import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { decrypt } from "@/utils/crypt";
import React, { useMemo } from "react";

const AvatarIcon = ({ name, decrypted = true, img, size = 40 }) => {
  const decryptedName = useMemo(() => {
    if (!decrypted) return name;
    try {
      return decrypt(name);
    } catch (e) {
      console.error("Failed to decrypt name:", e);
      return name; // fallback to original name on decrypt error
    }
  }, [name, decrypted]);

  const initials = useMemo(() => {
    return decryptedName
      .split(" ")
      .map((part) => part[0].toUpperCase())
      .join("")
      .slice(0, 2);
  }, [decryptedName]);

  const decryptedImg = useMemo(() => {
    if (!decrypted || img === null) return img;
    try {
      return decrypt(img);
    } catch (e) {
      console.error("Failed to decrypt image:", e);
      return img; // fallback to original img on decrypt error
    }
  }, [img, decrypted]);

  const image = useMemo(() => {
    return decryptedImg !== null
      ? decryptedImg
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size * 2}&background=random&rounded=true&bold=true&format=png`;
  }, [decryptedImg, initials, size]);

  return (
    <Avatar>
      <AvatarImage src={image} alt={decryptedName} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default React.memo(AvatarIcon);
