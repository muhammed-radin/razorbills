import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { decrypt } from "@/utils/crypt";

function AvatarIcon({ name, img, size = 40 }) {

    const initials = decrypt(name)
        .split(' ')
        .map(part => part[0].toUpperCase())
        .join('')
        .slice(0, 2);



    const image = img !== null ? decrypt(img) : `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size * 2}&background=random&rounded=true&bold=true&format=png`;

    console.log(image);
    return (<Avatar>
        <AvatarImage src={image} />
        <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>);
}

export default AvatarIcon;