export function calculateAnalyticsFrom(daysAnalytics = []) {
  const result = {
    events: {
      total: 0,
      errors: 0,
      sessions: 0,
    },
    traffic: {
      allViews: 0,
      debouncedViews: 0,
      uniqueUsers: 0,
      uniqueGuests: 0,
      devices: {
        desktop: 0,
        mobile: 0,
        tablet: 0,
      },
      sources: {
        chrome: 0,
        firefox: 0,
        safari: 0,
        edge: 0,
        other: 0,
      },
    },
    users: {
      loggedInUsers: 0,
      signedUpUsers: 0,
      deletedUsers: 0,
      passwordChanged: 0,
      totalUsers: 0, // This will be calculated as signedUpUsers - deletedUsers
    },
    products: {
      viewed: 0,
      searched: 0,

      lowStock: 0,
      outOfStock: 0,
      totalProducts: 0,
    },
    engagement: {
      ratings: 0,
      shares: 0,
      wishlists: 0,
      comments: 0,
    },
    orders: {
      total: 0,
      revenue: 0,
      cancelled: 0,
      delivered: 0,
      returned: 0,
    },
    reviews: {
      total: 0,
    },
    lastUpdated: new Date(),
  }; // DATA TYPE: siteAnalyticsSchema;
  // daysAnalytics.forEach((dayAnalytics) => {
  //   // Aggregate data from each day's analytics into the result object

  daysAnalytics.reduce((acc, dayAnalytics) => {
    // Aggregate data from each day's analytics into the accumulator object
    acc.events.total += dayAnalytics.events.total || 0;
    acc.events.errors += dayAnalytics.events.errors || 0;
    acc.events.sessions += dayAnalytics.events.sessions || 0;

    acc.traffic.allViews += dayAnalytics.traffic.allViews || 0;
    acc.traffic.debouncedViews += dayAnalytics.traffic.debouncedViews || 0;
    acc.traffic.uniqueUsers += dayAnalytics.traffic.uniqueUsers || 0;
    acc.traffic.uniqueGuests += dayAnalytics.traffic.uniqueGuests || 0;

    acc.traffic.devices.desktop += dayAnalytics.traffic.devices.desktop || 0;
    acc.traffic.devices.mobile += dayAnalytics.traffic.devices.mobile || 0;
    acc.traffic.devices.tablet += dayAnalytics.traffic.devices.tablet || 0;
    acc.traffic.devices.other += dayAnalytics.traffic.devices.other || 0;

    acc.traffic.sources.chrome += dayAnalytics.traffic.sources.chrome || 0;
    acc.traffic.sources.firefox += dayAnalytics.traffic.sources.firefox || 0;
    acc.traffic.sources.safari += dayAnalytics.traffic.sources.safari || 0;
    acc.traffic.sources.edge += dayAnalytics.traffic.sources.edge || 0;
    acc.traffic.sources.other += dayAnalytics.traffic.sources.other || 0;

    acc.users.loggedInUsers += dayAnalytics.users.loggedInUsers || 0;
    acc.users.signedUpUsers += dayAnalytics.users.signedUpUsers || 0;
    acc.users.deletedUsers += dayAnalytics.users.deletedUsers || 0;
    acc.users.passwordChanged += dayAnalytics.users.passwordChanged || 0;

    acc.products.viewed += dayAnalytics.products.viewed || 0;
    acc.products.searched += dayAnalytics.products.searched || 0;
    acc.products.lowStock += dayAnalytics.products.lowStock || 0;
    acc.products.outOfStock += dayAnalytics.products.outOfStock || 0;
    acc.products.totalProducts += dayAnalytics.products.totalProducts || 0;

    acc.engagement.ratings += dayAnalytics.engagement.ratings || 0;
    acc.engagement.shares += dayAnalytics.engagement.shares || 0;
    acc.engagement.wishlists += dayAnalytics.engagement.wishlists || 0;
    acc.engagement.comments += dayAnalytics.engagement.comments || 0;

    acc.orders.total += dayAnalytics.orders.total || 0;
    acc.orders.revenue += dayAnalytics.orders.revenue || 0;
    acc.orders.cancelled += dayAnalytics.orders.cancelled || 0;
    acc.orders.delivered += dayAnalytics.orders.delivered || 0;
    acc.orders.returned += dayAnalytics.orders.returned || 0;

    acc.reviews.total += dayAnalytics.reviews.total || 0;

    acc.users.totalUsers += dayAnalytics.users.signedUpUsers || 0;
    acc.users.totalUsers -= dayAnalytics.users.deletedUsers || 0;

    return acc; // Return the accumulator for the next iteration
  }, result);
}
