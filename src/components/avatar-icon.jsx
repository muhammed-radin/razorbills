import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { decrypt } from "@/utils/crypt";
import React, { useMemo } from "react";

const AvatarIcon = ({ name, img, size = 40 }) => {
  const decryptedName = useMemo(() => {
    return decrypt(name);
  }, [name]);

  const initials = useMemo(() => {
    return decryptedName
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [decryptedName]);

  const decryptedImg = useMemo(() => {
    return decrypt(img);
  }, [img]);

  const image = useMemo(() => {
    return decryptedImg !== null
      ? decryptedImg
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size * 2}&background=random&rounded=true&bold=true&format=png`;
  }, [decryptedImg, initials, size]);

  console.log(
    "AvatarIcon Rendered with name:",
    decryptedName,
    "and image:",
    image,
  );
  console.log("AvatarIcon Rendered with initials:", initials);
  console.log("Decypted image:", decryptedImg);

  return (
    <Avatar>
      <AvatarImage
        src={image}
        alt={decryptedName}
        referrerPolicy="no-referrer"
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default React.memo(AvatarIcon);
