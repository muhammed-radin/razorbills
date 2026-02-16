class FeedMold {
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

class ShowCaseTab {
  constructor(
    title = "",
    description = "",
    thumbnail = "",
    link = "",
    color = "",
  ) {
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.link = link;
    this.color = color;
  }
}

module.exports = { FeedMold, ShowCaseTab };
