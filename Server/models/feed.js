export class FeedMold {
  constructor() {}

  featured = []; // ProductSchema minimal here
  latest = []; // ProductSchema minimal here
  rated = []; // ProductSchema minimal here
  highlighted = []; // ProductSchema minimal here
  trending = []; // ProductSchema minimal here

  randomProducts = []; // ProductSchema minimal here

  showcaseCard = {
    listed: [], // ProductSchema minimal here
    tabs: [
      {
        title: "",
        description: "",
        thumbnail: "",
        link: "",
        color: "",
      },
    ],
  };

  grid_categories = [{}];
}

export class ShowCaseTab {
  constructor(
    tag = "",
    title = "",
    description = "",
    thumbnail = "",
    link = "",
    color = "",
  ) {
    this.tag = tag;
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.link = link;
    this.color = color;
  }
}

export default { FeedMold, ShowCaseTab };
