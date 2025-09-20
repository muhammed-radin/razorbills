function limitWords(des, length){
    return des.split(" ").splice(0,length).join(" ") + (des.split(" ").length > length ? "..." : "");
}

export {limitWords};